import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatKwh, formatNumber, formatRupees } from "@/lib/format";
import { getRepositories } from "@/lib/repositories";
import { computeBill } from "@/lib/tariff/compute";
import { getUsage } from "@/lib/services/usage";

export const dynamic = "force-dynamic";

function Row({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div
      className={`flex items-center justify-between py-1.5 ${
        strong ? "border-t font-semibold" : "text-sm"
      }`}
    >
      <span className={strong ? "" : "text-muted-foreground"}>{label}</span>
      <span className="tabular-nums">{value}</span>
    </div>
  );
}

export default async function BillPage() {
  const repos = getRepositories();
  const tariff = repos.tariffs.getActive();
  const usage = getUsage({ period: "cycle" });
  const bd = usage.cost.breakdown;

  // Real bills with computed-vs-actual comparison (calibration / golden check).
  const realBills = repos.bills.list().map((b) => {
    if (!tariff) return { b, computed: null as number | null, variance: null as number | null };
    const r = computeBill(
      {
        units: b.units,
        periodStart: new Date(`${b.cycleStart}T00:00:00+05:30`),
        periodEnd: new Date(`${b.cycleEnd}T23:59:59+05:30`),
        periodType: "cycle",
      },
      tariff,
    );
    const variance = b.amount > 0 ? ((r.total - b.amount) / b.amount) * 100 : null;
    return { b, computed: r.total, variance };
  });

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Current cycle — computed statement (PGVCL-style)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-2 text-xs text-muted-foreground">
            {tariff?.name} · {formatKwh(usage.units_kwh)} this cycle
          </div>
          <div className="rounded-md border p-3">
            <div className="mb-1 text-xs font-medium uppercase text-muted-foreground">
              Energy charge (telescopic)
            </div>
            {bd.energySlabs.map((s, i) => (
              <Row
                key={i}
                label={`${formatNumber(s.fromUnit, 0)}–${
                  s.toUnit == null ? "∞" : formatNumber(s.toUnit, 0)
                } @ ${formatRupees(s.ratePerUnit)} × ${formatNumber(s.units, 0)}`}
                value={formatRupees(s.amount)}
              />
            ))}
            <Row label="Energy charge" value={formatRupees(bd.energy)} strong />
            <div className="h-2" />
            <Row label="Fixed charge" value={formatRupees(bd.fixed)} />
            <Row label="Fuel charge (FPPPA)" value={formatRupees(bd.fuel)} />
            <Row label="Electricity duty" value={formatRupees(bd.duty)} />
            <Row label="Meter rent" value={formatRupees(bd.meter)} />
            <Row label="Total" value={formatRupees(usage.cost.total)} strong />
            <Row
              label="Effective ₹/unit"
              value={formatRupees(usage.cost.effective_rate)}
            />
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            For reference. FPPPA and electricity-duty rates are placeholders pending
            bill confirmation — see Settings to freeze them.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Real bills — computed vs actual</CardTitle>
        </CardHeader>
        <CardContent>
          {realBills.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No bills stored. Add one on the Calibrate page.
            </p>
          ) : (
            <div className="space-y-3">
              {realBills.map(({ b, computed, variance }) => (
                <div key={b.id} className="rounded-md border p-3 text-sm">
                  <div className="mb-2 flex items-center justify-between font-medium">
                    <span>
                      {b.cycleStart} → {b.cycleEnd}
                    </span>
                    <span className="text-muted-foreground">{formatKwh(b.units)}</span>
                  </div>
                  <Row label="Printed amount" value={formatRupees(b.amount)} />
                  <Row
                    label="Computed amount"
                    value={computed == null ? "—" : formatRupees(computed)}
                  />
                  {variance != null && (
                    <div
                      className={`mt-1 text-xs ${
                        Math.abs(variance) <= 2 ? "text-emerald-400" : "text-amber-400"
                      }`}
                    >
                      variance {formatNumber(variance, 1)}%{" "}
                      {Math.abs(variance) <= 2
                        ? "✓ within tolerance"
                        : "— adjust tariff / calibration"}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
