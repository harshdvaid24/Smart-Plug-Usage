# tasks/todo.md — Tapo P110 Energy & Cost Dashboard (PGVCL)

Backbone correctness: §6 Tariff Engine + §11 Golden Bill Test. Nothing "done"
without proof (test output / build / screenshot).

## Decisions locked
- [x] Poller language: **python-kasa** (spec default).
- [x] Golden test: build now, **freeze legible PGVCL slab + fixed rates**,
      scaffold golden test as **pending** until user confirms billed units,
      FPPPA ₹/unit, and electricity-duty basis.
- [x] Build cadence: approve once, run M0→M6, commit/push as we go.
- [x] Area category: Junagadh **M+OG = Other Areas** (urban), sanctioned load
      **≤2 kW** (₹15/mo × 2 = ₹30 reconciles to printed Fixed Charge).

## M0 — Connectivity
- [x] Repo scaffold, .env.example, .gitignore, README skeleton.
- [x] Poller `connect` smoke command: prints `fw_ver` + a live `current_power`.
      (Live verification requires a P110 on the LAN — runs on user's device.)

## M1 — Poller + persistence
- [x] python-kasa device interface (swappable) + KLAP auth via .env.
- [x] Three cadences: 15s power_samples, 5min energy_snapshots, daily authoritative
      energy_daily/energy_monthly @ 00:05 IST.
- [x] Normalization on ingest (W / Wh / minutes; mW guard). pytest passing.
- [x] Idempotent upserts on period-start unique keys; resilience/backoff + offline status.

## M2 — Tariff engine + GOLDEN TEST  (acceptance gate)
- [x] Pure `computeBill(input, tariff)` — telescopic slabs, per-month scaling.
- [x] Sub-cycle: marginal cost (a) + projected-cycle share (b).
- [x] Zod tariff schema (versioned), frozen PGVCL v1 config (legible rates).
- [x] Vitest: slab edges, scaling, marginal vs projected, duty/fixed variants. GREEN.
- [ ] **GOLDEN BILL TEST** — wire to printed total within ±₹2. **PENDING** confirmed
      units / FPPPA / duty (scaffolded + clearly marked; flip skip→it on confirm).

## M3 — API / aggregation
- [x] Repositories (interface-first) over Drizzle/SQLite.
- [x] `/api/v1/live`, `/usage` (day/week/month/cycle/year/custom), `/projection`,
      `/tariff`, `/bills`.
- [x] Comparison (prev period), CO₂, calibration applied before costing.
- [x] Zod on all inputs; RFC7807 errors; `{data, meta}` envelope.

## M4 — Dashboard UI
- [x] Live power gauge ('use client', 15s), KPI cards w/ Δ, main chart + granularity
      toggle, sticky period selector + range picker.

## M5 — Bill view + settings
- [x] Itemized PGVCL-style bill statement; tariff editor; calibration page; comparison strip.

## M6 — Polish & ship
- [x] Indian formatting (en-IN), dark mode default, vintage-meter motif, Docker Compose,
      README (LAN-locality + bill→tariff mapping), optional Turso/Vercel switch.

## Open items / follow-ups
- [ ] User to confirm: billed **units**, **FPPPA ₹/unit**, **electricity-duty basis**
      (% of what, or paise/unit) → freeze golden test.
- [ ] Live-verify M0/M1 on the LAN device (no P110 reachable from build env).
