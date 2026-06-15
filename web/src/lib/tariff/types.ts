export type PeriodType =
  | "day"
  | "week"
  | "month"
  | "cycle"
  | "year"
  | "custom";

export interface BillInput {
  /** kWh consumed in the window — ALREADY calibration-adjusted (see §6.2). */
  units: number;
  /** IST-aware period boundaries (stored UTC, boundaries computed in IST). */
  periodStart: Date;
  periodEnd: Date;
  /** Drives slab scaling: month=1, cycle=billingCycleMonths, else pro-rated. */
  periodType: PeriodType;
}

export interface SlabCharge {
  fromUnit: number;
  toUnit: number | null;
  ratePerUnit: number;
  units: number;
  amount: number;
}

export interface BillBreakdown {
  energy: number;
  energySlabs: SlabCharge[];
  fixed: number;
  fuel: number;
  duty: number;
  meter: number;
  otherCharges: { name: string; amount: number }[];
  subsidies: { name: string; amount: number }[];
  taxes: { name: string; amount: number }[];
}

export interface BillResult {
  units: number;
  /** Inclusive day span of the window. */
  days: number;
  /** Number of "months" the period represents (drives per-month scaling). */
  monthsInPeriod: number;
  breakdown: BillBreakdown;
  subtotal: number;
  total: number;
  effectiveRatePerUnit: number;
  currency: "INR";
}

export interface MarginalResult {
  units: number;
  /** Incremental energy cost of these units at the cycle's cumulative position. */
  marginalEnergy: number;
  /** Effective ₹/unit at the margin (marginalEnergy / units). */
  marginalRate: number;
  breakdown: BillBreakdown;
  total: number;
  effectiveRatePerUnit: number;
  currency: "INR";
}

export interface ProjectedShareResult {
  windowUnits: number;
  projectedCycleUnits: number;
  projectedCycleTotal: number;
  /** This window's proportional share of the projected full-cycle bill. */
  shareCost: number;
  currency: "INR";
}
