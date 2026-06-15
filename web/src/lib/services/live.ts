import { getRepositories } from "@/lib/repositories";
import { istYmd } from "@/lib/time";

export interface LiveResult {
  device_id: string;
  nickname: string | null;
  current_power_w: number;
  device_on: boolean;
  on_time_s: number | null;
  today_kwh: number;
  overheat: boolean;
  signal_level: number | null;
  status: string;
  last_seen: string | null;
}

export function getLive(deviceId?: string): LiveResult {
  const repos = getRepositories();
  const tariff = repos.tariffs.getActive();
  const calib = tariff?.calibrationFactor ?? 1;

  const dev = deviceId
    ? repos.devices.get(deviceId)
    : repos.devices.getPrimary();
  const id = dev?.deviceId ?? deviceId ?? "p110-demo";

  const power = repos.energy.latestPower(id);
  const snap = repos.energy.latestSnapshot(id);

  const watts = power?.watts ?? 0;
  // Authoritative today's kWh from energy_daily; fall back to latest snapshot.
  const todayYmd = istYmd(new Date());
  const todayWh =
    repos.energy.sumDailyWh(id, todayYmd, istYmd(new Date(Date.now() + 86_400_000))) ||
    snap?.todayWh ||
    0;

  return {
    device_id: id,
    nickname: dev?.nickname ?? null,
    current_power_w: watts,
    device_on: watts > 1,
    on_time_s: snap?.todayRuntimeMin != null ? snap.todayRuntimeMin * 60 : null,
    today_kwh: (todayWh / 1000) * calib,
    overheat: false,
    signal_level: null,
    status: dev?.status ?? "unknown",
    last_seen: dev?.lastSeen ?? null,
  };
}
