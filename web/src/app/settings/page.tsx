"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function SettingsPage() {
  const [json, setJson] = useState("");
  const [active, setActive] = useState<{ name: string; effectiveFrom: string } | null>(null);
  const [device, setDevice] = useState<{ status: string; nickname: string | null } | null>(
    null,
  );
  const [msg, setMsg] = useState<string | null>(null);

  async function load() {
    const t = await (await fetch("/api/v1/tariff", { cache: "no-store" })).json();
    if (t.data?.active) {
      setActive({ name: t.data.active.name, effectiveFrom: t.data.active.effectiveFrom });
      setJson(JSON.stringify(t.data.active, null, 2));
    }
    const l = await (await fetch("/api/v1/live", { cache: "no-store" })).json();
    if (l.data) setDevice({ status: l.data.status, nickname: l.data.nickname });
  }
  useEffect(() => {
    load();
  }, []);

  async function save() {
    setMsg(null);
    let parsed: unknown;
    try {
      parsed = JSON.parse(json);
    } catch {
      setMsg("Invalid JSON");
      return;
    }
    const res = await fetch("/api/v1/tariff", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(parsed),
    });
    if (res.ok) {
      setMsg("Saved as new active tariff version.");
      load();
    } else {
      const p = await res.json();
      setMsg(
        `Validation failed: ${p.title}${
          p.errors ? " — " + JSON.stringify(p.errors) : ""
        }`,
      );
    }
  }

  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Tariff editor (Zod-validated on save)</CardTitle>
        </CardHeader>
        <CardContent>
          {active && (
            <div className="mb-2 text-xs text-muted-foreground">
              Active: {active.name} · effective {active.effectiveFrom}
            </div>
          )}
          <textarea
            value={json}
            onChange={(e) => setJson(e.target.value)}
            spellCheck={false}
            className="h-[28rem] w-full rounded-md border bg-card p-3 font-mono text-xs"
          />
          <div className="mt-3 flex items-center gap-3">
            <button
              onClick={save}
              className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
            >
              Save new version
            </button>
            {msg && <span className="text-xs text-muted-foreground">{msg}</span>}
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            Saving creates a new versioned tariff and makes it active (history is kept).
            Freeze FPPPA (<code>fuelSurcharge.ratePerUnit</code>) and
            <code> electricityDuty</code> here once confirmed from your bill.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Plug & environment</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Device</span>
            <span>{device?.nickname ?? "—"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Status</span>
            <span
              className={
                device?.status === "online"
                  ? "text-emerald-400"
                  : device?.status === "offline"
                    ? "text-red-400"
                    : "text-muted-foreground"
              }
            >
              {device?.status ?? "unknown"}
            </span>
          </div>
          <p className="pt-2 text-xs text-muted-foreground">
            Plug IP / credentials live in <code>.env</code> (read by the poller on the
            LAN). Emission factor, currency, calibration factor and data retention are
            configured via env / the tariff config.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
