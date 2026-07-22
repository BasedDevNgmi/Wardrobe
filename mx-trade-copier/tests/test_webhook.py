import json
from unittest.mock import AsyncMock, MagicMock, patch

import pytest
from fastapi.testclient import TestClient

from api.webhook import init_webhook
from config import Settings
from main import app
from orders.router import OrderResult


@pytest.fixture
def settings():
    return Settings(
        webhook_secret="test-secret",
        tradovate_cid="test-cid",
        tradovate_sec="test-sec",
        tradovate_device_id="test-device",
        tradovate_accounts=[],
        symbol_map={"MES": "MESU5"},
    )


@pytest.fixture
def mock_order_router():
    router = MagicMock()
    router.route_signal = AsyncMock(return_value=[
        OrderResult(account_name="apex-1", success=True, order_id=12345),
    ])
    return router


@pytest.fixture
def client(settings, mock_order_router):
    init_webhook(settings, mock_order_router)
    return TestClient(app, raise_server_exceptions=False)


class TestWebhookEndpoint:
    def test_valid_signal_with_body_secret(self, client, mock_order_router):
        payload = {
            "secret": "test-secret",
            "action": "buy",
            "symbol": "MES",
            "qty": 1,
            "order_type": "market",
        }
        resp = client.post("/webhook", json=payload)
        assert resp.status_code == 200
        data = resp.json()
        assert data["status"] == "ok"
        assert data["succeeded"] == 1
        mock_order_router.route_signal.assert_called_once()

    def test_valid_signal_with_header_secret(self, client, mock_order_router):
        payload = {
            "action": "sell",
            "symbol": "NQ",
            "qty": 2,
        }
        resp = client.post(
            "/webhook",
            json=payload,
            headers={"X-Webhook-Secret": "test-secret"},
        )
        assert resp.status_code == 200

    def test_invalid_secret_rejected(self, client):
        payload = {
            "secret": "wrong-secret",
            "action": "buy",
            "symbol": "MES",
        }
        resp = client.post("/webhook", json=payload)
        assert resp.status_code == 401

    def test_no_secret_rejected(self, client):
        payload = {"action": "buy", "symbol": "MES"}
        resp = client.post("/webhook", json=payload)
        assert resp.status_code == 401

    def test_invalid_json_rejected(self, client):
        resp = client.post(
            "/webhook",
            content="not json",
            headers={"Content-Type": "application/json", "X-Webhook-Secret": "test-secret"},
        )
        assert resp.status_code == 400

    def test_invalid_signal_rejected(self, client):
        payload = {
            "secret": "test-secret",
            "action": "invalid_action",
            "symbol": "MES",
        }
        resp = client.post("/webhook", json=payload)
        assert resp.status_code == 400

    def test_flat_signal(self, client, mock_order_router):
        payload = {
            "secret": "test-secret",
            "action": "flat",
            "symbol": "MES",
        }
        resp = client.post("/webhook", json=payload)
        assert resp.status_code == 200

    def test_close_signal(self, client, mock_order_router):
        payload = {
            "secret": "test-secret",
            "action": "close",
            "symbol": "ES",
        }
        resp = client.post("/webhook", json=payload)
        assert resp.status_code == 200
