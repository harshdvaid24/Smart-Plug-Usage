import type { NextRequest } from "next/server";
import { projectionQuerySchema, searchParamsToObject } from "@/lib/api-schemas";
import { getProjection } from "@/lib/services/projection";
import { ok, toProblem } from "@/lib/http";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export function GET(req: NextRequest) {
  try {
    const q = projectionQuerySchema.parse(
      searchParamsToObject(req.nextUrl.searchParams),
    );
    return ok(getProjection(q));
  } catch (err) {
    return toProblem(err);
  }
}
