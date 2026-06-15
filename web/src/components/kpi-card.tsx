import { TrendingDown, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { formatPct } from "@/lib/format";
import { cn } from "@/lib/utils";

export function KpiCard({
  label,
  value,
  sub,
  deltaPct,
  lowerIsBetter = true,
}: {
  label: string;
  value: string;
  sub?: string;
  deltaPct?: number | null;
  lowerIsBetter?: boolean;
}) {
  const hasDelta = deltaPct != null && Number.isFinite(deltaPct);
  const up = hasDelta && (deltaPct as number) > 0;
  const good = hasDelta && (lowerIsBetter ? !up : up);

  return (
    <Card>
      <CardContent className="p-4">
        <div className="text-xs text-muted-foreground">{label}</div>
        <div className="mt-1 text-2xl font-semibold tabular-nums">{value}</div>
        <div className="mt-1 flex items-center gap-2 text-xs">
          {sub && <span className="text-muted-foreground">{sub}</span>}
          {hasDelta && (
            <span
              className={cn(
                "flex items-center gap-0.5",
                good ? "text-emerald-400" : "text-red-400",
              )}
            >
              {up ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
              {formatPct(deltaPct as number)}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
