import { env } from "@/lib/env";
import { getRepositories, type Repositories } from "@/lib/repositories";
import {
  computeBill,
  computeMarginalCost,
  computeProjectedShare,
} from "@/lib/tariff/compute";
import type { BillBreakdown, PeriodType } from "@/lib/tariff/types";
import type { TariffConfig } from "@/lib/tariff/schema";
import {
  cycleRangeContaining,
  cyclesInRange,
  daysBetween,
  istYmd,
  resolvePeriod,
  type PeriodRange,
} from "@/lib/time";

export interface CostResult {
  total: number;
  breakdown: BillBreakdown;
  effective_rate: number;
  /** Sub-cycle only: marginal headline cost of the window (§6.4a). */
  marginal?: number;
  /** Sub-cycle only: this window's share of the projected cycle bill (§6.4b). */
  projected_share?: number;
  projected_cycle_total?: number;
}

export interface UsageResult {
  period: PeriodType;
  range: { start: string; end: string; startYmd: string; endYmd: string };
  units_kwh: number;
  cost: CostResult;
  avg_power_w: number;
  peak_power_w: number;
  runtime_hours: number;
  co2_kg: number;
  series: { t: string; wh: number; w: number }[];
  comparison: {
    prev_units: number;
    prev_cost: number;
    delta_pct: number | null;
  };
}

function sumUnitsKwh(
  repos: Repositories,
  deviceId: string,
  startYmd: string,
  endYmd: string,
  calibration: number,
): number {
  const wh = repos.energy.sumDailyWh(deviceId, startYmd, endYmd);
  return (wh / 1000) * calibration;
}

/** Cost for a window, dispatching by period per §6.4/§6.5. */
function costFor(
  repos: Repositories,
  deviceId: string,
  range: Pick<PeriodRange, "periodType" | "start" | "end" | "startYmd" | "endYmd">,
  units: number,
  tariff: TariffConfig,
  now: Date,
): CostResult {
  const calib = tariff.calibrationFactor;
  const { periodType } = range;

  // Full-period computations.
  if (periodType === "month" || periodType === "cycle") {
    const r = computeBill(
      { units, periodStart: range.start, periodEnd: range.end, periodType },
      tariff,
    );
    return { total: r.total, breakdown: r.breakdown, effective_rate: r.effectiveRatePerUnit };
  }

  if (periodType === "year") {
    return yearCost(repos, deviceId, range.start, range.end, tariff, calib);
  }

  // Sub-cycle (day / week / custom): use marginal headline + projected share,
  // but only when the window sits within a single cycle. Otherwise fall back to
  // a pro-rated full computation.
  const cycles = cyclesInRange(range.start, range.end);
  if (cycles.length > 1) {
    const r = computeBill(
      { units, periodStart: range.start, periodEnd: range.end, periodType: "custom" },
      tariff,
    );
    return { total: r.total, breakdown: r.breakdown, effective_rate: r.effectiveRatePerUnit };
  }

  const cycle = cycleRangeContaining(range.start);
  const cycleStartYmd = istYmd(cycle.start);
  const cumulativeBefore = sumUnitsKwh(
    repos,
    deviceId,
    cycleStartYmd,
    range.startYmd,
    calib,
  );

  // Run-rate projection of the full cycle.
  const nowYmdExclusive = istYmd(new Date(now.getTime() + 86_400_000));
  const cycleSoFar = sumUnitsKwh(repos, deviceId, cycleStartYmd, nowYmdExclusive, calib);
  const daysElapsed = Math.max(daysBetween(cycle.start, now), 1 / 24);
  const cycleTotalDays = daysBetween(cycle.start, cycle.end);
  const runRate = cycleSoFar / daysElapsed;
  const projectedCycleUnits = Math.max(runRate * cycleTotalDays, cycleSoFar);

  const marginal = computeMarginalCost(
    { units, periodStart: range.start, periodEnd: range.end, periodType },
    tariff,
    cumulativeBefore,
  );
  const projected = computeProjectedShare(
    units,
    projectedCycleUnits,
    cycle.start,
    cycle.end,
    tariff,
  );

  return {
    total: marginal.total,
    breakdown: marginal.breakdown,
    effective_rate: marginal.effectiveRatePerUnit,
    marginal: marginal.total,
    projected_share: projected.shareCost,
    projected_cycle_total: projected.projectedCycleTotal,
  };
}

function emptyBreakdown(): BillBreakdown {
  return {
    energy: 0,
    energySlabs: [],
    fixed: 0,
    fuel: 0,
    duty: 0,
    meter: 0,
    otherCharges: [],
    subsidies: [],
    taxes: [],
  };
}

/** Year = sum of constituent bi-monthly cycles (§6.4). */
function yearCost(
  repos: Repositories,
  deviceId: string,
  start: Date,
  end: Date,
  tariff: TariffConfig,
  calib: number,
): CostResult {
  let total = 0;
  let units = 0;
  const bd = emptyBreakdown();
  for (const c of cyclesInRange(start, end)) {
    const u = sumUnitsKwh(repos, deviceId, istYmd(c.start), istYmd(c.end), calib);
    units += u;
    const r = computeBill(
      { units: u, periodStart: c.start, periodEnd: c.end, periodType: "cycle" },
      tariff,
    );
    total += r.total;
    bd.energy += r.breakdown.energy;
    bd.fixed += r.breakdown.fixed;
    bd.fuel += r.breakdown.fuel;
    bd.duty += r.breakdown.duty;
    bd.meter += r.breakdown.meter;
  }
  return { total, breakdown: bd, effective_rate: units > 0 ? total / units : 0 };
}

function seriesFor(
  repos: Repositories,
  deviceId: string,
  range: PeriodRange,
  granularity: "hour" | "day" | "month",
): { t: string; wh: number; w: number }[] {
  if (granularity === "hour") {
    const pts = repos.energy.hourlySeries(
      deviceId,
      range.start.toISOString(),
      range.end.toISOString(),
    );
    return pts.map((p) => ({ t: p.t, wh: p.wh, w: p.wh })); // 1h bucket → W≈Wh
  }
  if (granularity === "month") {
    const pts = repos.energy.monthlySeries(deviceId, range.startYmd.slice(0, 7) + "-01", range.endYmd.slice(0, 7) + "-01");
    return pts.map((p) => ({ t: p.t, wh: p.wh, w: p.wh / (24 * 30.4375) }));
  }
  const pts = repos.energy.dailySeries(deviceId, range.startYmd, range.endYmd);
  return pts.map((p) => ({ t: p.t, wh: p.wh, w: p.wh / 24 }));
}

function defaultGranularity(period: PeriodType): "hour" | "day" | "month" {
  if (period === "day") return "hour";
  if (period === "year") return "month";
  return "day";
}

export function getUsage(params: {
  period: PeriodType;
  start?: string;
  end?: string;
  granularity?: "hour" | "day" | "month";
  deviceId?: string;
  now?: Date;
}): UsageResult {
  const repos = getRepositories();
  const tariff = repos.tariffs.getActive();
  if (!tariff) throw new Error("No active tariff configured");

  const deviceId =
    params.deviceId ?? repos.devices.getPrimary()?.deviceId ?? "p110-demo";
  const range = resolvePeriod(params.period, {
    now: params.now,
    start: params.start,
    end: params.end,
  });
  const calib = tariff.calibrationFactor;

  const now = params.now ?? new Date();
  const units = sumUnitsKwh(repos, deviceId, range.startYmd, range.endYmd, calib);
  const cost = costFor(repos, deviceId, range, units, tariff, now);

  const power = repos.energy.powerStats(
    deviceId,
    range.start.toISOString(),
    range.end.toISOString(),
  );
  const runtimeHours = repos.energy.runtimeMinutes(deviceId, range.startYmd, range.endYmd) / 60;

  const gran = params.granularity ?? defaultGranularity(params.period);
  const series = seriesFor(repos, deviceId, range, gran);

  // Comparison vs immediately preceding period.
  const prevRange = {
    periodType: range.periodType,
    start: range.prevStart,
    end: range.prevEnd,
    startYmd: istYmd(range.prevStart),
    endYmd: istYmd(range.prevEnd),
  };
  const prevUnits = sumUnitsKwh(repos, deviceId, prevRange.startYmd, prevRange.endYmd, calib);
  const prevCost = costFor(repos, deviceId, prevRange, prevUnits, tariff, now);
  const deltaPct = prevUnits > 0 ? ((units - prevUnits) / prevUnits) * 100 : null;

  return {
    period: params.period,
    range: {
      start: range.start.toISOString(),
      end: range.end.toISOString(),
      startYmd: range.startYmd,
      endYmd: range.endYmd,
    },
    units_kwh: units,
    cost,
    avg_power_w: power.avgW,
    peak_power_w: power.peakW,
    runtime_hours: runtimeHours,
    co2_kg: units * env.emissionFactorKgPerKwh,
    series,
    comparison: {
      prev_units: prevUnits,
      prev_cost: prevCost.total,
      delta_pct: deltaPct,
    },
  };
}
