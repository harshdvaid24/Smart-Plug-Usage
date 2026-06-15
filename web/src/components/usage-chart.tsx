"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDayLabel, formatKwh } from "@/lib/format";

interface Point {
  t: string;
  wh: number;
  w: number;
}

function labelFor(t: string, granularity: string): string {
  if (granularity === "hour") {
    const d = new Date(t);
    return new Intl.DateTimeFormat("en-IN", {
      hour: "2-digit",
      timeZone: "Asia/Kolkata",
    }).format(d);
  }
  if (granularity === "month") return t.slice(0, 7);
  return formatDayLabel(t);
}

export function UsageChart({
  series,
  granularity,
}: {
  series: Point[];
  granularity: string;
}) {
  const data = series.map((p) => ({
    label: labelFor(p.t, granularity),
    kwh: p.wh / 1000,
  }));

  return (
    <Card className="col-span-full">
      <CardHeader className="flex-row items-center justify-between">
        <CardTitle>Consumption ({granularity})</CardTitle>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <div className="flex h-64 items-center justify-center text-sm text-muted-foreground">
            No data for this period yet — the poller fills this as it runs.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={data} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
              <defs>
                <linearGradient id="fill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.5} />
                  <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0.04} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                tickLine={false}
                axisLine={false}
                minTickGap={16}
              />
              <YAxis
                tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                tickLine={false}
                axisLine={false}
                width={40}
              />
              <Tooltip
                contentStyle={{
                  background: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: 8,
                  fontSize: 12,
                }}
                formatter={(v: number) => [formatKwh(v), "Energy"]}
              />
              <Area
                type="monotone"
                dataKey="kwh"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                fill="url(#fill)"
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
