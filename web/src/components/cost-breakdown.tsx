"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatRupees } from "@/lib/format";

interface Breakdown {
  energy: number;
  fixed: number;
  fuel: number;
  duty: number;
  meter: number;
}

const COLORS = ["#38bdf8", "#c8a04a", "#f97316", "#a78bfa", "#34d399"];

export function CostBreakdown({ breakdown }: { breakdown: Breakdown }) {
  const data = [
    { name: "Energy", value: breakdown.energy },
    { name: "Fixed", value: breakdown.fixed },
    { name: "FPPPA (fuel)", value: breakdown.fuel },
    { name: "Electricity duty", value: breakdown.duty },
    { name: "Meter rent", value: breakdown.meter },
  ].filter((d) => d.value > 0);

  const total = data.reduce((a, d) => a + d.value, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cost breakdown</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4">
          <ResponsiveContainer width="50%" height={160}>
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                innerRadius={42}
                outerRadius={64}
                paddingAngle={2}
              >
                {data.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: 8,
                  fontSize: 12,
                }}
                formatter={(v: number) => formatRupees(v)}
              />
            </PieChart>
          </ResponsiveContainer>
          <ul className="flex-1 space-y-1.5 text-sm">
            {data.map((d, i) => (
              <li key={d.name} className="flex items-center justify-between gap-2">
                <span className="flex items-center gap-2 text-muted-foreground">
                  <span
                    className="inline-block h-2.5 w-2.5 rounded-sm"
                    style={{ background: COLORS[i % COLORS.length] }}
                  />
                  {d.name}
                </span>
                <span className="font-medium tabular-nums">{formatRupees(d.value)}</span>
              </li>
            ))}
            <li className="flex items-center justify-between border-t pt-1.5 font-semibold">
              <span>Total</span>
              <span className="tabular-nums">{formatRupees(total)}</span>
            </li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
