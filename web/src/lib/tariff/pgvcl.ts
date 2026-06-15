import { parseTariffConfig, type TariffConfig } from "./schema";

/**
 * Frozen PGVCL v1 tariff — RGP (Residential General Purpose), "Other Areas".
 * Source: the user's PGVCL bill, "Tariff Schedule (Effective from 01.04.2022)".
 *
 * Junagadh is "M+OG" (Municipality + Out Growth = urban) → the "Other Areas"
 * rate column applies (not the lower Rural column).
 *
 * ┌─────────────────────── RECONCILED / TRUSTWORTHY ───────────────────────┐
 * │ Energy slabs (Other Areas, paise/unit → ₹/unit):                        │
 * │   First 50  → 305p = ₹3.05                                              │
 * │   Next  50  → 350p = ₹3.50   (50–100)                                   │
 * │   Next 150  → 415p = ₹4.15   (100–250)                                  │
 * │   Above 250 → 520p = ₹5.20                                              │
 * │ Fixed charge by sanctioned load (per month):                            │
 * │   ≤2kW ₹15 · 2–4kW ₹25 · 4–6kW ₹45 · >6kW ₹70                          │
 * │ Bill's Fixed Charge ₹30 = ₹15/mo × 2 months → load ≤2 kW (✓ exact).     │
 * └─────────────────────────────────────────────────────────────────────────┘
 *
 * ┌──────────────────── UNCONFIRMED — pending user input ────────────────────┐
 * │ The PDF isn't machine-extractable and the transcribed units/charges don't │
 * │ reconcile (see tasks/lessons.md). The following are ESTIMATES so the app   │
 * │ is functional; they are NOT frozen and the golden test stays pending:      │
 * │   • fuelSurcharge.ratePerUnit (FPPPA) — placeholder estimate.              │
 * │   • electricityDuty — placeholder 15% of energy (Gujarat residential).     │
 * │   • billed units for the golden bill.                                      │
 * │ Confirm these → flip the golden test from skip→it (golden-bill.test.ts).   │
 * └───────────────────────────────────────────────────────────────────────────┘
 */
export const PGVCL_RGP_OTHER_AREAS: TariffConfig = parseTariffConfig({
  name: "PGVCL RGP (Residential) — Other Areas (eff. 2022-04-01)",
  currency: "INR",
  billingCycleMonths: 2, // PGVCL bills bi-monthly
  slabBasis: "per_month", // slab widths defined per month; engine scales to period
  energySlabs: [
    { fromUnit: 0, toUnit: 50, ratePerUnit: 3.05 },
    { fromUnit: 50, toUnit: 100, ratePerUnit: 3.5 },
    { fromUnit: 100, toUnit: 250, ratePerUnit: 4.15 },
    { fromUnit: 250, toUnit: null, ratePerUnit: 5.2 },
  ],
  fixedCharge: {
    // ≤2 kW tier → ₹15/month flat (reconciles to the ₹30 printed for 2 months).
    type: "flat_per_month",
    amount: 15,
    ratePerKw: 0,
    sanctionedLoadKw: 2,
  },
  // FPPPA — PLACEHOLDER ESTIMATE (revised periodically by GERC). Confirm from bill.
  fuelSurcharge: { type: "per_unit", ratePerUnit: 3.0 },
  // PLACEHOLDER — Gujarat residential electricity duty is commonly 15%. Confirm.
  electricityDuty: { type: "percent_of_energy", value: 15 },
  meterRent: { type: "flat_per_month", amount: 0 }, // bill shows ₹0
  subsidies: [],
  otherCharges: [],
  taxes: [], // residential electricity is GST-exempt in India
  calibrationFactor: 1.0,
  rounding: "nearest_rupee",
  effectiveFrom: "2022-04-01",
});

/** Placeholder tariff to build against before the bill is reconciled (§ user note). */
export const PLACEHOLDER_TARIFF = PGVCL_RGP_OTHER_AREAS;
