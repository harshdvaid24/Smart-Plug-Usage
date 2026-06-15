"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatNumber, formatRupees } from "@/lib/format";

interface BillRow {
  id: number;
  cycleStart: string;
  cycleEnd: string;
  units: number;
  amount: number;
  computed: { total: number; variance_pct: number | null; delta: number } | null;
}

export default function CalibratePage() {
  const [rows, setRows] = useState<BillRow[]>([]);
  const [form, setForm] = useState({ cycleStart: "", cycleEnd: "", units: "", amount: "" });
  const [msg, setMsg] = useState<string | null>(null);

  async function load() {
    const res = await fetch("/api/v1/bills", { cache: "no-store" });
    const json = await res.json();
    if (json.data) setRows(json.data);
  }
  useEffect(() => {
    load();
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    const res = await fetch("/api/v1/bills", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        cycleStart: form.cycleStart,
        cycleEnd: form.cycleEnd,
        units: Number(form.units),
        amount: Number(form.amount),
        source: "manual",
      }),
    });
    if (res.ok) {
      setMsg("Saved. Compared below.");
      setForm({ cycleStart: "", cycleEnd: "", units: "", amount: "" });
      load();
    } else {
      const p = await res.json();
      setMsg(p.title ?? "Failed to save");
    }
  }

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Add a real bill (calibration / golden check)</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={submit} className="space-y-3 text-sm">
            <div className="grid grid-cols-2 gap-3">
              <label className="flex flex-col gap-1">
                Cycle start
                <input
                  type="date"
                  required
                  value={form.cycleStart}
                  onChange={(e) => setForm({ ...form, cycleStart: e.target.value })}
                  className="rounded-md border bg-card px-2 py-1.5"
                />
              </label>
              <label className="flex flex-col gap-1">
                Cycle end
                <input
                  type="date"
                  required
                  value={form.cycleEnd}
                  onChange={(e) => setForm({ ...form, cycleEnd: e.target.value })}
                  className="rounded-md border bg-card px-2 py-1.5"
                />
              </label>
              <label className="flex flex-col gap-1">
                Units (kWh)
                <input
                  type="number"
                  step="1"
                  required
                  value={form.units}
                  onChange={(e) => setForm({ ...form, units: e.target.value })}
                  className="rounded-md border bg-card px-2 py-1.5"
                />
              </label>
              <label className="flex flex-col gap-1">
                Printed amount (₹)
                <input
                  type="number"
                  step="0.01"
                  required
                  value={form.amount}
                  onChange={(e) => setForm({ ...form, amount: e.target.value })}
                  className="rounded-md border bg-card px-2 py-1.5"
                />
              </label>
            </div>
            <button
              type="submit"
              className="rounded-md bg-primary px-4 py-2 font-medium text-primary-foreground"
            >
              Save & compare
            </button>
            {msg && <p className="text-xs text-muted-foreground">{msg}</p>}
          </form>
          <p className="mt-4 text-xs text-muted-foreground">
            The app computes each bill against the active tariff and shows variance.
            If variance is consistently off, tune the calibration factor / FPPPA /
            duty in Settings until the golden bill reconciles within ±₹2.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Stored bills</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {rows.length === 0 ? (
            <p className="text-sm text-muted-foreground">No bills yet.</p>
          ) : (
            rows.map((b) => (
              <div key={b.id} className="rounded-md border p-3 text-sm">
                <div className="flex items-center justify-between font-medium">
                  <span>
                    {b.cycleStart} → {b.cycleEnd}
                  </span>
                  <span className="text-muted-foreground">{formatNumber(b.units, 0)} kWh</span>
                </div>
                <div className="mt-1 flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">
                    printed {formatRupees(b.amount)} · computed{" "}
                    {b.computed ? formatRupees(b.computed.total) : "—"}
                  </span>
                  {b.computed?.variance_pct != null && (
                    <span
                      className={
                        Math.abs(b.computed.variance_pct) <= 2
                          ? "text-emerald-400"
                          : "text-amber-400"
                      }
                    >
                      {formatNumber(b.computed.variance_pct, 1)}%
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
