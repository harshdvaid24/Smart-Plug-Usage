import type { EnergySlab, TariffConfig } from "./schema";
import type {
  BillInput,
  BillResult,
  MarginalResult,
  PeriodType,
  ProjectedShareResult,
  SlabCharge,
} from "./types";

/**
 * Tariff engine (§6). Pure, deterministic, side-effect-free. No I/O.
 * This is where correctness lives — see tests/tariff.test.ts (acceptance gate).
 *
 * Canonical inputs: `units` is kWh already adjusted by calibrationFactor.
 * All money is ₹. Rounding (nearest rupee) is applied only to final totals.
 */

const MS_PER_DAY = 86_400_000;
const DAYS_PER_MONTH = 30.4375; // 365.25 / 12

/** Fractional day span of a window (>= a tiny epsilon to avoid divide-by-zero). */
export function daySpan(start: Date, end: Date): number {
  const raw = (end.getTime() - start.getTime()) / MS_PER_DAY;
  return Math.max(raw, 1 / 24);
}

/** How many "months" a period represents — drives per-month slab scaling. */
export function monthsForPeriod(
  periodType: PeriodType,
  days: number,
  billingCycleMonths: number,
): number {
  switch (periodType) {
    case "month":
      return 1;
    case "cycle":
      return billingCycleMonths;
    default:
      // day / week / year / custom → pro-rate by calendar length.
      return days / DAYS_PER_MONTH;
  }
}

/**
 * Scale telescopic slab WIDTHS by a factor and rebuild cumulative boundaries.
 * Per §6.3: for per-month slabs, widths scale with the period length so the
 * thresholds stay proportional the way the DISCOM intends. The unbounded top
 * slab (toUnit === null) stays unbounded.
 */
export function scaleSlabWidths(
  slabs: EnergySlab[],
  scale: number,
): EnergySlab[] {
  const out: EnergySlab[] = [];
  let cum = 0;
  for (const s of slabs) {
    if (s.toUnit === null) {
      out.push({ fromUnit: cum, toUnit: null, ratePerUnit: s.ratePerUnit });
      break;
    }
    const width = (s.toUnit - s.fromUnit) * scale;
    const to = cum + width;
    out.push({ fromUnit: cum, toUnit: to, ratePerUnit: s.ratePerUnit });
    cum = to;
  }
  return out;
}

/** Telescopic (cumulative) energy charge (§6.3). Returns cost + per-slab detail. */
export function energyChargeTelescopic(
  units: number,
  slabs: EnergySlab[],
): { cost: number; breakdown: SlabCharge[] } {
  let cost = 0;
  let remaining = units;
  const breakdown: SlabCharge[] = [];
  for (const s of slabs) {
    const width = s.toUnit === null ? Infinity : s.toUnit - s.fromUnit;
    const take = Math.min(remaining, width);
    if (take <= 0) break;
    const amount = take * s.ratePerUnit;
    cost += amount;
    remaining -= take;
    breakdown.push({
      fromUnit: s.fromUnit,
      toUnit: s.toUnit,
      ratePerUnit: s.ratePerUnit,
      units: take,
      amount,
    });
  }
  return { cost, breakdown };
}

function resolveNamedCharge(
  c: { type: "flat_per_month" | "flat_per_cycle" | "per_unit"; amount: number },
  units: number,
  months: number,
  cycleMonths: number,
): number {
  switch (c.type) {
    case "flat_per_month":
      return c.amount * months;
    case "flat_per_cycle":
      return c.amount * (months / cycleMonths);
    case "per_unit":
      return c.amount * units;
  }
}

function fixedFor(tariff: TariffConfig, months: number): number {
  const f = tariff.fixedCharge;
  switch (f.type) {
    case "per_kw_per_month":
      return f.ratePerKw * f.sanctionedLoadKw * months;
    case "flat_per_month":
      return f.amount * months;
    case "flat_per_cycle":
      return f.amount * (months / tariff.billingCycleMonths);
  }
}

function dutyFor(tariff: TariffConfig, energy: number, units: number): number {
  const d = tariff.electricityDuty;
  return d.type === "percent_of_energy"
    ? (energy * d.value) / 100
    : units * d.value;
}

function roundTotal(value: number, rounding: TariffConfig["rounding"]): number {
  return rounding === "nearest_rupee" ? Math.round(value) : value;
}

/**
 * Full-period bill (§6.5). Use for month / cycle / year-constituent windows.
 * For sub-cycle day/week/custom windows, prefer computeMarginalCost (headline)
 * + computeProjectedShare (secondary) per §6.4.
 */
export function computeBill(input: BillInput, tariff: TariffConfig): BillResult {
  const { units } = input;
  const days = daySpan(input.periodStart, input.periodEnd);
  const months = monthsForPeriod(
    input.periodType,
    days,
    tariff.billingCycleMonths,
  );
  const slabScale = tariff.slabBasis === "per_month" ? months : 1;
  const scaledSlabs = scaleSlabWidths(tariff.energySlabs, slabScale);

  const { cost: energy, breakdown: energySlabs } = energyChargeTelescopic(
    units,
    scaledSlabs,
  );
  const fixed = fixedFor(tariff, months);
  const fuel = units * tariff.fuelSurcharge.ratePerUnit;
  const duty = dutyFor(tariff, energy, units);
  const meter = tariff.meterRent.amount * months;

  const otherCharges = tariff.otherCharges.map((c) => ({
    name: c.name,
    amount: resolveNamedCharge(c, units, months, tariff.billingCycleMonths),
  }));
  const subsidies = tariff.subsidies.map((c) => ({
    name: c.name,
    amount: resolveNamedCharge(c, units, months, tariff.billingCycleMonths),
  }));

  const otherSum = otherCharges.reduce((a, c) => a + c.amount, 0);
  const subsidySum = subsidies.reduce((a, c) => a + c.amount, 0);

  const subtotal = energy + fixed + fuel + duty + meter + otherSum - subsidySum;

  const taxes = tariff.taxes.map((t) => ({
    name: t.name,
    amount: (subtotal * t.value) / 100,
  }));
  const taxSum = taxes.reduce((a, t) => a + t.amount, 0);

  const total = roundTotal(subtotal + taxSum, tariff.rounding);

  return {
    units,
    days,
    monthsInPeriod: months,
    breakdown: {
      energy,
      energySlabs,
      fixed,
      fuel,
      duty,
      meter,
      otherCharges,
      subsidies,
      taxes,
    },
    subtotal,
    total,
    effectiveRatePerUnit: units > 0 ? total / units : 0,
    currency: "INR",
  };
}

/**
 * Sub-cycle MARGINAL cost (§6.4a). "What did this window actually cost at the
 * margin?" — the incremental energy cost of these units given the cycle's
 * current cumulative consumption, plus pro-rated fixed/fuel/duty/meter.
 */
export function computeMarginalCost(
  input: BillInput,
  tariff: TariffConfig,
  cycleCumulativeUnitsBefore: number,
): MarginalResult {
  const { units } = input;
  const days = daySpan(input.periodStart, input.periodEnd);
  const months = days / DAYS_PER_MONTH; // sub-cycle pro-rate

  // Slabs are a cycle construct → scale to the FULL cycle for cumulative math.
  const slabScale =
    tariff.slabBasis === "per_month" ? tariff.billingCycleMonths : 1;
  const scaledSlabs = scaleSlabWidths(tariff.energySlabs, slabScale);

  const before = energyChargeTelescopic(
    cycleCumulativeUnitsBefore,
    scaledSlabs,
  ).cost;
  const after = energyChargeTelescopic(
    cycleCumulativeUnitsBefore + units,
    scaledSlabs,
  ).cost;
  const marginalEnergy = after - before;
  const marginalRate = units > 0 ? marginalEnergy / units : 0;

  const fixed = fixedFor(tariff, months);
  const fuel = units * tariff.fuelSurcharge.ratePerUnit;
  const duty = dutyFor(tariff, marginalEnergy, units);
  const meter = tariff.meterRent.amount * months;

  const otherCharges = tariff.otherCharges.map((c) => ({
    name: c.name,
    amount: resolveNamedCharge(c, units, months, tariff.billingCycleMonths),
  }));
  const subsidies = tariff.subsidies.map((c) => ({
    name: c.name,
    amount: resolveNamedCharge(c, units, months, tariff.billingCycleMonths),
  }));
  const otherSum = otherCharges.reduce((a, c) => a + c.amount, 0);
  const subsidySum = subsidies.reduce((a, c) => a + c.amount, 0);

  const subtotal =
    marginalEnergy + fixed + fuel + duty + meter + otherSum - subsidySum;
  const taxes = tariff.taxes.map((t) => ({
    name: t.name,
    amount: (subtotal * t.value) / 100,
  }));
  const taxSum = taxes.reduce((a, t) => a + t.amount, 0);
  const total = roundTotal(subtotal + taxSum, tariff.rounding);

  return {
    units,
    marginalEnergy,
    marginalRate,
    breakdown: {
      energy: marginalEnergy,
      energySlabs: [],
      fixed,
      fuel,
      duty,
      meter,
      otherCharges,
      subsidies,
      taxes,
    },
    total,
    effectiveRatePerUnit: units > 0 ? total / units : 0,
    currency: "INR",
  };
}

/**
 * Sub-cycle PROJECTED-SHARE cost (§6.4b). Run-rate-extrapolate the cycle, run the
 * full-cycle bill, and attribute this window's proportional share of it.
 */
export function computeProjectedShare(
  windowUnits: number,
  projectedCycleUnits: number,
  cycleStart: Date,
  cycleEnd: Date,
  tariff: TariffConfig,
): ProjectedShareResult {
  const projected = computeBill(
    {
      units: projectedCycleUnits,
      periodStart: cycleStart,
      periodEnd: cycleEnd,
      periodType: "cycle",
    },
    tariff,
  );
  const shareCost =
    projectedCycleUnits > 0
      ? projected.total * (windowUnits / projectedCycleUnits)
      : 0;
  return {
    windowUnits,
    projectedCycleUnits,
    projectedCycleTotal: projected.total,
    shareCost,
    currency: "INR",
  };
}
