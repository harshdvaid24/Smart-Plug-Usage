"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";

const PERIODS = [
  { key: "day", label: "Day" },
  { key: "week", label: "Week" },
  { key: "month", label: "Month" },
  { key: "cycle", label: "2-Month" },
  { key: "year", label: "Year" },
  { key: "custom", label: "Custom" },
] as const;

export function PeriodSelector() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const active = params.get("period") ?? "cycle";
  const [start, setStart] = useState(params.get("start") ?? "");
  const [end, setEnd] = useState(params.get("end") ?? "");

  function go(period: string, s?: string, e?: string) {
    const q = new URLSearchParams(params.toString());
    q.set("period", period);
    if (period === "custom" && s && e) {
      q.set("start", s);
      q.set("end", e);
    } else {
      q.delete("start");
      q.delete("end");
    }
    router.push(`${pathname}?${q.toString()}`);
  }

  return (
    <div className="sticky top-0 z-10 -mx-4 mb-6 border-b bg-background/80 px-4 py-3 backdrop-blur">
      <div className="flex flex-wrap items-center gap-2">
        <div className="inline-flex rounded-lg border bg-card p-1">
          {PERIODS.map((p) => (
            <button
              key={p.key}
              onClick={() => go(p.key, start, end)}
              className={cn(
                "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                active === p.key
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {p.label}
            </button>
          ))}
        </div>
        {active === "custom" && (
          <div className="flex items-center gap-2">
            <input
              type="date"
              value={start}
              onChange={(e) => setStart(e.target.value)}
              className="rounded-md border bg-card px-2 py-1.5 text-sm"
            />
            <span className="text-muted-foreground">→</span>
            <input
              type="date"
              value={end}
              onChange={(e) => setEnd(e.target.value)}
              className="rounded-md border bg-card px-2 py-1.5 text-sm"
            />
            <button
              onClick={() => start && end && go("custom", start, end)}
              className="rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground disabled:opacity-50"
              disabled={!start || !end}
            >
              Apply
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
