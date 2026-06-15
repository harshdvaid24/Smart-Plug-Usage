import { describe, expect, it } from "vitest";
import { computeBill } from "@/lib/tariff/compute";
import { PGVCL_RGP_OTHER_AREAS } from "@/lib/tariff/pgvcl";
import { REAL_BILLS } from "@/lib/tariff/__fixtures__/real-bills";

/**
 * GOLDEN BILL TEST (§11) — the blocking acceptance gate.
 *
 * STATUS: PENDING. The uploaded PDF isn't machine-extractable here and the
 * transcribed units/charges don't reconcile under PGVCL's telescopic slabs
 * (see tasks/lessons.md). So the full-total assertion is `it.skip` until the
 * user confirms: billed units, FPPPA ₹/unit, and electricity-duty basis.
 *
 * TO ACTIVATE once figures are confirmed:
 *   1. Set the confirmed values in pgvcl.ts (FPPPA, duty) + real-bills.ts (units,
 *      unitsConfirmed: true).
 *   2. Change `it.skip(...)` below to `it(...)`.
 *   3. Run `npm test` — it must pass within ±₹2 of the printed Total Company Charge.
 *
 * Until then, we DO assert the parts that already reconcile (fixed charge, and
 * that each bill's printed line items sum to the printed Total Company Charge),
 * so regressions in the reconciled facts are still caught.
 */
describe("Golden Bill Test — PGVCL (acceptance gate)", () => {
  for (const bill of REAL_BILLS) {
    describe(`${bill.billingPeriod} (consumer ${bill.consumerNo})`, () => {
      it("printed line items sum to the printed Total Company Charge", () => {
        const p = bill.printed;
        const sum =
          p.fixedCharge +
          p.energyCharge +
          p.fuelCharge +
          p.electricDuty +
          p.meterRent;
        expect(sum).toBeCloseTo(p.totalCompanyCharge, 2);
      });

      it("fixed charge reconciles to ₹15/mo × 2 months (≤2 kW load)", () => {
        // This is independent of the unconfirmed units/FPPPA/duty.
        const monthlyFixed = PGVCL_RGP_OTHER_AREAS.fixedCharge.amount; // 15
        expect(monthlyFixed * PGVCL_RGP_OTHER_AREAS.billingCycleMonths).toBe(
          bill.printed.fixedCharge,
        );
      });

      const runOrSkip = bill.unitsConfirmed ? it : it.skip;
      runOrSkip(
        "computed total matches printed Total Company Charge within ±₹2",
        () => {
          const result = computeBill(
            {
              units: bill.units,
              periodStart: new Date(`${bill.cycleStart}T00:00:00+05:30`),
              periodEnd: new Date(`${bill.cycleEnd}T23:59:59+05:30`),
              periodType: "cycle",
            },
            PGVCL_RGP_OTHER_AREAS,
          );
          expect(Math.abs(result.total - bill.printed.totalCompanyCharge)).toBeLessThanOrEqual(2);
        },
      );
    });
  }
});
