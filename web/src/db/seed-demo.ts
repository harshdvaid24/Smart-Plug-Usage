import { getSqlite } from "./client";
import { cycleRangeContaining, istYmd } from "@/lib/time";

/**
 * Seed believable demo data for the CURRENT bi-monthly cycle so the dashboard
 * renders without a live plug (offline demo). Idempotent-ish: clears the demo
 * device's rows first. Run: `npm run db:seed:demo`.
 */
function main() {
  const db = getSqlite();
  const deviceId = "p110-demo";

  db.prepare("DELETE FROM energy_daily WHERE device_id=?").run(deviceId);
  db.prepare("DELETE FROM energy_hourly WHERE device_id=?").run(deviceId);
  db.prepare("DELETE FROM energy_monthly WHERE device_id=?").run(deviceId);
  db.prepare("DELETE FROM power_samples WHERE device_id=?").run(deviceId);
  db.prepare("DELETE FROM energy_snapshots WHERE device_id=?").run(deviceId);

  db.prepare(
    "UPDATE device SET status='online', last_seen=? WHERE device_id=?",
  ).run(new Date().toISOString(), deviceId);

  const now = new Date();
  const cycle = cycleRangeContaining(now);
  const DAY = 86_400_000;

  // Daily totals from cycle start up to today (1.5-ton AC ≈ 9–16 kWh/day).
  const insDaily = db.prepare(
    "INSERT INTO energy_daily (device_id, day_ist, wh, runtime_min) VALUES (?,?,?,?)",
  );
  let monthWh: Record<string, number> = {};
  let monthRun: Record<string, number> = {};
  let cycleTotal = 0;
  for (let t = cycle.start.getTime(); t <= now.getTime(); t += DAY) {
    const d = new Date(t);
    const ymd = istYmd(d);
    const wh = Math.round(9000 + Math.random() * 7000);
    const run = Math.round(180 + Math.random() * 360);
    insDaily.run(deviceId, ymd, wh, run);
    cycleTotal += wh;
    const mk = ymd.slice(0, 7) + "-01";
    monthWh[mk] = (monthWh[mk] ?? 0) + wh;
    monthRun[mk] = (monthRun[mk] ?? 0) + run;
  }

  const insMonth = db.prepare(
    "INSERT INTO energy_monthly (device_id, month_start_ist, wh, runtime_min) VALUES (?,?,?,?)",
  );
  for (const [mk, wh] of Object.entries(monthWh)) {
    insMonth.run(deviceId, mk, wh, monthRun[mk]);
  }

  // Hourly shape for today.
  const insHour = db.prepare(
    "INSERT INTO energy_hourly (device_id, hour_start_utc, wh) VALUES (?,?,?)",
  );
  const todayStart = new Date(istYmd(now) + "T00:00:00+05:30").getTime();
  for (let h = 0; h < 24; h++) {
    const ts = new Date(todayStart + h * 3_600_000);
    if (ts.getTime() > now.getTime()) break;
    const wh = Math.round(200 + Math.random() * 900);
    insHour.run(deviceId, ts.toISOString().replace(/\.\d+Z$/, "Z"), wh);
  }

  // Recent power samples (last 30 min @ 15s) + a snapshot.
  const insPS = db.prepare(
    "INSERT INTO power_samples (device_id, ts_utc, watts, voltage, current) VALUES (?,?,?,?,?)",
  );
  for (let i = 120; i >= 0; i--) {
    const ts = new Date(now.getTime() - i * 15_000);
    const w = 1300 + Math.round(Math.sin(i / 8) * 250 + Math.random() * 120);
    insPS.run(deviceId, ts.toISOString(), w, 232, w / 232);
  }
  const todayWh = monthWh[istYmd(now).slice(0, 7) + "-01"] ?? 0;
  db.prepare(
    "INSERT INTO energy_snapshots (device_id, ts_utc, today_wh, month_wh, today_runtime_min, month_runtime_min) VALUES (?,?,?,?,?,?)",
  ).run(deviceId, now.toISOString(), 12500, todayWh, 280, 5600);

  console.log(
    `[seed:demo] cycle ${istYmd(cycle.start)}→ ${istYmd(now)} · ${(cycleTotal / 1000).toFixed(0)} kWh seeded`,
  );
}

main();
