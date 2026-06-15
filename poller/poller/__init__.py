"""Tapo P110 poller — LAN-local data acquisition sidecar.

Reads the P110 over its free local API (python-kasa / KLAP) and persists
normalized energy data into the shared SQLite DB. MUST run on the same network
as the plug (the local API only answers on the LAN).
"""

__version__ = "0.1.0"
