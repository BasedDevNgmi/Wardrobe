from tradovate.models import (
    OrderAction,
    OrderType,
    PlaceOrderRequest,
    BracketOrderRequest,
    BracketParams,
    TimeInForce,
)


class TestPlaceOrderRequest:
    def test_market_order_dict(self):
        req = PlaceOrderRequest(
            account_spec="APEX-12345",
            account_id=12345,
            action=OrderAction.BUY,
            symbol="MESU5",
            order_qty=1,
            order_type=OrderType.MARKET,
        )
        d = req.to_api_dict()
        assert d["accountSpec"] == "APEX-12345"
        assert d["accountId"] == 12345
        assert d["action"] == "Buy"
        assert d["symbol"] == "MESU5"
        assert d["orderQty"] == 1
        assert d["orderType"] == "Market"
        assert d["isAutomated"] is True
        assert d["timeInForce"] == "Day"
        assert "price" not in d
        assert "stopPrice" not in d

    def test_limit_order_dict(self):
        req = PlaceOrderRequest(
            account_spec="APEX-99",
            account_id=99,
            action=OrderAction.SELL,
            symbol="MNQU5",
            order_qty=2,
            order_type=OrderType.LIMIT,
            price=18500.25,
            time_in_force=TimeInForce.GTC,
        )
        d = req.to_api_dict()
        assert d["action"] == "Sell"
        assert d["orderType"] == "Limit"
        assert d["price"] == 18500.25
        assert d["timeInForce"] == "GTC"

    def test_stop_order_dict(self):
        req = PlaceOrderRequest(
            account_spec="APEX-1",
            account_id=1,
            action=OrderAction.SELL,
            symbol="ESU5",
            order_qty=1,
            order_type=OrderType.STOP,
            stop_price=5400.0,
        )
        d = req.to_api_dict()
        assert d["orderType"] == "Stop"
        assert d["stopPrice"] == 5400.0

    def test_is_automated_always_true(self):
        req = PlaceOrderRequest(
            account_spec="X",
            account_id=1,
            action=OrderAction.BUY,
            symbol="MESU5",
            order_qty=1,
        )
        assert req.is_automated is True
        assert req.to_api_dict()["isAutomated"] is True


class TestBracketOrderRequest:
    def test_bracket_dict(self):
        params = BracketParams(
            entry_version={"orderQty": 1, "orderType": "Market", "timeInForce": "Day"},
            brackets=[{"qty": 1, "profitTarget": 10, "stopLoss": -5, "trailingStop": False}],
        )
        req = BracketOrderRequest(
            account_spec="APEX-1",
            account_id=1,
            action=OrderAction.BUY,
            symbol="MESU5",
            params=params,
        )
        d = req.to_api_dict()
        assert d["accountSpec"] == "APEX-1"
        assert d["orderStrategyTypeId"] == 2
        assert isinstance(d["params"], str)
        assert '"profitTarget": 10' in d["params"]
        assert '"stopLoss": -5' in d["params"]
