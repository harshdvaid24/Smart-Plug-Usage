/**
 * Real PGVCL bill(s) for the GOLDEN BILL TEST (§11) and in-product calibration.
 *
 * ⚠️ The figures below are transcribed from the uploaded (translated) PDF, which
 * is NOT machine-extractable here. Several fields DO NOT reconcile under PGVCL's
 * telescopic slabs (see tasks/lessons.md), so `unitsConfirmed` is false and the
 * golden test is skipped until the user confirms the real values.
 */
export interface RealBill {
  consumerNo: string;
  billNumber: string;
  billingPeriod: string;
  /** Billed consumption in units (kWh). UNCONFIRMED — see note above. */
  units: number;
  /** Whether `units` (and the charge breakdown) are confirmed & reconciled. */
  unitsConfirmed: boolean;
  cycleStart: string; // ISO date (IST)
  cycleEnd: string; // ISO date (IST)
  printed: {
    fixedCharge: number;
    energyCharge: number;
    fuelCharge: number;
    electricDuty: number;
    meterRent: number;
    /** Fixed+Energy+Fuel+Duty+Meter for THIS period (excludes arrears). */
    totalCompanyCharge: number;
    netPayable: number; // includes previous balance + arrears (not for golden test)
  };
}

/** APR–MAY 2026 bill. Golden target = printed.totalCompanyCharge (₹10,153.11). */
export const PGVCL_BILL_APR_MAY_2026: RealBill = {
  consumerNo: "85014039545",
  billNumber: "1/23525",
  billingPeriod: "APR-MAY, 26",
  units: 743, // ⚠️ stated "Consumption 743" — does NOT reconcile with energy charge
  unitsConfirmed: false,
  cycleStart: "2026-04-01",
  cycleEnd: "2026-05-31",
  printed: {
    fixedCharge: 30.0,
    energyCharge: 4902.5,
    fuelCharge: 4179.0,
    electricDuty: 1041.61,
    meterRent: 0.0,
    totalCompanyCharge: 10153.11,
    netPayable: 14053.01,
  },
};

export const REAL_BILLS: RealBill[] = [PGVCL_BILL_APR_MAY_2026];
