import type { NextRequest } from "next/server";
import { getRepositories } from "@/lib/repositories";
import { tariffConfigSchema } from "@/lib/tariff/schema";
import { ok, toProblem } from "@/lib/http";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export function GET() {
  try {
    const repos = getRepositories();
    return ok({ active: repos.tariffs.getActive() ?? null, versions: repos.tariffs.list() });
  } catch (err) {
    return toProblem(err);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const config = tariffConfigSchema.parse(body);
    const id = getRepositories().tariffs.create(config, true);
    return ok({ id, config }, { created: true });
  } catch (err) {
    return toProblem(err);
  }
}
