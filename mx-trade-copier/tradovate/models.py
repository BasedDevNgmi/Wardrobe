from datetime import datetime
from enum import Enum

from pydantic import BaseModel, ConfigDict


class OrderAction(str, Enum):
    BUY = "Buy"
    SELL = "Sell"


class OrderType(str, Enum):
    MARKET = "Market"
    LIMIT = "Limit"
    STOP = "Stop"
    STOP_LIMIT = "StopLimit"
    MIT = "MIT"
    TRAILING_STOP = "TrailingStop"
    TRAILING_STOP_LIMIT = "TrailingStopLimit"


class TimeInForce(str, Enum):
    DAY = "Day"
    GTC = "GTC"
    IOC = "IOC"
    FOK = "FOK"


def _to_camel(s: str) -> str:
    parts = s.split("_")
    return parts[0] + "".join(w.capitalize() for w in parts[1:])


class AuthResponse(BaseModel):
    model_config = ConfigDict(alias_generator=_to_camel, populate_by_name=True)

    access_token: str
    expiration_time: datetime
    user_id: int
    md_access_token: str | None = None


class TradovateAccount(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    id: int
    name: str
    account_id: int | None = None


class PlaceOrderRequest(BaseModel):
    account_spec: str
    account_id: int
    action: OrderAction
    symbol: str
    order_qty: int
    order_type: OrderType = OrderType.MARKET
    price: float | None = None
    stop_price: float | None = None
    time_in_force: TimeInForce = TimeInForce.DAY
    is_automated: bool = True

    def to_api_dict(self) -> dict:
        d = {
            "accountSpec": self.account_spec,
            "accountId": self.account_id,
            "action": self.action.value,
            "symbol": self.symbol,
            "orderQty": self.order_qty,
            "orderType": self.order_type.value,
            "timeInForce": self.time_in_force.value,
            "isAutomated": self.is_automated,
        }
        if self.price is not None:
            d["price"] = self.price
        if self.stop_price is not None:
            d["stopPrice"] = self.stop_price
        return d


class OrderResponse(BaseModel):
    model_config = ConfigDict(alias_generator=_to_camel, populate_by_name=True)

    order_id: int
    account_id: int | None = None
    action: str | None = None
    symbol: str | None = None
    order_qty: int | None = None
    order_type: str | None = None
    status: str | None = None


class BracketParams(BaseModel):
    entry_version: dict
    brackets: list[dict]

    def to_json_string(self) -> str:
        import json
        return json.dumps({
            "entryVersion": self.entry_version,
            "brackets": self.brackets,
        })


class BracketOrderRequest(BaseModel):
    account_spec: str
    account_id: int
    action: OrderAction
    symbol: str
    order_strategy_type_id: int = 2
    params: BracketParams

    def to_api_dict(self) -> dict:
        return {
            "accountSpec": self.account_spec,
            "accountId": self.account_id,
            "action": self.action.value,
            "symbol": self.symbol,
            "orderStrategyTypeId": self.order_strategy_type_id,
            "params": self.params.to_json_string(),
        }
