import { describe, expect, it } from "vitest";
import {
  computeBill,
  computeMarginalCost,
  computeProjectedShare,
  daySpan,
  energyChargeTelescopic,
  monthsForPeriod,
  scaleSlabWidths,
} from "@/lib/tariff/compute";
import { parseTariffConfig, type TariffConfig } from "@/lib/tariff/schema";
import { PGVCL_RGP_OTHER_AREAS } from "@/lib/tariff/pgvcl";

const SLABS = PGVCL_RGP_OTHER_AREAS.energySlabs;

/** Minimal tariff builder for isolating a single behaviour. */
function tariff(overrides: Partial<TariffConfig> = {}): TariffConfig {
  return parseTariffConfig({
    name: "test",
    billingCycleMonths: 2,
    slabBasis: "per_month",
    energySlabs: SLABS,
    fixedCharge: { type: "flat_per_month", amount: 0 },
    fuelSurcharge: { type: "per_unit", ratePerUnit: 0 },
    electricityDuty: { type: "percent_of_energy", value: 0 },
    meterRent: { type: "flat_per_month", amount: 0 },
    calibrationFactor: 1,
    rounding: "none",
    effectiveFrom: "2022-04-01",
    ...overrides,
  });
}

const day = (iso: string) => new Date(`${iso}T00:00:00+05:30`);

describe("energyChargeTelescopic — slab edges", () => {
  it("zero units costs nothing", () => {
    expect(energyChargeTelescopic(0, SLABS).cost).toBe(0);
  });
  it("exactly the first boundary (50)", () => {
    expect(energyChargeTelescopic(50, SLABS).cost).toBeCloseTo(152.5, 6);
  });
  it("exactly the second boundary (100)", () => {
    // 50*3.05 + 50*3.50
    expect(energyChargeTelescopic(100, SLABS).cost).toBeCloseTo(327.5, 6);
  });
  it("exactly the third boundary (250)", () => {
    // 152.5 + 175 + 150*4.15
    expect(energyChargeTelescopic(250, SLABS).cost).toBeCloseTo(950, 6);
  });
  it("into the unbounded top slab (1000)", () => {
    // 950 + 750*5.20
    expect(energyChargeTelescopic(1000, SLABS).cost).toBeCloseTo(4850, 6);
  });
  it("per-slab breakdown sums to total and respects widths", () => {
    const { cost, breakdown } = energyChargeTelescopic(300, SLABS);
    expect(breakdown.reduce((a, b) => a + b.amount, 0)).toBeCloseTo(cost, 6);
    expect(breakdown.map((b) => b.units)).toEqual([50, 50, 150, 50]);
  });
});

describe("scaleSlabWidths — per-month scaling", () => {
  it("scale ×2 (bi-monthly) doubles widths and rebuilds boundaries", () => {
    const scaled = scaleSlabWidths(SLABS, 2);
    expect(scaled.map((s) => [s.fromUnit, s.toUnit])).toEqual([
      [0, 100],
      [100, 200],
      [200, 500],
      [500, null],
    ]);
  });
  it("scale ×1 is identity on boundaries", () => {
    const scaled = scaleSlabWidths(SLABS, 1);
    expect(scaled.map((s) => [s.fromUnit, s.toUnit])).toEqual([
      [0, 50],
      [50, 100],
      [100, 250],
      [250, null],
    ]);
  });
});

describe("monthsForPeriod", () => {
  it("month → 1, cycle → billingCycleMonths", () => {
    expect(monthsForPeriod("month", 30, 2)).toBe(1);
    expect(monthsForPeriod("cycle", 61, 2)).toBe(2);
  });
  it("sub-cycle pro-rates by calendar length", () => {
    expect(monthsForPeriod("day", 1, 2)).toBeCloseTo(1 / 30.4375, 6);
    expect(monthsForPeriod("custom", 15, 2)).toBeCloseTo(15 / 30.4375, 6);
  });
});

describe("daySpan", () => {
  it("counts a calendar day as ~1", () => {
    expect(daySpan(day("2026-04-01"), day("2026-04-02"))).toBeCloseTo(1, 6);
  });
});

describe("computeBill — full periods", () => {
  it("cycle (300 units): slabs ×2, fixed×2, fuel, 15% duty", () => {
    const t = tariff({
      fixedCharge: { type: "flat_per_month", amount: 15 },
      fuelSurcharge: { type: "per_unit", ratePerUnit: 3.0 },
      electricityDuty: { type: "percent_of_energy", value: 15 },
    });
    const r = computeBill(
      {
        units: 300,
        periodStart: day("2026-04-01"),
        periodEnd: day("2026-06-01"),
        periodType: "cycle",
      },
      t,
    );
    // energy with ×2 slabs: 100*3.05 + 100*3.50 + 100*4.15 = 1070
    expect(r.breakdown.energy).toBeCloseTo(1070, 6);
    expect(r.breakdown.fixed).toBeCloseTo(30, 6); // 15 * 2 months
    expect(r.breakdown.fuel).toBeCloseTo(900, 6); // 300 * 3
    expect(r.breakdown.duty).toBeCloseTo(160.5, 6); // 15% of 1070
    expect(r.subtotal).toBeCloseTo(2160.5, 6);
  });

  it("month (300 units): single slabs, fixed×1", () => {
    const t = tariff({
      fixedCharge: { type: "flat_per_month", amount: 15 },
    });
    const r = computeBill(
      {
        units: 300,
        periodStart: day("2026-04-01"),
        periodEnd: day("2026-05-01"),
        periodType: "month",
      },
      t,
    );
    // single slabs: 152.5 + 175 + 622.5 + 50*5.20 = 1210
    expect(r.breakdown.energy).toBeCloseTo(1210, 6);
    expect(r.breakdown.fixed).toBeCloseTo(15, 6);
    expect(r.monthsInPeriod).toBe(1);
  });

  it("nearest_rupee rounding applies only to the total", () => {
    const t = tariff({
      rounding: "nearest_rupee",
      electricityDuty: { type: "percent_of_energy", value: 15 },
      fuelSurcharge: { type: "per_unit", ratePerUnit: 3.0 },
      fixedCharge: { type: "flat_per_month", amount: 15 },
    });
    const r = computeBill(
      {
        units: 300,
        periodStart: day("2026-04-01"),
        periodEnd: day("2026-06-01"),
        periodType: "cycle",
      },
      t,
    );
    expect(r.total).toBe(2161); // round(2160.5)
  });
});

describe("computeBill — fixed-charge variants", () => {
  const period = {
    units: 100,
    periodStart: day("2026-04-01"),
    periodEnd: day("2026-06-01"),
    periodType: "cycle" as const,
  };
  it("per_kw_per_month scales by load × months", () => {
    const t = tariff({
      fixedCharge: {
        type: "per_kw_per_month",
        ratePerKw: 10,
        sanctionedLoadKw: 2,
      },
    });
    expect(computeBill(period, t).breakdown.fixed).toBeCloseTo(40, 6); // 10*2*2
  });
  it("flat_per_cycle is as-is for a full cycle, pro-rated for a month", () => {
    const t = tariff({ fixedCharge: { type: "flat_per_cycle", amount: 100 } });
    expect(computeBill(period, t).breakdown.fixed).toBeCloseTo(100, 6);
    expect(
      computeBill({ ...period, periodType: "month" }, t).breakdown.fixed,
    ).toBeCloseTo(50, 6); // 100 * (1/2)
  });
});

describe("computeBill — duty variants", () => {
  const period = {
    units: 300,
    periodStart: day("2026-04-01"),
    periodEnd: day("2026-06-01"),
    periodType: "cycle" as const,
  };
  it("per_unit duty = units × value", () => {
    const t = tariff({ electricityDuty: { type: "per_unit", value: 1.5 } });
    expect(computeBill(period, t).breakdown.duty).toBeCloseTo(450, 6);
  });
  it("percent_of_energy duty = energy × value%", () => {
    const t = tariff({
      electricityDuty: { type: "percent_of_energy", value: 15 },
    });
    // energy ×2 slabs for 300 = 1070
    expect(computeBill(period, t).breakdown.duty).toBeCloseTo(160.5, 6);
  });
});

describe("sub-cycle: marginal (§6.4a)", () => {
  it("marginal energy is the incremental cost at cumulative position", () => {
    const t = tariff({
      fuelSurcharge: { type: "per_unit", ratePerUnit: 3.0 },
      electricityDuty: { type: "percent_of_energy", value: 15 },
      fixedCharge: { type: "flat_per_month", amount: 15 },
    });
    // cumulative 240 → +20 units, ×2 slabs so 240 & 260 are both in 200–500 @4.15
    const r = computeMarginalCost(
      {
        units: 20,
        periodStart: day("2026-04-10"),
        periodEnd: day("2026-04-11"),
        periodType: "day",
      },
      t,
      240,
    );
    expect(r.marginalEnergy).toBeCloseTo(83, 6); // 20 * 4.15
    expect(r.marginalRate).toBeCloseTo(4.15, 6);
    expect(r.breakdown.fuel).toBeCloseTo(60, 6); // 20 * 3
  });

  it("marginal crossing a slab boundary blends the two rates", () => {
    const t = tariff();
    // ×2 slabs: boundary at 200 (₹3.50→₹4.15). 190→210 spans it.
    const r = computeMarginalCost(
      {
        units: 20,
        periodStart: day("2026-04-10"),
        periodEnd: day("2026-04-11"),
        periodType: "day",
      },
      t,
      190,
    );
    // 10 units @3.50 + 10 units @4.15 = 76.5
    expect(r.marginalEnergy).toBeCloseTo(76.5, 6);
  });
});

describe("sub-cycle: projected share (§6.4b)", () => {
  it("attributes a window's proportional share of the projected cycle bill", () => {
    const t = tariff({
      fuelSurcharge: { type: "per_unit", ratePerUnit: 3.0 },
      electricityDuty: { type: "percent_of_energy", value: 15 },
      fixedCharge: { type: "flat_per_month", amount: 15 },
    });
    const r = computeProjectedShare(
      50, // window units
      500, // projected cycle units
      day("2026-04-01"),
      day("2026-06-01"),
      t,
    );
    // projected cycle 500: energy ×2 = 305+350+1245 = 1900; fixed 30; fuel 1500; duty 285
    // total = 3715; share = 3715 * 50/500 = 371.5
    expect(r.projectedCycleTotal).toBeCloseTo(3715, 6);
    expect(r.shareCost).toBeCloseTo(371.5, 6);
  });
});
