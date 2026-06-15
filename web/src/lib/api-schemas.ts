import { z } from "zod";

const ymd = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "expected YYYY-MM-DD");

export const usageQuerySchema = z
  .object({
    period: z.enum(["day", "week", "month", "cycle", "year", "custom"]),
    start: ymd.optional(),
    end: ymd.optional(),
    granularity: z.enum(["hour", "day", "month"]).optional(),
    deviceId: z.string().optional(),
  })
  .refine((q) => q.period !== "custom" || (q.start && q.end), {
    message: "custom period requires start and end",
    path: ["start"],
  });

export type UsageQuery = z.infer<typeof usageQuerySchema>;

export const projectionQuerySchema = z.object({
  cycleStart: ymd.optional(),
  deviceId: z.string().optional(),
});

export const billInputSchema = z.object({
  cycleStart: ymd,
  cycleEnd: ymd,
  units: z.number().positive(),
  amount: z.number().nonnegative(),
  source: z.string().optional(),
});

/** Parse URLSearchParams into a plain object for Zod. */
export function searchParamsToObject(sp: URLSearchParams): Record<string, string> {
  const obj: Record<string, string> = {};
  for (const [k, v] of sp.entries()) obj[k] = v;
  return obj;
}
