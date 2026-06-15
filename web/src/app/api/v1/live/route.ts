import type { NextRequest } from "next/server";
import { getLive } from "@/lib/services/live";
import { ok, toProblem } from "@/lib/http";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export function GET(req: NextRequest) {
  try {
    const deviceId = req.nextUrl.searchParams.get("deviceId") ?? undefined;
    return ok(getLive(deviceId));
  } catch (err) {
    return toProblem(err);
  }
}
