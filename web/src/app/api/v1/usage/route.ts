import type { NextRequest } from "next/server";
import { searchParamsToObject, usageQuerySchema } from "@/lib/api-schemas";
import { getUsage } from "@/lib/services/usage";
import { ok, toProblem } from "@/lib/http";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export function GET(req: NextRequest) {
  try {
    const q = usageQuerySchema.parse(searchParamsToObject(req.nextUrl.searchParams));
    const result = getUsage(q);
    return ok(result, { period: q.period });
  } catch (err) {
    return toProblem(err);
  }
}
