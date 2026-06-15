"""SQLite persistence for the poller. Idempotent upserts on period-start keys.

The poller is the WRITER; the web app is the READER. WAL mode keeps concurrent
read/write safe. Reconciliation rule (§5.2): the plug's reported daily/monthly
energy WINS — daily/monthly upserts overwrite with the metered value.
"""

from __future__ import annotations

import os
import sqlite3
from pathlib import Path

from .normalize import utc_iso
from .schema_sql import DDL


def connect(db_path: str) -> sqlite3.Connection:
    Path(db_path).parent.mkdir(parents=True, exist_ok=True)
    conn = sqlite3.connect(db_path, timeout=5.0)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA journal_mode = WAL")
    conn.execute("PRAGMA busy_timeout = 5000")
    conn.executescript(DDL)
    conn.commit()
    return conn


def upsert_device(
    conn: sqlite3.Connection,
    *,
    device_id: str,
    model: str | None = None,
    fw_ver: str | None = None,
    mac: str | None = None,
    nickname: str | None = None,
    ip: str | None = None,
    status: str = "online",
) -> None:
    now = utc_iso()
    conn.execute(
        """
        INSERT INTO device (device_id, model, fw_ver, mac, nickname, ip, status,
                            first_seen, last_seen, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(device_id) DO UPDATE SET
            model      = COALESCE(excluded.model, device.model),
            fw_ver     = COALESCE(excluded.fw_ver, device.fw_ver),
            mac        = COALESCE(excluded.mac, device.mac),
            nickname   = COALESCE(excluded.nickname, device.nickname),
            ip         = COALESCE(excluded.ip, device.ip),
            status     = excluded.status,
            last_seen  = excluded.last_seen,
            updated_at = excluded.updated_at
        """,
        (device_id, model, fw_ver, mac, nickname, ip, status, now, now, now),
    )
    conn.commit()


def set_device_status(conn: sqlite3.Connection, device_id: str, status: str) -> None:
    conn.execute(
        "UPDATE device SET status = ?, updated_at = ? WHERE device_id = ?",
        (status, utc_iso(), device_id),
    )
    conn.commit()


def insert_power_sample(
    conn: sqlite3.Connection,
    *,
    device_id: str,
    ts_utc: str,
    watts: float,
    voltage: float | None = None,
    current: float | None = None,
) -> None:
    conn.execute(
        "INSERT INTO power_samples (device_id, ts_utc, watts, voltage, current) "
        "VALUES (?, ?, ?, ?, ?)",
        (device_id, ts_utc, watts, voltage, current),
    )
    conn.commit()


def insert_energy_snapshot(
    conn: sqlite3.Connection,
    *,
    device_id: str,
    ts_utc: str,
    today_wh: float | None,
    month_wh: float | None,
    today_runtime_min: int | None,
    month_runtime_min: int | None,
) -> None:
    conn.execute(
        """
        INSERT INTO energy_snapshots
          (device_id, ts_utc, today_wh, month_wh, today_runtime_min, month_runtime_min)
        VALUES (?, ?, ?, ?, ?, ?)
        """,
        (device_id, ts_utc, today_wh, month_wh, today_runtime_min, month_runtime_min),
    )
    conn.commit()


def upsert_energy_daily(
    conn: sqlite3.Connection,
    *,
    device_id: str,
    day_ist: str,
    wh: float,
    runtime_min: int | None = None,
) -> None:
    """AUTHORITATIVE daily total. Plug value wins → overwrite on conflict."""
    conn.execute(
        """
        INSERT INTO energy_daily (device_id, day_ist, wh, runtime_min, updated_at)
        VALUES (?, ?, ?, ?, ?)
        ON CONFLICT(device_id, day_ist) DO UPDATE SET
            wh          = excluded.wh,
            runtime_min = excluded.runtime_min,
            updated_at  = excluded.updated_at
        """,
        (device_id, day_ist, wh, runtime_min, utc_iso()),
    )
    conn.commit()


def upsert_energy_monthly(
    conn: sqlite3.Connection,
    *,
    device_id: str,
    month_start_ist: str,
    wh: float,
    runtime_min: int | None = None,
) -> None:
    conn.execute(
        """
        INSERT INTO energy_monthly (device_id, month_start_ist, wh, runtime_min, updated_at)
        VALUES (?, ?, ?, ?, ?)
        ON CONFLICT(device_id, month_start_ist) DO UPDATE SET
            wh          = excluded.wh,
            runtime_min = excluded.runtime_min,
            updated_at  = excluded.updated_at
        """,
        (device_id, month_start_ist, wh, runtime_min, utc_iso()),
    )
    conn.commit()


def upsert_energy_hourly(
    conn: sqlite3.Connection,
    *,
    device_id: str,
    hour_start_utc: str,
    wh: float,
) -> None:
    conn.execute(
        """
        INSERT INTO energy_hourly (device_id, hour_start_utc, wh, updated_at)
        VALUES (?, ?, ?, ?)
        ON CONFLICT(device_id, hour_start_utc) DO UPDATE SET
            wh         = excluded.wh,
            updated_at = excluded.updated_at
        """,
        (device_id, hour_start_utc, wh, utc_iso()),
    )
    conn.commit()


def prune_power_samples(conn: sqlite3.Connection, retention_days: int) -> int:
    """Delete raw power_samples older than retention_days (0 = keep forever)."""
    if retention_days <= 0:
        return 0
    cutoff = (
        f"datetime('now', '-{int(retention_days)} days')"
    )
    cur = conn.execute(
        f"DELETE FROM power_samples WHERE ts_utc < strftime('%Y-%m-%dT%H:%M:%SZ', {cutoff})"
    )
    conn.commit()
    return cur.rowcount
