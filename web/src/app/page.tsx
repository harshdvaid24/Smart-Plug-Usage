import { CostBreakdown } from "@/components/cost-breakdown";
import { KpiCard } from "@/components/kpi-card";
import { LiveGauge } from "@/components/live-gauge";
import { PeriodSelector } from "@/components/period-selector";
import { UsageChart } from "@/components/usage-chart";
import { Card, CardContent } from "@/components/ui/card";
import {
  formatKwh,
  formatNumber,
  formatRupees,
} from "@/lib/format";
import { getLive } from "@/lib/services/live";
import { getProjection } from "@/lib/services/projection";
import { getUsage } from "@/lib/services/usage";
import type { PeriodType } from "@/lib/tariff/types";

export const dynamic = "force-dynamic";

const VALID: PeriodType[] = ["day", "week", "month", "cycle", "year", "custom"];

export default async function Dashboard({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const sp = await searchParams;
  const period = (VALID.includes(sp.period as PeriodType) ? sp.period : "cycle") as PeriodType;

  let usage, projection, live, error: string | null = null;
  try {
    usage = getUsage({
      period,
      start: sp.start,
      end: sp.end,
      granularity: sp.granularity as "hour" | "day" | "month" | undefined,
    });
    projection = getProjection({});
    live = getLive();
  } catch (e) {
    error = e instanceof Error ? e.message : "Failed to load";
  }

  if (error || !usage || !projection || !live) {
    return (
      <>
        <PeriodSelector />
        <Card>
          <CardContent className="p-8 text-center text-sm text-muted-foreground">
            {error ?? "No data yet."} — run the poller (or seed the DB) to populate
            readings.
          </CardContent>
        </Card>
      </>
    );
  }

  const c = usage.cost;
  const granularity =
    sp.granularity ?? (period === "day" ? "hour" : period === "year" ? "month" : "day");

  return (
    <>
      <PeriodSelector />

      <div className="grid gap-4 md:grid-cols-3">
        <div className="md:col-span-1">
          <LiveGauge initial={live} />
        </div>

        <div className="grid grid-cols-2 gap-4 md:col-span-2">
          <KpiCard
            label="Units this period"
            value={formatKwh(usage.units_kwh)}
            deltaPct={usage.comparison.delta_pct}
          />
          <KpiCard
            label={c.marginal != null ? "Marginal cost" : "Cost this period"}
            value={formatRupees(c.total)}
            sub={c.projected_share != null ? `share ${formatRupees(c.projected_share)}` : undefined}
            deltaPct={
              usage.comparison.prev_cost > 0
                ? ((c.total - usage.comparison.prev_cost) / usage.comparison.prev_cost) * 100
                : null
            }
          />
          <KpiCard
            label="Projected cycle bill"
            value={formatRupees(projection.projected_cost)}
            sub={`${formatNumber(projection.projected_units, 0)} kWh · ${formatNumber(
              projection.run_rate_kwh_per_day,
              1,
            )} kWh/day`}
          />
          <KpiCard
            label="Cost so far (cycle)"
            value={formatRupees(projection.cost_so_far)}
            sub={`${formatNumber(projection.days_elapsed, 0)}/${formatNumber(
              projection.days_total,
              0,
            )} days`}
          />
          <KpiCard
            label="Effective ₹/unit"
            value={formatRupees(c.effective_rate)}
            sub="all-in"
          />
          <KpiCard
            label="Avg / peak power"
            value={`${formatNumber(usage.avg_power_w, 0)} W`}
            sub={`peak ${formatNumber(usage.peak_power_w, 0)} W · ${formatNumber(
              usage.runtime_hours,
              1,
            )} h on`}
          />
        </div>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-3">
        <div className="md:col-span-2">
          <UsageChart series={usage.series} granularity={granularity} />
        </div>
        <CostBreakdown breakdown={usage.cost.breakdown} />
      </div>

      <Card className="mt-4">
        <CardContent className="flex flex-wrap items-center justify-between gap-3 p-4 text-sm">
          <span className="text-muted-foreground">
            vs previous {period}: {formatKwh(usage.comparison.prev_units)} ·{" "}
            {formatRupees(usage.comparison.prev_cost)}
          </span>
          <span className="text-muted-foreground">
            CO₂ ≈ <span className="font-medium text-foreground">{formatNumber(usage.co2_kg, 1)} kg</span>
          </span>
        </CardContent>
      </Card>
    </>
  );
}
