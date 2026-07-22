import pytest

from models.signal import Signal, SignalAction, resolve_symbol, set_symbol_map
from tradovate.models import OrderAction, OrderType


class TestSignalParsing:
    def test_basic_buy(self):
        signal = Signal(action="buy", symbol="MES", qty=1)
        assert signal.action == SignalAction.BUY
        assert signal.symbol == "MES"
        assert signal.qty == 1
        assert signal.order_type == "market"

    def test_basic_sell(self):
        signal = Signal(action="sell", symbol="NQ", qty=2, order_type="limit", price=18000.0)
        assert signal.action == SignalAction.SELL
        assert signal.qty == 2
        assert signal.order_type == "limit"
        assert signal.price == 18000.0

    def test_flat_action(self):
        signal = Signal(action="flat", symbol="MES")
        assert signal.action == SignalAction.FLAT
        assert signal.action.is_exit is True

    def test_close_action(self):
        signal = Signal(action="close", symbol="ES")
        assert signal.action == SignalAction.CLOSE
        assert signal.action.is_exit is True

    def test_case_insensitive_action(self):
        signal = Signal(action="BUY", symbol="MES")
        assert signal.action == SignalAction.BUY

    def test_case_insensitive_order_type(self):
        signal = Signal(action="buy", symbol="MES", order_type="LIMIT", price=5000.0)
        assert signal.order_type == "limit"

    def test_with_tp_sl(self):
        signal = Signal(action="buy", symbol="MES", qty=1, tp=10.0, sl=-5.0)
        assert signal.tp == 10.0
        assert signal.sl == -5.0

    def test_with_secret(self):
        signal = Signal(secret="my-secret", action="buy", symbol="MES")
        assert signal.secret == "my-secret"

    def test_to_order_action_buy(self):
        signal = Signal(action="buy", symbol="MES")
        assert signal.action.to_order_action() == OrderAction.BUY

    def test_to_order_action_sell(self):
        signal = Signal(action="sell", symbol="MES")
        assert signal.action.to_order_action() == OrderAction.SELL

    def test_to_order_action_flat_raises(self):
        signal = Signal(action="flat", symbol="MES")
        with pytest.raises(ValueError):
            signal.action.to_order_action()

    def test_to_tradovate_order_type(self):
        signal = Signal(action="buy", symbol="MES", order_type="market")
        assert signal.to_tradovate_order_type() == OrderType.MARKET

        signal2 = Signal(action="buy", symbol="MES", order_type="limit", price=5000.0)
        assert signal2.to_tradovate_order_type() == OrderType.LIMIT

        signal3 = Signal(action="buy", symbol="MES", order_type="stop", stop_price=4900.0)
        assert signal3.to_tradovate_order_type() == OrderType.STOP

    def test_from_full_payload(self):
        payload = {
            "secret": "test-secret",
            "action": "buy",
            "symbol": "MES",
            "qty": 3,
            "order_type": "market",
            "price": None,
            "stop_price": None,
            "tp": 10,
            "sl": -5,
        }
        signal = Signal.model_validate(payload)
        assert signal.action == SignalAction.BUY
        assert signal.qty == 3
        assert signal.tp == 10.0
        assert signal.sl == -5.0


class TestSymbolMapping:
    def test_resolve_mapped_symbol(self):
        set_symbol_map({"MES": "MESU5", "NQ": "NQU5"})
        assert resolve_symbol("MES") == "MESU5"
        assert resolve_symbol("NQ") == "NQU5"

    def test_resolve_unmapped_passthrough(self):
        set_symbol_map({"MES": "MESU5"})
        assert resolve_symbol("MESU5") == "MESU5"
        assert resolve_symbol("UNKNOWN") == "UNKNOWN"

    def test_signal_resolved_symbol(self):
        set_symbol_map({"MES": "MESZ5"})
        signal = Signal(action="buy", symbol="MES")
        assert signal.resolved_symbol() == "MESZ5"

    def test_empty_map_passthrough(self):
        set_symbol_map({})
        assert resolve_symbol("MES") == "MES"
