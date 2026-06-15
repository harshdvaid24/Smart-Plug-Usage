# Tapo P110 poller — LAN-local sidecar. MUST run on the plug's network.
FROM python:3.11-slim

WORKDIR /app

# Install deps first for layer caching.
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

COPY poller ./poller

ENV TZ=Asia/Kolkata \
    PYTHONUNBUFFERED=1 \
    DATABASE_URL=/data/energy.db

# Shared SQLite volume mounted at /data (see docker-compose.yml).
VOLUME ["/data"]

# Default: run the three-cadence poller. Use `connect` to smoke-test.
CMD ["python", "-m", "poller.main", "run"]
