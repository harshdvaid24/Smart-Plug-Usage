"""Three-cadence poller (§5.2) + idempotent ingest. asyncio-based.

  every 15s  → get_current_power → power_samples
  every 5min → get_energy_usage  → energy_snapshots (+ rolling energy_daily/monthly)
  daily 00:05 IST → authoritative reconcile of energy_daily/energy_monthly + prune

Resilience (§5.3): retry with exponential backoff on connect/read failures, mark
the device offline, and keep going (gaps in power_samples are acceptable; the
daily authoritative total still fills kWh truth).
"""

from __future__ import annotations

import asyncio
import logging
import sqlite3
from datetime import datetime, timedelta

from .config import Config
from .device import PlugClient
from . import db
from .normalize import IST, ist_day, ist_month_start, utc_iso, utc_now

log = logging.getLogger("poller.scheduler")


# ── Ingest (testable with MockPlugClient + a temp DB) ─────────────────────────
async def ingest_power(
    conn: sqlite3.Connection, client: PlugClient, device_id: str
) -> float:
    r = await client.get_power()
    db.insert_power_sample(
        conn,
        device_id=device_id,
        ts_utc=utc_iso(),
        watts=r.watts,
        voltage=r.voltage,
        current=r.current,
    )
    return r.watts


async def ingest_energy(
    conn: sqlite3.Connection,
    client: PlugClient,
    device_id: str,
    now: datetime | None = None,
) -> None:
    now = now or utc_now()
    e = await client.get_energy()
    db.insert_energy_snapshot(
        conn,
        device_id=device_id,
        ts_utc=utc_iso(now),
        today_wh=e.today_wh,
        month_wh=e.month_wh,
        today_runtime_min=e.today_runtime_min,
        month_runtime_min=e.month_runtime_min,
    )
    # Rolling authoritative totals (upsert → plug value wins, no double counting).
    db.upsert_energy_daily(
        conn,
        device_id=device_id,
        day_ist=ist_day(now),
        wh=e.today_wh,
        runtime_min=e.today_runtime_min,
    )
    db.upsert_energy_monthly(
        conn,
        device_id=device_id,
        month_start_ist=ist_month_start(now),
        wh=e.month_wh,
        runtime_min=e.month_runtime_min,
    )


async def reconcile_daily(
    conn: sqlite3.Connection,
    client: PlugClient,
    device_id: str,
    retention_days: int = 90,
) -> None:
    """Daily authoritative reconcile from the plug's own stat buffers (§5.2)."""
    daily = await client.get_daily_stats()
    for day_ist, wh in daily.items():
        db.upsert_energy_daily(conn, device_id=device_id, day_ist=day_ist, wh=wh)
    monthly = await client.get_monthly_stats()
    for month_start_ist, wh in monthly.items():
        db.upsert_energy_monthly(
            conn, device_id=device_id, month_start_ist=month_start_ist, wh=wh
        )
    pruned = db.prune_power_samples(conn, retention_days)
    if pruned:
        log.info("pruned %d old power_samples", pruned)


# ── Resilience ────────────────────────────────────────────────────────────────
async def _with_backoff(coro_factory, *, attempts: int = 4, base: float = 2.0):
    delay = base
    last: Exception | None = None
    for i in range(attempts):
        try:
            return await coro_factory()
        except Exception as exc:  # noqa: BLE001 — surface + retry transient LAN/KLAP errors
            last = exc
            log.warning("attempt %d/%d failed: %s", i + 1, attempts, exc)
            if i < attempts - 1:
                await asyncio.sleep(delay)
                delay *= 2
    assert last is not None
    raise last


def _seconds_until_daily(hour: int, minute: int, now: datetime | None = None) -> float:
    now = (now or utc_now()).astimezone(IST)
    target = now.replace(hour=hour, minute=minute, second=0, microsecond=0)
    if target <= now:
        target += timedelta(days=1)
    return (target - now).total_seconds()


# ── Loops ─────────────────────────────────────────────────────────────────────
async def _power_loop(conn, client, device_id, cfg: Config) -> None:
    while True:
        try:
            await ingest_power(conn, client, device_id)
            db.set_device_status(conn, device_id, "online")
        except Exception as exc:  # noqa: BLE001
            log.warning("power poll failed: %s", exc)
            db.set_device_status(conn, device_id, "offline")
        await asyncio.sleep(cfg.poll_power_seconds)


async def _energy_loop(conn, client, device_id, cfg: Config) -> None:
    while True:
        try:
            await ingest_energy(conn, client, device_id)
        except Exception as exc:  # noqa: BLE001
            log.warning("energy poll failed: %s", exc)
        await asyncio.sleep(cfg.poll_energy_seconds)


async def _daily_loop(conn, client, device_id, cfg: Config) -> None:
    while True:
        wait = _seconds_until_daily(cfg.daily_job_ist_hour, cfg.daily_job_ist_minute)
        log.info("daily reconcile in %.0f min", wait / 60)
        await asyncio.sleep(wait)
        try:
            await reconcile_daily(
                conn, client, device_id, cfg.power_sample_retention_days
            )
            log.info("daily reconcile done")
        except Exception as exc:  # noqa: BLE001
            log.warning("daily reconcile failed: %s", exc)


async def run(conn, client: PlugClient, device_id: str, cfg: Config) -> None:
    await _with_backoff(client.connect)
    info = await client.get_info()
    db.upsert_device(
        conn,
        device_id=device_id,
        model=info.model,
        fw_ver=info.fw_ver,
        mac=info.mac,
        nickname=info.nickname,
        ip=info.ip,
        status="online",
    )
    log.info("poller running for %s (fw=%s)", device_id, info.fw_ver)
    
    # Start internal API server
    from .api import start_api_server
    api_runner = await start_api_server(client, port=8000)
    
    try:
        await asyncio.gather(
            _power_loop(conn, client, device_id, cfg),
            _energy_loop(conn, client, device_id, cfg),
            _daily_loop(conn, client, device_id, cfg),
        )
    finally:
        await api_runner.cleanup()
