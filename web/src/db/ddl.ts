/**
 * Canonical SQLite DDL (§7). Idempotent. Runtime source of truth for the web app
 * (embedded so Next prod builds don't need to bundle a .sql file).
 *
 * ⚠️ Mirrored in poller/poller/schema_sql.py — keep identical across both languages.
 * Units: Wh (energy), W (power), minutes (runtime). UTC ISO text timestamps.
 */
export const DDL = /* sql */ `
PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS device (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  device_id   TEXT NOT NULL UNIQUE,
  model       TEXT,
  fw_ver      TEXT,
  mac         TEXT,
  nickname    TEXT,
  ip          TEXT,
  status      TEXT NOT NULL DEFAULT 'unknown',
  first_seen  TEXT,
  last_seen   TEXT,
  created_at  TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS power_samples (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  device_id  TEXT NOT NULL,
  ts_utc     TEXT NOT NULL,
  watts      REAL NOT NULL,
  voltage    REAL,
  current    REAL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_power_samples_device_ts ON power_samples(device_id, ts_utc);

CREATE TABLE IF NOT EXISTS energy_snapshots (
  id                 INTEGER PRIMARY KEY AUTOINCREMENT,
  device_id          TEXT NOT NULL,
  ts_utc             TEXT NOT NULL,
  today_wh           REAL,
  month_wh           REAL,
  today_runtime_min  INTEGER,
  month_runtime_min  INTEGER,
  created_at         TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at         TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_energy_snapshots_device_ts ON energy_snapshots(device_id, ts_utc);

CREATE TABLE IF NOT EXISTS energy_hourly (
  id             INTEGER PRIMARY KEY AUTOINCREMENT,
  device_id      TEXT NOT NULL,
  hour_start_utc TEXT NOT NULL,
  wh             REAL NOT NULL,
  created_at     TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at     TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(device_id, hour_start_utc)
);
CREATE INDEX IF NOT EXISTS idx_energy_hourly_hour ON energy_hourly(hour_start_utc);

CREATE TABLE IF NOT EXISTS energy_daily (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  device_id   TEXT NOT NULL,
  day_ist     TEXT NOT NULL,
  wh          REAL NOT NULL,
  runtime_min INTEGER,
  created_at  TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(device_id, day_ist)
);
CREATE INDEX IF NOT EXISTS idx_energy_daily_day ON energy_daily(day_ist);

CREATE TABLE IF NOT EXISTS energy_monthly (
  id              INTEGER PRIMARY KEY AUTOINCREMENT,
  device_id       TEXT NOT NULL,
  month_start_ist TEXT NOT NULL,
  wh              REAL NOT NULL,
  runtime_min     INTEGER,
  created_at      TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at      TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(device_id, month_start_ist)
);
CREATE INDEX IF NOT EXISTS idx_energy_monthly_month ON energy_monthly(month_start_ist);

CREATE TABLE IF NOT EXISTS tariff_config (
  id             INTEGER PRIMARY KEY AUTOINCREMENT,
  name           TEXT NOT NULL,
  effective_from TEXT NOT NULL,
  json           TEXT NOT NULL,
  is_active      INTEGER NOT NULL DEFAULT 0,
  created_at     TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at     TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS bills (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  cycle_start TEXT NOT NULL,
  cycle_end   TEXT NOT NULL,
  units       REAL NOT NULL,
  amount      REAL NOT NULL,
  source      TEXT,
  created_at  TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
`;
