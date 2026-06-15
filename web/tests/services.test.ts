import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { beforeAll, describe, expect, it } from "vitest";

// Point the DB at a fresh temp file BEFORE importing anything that opens it.
process.env.DATABASE_URL = join(
  mkdtempSync(join(tmpdir(), "tapo-test-")),
  "energy.db",
);

const IST = "+05:30";

beforeAll(async () => {
  const { getSqlite } = await import("@/db/client");
  const { PGVCL_RGP_OTHER_AREAS } = await import("@/lib/tariff/pgvcl");
  const db = getSqlite();

  db.prepare(
    "INSERT INTO tariff_config (name, effective_from, json, is_active) VALUES (?,?,?,1)",
  ).run(
    PGVCL_RGP_OTHER_AREAS.name,
    PGVCL_RGP_OTHER_AREAS.effectiveFrom,
    JSON.stringify(PGVCL_RGP_OTHER_AREAS),
  );
  db.prepare(
    "INSERT INTO device (device_id, model, status) VALUES ('p110-demo','P110','online')",
  ).run();

  // Seed April 1–15, 2026: 10 kWh/day for 1–14, 12 kWh on the 15th.
  const ins = db.prepare(
    "INSERT INTO energy_daily (device_id, day_ist, wh, runtime_min) VALUES (?,?,?,?)",
  );
  for (let d = 1; d <= 14; d++) {
    ins.run("p110-demo", `2026-04-${String(d).padStart(2, "0")}`, 10000, 300);
  }
  ins.run("p110-demo", "2026-04-15", 12000, 360);

  // A few power samples within Apr 15 for avg/peak.
  const ps = db.prepare(
    "INSERT INTO power_samples (device_id, ts_utc, watts) VALUES (?,?,?)",
  );
  ps.run("p110-demo", "2026-04-15T06:00:00Z", 1000);
  ps.run("p110-demo", "2026-04-15T07:00:00Z", 1500);
});

describe("getUsage — cycle aggregation + cost", () => {
  it("sums authoritative daily kWh and prices the full cycle", async () => {
    const { getUsage } = await import("@/lib/services/usage");
    const r = getUsage({
      period: "cycle",
      now: new Date(`2026-04-15T12:00:00${IST}`),
    });
    // 14*10 + 12 = 152 kWh
    expect(r.units_kwh).toBeCloseTo(152, 6);
    // computeBill cycle(152): energy ×2 = 100*3.05+52*3.50 = 487; fixed 30;
    // fuel 152*3=456; duty 15% of 487 = 73.05 → subtotal 1046.05 → 1046
    expect(r.cost.total).toBe(1046);
    expect(r.co2_kg).toBeCloseTo(152 * 0.79, 4);
  });
});

describe("getUsage — sub-cycle day (marginal + projected)", () => {
  it("uses marginal headline and exposes projected share", async () => {
    const { getUsage } = await import("@/lib/services/usage");
    const r = getUsage({
      period: "day",
      now: new Date(`2026-04-15T12:00:00${IST}`),
    });
    expect(r.units_kwh).toBeCloseTo(12, 6);
    // marginal energy: cumulative 140 → +12 all in 100–200 slab @3.50 = 42
    expect(r.cost.marginal).toBeDefined();
    expect(r.cost.projected_share).toBeGreaterThan(0);
    expect(r.cost.breakdown.fuel).toBeCloseTo(36, 6); // 12 * 3
  });
});

describe("getProjection", () => {
  it("extrapolates the cycle run-rate", async () => {
    const { getProjection } = await import("@/lib/services/projection");
    const p = getProjection({ now: new Date(`2026-04-15T12:00:00${IST}`) });
    expect(p.units_so_far).toBeCloseTo(152, 6);
    expect(p.projected_units).toBeGreaterThanOrEqual(p.units_so_far);
    expect(p.projected_cost).toBeGreaterThan(0);
  });
});

describe("getLive", () => {
  it("reports latest power + today kWh", async () => {
    const { getLive } = await import("@/lib/services/live");
    const live = getLive();
    expect(live.device_id).toBe("p110-demo");
    expect(live.current_power_w).toBe(1500); // latest sample
    expect(live.today_kwh).toBeCloseTo(0, 6); // no data for the real "today"
  });
});
