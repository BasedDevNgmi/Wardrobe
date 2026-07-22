import asyncio
import logging
from datetime import datetime, timezone

import httpx

from config import AccountConfig
from tradovate.exceptions import (
    AccountError,
    AuthenticationError,
    OrderError,
    RateLimitError,
    TradovateError,
)
from tradovate.models import (
    AuthResponse,
    OrderResponse,
    PlaceOrderRequest,
    TradovateAccount,
)

logger = logging.getLogger(__name__)

MAX_RETRIES = 3
BACKOFF_BASE = 1.0
REQUEST_TIMEOUT = 10.0


class TradovateClient:
    def __init__(self, account_config: AccountConfig, cid: str, sec: str, device_id: str):
        self.config = account_config
        self.cid = cid
        self.sec = sec
        self.device_id = device_id

        self._http = httpx.AsyncClient(timeout=REQUEST_TIMEOUT)
        self._access_token: str | None = None
        self._expiration_time: datetime | None = None
        self._user_id: int | None = None
        self._accounts: list[TradovateAccount] = []

    @property
    def is_authenticated(self) -> bool:
        if self._access_token is None or self._expiration_time is None:
            return False
        return datetime.now(timezone.utc) < self._expiration_time

    @property
    def seconds_until_expiry(self) -> float:
        if self._expiration_time is None:
            return 0.0
        delta = self._expiration_time - datetime.now(timezone.utc)
        return max(0.0, delta.total_seconds())

    @property
    def needs_renewal(self) -> bool:
        return self.seconds_until_expiry < 300  # 5 minutes

    @property
    def accounts(self) -> list[TradovateAccount]:
        return self._accounts

    def _headers(self) -> dict[str, str]:
        headers = {"Content-Type": "application/json"}
        if self._access_token:
            headers["Authorization"] = f"Bearer {self._access_token}"
        return headers

    async def _request(self, method: str, path: str, **kwargs) -> httpx.Response:
        url = f"{self.config.base_url}{path}"
        for attempt in range(MAX_RETRIES + 1):
            try:
                resp = await self._http.request(method, url, headers=self._headers(), **kwargs)
            except httpx.TimeoutException:
                if attempt < MAX_RETRIES:
                    await asyncio.sleep(BACKOFF_BASE * (2 ** attempt))
                    continue
                raise TradovateError("Request timed out", status_code=None)

            if resp.status_code == 429:
                if attempt < MAX_RETRIES:
                    wait = BACKOFF_BASE * (2 ** attempt)
                    logger.warning("Rate limited on %s, retrying in %.1fs", path, wait)
                    await asyncio.sleep(wait)
                    continue
                raise RateLimitError(status_code=429, response_body=resp.text)

            return resp

        raise TradovateError("Max retries exceeded")

    async def authenticate(self) -> AuthResponse:
        body = {
            "name": self.config.username,
            "password": self.config.password,
            "appId": "MXTradeCopier",
            "appVersion": "1.0.0",
            "cid": self.cid,
            "sec": self.sec,
            "deviceId": self.device_id,
        }
        resp = await self._request("POST", "/auth/accesstokenrequest", json=body)
        if resp.status_code != 200:
            raise AuthenticationError(
                f"Auth failed for {self.config.name}: {resp.text}",
                status_code=resp.status_code,
                response_body=resp.text,
            )

        data = resp.json()
        if "errorText" in data:
            raise AuthenticationError(
                f"Auth failed for {self.config.name}: {data['errorText']}",
                response_body=resp.text,
            )

        self._access_token = data["accessToken"]
        exp_str = data["expirationTime"]
        if exp_str.endswith("Z"):
            exp_str = exp_str[:-1] + "+00:00"
        self._expiration_time = datetime.fromisoformat(exp_str)
        if self._expiration_time.tzinfo is None:
            self._expiration_time = self._expiration_time.replace(tzinfo=timezone.utc)
        self._user_id = data.get("userId")

        auth_resp = AuthResponse(
            accessToken=self._access_token,
            expirationTime=self._expiration_time,
            userId=self._user_id or 0,
            mdAccessToken=data.get("mdAccessToken"),
        )
        logger.info("Authenticated %s (expires in %.0fs)", self.config.name, self.seconds_until_expiry)
        return auth_resp

    async def renew_token(self) -> None:
        if not self._access_token:
            await self.authenticate()
            return

        resp = await self._request("POST", "/auth/renewaccesstoken")
        if resp.status_code != 200:
            logger.warning("Token renewal failed for %s, re-authenticating", self.config.name)
            await self.authenticate()
            return

        data = resp.json()
        if "errorText" in data:
            logger.warning("Token renewal error for %s: %s, re-authenticating", self.config.name, data["errorText"])
            await self.authenticate()
            return

        self._access_token = data["accessToken"]
        exp_str = data["expirationTime"]
        if exp_str.endswith("Z"):
            exp_str = exp_str[:-1] + "+00:00"
        self._expiration_time = datetime.fromisoformat(exp_str)
        if self._expiration_time.tzinfo is None:
            self._expiration_time = self._expiration_time.replace(tzinfo=timezone.utc)
        logger.info("Renewed token for %s (expires in %.0fs)", self.config.name, self.seconds_until_expiry)

    async def get_accounts(self) -> list[TradovateAccount]:
        resp = await self._request("GET", "/account/list")
        if resp.status_code != 200:
            raise AccountError(
                f"Failed to list accounts for {self.config.name}",
                status_code=resp.status_code,
                response_body=resp.text,
            )

        data = resp.json()
        self._accounts = [TradovateAccount(id=a["id"], name=a["name"]) for a in data]
        logger.info("Found %d accounts for %s: %s", len(self._accounts), self.config.name, [a.name for a in self._accounts])
        return self._accounts

    async def place_order(self, request: PlaceOrderRequest) -> OrderResponse:
        resp = await self._request("POST", "/order/placeOrder", json=request.to_api_dict())
        if resp.status_code != 200:
            raise OrderError(
                f"Order placement failed on {self.config.name}: {resp.text}",
                status_code=resp.status_code,
                response_body=resp.text,
            )

        data = resp.json()
        if "errorText" in data:
            raise OrderError(
                f"Order rejected on {self.config.name}: {data['errorText']}",
                response_body=resp.text,
            )

        return OrderResponse(
            orderId=data.get("orderId", data.get("id", 0)),
            accountId=data.get("accountId"),
            action=data.get("action"),
            symbol=data.get("contractId"),
            orderQty=data.get("orderQty"),
            orderType=data.get("orderType"),
            status=data.get("ordStatus"),
        )

    async def place_bracket_order(self, request_dict: dict) -> dict:
        resp = await self._request("POST", "/orderStrategy/startOrderStrategy", json=request_dict)
        if resp.status_code != 200:
            raise OrderError(
                f"Bracket order failed on {self.config.name}: {resp.text}",
                status_code=resp.status_code,
                response_body=resp.text,
            )
        data = resp.json()
        if "errorText" in data:
            raise OrderError(
                f"Bracket order rejected on {self.config.name}: {data['errorText']}",
                response_body=resp.text,
            )
        return data

    async def cancel_order(self, order_id: int) -> dict:
        resp = await self._request("POST", "/order/cancelOrder", json={"orderId": order_id})
        if resp.status_code != 200:
            raise OrderError(
                f"Cancel failed for order {order_id}: {resp.text}",
                status_code=resp.status_code,
                response_body=resp.text,
            )
        return resp.json()

    async def liquidate_position(self, account_id: int, symbol: str) -> dict:
        resp = await self._request(
            "POST",
            "/order/liquidatePosition",
            json={"accountId": account_id, "symbol": symbol},
        )
        if resp.status_code != 200:
            raise OrderError(
                f"Liquidation failed for {symbol} on account {account_id}: {resp.text}",
                status_code=resp.status_code,
                response_body=resp.text,
            )
        return resp.json()

    async def close(self) -> None:
        await self._http.aclose()
