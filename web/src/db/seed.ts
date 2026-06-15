import { eq } from "drizzle-orm";
import { getDb } from "./client";
import { bills, device, tariffConfig } from "./schema";
import { PGVCL_RGP_OTHER_AREAS } from "@/lib/tariff/pgvcl";
import { REAL_BILLS } from "@/lib/tariff/__fixtures__/real-bills";

/**
 * Seed the active tariff, the real bill(s), and a placeholder device so the UI
 * has something to render before the poller connects. Run: `npm run db:seed`.
 * Idempotent: re-running won't duplicate.
 */
function main() {
  const db = getDb();

  // Active tariff
  const existing = db.select().from(tariffConfig).all();
  if (existing.length === 0) {
    db.insert(tariffConfig)
      .values({
        name: PGVCL_RGP_OTHER_AREAS.name,
        effectiveFrom: PGVCL_RGP_OTHER_AREAS.effectiveFrom,
        json: JSON.stringify(PGVCL_RGP_OTHER_AREAS),
        isActive: true,
      })
      .run();
    console.log("[seed] inserted active PGVCL tariff");
  }

  // Real bills (calibration + golden test)
  for (const b of REAL_BILLS) {
    const found = db
      .select()
      .from(bills)
      .where(eq(bills.cycleStart, b.cycleStart))
      .all();
    if (found.length === 0) {
      db.insert(bills)
        .values({
          cycleStart: b.cycleStart,
          cycleEnd: b.cycleEnd,
          units: b.units,
          amount: b.printed.totalCompanyCharge,
          source: "pgvcl",
        })
        .run();
      console.log(`[seed] inserted bill ${b.billingPeriod}`);
    }
  }

  // Placeholder device (so the dashboard renders pre-poller).
  const devId = "p110-demo";
  const dev = db.select().from(device).where(eq(device.deviceId, devId)).all();
  if (dev.length === 0) {
    db.insert(device)
      .values({
        deviceId: devId,
        model: "P110",
        nickname: process.env.TAPO_DEVICE_NICKNAME ?? "Living Room AC",
        ip: process.env.TAPO_DEVICE_IP ?? null,
        status: "unknown",
      })
      .run();
    console.log("[seed] inserted placeholder device");
  }

  console.log("[seed] done");
}

main();
