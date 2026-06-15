# Tapo P110 — Energy & Cost Dashboard (India / PGVCL)

Self-hosted dashboard that reads a **TP-Link Tapo P110 (16A)** smart plug over its
**free local API** (no cloud, no rate limits), persists the energy history, and
shows **consumption + electricity cost in ₹** across **day / week / month /
2-month (bi-monthly cycle) / year / custom** ranges — with a cost engine that
mirrors a **real PGVCL (Gujarat) residential bill**, not the rough estimate the
Tapo app gives.

The plug meters a 1.5-ton AC; the design is multi-plug ready (everything is keyed
by `device_id`).

---

## Why it's built this way (the non-negotiables)

1. **LAN-locality.** The P110 local API only responds on the plug's network. The
   **poller must run on the local network** (Pi / mini-PC / NAS / always-on
   laptop) — it cannot run on a remote cloud host. Access the dashboard over LAN
   or via **Tailscale**.
2. **Own the history.** The plug keeps only rolling buffers and overwrites them.
   Long-range / arbitrary-range queries come **only** from our persisted
   **authoritative daily/monthly totals**. The DB is the source of truth for
   history; the plug is the source of truth for *current* metered values.
3. **Bi-monthly telescopic slabs.** PGVCL bills every 2 months on cumulative
   slabs. The tariff engine is cycle-aware: sub-cycle windows (a day/week) get
   explicit **marginal-rate** and **projected-cycle** math — naïvely applying
   full slabs to a day's units is wrong.
4. **Unit normalization on ingest.** Canonical DB units: **Wh** (energy), **W**
   (power), **minutes** (runtime). A mW guard catches firmware that reports
   embedded power in milliwatts.
5. **Calibration.** The P110 reads ~5–6% low; a user-set `calibrationFactor`
   aligns totals to the DISCOM meter. All cost figures are labelled "for reference".
6. **Timezone.** Store UTC; compute day/cycle boundaries and display in **IST**
   (Asia/Kolkata; India has no DST).

---

## Architecture

```
   LAN (same network as plug)
  ┌───────────┐  local KLAP   ┌──────────────┐  write   ┌────────────┐
  │ Tapo P110 │◄────────────► │   poller     │ ───────► │  SQLite DB │
  │ (static IP)│ 15s/5min/day │ (python-kasa)│          │  (volume)  │
  └───────────┘               └──────────────┘          └─────┬──────┘
                                       ┌───────────────┐      │ read
                                       │  web (Next.js)│◄─────┘
                                       │  UI+API+tariff│
                                       └───────┬───────┘
                                          LAN / Tailscale → Browser
```

- **`poller/`** — Python 3.11 + `python-kasa` sidecar. Three cadences write
  `power_samples` (15s), `energy_snapshots` (5min), and authoritative
  `energy_daily` / `energy_monthly` (daily 00:05 IST reconcile).
- **`web/`** — Next.js 15 (App Router, RSC), TypeScript strict, Tailwind,
  Recharts, Drizzle + `better-sqlite3`. Houses the **pure tariff engine** and the
  REST API.

---

## Quickstart (Docker, on the LAN device)

```bash
cp .env.example .env          # fill TAPO_EMAIL / TAPO_PASSWORD / TAPO_DEVICE_IP
docker compose up -d --build
# open http://<lan-host>:3000   (or the Tailscale name)
```

### Plug prep (one-time)
- In the **Tapo app**: enable **Settings → Third-Party Compatibility**.
- Give the plug a **DHCP reservation** (static IP) on your router so `TAPO_DEVICE_IP`
  never changes.
- Firmware **1.1.2+** is required for energy monitoring (the poller logs `fw_ver`
  on startup and warns if older).

---

## Local development

```bash
# Tariff engine + services (no plug needed) — the acceptance gate
cd web && npm install
npm test                       # vitest
npm run db:migrate             # create schema
npm run db:seed                # active PGVCL tariff + real bill + device
npm run db:seed:demo           # believable demo data (offline, no plug)
npm run dev                    # http://localhost:3000

# Poller
cd poller && pip install -r requirements.txt
python -m poller.main connect            # M0 smoke (needs a plug)
python -m poller.main connect --mock     # smoke against the mock
python -m poller.main run                # start the three cadences
python -m pytest                         # normalize + db idempotency tests
```

---

## Mapping a PGVCL bill into the tariff config

The tariff is **data-driven** (`web/src/lib/tariff/pgvcl.ts`, validated by the Zod
schema in `schema.ts`). Map each printed line item to a field:

| Bill line item | Tariff field |
|---|---|
| Energy slabs (Other Areas: ₹3.05 / 3.50 / 4.15 / 5.20 per unit) | `energySlabs[]` (per-month widths 50/50/150/∞) |
| Fixed charge (₹15/25/45/70 per month by sanctioned load) | `fixedCharge` (`flat_per_month`, `sanctionedLoadKw`) |
| Fuel charge (FPPPA) | `fuelSurcharge.ratePerUnit` |
| Electricity duty | `electricityDuty` (`percent_of_energy` or `per_unit`) |
| Meter rent | `meterRent.amount` |
| Billing cycle | `billingCycleMonths: 2` |

> **Status of the v1 PGVCL tariff:** The slab rates and fixed-charge tiers
> (effective 2022-04-01, Other Areas) are **frozen** from the bill and reconcile
> exactly (Fixed ₹30 = ₹15/mo × 2 → ≤2 kW load). The **FPPPA rate**,
> **electricity-duty basis**, and the **billed units** for the golden bill are
> still **placeholders** — the uploaded PDF wasn't machine-extractable and the
> transcribed figures don't reconcile under the telescopic slabs (see
> `tasks/lessons.md`). Confirm those three values, set them in `pgvcl.ts`, set
> `unitsConfirmed: true` in `__fixtures__/real-bills.ts`, and flip the golden test
> `it.skip → it` (`web/tests/golden-bill.test.ts`).

### Golden bill test (acceptance gate, §11)
`computeBill(units, tariff)` must match the printed **Total Company Charge** within
**±₹2**. It runs in `npm test` and is currently skipped pending the three
confirmed values above. The reconciled facts (fixed charge; line items summing to
the printed total) are already asserted.

---

## API (`/api/v1`, `{ data, meta }` envelope, RFC 7807 errors)

| Route | Purpose |
|---|---|
| `GET /live` | current W, on/off, today kWh, runtime, status |
| `GET /usage?period=day\|week\|month\|cycle\|year\|custom&start&end&granularity` | units, cost (+ breakdown, marginal, projected share), avg/peak W, runtime, series, comparison, CO₂ |
| `GET /projection?cycleStart` | run-rate, projected units + cost for the cycle |
| `GET/POST /tariff` | read / create a versioned tariff |
| `GET/POST /bills` | store a real bill; computed-vs-actual variance |

---

## Remote access

- **Default:** everything on the LAN device; reach the dashboard over LAN or
  **Tailscale**.
- **Optional (documented switch):** keep the poller local but sync SQLite →
  **Turso (libSQL)** and deploy `web/` to **Vercel** reading Turso. Set
  `TURSO_URL` / `TURSO_TOKEN` in `.env`. The default local path is unaffected.

---

## Project layout

```
poller/   python-kasa sidecar (config, normalize, db, device, scheduler, main) + tests
web/
  src/lib/tariff/   pure engine (compute.ts), Zod schema, frozen PGVCL config, fixtures
  src/db/           Drizzle schema, canonical DDL, client, migrate/seed
  src/lib/          time (IST periods), repositories, services (usage/live/projection)
  src/app/          dashboard, bill, calibrate, settings, /api/v1 routes
  tests/            tariff (gate), golden-bill (pending), services
tasks/    todo.md (milestones) + lessons.md (corrections)
```

## Testing

- `web`: `npm test` → vitest (tariff edges/scaling/marginal/projected/duty/fixed,
  service aggregation, golden-bill scaffold).
- `poller`: `python -m pytest` → normalization (mW guard, IST boundaries),
  `energy_daily` upsert idempotency, mock ingest pipeline.
