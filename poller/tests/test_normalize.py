from datetime import datetime, timezone

from poller.normalize import (
    hour_start_utc,
    ist_day,
    ist_month_start,
    to_minutes,
    to_watts,
    to_wh,
)


def test_to_watts_passthrough_for_plausible_values():
    assert to_watts(1500) == 1500.0
    assert to_watts(3680) == 3680.0  # P110 max-ish, must NOT be divided
    assert to_watts(0) == 0.0


def test_to_watts_mw_guard():
    # 1.45 kW reported as milliwatts must normalize to ~1450 W (§5.4).
    assert to_watts(1_450_000) == 1450.0
    assert to_watts(None) == 0.0


def test_to_wh_identity():
    assert to_wh(12345) == 12345.0
    assert to_wh(None) == 0.0


def test_to_minutes():
    assert to_minutes(240.0) == 240
    assert to_minutes(None) == 0


def test_ist_boundaries():
    # 2026-04-01 20:00 UTC = 2026-04-02 01:30 IST → next IST day.
    dt = datetime(2026, 4, 1, 20, 0, 0, tzinfo=timezone.utc)
    assert ist_day(dt) == "2026-04-02"
    assert ist_month_start(dt) == "2026-04-01"


def test_hour_start_utc_truncates():
    dt = datetime(2026, 4, 1, 20, 45, 30, tzinfo=timezone.utc)
    assert hour_start_utc(dt) == "2026-04-01T20:00:00Z"
