import logging
from aiohttp import web
from .device import PlugClient

log = logging.getLogger("poller.api")

class PollerAPI:
    def __init__(self, client: PlugClient):
        self.client = client
        self.app = web.Application()
        self.app.add_routes([
            web.post("/api/action", self.handle_action),
            web.get("/api/status", self.handle_status)
        ])

    async def handle_status(self, request: web.Request) -> web.Response:
        try:
            info = await self.client.get_info()
            return web.json_response({
                "status": "ok",
                "device_on": info.device_on,
            })
        except Exception as e:
            return web.json_response({"error": str(e)}, status=500)

    async def handle_action(self, request: web.Request) -> web.Response:
        try:
            data = await request.json()
            action = data.get("action")
            params = data.get("params", {})
            
            log.info("Received action: %s %s", action, params)
            
            if action == "turn_on":
                await self.client.turn_on()
            elif action == "turn_off":
                await self.client.turn_off()
            elif action == "set_led":
                state = params.get("state", True)
                await self.client.set_led(state)
            elif action == "set_auto_off":
                enabled = params.get("enabled", False)
                minutes = params.get("minutes", 120)
                await self.client.set_auto_off(enabled, minutes)
            else:
                return web.json_response({"error": "Unknown action"}, status=400)
                
            return web.json_response({"status": "success"})
            
        except Exception as e:
            log.exception("Action failed")
            return web.json_response({"error": str(e)}, status=500)

async def start_api_server(client: PlugClient, port: int = 8000) -> web.AppRunner:
    api = PollerAPI(client)
    runner = web.AppRunner(api.app)
    await runner.setup()
    site = web.TCPSite(runner, '127.0.0.1', port)
    await site.start()
    log.info("API server listening on http://127.0.0.1:%d", port)
    return runner
