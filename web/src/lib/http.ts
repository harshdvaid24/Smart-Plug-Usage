import { NextResponse } from "next/server";
import { ZodError } from "zod";

/** Success envelope `{ data, meta }` (§3). */
export function ok<T>(data: T, meta: Record<string, unknown> = {}) {
  return NextResponse.json({
    data,
    meta: { generatedAt: new Date().toISOString(), ...meta },
  });
}

/** RFC 7807 problem+json error. */
export function problem(
  status: number,
  title: string,
  detail?: string,
  extra: Record<string, unknown> = {},
) {
  return NextResponse.json(
    {
      type: "about:blank",
      title,
      status,
      ...(detail ? { detail } : {}),
      ...extra,
    },
    { status, headers: { "content-type": "application/problem+json" } },
  );
}

/** Map thrown errors to problem+json (Zod → 400 with field errors). */
export function toProblem(err: unknown) {
  if (err instanceof ZodError) {
    return problem(400, "Invalid request", "One or more parameters are invalid", {
      errors: err.flatten().fieldErrors,
    });
  }
  const message = err instanceof Error ? err.message : "Unexpected error";
  return problem(500, "Internal error", message);
}
