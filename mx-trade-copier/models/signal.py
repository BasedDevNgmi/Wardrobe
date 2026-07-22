from enum import Enum

from pydantic import BaseModel, field_validator

from tradovate.models import OrderAction, OrderType


class SignalAction(str, Enum):
    BUY = "buy"
    SELL = "sell"
    FLAT = "flat"
    CLOSE = "close"

    def to_order_action(self) -> OrderAction:
        if self == SignalAction.BUY:
            return OrderAction.BUY
        if self == SignalAction.SELL:
            return OrderAction.SELL
        raise ValueError(f"Cannot convert {self} to OrderAction")

    @property
    def is_exit(self) -> bool:
        return self in (SignalAction.FLAT, SignalAction.CLOSE)


SYMBOL_MAP: dict[str, str] = {}


def set_symbol_map(mapping: dict[str, str]) -> None:
    global SYMBOL_MAP
    SYMBOL_MAP = mapping


def resolve_symbol(symbol: str) -> str:
    return SYMBOL_MAP.get(symbol, symbol)


class Signal(BaseModel):
    secret: str | None = None
    action: SignalAction
    symbol: str
    qty: int = 1
    order_type: str = "market"
    price: float | None = None
    stop_price: float | None = None
    tp: float | None = None
    sl: float | None = None

    @field_validator("action", mode="before")
    @classmethod
    def normalize_action(cls, v: str) -> str:
        if isinstance(v, str):
            return v.lower()
        return v

    @field_validator("order_type", mode="before")
    @classmethod
    def normalize_order_type(cls, v: str) -> str:
        if isinstance(v, str):
            return v.lower()
        return v

    def resolved_symbol(self) -> str:
        return resolve_symbol(self.symbol)

    def to_tradovate_order_type(self) -> OrderType:
        mapping = {
            "market": OrderType.MARKET,
            "limit": OrderType.LIMIT,
            "stop": OrderType.STOP,
            "stoplimit": OrderType.STOP_LIMIT,
            "mit": OrderType.MIT,
            "trailingstop": OrderType.TRAILING_STOP,
        }
        return mapping.get(self.order_type, OrderType.MARKET)
