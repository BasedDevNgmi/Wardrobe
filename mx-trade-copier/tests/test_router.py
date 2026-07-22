import asyncio
from unittest.mock import AsyncMock, MagicMock, patch

import pytest

from models.signal import Signal, set_symbol_map
from orders.router import OrderRouter
from tradovate.models import OrderResponse, TradovateAccount


@pytest.fixture(autouse=True)
def setup_symbol_map():
    set_symbol_map({"MES": "MESU5", "NQ": "NQU5"})


def make_mock_client(account_name="APEX-1", account_id=100):
    client = MagicMock()
    client.accounts = [TradovateAccount(id=account_id, name=account_name)]
    client.is_authenticated = True
    client.place_order = AsyncMock(return_value=OrderResponse(
        orderId=999, accountId=account_id, action="Buy", symbol="MESU5", orderQty=1,
        orderType="Market", status="Working",
    ))
    client.liquidate_position = AsyncMock(return_value={"orderId": 1000})
    client.place_bracket_order = AsyncMock(return_value={"orderId": 1001})
    return client


def make_mock_manager(clients: dict[str, MagicMock] | None = None):
    if clients is None:
        clients = {"apex-1": make_mock_client()}

    manager = MagicMock()
    manager._clients = clients
    manager._healthy = {name: True for name in clients}
    manager.settings = MagicMock()
    manager.settings.tradovate_accounts = [
        MagicMock(name=name, qty_multiplier=1.0) for name in clients
    ]

    def get_ready():
        return [(name, c) for name, c in clients.items()]

    manager.get_ready_accounts = MagicMock(side_effect=get_ready)
    return manager


class TestOrderRouter:
    @pytest.mark.asyncio
    @patch("orders.router.queries")
    async def test_market_buy_single_account(self, mock_queries):
        mock_queries.insert_signal = AsyncMock(return_value=1)
        mock_queries.insert_order = AsyncMock(return_value=1)

        manager = make_mock_manager()
        router = OrderRouter(manager)
        signal = Signal(action="buy", symbol="MES", qty=1)

        results = await router.route_signal(signal, '{"action":"buy","symbol":"MES","qty":1}')

        assert len(results) == 1
        assert results[0].success is True
        assert results[0].order_id == 999
        mock_queries.insert_signal.assert_called_once()
        mock_queries.insert_order.assert_called_once()

    @pytest.mark.asyncio
    @patch("orders.router.queries")
    async def test_fan_out_to_multiple_accounts(self, mock_queries):
        mock_queries.insert_signal = AsyncMock(return_value=1)
        mock_queries.insert_order = AsyncMock(return_value=1)

        clients = {
            "apex-1": make_mock_client("APEX-1", 100),
            "apex-2": make_mock_client("APEX-2", 200),
            "apex-3": make_mock_client("APEX-3", 300),
        }
        manager = make_mock_manager(clients)
        router = OrderRouter(manager)
        signal = Signal(action="buy", symbol="MES", qty=1)

        results = await router.route_signal(signal, "{}")

        assert len(results) == 3
        assert all(r.success for r in results)

    @pytest.mark.asyncio
    @patch("orders.router.queries")
    async def test_liquidation_on_flat(self, mock_queries):
        mock_queries.insert_signal = AsyncMock(return_value=1)
        mock_queries.insert_order = AsyncMock(return_value=1)

        manager = make_mock_manager()
        router = OrderRouter(manager)
        signal = Signal(action="flat", symbol="MES")

        results = await router.route_signal(signal, "{}")

        assert len(results) == 1
        assert results[0].success is True
        manager._clients["apex-1"].liquidate_position.assert_called_once()

    @pytest.mark.asyncio
    @patch("orders.router.queries")
    async def test_no_ready_accounts(self, mock_queries):
        mock_queries.insert_signal = AsyncMock(return_value=1)

        manager = MagicMock()
        manager.get_ready_accounts = MagicMock(return_value=[])
        router = OrderRouter(manager)
        signal = Signal(action="buy", symbol="MES", qty=1)

        results = await router.route_signal(signal, "{}")

        assert len(results) == 0

    @pytest.mark.asyncio
    @patch("orders.router.queries")
    async def test_bracket_order_with_tp_sl(self, mock_queries):
        mock_queries.insert_signal = AsyncMock(return_value=1)
        mock_queries.insert_order = AsyncMock(return_value=1)

        manager = make_mock_manager()
        router = OrderRouter(manager)
        signal = Signal(action="buy", symbol="MES", qty=1, tp=10.0, sl=-5.0)

        results = await router.route_signal(signal, "{}")

        assert len(results) == 1
        assert results[0].success is True
        manager._clients["apex-1"].place_bracket_order.assert_called_once()
