import json
import logging

from fastapi import APIRouter, Request, Response

from config import Settings
from models.signal import Signal
from orders.router import OrderRouter

logger = logging.getLogger(__name__)

router = APIRouter()

_settings: Settings | None = None
_order_router: OrderRouter | None = None


def init_webhook(settings: Settings, order_router: OrderRouter) -> None:
    global _settings, _order_router
    _settings = settings
    _order_router = order_router


@router.post("/webhook")
async def receive_webhook(request: Request) -> Response:
    if _settings is None or _order_router is None:
        return Response(status_code=503, content="Server not initialized")

    try:
        raw = await request.body()
        raw_str = raw.decode("utf-8")
    except Exception:
        logger.error("Failed to read webhook body")
        return Response(status_code=400, content="Invalid request body")

    try:
        payload = json.loads(raw_str)
    except json.JSONDecodeError:
        logger.error("Invalid JSON in webhook: %s", raw_str[:500])
        return Response(status_code=400, content="Invalid JSON")

    secret_from_header = request.headers.get("X-Webhook-Secret")
    secret_from_body = payload.get("secret")
    provided_secret = secret_from_header or secret_from_body

    if provided_secret != _settings.webhook_secret:
        logger.warning("Invalid webhook secret")
        return Response(status_code=401, content="Unauthorized")

    try:
        signal = Signal.model_validate(payload)
    except Exception as e:
        logger.error("Failed to parse signal: %s | payload: %s", e, raw_str[:500])
        return Response(status_code=400, content=f"Invalid signal: {e}")

    logger.info("Received signal: %s %s x%d", signal.action.value, signal.symbol, signal.qty)

    results = await _order_router.route_signal(signal, raw_str)

    summary = {
        "status": "ok",
        "signal": signal.action.value,
        "symbol": signal.symbol,
        "accounts_targeted": len(results),
        "succeeded": sum(1 for r in results if r.success),
        "failed": sum(1 for r in results if not r.success),
        "results": [r.to_dict() for r in results],
    }

    return Response(
        status_code=200,
        content=json.dumps(summary),
        media_type="application/json",
    )
