import asyncio
from datetime import datetime, timezone

from poller import db
from poller.device import MockPlugClient
from poller.scheduler import ingest_energy, ingest_power


def _count(conn, table: str) -> int:
    return conn.execute(f"SELECT COUNT(*) AS c FROM {table}").fetchone()["c"]


def test_energy_daily_upsert_is_idempotent(tmp_path):
    conn = db.connect(str(tmp_path / "t.db"))
    db.upsert_energy_daily(conn, device_id="d1", day_ist="2026-04-01", wh=1000.0)
    db.upsert_energy_daily(conn, device_id="d1", day_ist="2026-04-01", wh=1500.0)
    # Re-running the daily job must NOT double-count → one row, latest value wins.
    assert _count(conn, "energy_daily") == 1
    row = conn.execute("SELECT wh FROM energy_daily").fetchone()
    assert row["wh"] == 1500.0


def test_ingest_pipeline_with_mock(tmp_path):
    conn = db.connect(str(tmp_path / "t.db"))
    client = MockPlugClient(device_id="d1")
    now = datetime(2026, 4, 1, 12, 0, 0, tzinfo=timezone.utc)

    watts = asyncio.run(ingest_power(conn, client, "d1"))
    # Mock reports power in mW; the guard must normalize 1_450_000 → 1450 W.
    assert watts == 1450.0
    assert _count(conn, "power_samples") == 1

    # Two energy polls → snapshots append (2), but daily/monthly upsert (1 each).
    asyncio.run(ingest_energy(conn, client, "d1", now=now))
    asyncio.run(ingest_energy(conn, client, "d1", now=now))
    assert _count(conn, "energy_snapshots") == 2
    assert _count(conn, "energy_daily") == 1
    assert _count(conn, "energy_monthly") == 1

    daily = conn.execute("SELECT day_ist, wh FROM energy_daily").fetchone()
    assert daily["day_ist"] == "2026-04-01"  # 12:00 UTC = 17:30 IST, same day
    assert daily["wh"] == 12345.0


def test_prune_respects_zero_retention(tmp_path):
    conn = db.connect(str(tmp_path / "t.db"))
    db.insert_power_sample(conn, device_id="d1", ts_utc="2020-01-01T00:00:00Z", watts=5)
    assert db.prune_power_samples(conn, 0) == 0  # 0 = keep forever
    assert _count(conn, "power_samples") == 1
