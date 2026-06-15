"""Unit normalization on ingest (§5.4) + IST/UTC time helpers (§2.6).

Canonical DB units: Wh (energy), W (power), minutes (runtime).
Raw API units vary:
  - get_current_power            -> watts (W)
  - today_energy / month_energy  -> watt-hours (Wh)
  - runtime                      -> minutes
  - embedded current_power in the energy struct -> milliwatts (mW) on some firmware
"""

from __future__ import annotations

from datetime import datetime, timedelta, timezone

# A P110 (16A) tops out near 230V * 16A ≈ 3680 W. Any "power" far above this is
# almost certainly milliwatts (e.g. 1500 W reported as 1_500_000 mW). Guard with
# a generous threshold so legitimate high readings are never misclassified.
MW_GUARD_THRESHOLD_W = 10_000.0

IST = timezone(timedelta(hours=5, minutes=30))  # India: UTC+5:30, no DST


def to_watts(raw: float | int | None) -> float:
    """Normalize a power reading to watts, guarding against mW-encoded values."""
    if raw is None:
        return 0.0
    value = float(raw)
    if abs(value) > MW_GUARD_THRESHOLD_W:
        value = value / 1000.0  # mW -> W
    return value


def to_wh(raw: float | int | None) -> float:
    """Energy is already watt-hours; identity, documented for maintainers."""
    return 0.0 if raw is None else float(raw)


def to_minutes(raw: float | int | None) -> int:
    """Runtime is already minutes; coerce to int."""
    return 0 if raw is None else int(round(float(raw)))


def utc_now() -> datetime:
    return datetime.now(timezone.utc)


def utc_iso(dt: datetime | None = None) -> str:
    dt = dt or utc_now()
    if dt.tzinfo is None:
        dt = dt.replace(tzinfo=timezone.utc)
    return dt.astimezone(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")


def hour_start_utc(dt: datetime) -> str:
    """ISO UTC truncated to the hour (key for energy_hourly)."""
    dt = dt.astimezone(timezone.utc).replace(minute=0, second=0, microsecond=0)
    return dt.strftime("%Y-%m-%dT%H:%M:%SZ")


def ist_day(dt: datetime) -> str:
    """IST calendar day 'YYYY-MM-DD' (DISCOM billing-day boundary)."""
    return dt.astimezone(IST).strftime("%Y-%m-%d")


def ist_month_start(dt: datetime) -> str:
    """IST month-start 'YYYY-MM-01'."""
    return dt.astimezone(IST).strftime("%Y-%m-01")
