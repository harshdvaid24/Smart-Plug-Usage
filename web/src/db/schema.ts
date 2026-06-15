import { sql } from "drizzle-orm";
import {
  index,
  integer,
  real,
  sqliteTable,
  text,
  unique,
} from "drizzle-orm/sqlite-core";

/**
 * Data model (§7). Canonical units: Wh (energy), W (power), minutes (runtime).
 * Timestamps stored as ISO-8601 UTC text (sorts lexicographically → range-friendly).
 * Day/month boundary columns are IST calendar strings ('YYYY-MM-DD' / 'YYYY-MM-01').
 *
 * ⚠️ The Python poller mirrors this DDL exactly in poller/poller/schema_sql.py.
 * Keep the two in sync (column names + types). Both apply CREATE TABLE IF NOT EXISTS.
 */

const timestamps = {
  createdAt: text("created_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
};

export const device = sqliteTable("device", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  deviceId: text("device_id").notNull().unique(),
  model: text("model"),
  fwVer: text("fw_ver"),
  mac: text("mac"),
  nickname: text("nickname"),
  ip: text("ip"),
  // online | offline | unknown
  status: text("status").notNull().default("unknown"),
  firstSeen: text("first_seen"),
  lastSeen: text("last_seen"),
  ...timestamps,
});

export const powerSamples = sqliteTable(
  "power_samples",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    deviceId: text("device_id").notNull(),
    tsUtc: text("ts_utc").notNull(),
    watts: real("watts").notNull(),
    voltage: real("voltage"),
    current: real("current"),
    ...timestamps,
  },
  (t) => ({
    byDeviceTs: index("idx_power_samples_device_ts").on(t.deviceId, t.tsUtc),
  }),
);

export const energySnapshots = sqliteTable(
  "energy_snapshots",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    deviceId: text("device_id").notNull(),
    tsUtc: text("ts_utc").notNull(),
    todayWh: real("today_wh"),
    monthWh: real("month_wh"),
    todayRuntimeMin: integer("today_runtime_min"),
    monthRuntimeMin: integer("month_runtime_min"),
    ...timestamps,
  },
  (t) => ({
    byDeviceTs: index("idx_energy_snapshots_device_ts").on(t.deviceId, t.tsUtc),
  }),
);

export const energyHourly = sqliteTable(
  "energy_hourly",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    deviceId: text("device_id").notNull(),
    hourStartUtc: text("hour_start_utc").notNull(),
    wh: real("wh").notNull(),
    ...timestamps,
  },
  (t) => ({
    uniq: unique("uniq_energy_hourly").on(t.deviceId, t.hourStartUtc),
    byHour: index("idx_energy_hourly_hour").on(t.hourStartUtc),
  }),
);

/** AUTHORITATIVE daily kWh (Wh) — the source of truth for history (§5.2). */
export const energyDaily = sqliteTable(
  "energy_daily",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    deviceId: text("device_id").notNull(),
    dayIst: text("day_ist").notNull(), // 'YYYY-MM-DD' (IST)
    wh: real("wh").notNull(),
    runtimeMin: integer("runtime_min"),
    ...timestamps,
  },
  (t) => ({
    uniq: unique("uniq_energy_daily").on(t.deviceId, t.dayIst),
    byDay: index("idx_energy_daily_day").on(t.dayIst),
  }),
);

export const energyMonthly = sqliteTable(
  "energy_monthly",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    deviceId: text("device_id").notNull(),
    monthStartIst: text("month_start_ist").notNull(), // 'YYYY-MM-01' (IST)
    wh: real("wh").notNull(),
    runtimeMin: integer("runtime_min"),
    ...timestamps,
  },
  (t) => ({
    uniq: unique("uniq_energy_monthly").on(t.deviceId, t.monthStartIst),
    byMonth: index("idx_energy_monthly_month").on(t.monthStartIst),
  }),
);

/** Versioned tariff snapshots — json validated by tariffConfigSchema. */
export const tariffConfig = sqliteTable("tariff_config", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  effectiveFrom: text("effective_from").notNull(), // 'YYYY-MM-DD'
  json: text("json").notNull(),
  isActive: integer("is_active", { mode: "boolean" }).notNull().default(false),
  ...timestamps,
});

/** Real DISCOM bills — for calibration + the golden test. */
export const bills = sqliteTable("bills", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  cycleStart: text("cycle_start").notNull(),
  cycleEnd: text("cycle_end").notNull(),
  units: real("units").notNull(),
  amount: real("amount").notNull(),
  source: text("source"), // 'pgvcl' | 'manual' | ...
  ...timestamps,
});

export type Device = typeof device.$inferSelect;
export type PowerSample = typeof powerSamples.$inferSelect;
export type EnergyDaily = typeof energyDaily.$inferSelect;
export type EnergyMonthly = typeof energyMonthly.$inferSelect;
export type TariffConfigRow = typeof tariffConfig.$inferSelect;
export type BillRow = typeof bills.$inferSelect;
