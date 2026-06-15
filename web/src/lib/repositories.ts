import { and, desc, eq, gte, lt } from "drizzle-orm";
import { getDb, getSqlite } from "@/db/client";
import {
  bills,
  device,
  energyDaily,
  energyHourly,
  energyMonthly,
  energySnapshots,
  powerSamples,
  tariffConfig,
} from "@/db/schema";
import { parseTariffConfig, type TariffConfig } from "@/lib/tariff/schema";

/**
 * Repository pattern (§3): business logic depends on these INTERFACES, not on
 * Drizzle. The Drizzle-backed factory below is the only place that touches the ORM.
 */

export interface SeriesPoint {
  t: string; // IST day / month label or UTC hour ISO
  wh: number;
}

export interface PowerStats {
  avgW: number;
  peakW: number;
  count: number;
}

export interface DeviceRepository {
  getPrimary(): typeof device.$inferSelect | undefined;
  get(deviceId: string): typeof device.$inferSelect | undefined;
  list(): (typeof device.$inferSelect)[];
}

export interface EnergyRepository {
  sumDailyWh(deviceId: string, startYmd: string, endYmd: string): number;
  runtimeMinutes(deviceId: string, startYmd: string, endYmd: string): number;
  dailySeries(deviceId: string, startYmd: string, endYmd: string): SeriesPoint[];
  monthlySeries(deviceId: string, startMonthYmd: string, endMonthYmd: string): SeriesPoint[];
  hourlySeries(deviceId: string, startUtcIso: string, endUtcIso: string): SeriesPoint[];
  powerStats(deviceId: string, startUtcIso: string, endUtcIso: string): PowerStats;
  latestSnapshot(deviceId: string): typeof energySnapshots.$inferSelect | undefined;
  latestPower(deviceId: string): typeof powerSamples.$inferSelect | undefined;
}

export interface TariffRepository {
  getActive(): TariffConfig | undefined;
  list(): (typeof tariffConfig.$inferSelect)[];
  create(config: TariffConfig, makeActive: boolean): number;
}

export interface BillsRepository {
  list(): (typeof bills.$inferSelect)[];
  create(input: {
    cycleStart: string;
    cycleEnd: string;
    units: number;
    amount: number;
    source?: string;
  }): number;
}

// ── Drizzle implementations ───────────────────────────────────────────────────
function deviceRepo(): DeviceRepository {
  const db = getDb();
  return {
    getPrimary() {
      const list = db.select().from(device).all();
      const real = list.find((d) => d.deviceId !== "p110-demo" && d.deviceId !== "p110-mock");
      return real || list[0];
    },
    get: (deviceId) =>
      db.select().from(device).where(eq(device.deviceId, deviceId)).get(),
    list: () => db.select().from(device).all(),
  };
}

function num(v: unknown): number {
  return typeof v === "number" ? v : v == null ? 0 : Number(v);
}

function energyRepo(): EnergyRepository {
  const db = getDb();
  const raw = getSqlite();
  return {
    sumDailyWh(deviceId, startYmd, endYmd) {
      const row = raw
        .prepare(
          "SELECT COALESCE(SUM(wh),0) AS wh FROM energy_daily WHERE device_id=? AND day_ist>=? AND day_ist<?",
        )
        .get(deviceId, startYmd, endYmd) as { wh: number };
      return num(row.wh);
    },
    runtimeMinutes(deviceId, startYmd, endYmd) {
      const row = raw
        .prepare(
          "SELECT COALESCE(SUM(runtime_min),0) AS r FROM energy_daily WHERE device_id=? AND day_ist>=? AND day_ist<?",
        )
        .get(deviceId, startYmd, endYmd) as { r: number };
      return num(row.r);
    },
    dailySeries(deviceId, startYmd, endYmd) {
      return db
        .select({ t: energyDaily.dayIst, wh: energyDaily.wh })
        .from(energyDaily)
        .where(
          and(
            eq(energyDaily.deviceId, deviceId),
            gte(energyDaily.dayIst, startYmd),
            lt(energyDaily.dayIst, endYmd),
          ),
        )
        .orderBy(energyDaily.dayIst)
        .all()
        .map((r) => ({ t: r.t, wh: num(r.wh) }));
    },
    monthlySeries(deviceId, startMonthYmd, endMonthYmd) {
      return db
        .select({ t: energyMonthly.monthStartIst, wh: energyMonthly.wh })
        .from(energyMonthly)
        .where(
          and(
            eq(energyMonthly.deviceId, deviceId),
            gte(energyMonthly.monthStartIst, startMonthYmd),
            lt(energyMonthly.monthStartIst, endMonthYmd),
          ),
        )
        .orderBy(energyMonthly.monthStartIst)
        .all()
        .map((r) => ({ t: r.t, wh: num(r.wh) }));
    },
    hourlySeries(deviceId, startUtcIso, endUtcIso) {
      return db
        .select({ t: energyHourly.hourStartUtc, wh: energyHourly.wh })
        .from(energyHourly)
        .where(
          and(
            eq(energyHourly.deviceId, deviceId),
            gte(energyHourly.hourStartUtc, startUtcIso),
            lt(energyHourly.hourStartUtc, endUtcIso),
          ),
        )
        .orderBy(energyHourly.hourStartUtc)
        .all()
        .map((r) => ({ t: r.t, wh: num(r.wh) }));
    },
    powerStats(deviceId, startUtcIso, endUtcIso) {
      const row = raw
        .prepare(
          "SELECT COALESCE(AVG(watts),0) AS avg, COALESCE(MAX(watts),0) AS peak, COUNT(*) AS n FROM power_samples WHERE device_id=? AND ts_utc>=? AND ts_utc<?",
        )
        .get(deviceId, startUtcIso, endUtcIso) as {
        avg: number;
        peak: number;
        n: number;
      };
      return { avgW: num(row.avg), peakW: num(row.peak), count: num(row.n) };
    },
    latestSnapshot: (deviceId) =>
      db
        .select()
        .from(energySnapshots)
        .where(eq(energySnapshots.deviceId, deviceId))
        .orderBy(desc(energySnapshots.tsUtc))
        .limit(1)
        .get(),
    latestPower: (deviceId) =>
      db
        .select()
        .from(powerSamples)
        .where(eq(powerSamples.deviceId, deviceId))
        .orderBy(desc(powerSamples.tsUtc))
        .limit(1)
        .get(),
  };
}

function tariffRepo(): TariffRepository {
  const db = getDb();
  return {
    getActive() {
      const row = db
        .select()
        .from(tariffConfig)
        .where(eq(tariffConfig.isActive, true))
        .orderBy(desc(tariffConfig.effectiveFrom))
        .limit(1)
        .get();
      if (!row) return undefined;
      return parseTariffConfig(JSON.parse(row.json));
    },
    list: () =>
      db.select().from(tariffConfig).orderBy(desc(tariffConfig.effectiveFrom)).all(),
    create(config, makeActive) {
      if (makeActive) {
        db.update(tariffConfig).set({ isActive: false }).run();
      }
      const res = db
        .insert(tariffConfig)
        .values({
          name: config.name,
          effectiveFrom: config.effectiveFrom,
          json: JSON.stringify(config),
          isActive: makeActive,
        })
        .run();
      return Number(res.lastInsertRowid);
    },
  };
}

function billsRepo(): BillsRepository {
  const db = getDb();
  return {
    list: () => db.select().from(bills).orderBy(desc(bills.cycleStart)).all(),
    create(input) {
      const res = db
        .insert(bills)
        .values({
          cycleStart: input.cycleStart,
          cycleEnd: input.cycleEnd,
          units: input.units,
          amount: input.amount,
          source: input.source ?? "manual",
        })
        .run();
      return Number(res.lastInsertRowid);
    },
  };
}

export interface Repositories {
  devices: DeviceRepository;
  energy: EnergyRepository;
  tariffs: TariffRepository;
  bills: BillsRepository;
}

export function getRepositories(): Repositories {
  return {
    devices: deviceRepo(),
    energy: energyRepo(),
    tariffs: tariffRepo(),
    bills: billsRepo(),
  };
}
