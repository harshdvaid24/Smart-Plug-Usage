import { z } from "zod";

/**
 * Tariff config schema (§6.1). Versioned + Zod-validated. This is the single
 * source of truth for both the TS types (inferred below) and runtime validation
 * on the API and the settings editor.
 *
 * IMPORTANT: rates are data-driven. Never hard-code numbers in the engine —
 * everything the engine needs lives in a validated tariff config so PGVCL rate
 * revisions are a config change, not a code change.
 */

export const energySlabSchema = z
  .object({
    fromUnit: z.number().min(0),
    // null = unbounded top slab
    toUnit: z.number().positive().nullable(),
    ratePerUnit: z.number().min(0),
  })
  .refine((s) => s.toUnit === null || s.toUnit > s.fromUnit, {
    message: "toUnit must be greater than fromUnit (or null for the top slab)",
  });

export const fixedChargeSchema = z.object({
  type: z.enum(["per_kw_per_month", "flat_per_month", "flat_per_cycle"]),
  ratePerKw: z.number().min(0).default(0),
  amount: z.number().min(0).default(0),
  sanctionedLoadKw: z.number().min(0).default(0),
});

export const fuelSurchargeSchema = z.object({
  // FPPPA (Fuel & Power Purchase Price Adjustment), revised periodically.
  type: z.literal("per_unit"),
  ratePerUnit: z.number(), // can be negative on some cycles
});

export const electricityDutySchema = z.object({
  // percent_of_energy: value is a percentage of the energy charge.
  // per_unit: value is ₹ per unit (kWh).
  type: z.enum(["percent_of_energy", "per_unit"]),
  value: z.number().min(0),
});

export const meterRentSchema = z.object({
  type: z.literal("flat_per_month"),
  amount: z.number().min(0),
});

const namedChargeSchema = z.object({
  name: z.string(),
  type: z.enum(["flat_per_month", "flat_per_cycle", "per_unit"]),
  amount: z.number(),
});

const taxSchema = z.object({
  name: z.string(),
  type: z.enum(["percent_of_subtotal"]),
  value: z.number().min(0),
});

export const tariffConfigSchema = z.object({
  name: z.string().min(1),
  currency: z.literal("INR").default("INR"),
  billingCycleMonths: z.number().int().positive().default(2),
  slabBasis: z.enum(["per_month"]).default("per_month"),
  energySlabs: z.array(energySlabSchema).min(1),
  fixedCharge: fixedChargeSchema,
  fuelSurcharge: fuelSurchargeSchema,
  electricityDuty: electricityDutySchema,
  meterRent: meterRentSchema,
  subsidies: z.array(namedChargeSchema).default([]),
  otherCharges: z.array(namedChargeSchema).default([]),
  taxes: z.array(taxSchema).default([]),
  // Multiply metered kWh to match the DISCOM meter (P110 reads ~5–6% low).
  calibrationFactor: z.number().positive().default(1),
  rounding: z.enum(["nearest_rupee", "none"]).default("nearest_rupee"),
  effectiveFrom: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});

export type TariffConfig = z.infer<typeof tariffConfigSchema>;
export type EnergySlab = z.infer<typeof energySlabSchema>;
export type FixedCharge = z.infer<typeof fixedChargeSchema>;

/** Parse + validate an unknown value into a TariffConfig (throws on invalid). */
export function parseTariffConfig(input: unknown): TariffConfig {
  return tariffConfigSchema.parse(input);
}
