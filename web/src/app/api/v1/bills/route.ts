import type { NextRequest } from "next/server";
import { billInputSchema } from "@/lib/api-schemas";
import { getRepositories } from "@/lib/repositories";
import { computeBill } from "@/lib/tariff/compute";
import { ok, problem, toProblem } from "@/lib/http";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Compute the bill for a stored real bill and compare to its actual amount. */
function withComparison(
  bill: { cycleStart: string; cycleEnd: string; units: number; amount: number },
) {
  const tariff = getRepositories().tariffs.getActive();
  if (!tariff) return { ...bill, computed: null };
  const computed = computeBill(
    {
      units: bill.units,
      periodStart: new Date(`${bill.cycleStart}T00:00:00+05:30`),
      periodEnd: new Date(`${bill.cycleEnd}T23:59:59+05:30`),
      periodType: "cycle",
    },
    tariff,
  );
  const variance = bill.amount > 0 ? ((computed.total - bill.amount) / bill.amount) * 100 : null;
  return {
    ...bill,
    computed: {
      total: computed.total,
      breakdown: computed.breakdown,
      variance_pct: variance,
      delta: computed.total - bill.amount,
    },
  };
}

export function GET() {
  try {
    const rows = getRepositories().bills.list();
    return ok(rows.map(withComparison));
  } catch (err) {
    return toProblem(err);
  }
}

export async function POST(req: NextRequest) {
  try {
    const input = billInputSchema.parse(await req.json());
    if (new Date(input.cycleEnd) < new Date(input.cycleStart)) {
      return problem(400, "Invalid range", "cycleEnd must be on or after cycleStart");
    }
    const id = getRepositories().bills.create(input);
    return ok(withComparison({ ...input, id } as never), { created: true });
  } catch (err) {
    return toProblem(err);
  }
}
