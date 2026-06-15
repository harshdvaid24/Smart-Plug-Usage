/** Centralized runtime settings (env-driven). */
export const env = {
  emissionFactorKgPerKwh: Number(
    process.env.EMISSION_FACTOR_KG_PER_KWH ?? "0.79",
  ),
  tz: process.env.TZ ?? "Asia/Kolkata",
  deviceNickname: process.env.TAPO_DEVICE_NICKNAME ?? "Tapo P110",
};
