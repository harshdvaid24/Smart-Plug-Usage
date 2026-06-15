"""Device acquisition interface + python-kasa implementation + a mock.

The poller depends on the PlugClient PROTOCOL, not python-kasa directly, so the
acquisition backend can be swapped (e.g. to tp-link-tapo-connect) without
touching the scheduler/db. Normalization happens here on ingest (§5.4).
"""

from __future__ import annotations

import logging
from dataclasses import dataclass
from typing import Protocol, runtime_checkable

from .normalize import to_minutes, to_watts, to_wh

log = logging.getLogger("poller.device")


@dataclass
class DeviceInfo:
    device_id: str
    model: str | None
    fw_ver: str | None
    mac: str | None
    nickname: str | None
    ip: str | None
    device_on: bool
    overheated: bool
    signal_level: int | None
    on_time_s: int | None


@dataclass
class PowerReading:
    watts: float  # normalized W
    voltage: float | None
    current: float | None  # amps


@dataclass
class EnergyReading:
    today_wh: float
    month_wh: float
    today_runtime_min: int
    month_runtime_min: int


@runtime_checkable
class PlugClient(Protocol):
    async def connect(self) -> None: ...
    async def get_info(self) -> DeviceInfo: ...
    async def get_power(self) -> PowerReading: ...
    async def get_energy(self) -> EnergyReading: ...
    # Authoritative backfill: {day_ist 'YYYY-MM-DD': wh}
    async def get_daily_stats(self) -> dict[str, float]: ...
    # {month_start_ist 'YYYY-MM-01': wh}
    async def get_monthly_stats(self) -> dict[str, float]: ...


# ──────────────────────────────────────────────────────────────────────────────
# python-kasa implementation (runs on the LAN; can't be unit-tested without a plug)
# ──────────────────────────────────────────────────────────────────────────────
class KasaP110Client:
    """python-kasa backend. Requires fw 1.1.2+ and 'Third-Party Compatibility'
    enabled in the Tapo app. Uses KLAP via the TP-Link account credentials."""

    def __init__(self, host: str, email: str, password: str, nickname: str = "") -> None:
        self._host = host
        self._email = email
        self._password = password
        self._nickname = nickname
        self._dev = None  # kasa.Device

    async def connect(self) -> None:
        from kasa import Credentials, Device, DeviceConfig, DeviceConnectionParameters, DeviceFamily, DeviceEncryptionType  # lazy import

        self._dev = await Device.connect(
            config=DeviceConfig(
                host=self._host,
                credentials=Credentials(self._email, self._password),
                uses_http=True,
                connection_type=DeviceConnectionParameters(
                    device_family=DeviceFamily.SmartTapoPlug,
                    encryption_type=DeviceEncryptionType.Klap,
                )
            )
        )
        await self._dev.update()
        fw = getattr(self._dev, "hw_info", {}).get("sw_ver") or getattr(
            self._dev, "firmware_version", None
        )
        log.info("connected to %s (fw_ver=%s)", self._host, fw)

    def _energy_module(self):
        from kasa import Module

        mod = self._dev.modules.get(Module.Energy)
        if mod is None:
            raise RuntimeError(
                "Energy module unavailable — check fw (>=1.1.2) & device model (P110)."
            )
        return mod

    async def get_info(self) -> DeviceInfo:
        await self._dev.update()
        d = self._dev
        sys = getattr(d, "sys_info", {}) or {}
        return DeviceInfo(
            device_id=getattr(d, "device_id", None) or self._host,
            model=getattr(d, "model", None),
            fw_ver=(getattr(d, "hw_info", {}) or {}).get("sw_ver"),
            mac=getattr(d, "mac", None),
            nickname=getattr(d, "alias", None) or self._nickname,
            ip=self._host,
            device_on=bool(getattr(d, "is_on", False)),
            overheated=bool(sys.get("overheated", False)),
            signal_level=sys.get("rssi") or sys.get("signal_level"),
            on_time_s=sys.get("on_time"),
        )

    async def get_power(self) -> PowerReading:
        await self._dev.update()
        mod = self._energy_module()
        # current_consumption is in W; emeter realtime may carry voltage/current.
        watts = to_watts(getattr(mod, "current_consumption", None))
        status = getattr(mod, "status", None)
        voltage = getattr(status, "voltage", None) if status else None
        current = getattr(status, "current", None) if status else None
        return PowerReading(watts=watts, voltage=voltage, current=current)

    async def get_energy(self) -> EnergyReading:
        await self._dev.update()
        mod = self._energy_module()
        # python-kasa exposes consumption in kWh; convert to Wh.
        today_kwh = getattr(mod, "consumption_today", None) or 0.0
        month_kwh = getattr(mod, "consumption_this_month", None) or 0.0
        runtime = getattr(mod, "_data", {}) if hasattr(mod, "_data") else {}
        return EnergyReading(
            today_wh=to_wh(today_kwh * 1000.0),
            month_wh=to_wh(month_kwh * 1000.0),
            today_runtime_min=to_minutes(runtime.get("today_runtime", 0)),
            month_runtime_min=to_minutes(runtime.get("month_runtime", 0)),
        )

    async def get_daily_stats(self) -> dict[str, float]:
        # get_energy_data(interval=daily) → per-day Wh; mapped to IST day keys by caller.
        # Implementation depends on python-kasa version; left to LAN deployment.
        return {}

    async def get_monthly_stats(self) -> dict[str, float]:
        return {}


# ──────────────────────────────────────────────────────────────────────────────
# Mock implementation — deterministic, for tests & offline demo (no network)
# ──────────────────────────────────────────────────────────────────────────────
class MockPlugClient:
    """Deterministic fake plug. Used by tests and as an offline fallback so the
    pipeline (normalize → db) is fully verifiable without a real P110."""

    def __init__(self, device_id: str = "p110-mock", *, today_wh: float = 12345.0) -> None:
        self.device_id = device_id
        self._today_wh = today_wh

    async def connect(self) -> None:
        log.info("mock plug connected (%s)", self.device_id)

    async def get_info(self) -> DeviceInfo:
        return DeviceInfo(
            device_id=self.device_id,
            model="P110",
            fw_ver="1.3.0",
            mac="AA:BB:CC:DD:EE:FF",
            nickname="Mock AC",
            ip="192.168.1.50",
            device_on=True,
            overheated=False,
            signal_level=3,
            on_time_s=3600,
        )

    async def get_power(self) -> PowerReading:
        # Simulate a firmware that reports embedded power in mW (1.45 kW AC).
        return PowerReading(watts=to_watts(1_450_000), voltage=232.0, current=6.25)

    async def get_energy(self) -> EnergyReading:
        return EnergyReading(
            today_wh=self._today_wh,
            month_wh=self._today_wh * 20,
            today_runtime_min=240,
            month_runtime_min=4800,
        )

    async def get_daily_stats(self) -> dict[str, float]:
        return {}

    async def get_monthly_stats(self) -> dict[str, float]:
        return {}
