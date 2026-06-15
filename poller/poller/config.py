"""Poller configuration from environment (.env). Never hard-code secrets."""

from __future__ import annotations

import os
from dataclasses import dataclass
from pathlib import Path


def _load_dotenv() -> None:
    """Tiny .env loader (avoids a hard dependency). Repo root or CWD."""
    for candidate in (Path.cwd() / ".env", Path(__file__).resolve().parents[2] / ".env"):
        if candidate.is_file():
            for line in candidate.read_text().splitlines():
                line = line.strip()
                if not line or line.startswith("#") or "=" not in line:
                    continue
                key, _, value = line.partition("=")
                os.environ.setdefault(key.strip(), value.strip())
            return


@dataclass(frozen=True)
class Config:
    email: str
    password: str
    device_ip: str
    nickname: str
    db_path: str
    tz: str
    poll_power_seconds: int
    poll_energy_seconds: int
    daily_job_ist_hour: int
    daily_job_ist_minute: int
    power_sample_retention_days: int

    @staticmethod
    def load() -> "Config":
        _load_dotenv()
        db_raw = os.environ.get("DATABASE_URL", "./data/energy.db")
        # Resolve relative to repo root (this file is poller/poller/config.py).
        db_path = (
            db_raw
            if os.path.isabs(db_raw)
            else str((Path(__file__).resolve().parents[2] / db_raw).resolve())
        )
        return Config(
            email=os.environ.get("TAPO_EMAIL", ""),
            password=os.environ.get("TAPO_PASSWORD", ""),
            device_ip=os.environ.get("TAPO_DEVICE_IP", ""),
            nickname=os.environ.get("TAPO_DEVICE_NICKNAME", "Tapo P110"),
            db_path=db_path,
            tz=os.environ.get("TZ", "Asia/Kolkata"),
            poll_power_seconds=int(os.environ.get("POLL_POWER_SECONDS", "15")),
            poll_energy_seconds=int(os.environ.get("POLL_ENERGY_SECONDS", "300")),
            daily_job_ist_hour=int(os.environ.get("DAILY_JOB_IST_HOUR", "0")),
            daily_job_ist_minute=int(os.environ.get("DAILY_JOB_IST_MINUTE", "5")),
            power_sample_retention_days=int(
                os.environ.get("POWER_SAMPLE_RETENTION_DAYS", "90")
            ),
        )

    def require_credentials(self) -> None:
        missing = [
            name
            for name, val in (
                ("TAPO_EMAIL", self.email),
                ("TAPO_PASSWORD", self.password),
                ("TAPO_DEVICE_IP", self.device_ip),
            )
            if not val
        ]
        if missing:
            raise SystemExit(
                "Missing required env vars: "
                + ", ".join(missing)
                + ". Copy .env.example to .env and fill them in."
            )
