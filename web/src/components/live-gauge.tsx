"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, Power } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { formatKwh, formatWatts } from "@/lib/format";

interface Live {
  current_power_w: number;
  device_on: boolean;
  on_time_s: number | null;
  today_kwh: number;
  overheat: boolean;
  status: string;
  nickname: string | null;
}

const MAX_W = 3680; // P110 16A ceiling — gauge full scale

function describeArc(value: number) {
  const pct = Math.max(0, Math.min(1, value / MAX_W));
  const startAngle = -210;
  const sweep = 240;
  const angle = startAngle + sweep * pct;
  const r = 80;
  const cx = 100;
  const cy = 100;
  const rad = (a: number) => (a * Math.PI) / 180;
  const x = cx + r * Math.cos(rad(angle));
  const y = cy + r * Math.sin(rad(angle));
  return { x, y };
}

export function LiveGauge({ initial }: { initial: Live }) {
  const [live, setLive] = useState<Live>(initial);

  useEffect(() => {
    let active = true;
    const tick = async () => {
      try {
        const res = await fetch("/api/v1/live", { cache: "no-store" });
        const json = await res.json();
        if (active && json.data) setLive(json.data);
      } catch {
        /* keep last reading on transient failure */
      }
    };
    const id = setInterval(tick, 15_000); // §5.2 live cadence
    return () => {
      active = false;
      clearInterval(id);
    };
  }, []);

  const needle = describeArc(live.current_power_w);
  const onMin = live.on_time_s != null ? Math.round(live.on_time_s / 60) : null;
  const offline = live.status === "offline";

  return (
    <Card className="overflow-hidden">
      <CardContent className="flex flex-col items-center gap-2 p-6">
        <div className="flex w-full items-center justify-between text-xs">
          <span className="text-muted-foreground">{live.nickname ?? "Plug"}</span>
          <span
            className={`flex items-center gap-1 rounded-full px-2 py-0.5 ${
              offline
                ? "bg-red-500/15 text-red-400"
                : live.device_on
                  ? "bg-emerald-500/15 text-emerald-400"
                  : "bg-muted text-muted-foreground"
            }`}
          >
            <Power className="h-3 w-3" />
            {offline ? "OFFLINE" : live.device_on ? "ON" : "OFF"}
          </span>
        </div>

        <div className="meter-face relative rounded-full p-2">
          <svg viewBox="0 0 200 140" className="h-40 w-56">
            <path
              d="M 30.7 168 A 80 80 0 1 1 169.3 168"
              fill="none"
              stroke="rgba(255,255,255,0.12)"
              strokeWidth="10"
              strokeLinecap="round"
            />
            {[0, 0.25, 0.5, 0.75, 1].map((t) => {
              const p = describeArc(t * MAX_W);
              return <circle key={t} cx={p.x} cy={p.y} r="2.5" fill="var(--brass,#c8a04a)" />;
            })}
            <line
              x1="100"
              y1="100"
              x2={needle.x}
              y2={needle.y}
              stroke="#e8c87a"
              strokeWidth="3"
              strokeLinecap="round"
            />
            <circle cx="100" cy="100" r="6" fill="#e8c87a" />
          </svg>
        </div>

        <div className="text-center">
          <div className="font-mono text-3xl font-bold tabular-nums text-primary">
            {formatWatts(live.current_power_w)}
          </div>
          <div className="mt-1 text-xs text-muted-foreground">
            Today {formatKwh(live.today_kwh)}
            {onMin != null && <> · on {onMin} min</>}
          </div>
        </div>

        {live.overheat && (
          <div className="flex items-center gap-1 text-xs text-amber-400">
            <AlertTriangle className="h-3.5 w-3.5" /> Overheat warning
          </div>
        )}
      </CardContent>
    </Card>
  );
}
