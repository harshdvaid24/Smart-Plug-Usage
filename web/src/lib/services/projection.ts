import { getRepositories } from "@/lib/repositories";
import { computeBill } from "@/lib/tariff/compute";
import {
  cycleRangeContaining,
  daysBetween,
  istMidnight,
  istYmd,
} from "@/lib/time";

export interface ProjectionResult {
  cycle_start: string;
  cycle_end: string;
  units_so_far: number;
  days_elapsed: number;
  days_total: number;
  run_rate_kwh_per_day: number;
  projected_units: number;
  projected_cost: number;
  cost_so_far: number;
}

export function getProjection(opts: {
  cycleStart?: string;
  deviceId?: string;
  now?: Date;
}): ProjectionResult {
  const repos = getRepositories();
  const tariff = repos.tariffs.getActive();
  if (!tariff) throw new Error("No active tariff configured");
  const calib = tariff.calibrationFactor;

  const deviceId =
    opts.deviceId ?? repos.devices.getPrimary()?.deviceId ?? "p110-demo";
  const now = opts.now ?? new Date();

  const cycle = opts.cycleStart
    ? (() => {
        const [y, m, d] = opts.cycleStart!.split("-").map(Number);
        return cycleRangeContaining(istMidnight(y, m, d));
      })()
    : cycleRangeContaining(now);

  const cycleStartYmd = istYmd(cycle.start);
  const nowExclusive = istYmd(new Date(now.getTime() + 86_400_000));
  const unitsSoFar =
    (repos.energy.sumDailyWh(deviceId, cycleStartYmd, nowExclusive) / 1000) * calib;

  const daysElapsed = Math.max(daysBetween(cycle.start, now), 1 / 24);
  const daysTotal = daysBetween(cycle.start, cycle.end);
  const runRate = unitsSoFar / daysElapsed;
  const projectedUnits = Math.max(runRate * daysTotal, unitsSoFar);

  const projected = computeBill(
    {
      units: projectedUnits,
      periodStart: cycle.start,
      periodEnd: cycle.end,
      periodType: "cycle",
    },
    tariff,
  );
  const soFar = computeBill(
    {
      units: unitsSoFar,
      periodStart: cycle.start,
      periodEnd: cycle.end,
      periodType: "cycle",
    },
    tariff,
  );

  return {
    cycle_start: cycle.start.toISOString(),
    cycle_end: cycle.end.toISOString(),
    units_so_far: unitsSoFar,
    days_elapsed: daysElapsed,
    days_total: daysTotal,
    run_rate_kwh_per_day: runRate,
    projected_units: projectedUnits,
    projected_cost: projected.total,
    cost_so_far: soFar.total,
  };
}
