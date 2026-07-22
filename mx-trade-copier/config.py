import json

from pydantic import BaseModel, field_validator
from pydantic_settings import BaseSettings


class AccountConfig(BaseModel):
    name: str
    username: str
    password: str
    env: str = "demo"
    enabled: bool = True
    qty_multiplier: float = 1.0

    @property
    def base_url(self) -> str:
        if self.env == "live":
            return "https://live.tradovateapi.com/v1"
        return "https://demo.tradovateapi.com/v1"

    @property
    def ws_url(self) -> str:
        if self.env == "live":
            return "wss://live.tradovateapi.com/v1/websocket"
        return "wss://demo.tradovateapi.com/v1/websocket"


class Settings(BaseSettings):
    webhook_secret: str = "change-me"
    host: str = "0.0.0.0"
    port: int = 8000

    tradovate_cid: str = ""
    tradovate_sec: str = ""
    tradovate_device_id: str = ""

    tradovate_accounts: list[AccountConfig] = []
    symbol_map: dict[str, str] = {}

    default_max_daily_loss: float = 500.0
    default_max_position_size: int = 5

    discord_webhook_url: str = ""

    db_path: str = "mx_trade_copier.db"

    @field_validator("tradovate_accounts", mode="before")
    @classmethod
    def parse_accounts(cls, v):
        if isinstance(v, str):
            return json.loads(v)
        return v

    @field_validator("symbol_map", mode="before")
    @classmethod
    def parse_symbol_map(cls, v):
        if isinstance(v, str):
            return json.loads(v)
        return v

    model_config = {"env_file": ".env", "env_file_encoding": "utf-8"}
