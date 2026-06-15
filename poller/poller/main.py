"""Poller CLI.

  python -m poller.main connect   # M0 smoke: print fw_ver + a live current_power
  python -m poller.main run       # start the three-cadence poller
  python -m poller.main run --mock  # run against the deterministic mock (no plug)
"""

from __future__ import annotations

import argparse
import asyncio
import logging
import sys

from .config import Config
from .device import KasaP110Client, MockPlugClient, PlugClient
from . import db, scheduler


def _setup_logging() -> None:
    logging.basicConfig(
        level=logging.INFO,
        format="%(asctime)s %(levelname)s %(name)s: %(message)s",
    )


def _make_client(cfg: Config, mock: bool) -> tuple[PlugClient, str]:
    if mock:
        client = MockPlugClient()
        return client, client.device_id
    cfg.require_credentials()
    client = KasaP110Client(cfg.device_ip, cfg.email, cfg.password, cfg.nickname)
    return client, cfg.device_ip


async def _connect_smoke(cfg: Config, mock: bool) -> int:
    client, device_id = _make_client(cfg, mock)
    await client.connect()
    info = await client.get_info()
    power = await client.get_power()
    print(f"✅ Connected to {info.model or 'device'} @ {info.ip}")
    print(f"   device_id : {info.device_id}")
    print(f"   fw_ver    : {info.fw_ver}")
    print(f"   on/off    : {'ON' if info.device_on else 'OFF'}")
    print(f"   power     : {power.watts:.1f} W")
    if info.fw_ver and _fw_too_old(info.fw_ver):
        print("⚠️  Firmware < 1.1.2 — energy monitoring may be unavailable.")
    return 0


def _fw_too_old(fw: str) -> bool:
    try:
        parts = [int(x) for x in fw.split(".")[:3]]
        return tuple(parts) < (1, 1, 2)
    except Exception:
        return False


async def _run(cfg: Config, mock: bool) -> int:
    client, device_id = _make_client(cfg, mock)
    conn = db.connect(cfg.db_path)
    try:
        await scheduler.run(conn, client, device_id, cfg)
    finally:
        conn.close()
    return 0


def main(argv: list[str] | None = None) -> int:
    _setup_logging()
    parser = argparse.ArgumentParser(prog="poller", description="Tapo P110 poller")
    sub = parser.add_subparsers(dest="cmd", required=True)
    for name in ("connect", "run"):
        p = sub.add_parser(name)
        p.add_argument("--mock", action="store_true", help="use the mock plug (no LAN)")
    args = parser.parse_args(argv)

    cfg = Config.load()
    if args.cmd == "connect":
        return asyncio.run(_connect_smoke(cfg, args.mock))
    if args.cmd == "run":
        return asyncio.run(_run(cfg, args.mock))
    return 1


if __name__ == "__main__":
    sys.exit(main())
