# MX Trade Copier — Multi-Broker Abstraction + Rithmic Integration

## What this is

A refactor spec that decouples the MX Trade Copier from Tradovate and introduces a broker abstraction layer, then adds Rithmic as the second broker backend. This enables the copier to serve ~90% of prop firm customers (Tradovate-backed firms like Apex + Rithmic-backed firms like TopStep, TakeProfitTrader, Bulenox, MyFundedFutures, Tradeify, Earn2Trade).

## Current State (What Exists)

Phase 1 is complete — a working Tradovate-only copier with:
- FastAPI webhook receiver (`api/webhook.py`)
- `TradovateClient` with auth, token renewal, order placement (`tradovate/client.py`)
- `AccountManager` managing N TradovateClient instances (`accounts/manager.py`)
- `OrderRouter` with async fan-out (`orders/router.py`)
- Signal model with symbol mapping (`models/signal.py`)
- SQLite logging (`db/`)
- 35 passing tests

## The Problem

The codebase is tightly coupled to Tradovate. Every layer imports Tradovate-specific types:

**orders/router.py** — imports `PlaceOrderRequest`, `BracketOrderRequest`, `BracketParams`, `OrderAction` from `tradovate.models`. Constructs Tradovate-specific request objects (`account_spec`, `account_id`). Calls `client.place_order()`, `client.place_bracket_order()`, `client.liquidate_position()` with Tradovate signatures.

**models/signal.py** — imports `OrderAction`, `OrderType` from `tradovate.models`. Has `to_tradovate_order_type()` method.

**accounts/manager.py** — imports and constructs `TradovateClient` directly. References `settings.tradovate_cid`, `settings.tradovate_sec`, `settings.tradovate_device_id`.

**config.py** — `AccountConfig.base_url` and `ws_url` hardcode Tradovate URLs. Settings has `tradovate_cid`, `tradovate_sec`, `tradovate_device_id` fields.

**db/database.py** — orders table has `tradovate_order_id` column.

## Architecture After Refactor

```
TradingView Alert (webhook POST)
        │
        ▼
  FastAPI Server
        │
        ├── Webhook Receiver (unchanged)
        ├── Signal Model (broker-agnostic enums)
        │
        ├── Order Router (uses BrokerClient protocol, not Tradovate directly)
        │         │
        │    ┌────┴────────────────┐
        │    │                     │
        │    ▼                     ▼
        │  TradovateClient     RithmicClient
        │  (tradovate/)        (rithmic/)
        │                         │
        ├── Account Manager (creates correct client type per account config)
        │
        └── Broker Protocol (abstract interface both clients implement)
              brokers/base.py → BrokerClient ABC
```

## Broker Abstraction Layer

### The Protocol — `brokers/base.py`

This is the core of the refactor. Define an abstract base class that both Tradovate and Rithmic clients implement. The order router and account manager only interact through this interface.

```python
from abc import ABC, abstractmethod
from dataclasses import dataclass
from enum import Enum

class OrderSide(str, Enum):
    BUY = "buy"
    SELL = "sell"

class OrderType(str, Enum):
    MARKET = "market"
    LIMIT = "limit"
    STOP = "stop"
    STOP_LIMIT = "stop_limit"

@dataclass
class BrokerAccount:
    """A trading account within a broker connection."""
    account_id: str          # broker's internal ID (str to be universal)
    account_name: str        # human-readable name (e.g., "APEX-12345")
    broker: str              # "tradovate" or "rithmic"

@dataclass
class OrderRequest:
    """Broker-agnostic order request."""
    account: BrokerAccount
    side: OrderSide
    symbol: str              # resolved contract symbol (e.g., "MESU5")
    qty: int
    order_type: OrderType = OrderType.MARKET
    price: float | None = None
    stop_price: float | None = None
    tp_ticks: float | None = None       # take profit in ticks
    sl_ticks: float | None = None       # stop loss in ticks
    is_bracket: bool = False

@dataclass
class OrderResult:
    """Broker-agnostic order result."""
    broker_order_id: str     # broker's order ID (str to be universal)
    account_name: str
    success: bool
    status: str | None = None
    error: str | None = None

class BrokerClient(ABC):
    """Abstract interface that all broker backends implement."""

    @property
    @abstractmethod
    def broker_name(self) -> str:
        """Return broker identifier: 'tradovate', 'rithmic', etc."""

    @property
    @abstractmethod
    def is_connected(self) -> bool:
        """True if authenticated and ready to place orders."""

    @property
    @abstractmethod
    def needs_renewal(self) -> bool:
        """True if auth credentials need renewal soon."""

    @property
    @abstractmethod
    def accounts(self) -> list[BrokerAccount]:
        """List of trading accounts available through this connection."""

    @abstractmethod
    async def connect(self) -> None:
        """Authenticate and discover accounts. Called once on startup."""

    @abstractmethod
    async def disconnect(self) -> None:
        """Graceful shutdown — close connections, release resources."""

    @abstractmethod
    async def renew(self) -> None:
        """Renew auth tokens/sessions if applicable. No-op if broker doesn't need it."""

    @abstractmethod
    async def place_order(self, request: OrderRequest) -> OrderResult:
        """Place a single order. Handles market, limit, stop, and bracket orders.
        The implementation translates OrderRequest into broker-specific API calls."""

    @abstractmethod
    async def cancel_order(self, account: BrokerAccount, broker_order_id: str) -> OrderResult:
        """Cancel a pending order by its broker-assigned ID."""

    @abstractmethod
    async def flatten(self, account: BrokerAccount, symbol: str) -> OrderResult:
        """Close all positions for a symbol on an account."""

    @abstractmethod
    async def get_positions(self, account: BrokerAccount) -> list[dict]:
        """Return current positions for an account. Used for sync/reconciliation."""

    @abstractmethod
    def health(self) -> dict:
        """Return health/status info for monitoring."""
```

### Key Design Decisions

1. **`account_id` and `broker_order_id` are strings** — Tradovate uses ints, Rithmic uses strings. String is the universal type.

2. **`OrderRequest` is flat, not nested** — no broker-specific sub-objects. Bracket orders are signaled by `is_bracket=True` + `tp_ticks`/`sl_ticks`. Each broker implementation translates this into its own bracket/OCO/strategy format.

3. **`BrokerAccount` carries broker identity** — so the order router knows which broker placed each order without tracking it separately.

4. **`connect()` replaces `authenticate()` + `get_accounts()`** — Rithmic's connection involves WebSocket setup + login + account discovery in one flow. Tradovate's is REST auth + account list GET. `connect()` abstracts both.

5. **`renew()` is a no-op for Rithmic** — Rithmic sessions are maintained via WebSocket heartbeat, not token renewal. Tradovate needs periodic token renewal.

---

## Refactor Plan — File by File

### Step 1: Create the abstraction layer

**New file: `brokers/__init__.py`** — empty

**New file: `brokers/base.py`** — the `BrokerClient` ABC, `BrokerAccount`, `OrderRequest`, `OrderResult`, `OrderSide`, `OrderType` as defined above.

### Step 2: Move broker-agnostic enums out of tradovate/

**Modify: `models/signal.py`**
- Remove imports from `tradovate.models` (`OrderAction`, `OrderType`)
- Import `OrderSide`, `OrderType` from `brokers.base` instead
- Rename `to_order_action()` → return `OrderSide.BUY` / `OrderSide.SELL`
- Rename `to_tradovate_order_type()` → `to_order_type()`, return `brokers.base.OrderType`
- `SignalAction.to_order_side()` replaces `to_order_action()`

### Step 3: Refactor config.py

**Modify: `config.py`**

Replace the single `AccountConfig` with a broker-aware config:

```python
class AccountConfig(BaseModel):
    name: str
    broker: str = "tradovate"     # "tradovate" or "rithmic"
    username: str
    password: str
    env: str = "demo"             # "demo" or "live"
    enabled: bool = True
    qty_multiplier: float = 1.0

    # Tradovate-specific (ignored by Rithmic)
    cid: str | None = None        # can override global
    sec: str | None = None        # can override global

    # Rithmic-specific (ignored by Tradovate)
    system_name: str | None = None    # e.g., "Rithmic Paper Trading", "Rithmic 01"
    gateway: str | None = None        # e.g., "rituz00100.rithmic.com:443"
    fcm_id: str | None = None         # Futures Commission Merchant ID
    ib_id: str | None = None          # Introducing Broker ID
```

Move `base_url` / `ws_url` properties into the Tradovate client, not the config. Config just stores credentials and broker type.

Update `Settings`:
```python
class Settings(BaseSettings):
    webhook_secret: str = "change-me"
    host: str = "0.0.0.0"
    port: int = 8000

    # Global Tradovate API key (accounts can override)
    tradovate_cid: str = ""
    tradovate_sec: str = ""
    tradovate_device_id: str = ""

    # Global Rithmic settings
    rithmic_app_name: str = "MXTradeCopier"
    rithmic_app_version: str = "1.0.0"
    rithmic_cert_path: str = ""           # path to rithmic_ssl_cert_auth_params

    # All accounts (mixed brokers)
    accounts: list[AccountConfig] = []    # renamed from tradovate_accounts
    symbol_map: dict[str, str] = {}

    default_max_daily_loss: float = 500.0
    default_max_position_size: int = 5
    db_path: str = "mx_trade_copier.db"

    # Keep tradovate_accounts as alias for backwards compatibility
    @field_validator("accounts", mode="before")
    @classmethod
    def parse_accounts(cls, v):
        if isinstance(v, str):
            return json.loads(v)
        return v
```

### Step 4: Refactor TradovateClient to implement BrokerClient

**Modify: `tradovate/client.py`**

Make `TradovateClient` implement `BrokerClient`:

```python
from brokers.base import BrokerClient, BrokerAccount, OrderRequest, OrderResult, OrderSide, OrderType

class TradovateClient(BrokerClient):
    @property
    def broker_name(self) -> str:
        return "tradovate"

    @property
    def is_connected(self) -> bool:
        return self._access_token is not None and not self._is_expired()

    @property
    def accounts(self) -> list[BrokerAccount]:
        return [BrokerAccount(account_id=str(a.id), account_name=a.name, broker="tradovate") for a in self._tv_accounts]

    async def connect(self) -> None:
        await self._authenticate()
        await self._get_accounts()

    async def disconnect(self) -> None:
        await self._http.aclose()

    async def renew(self) -> None:
        # existing renewal logic

    async def place_order(self, request: OrderRequest) -> OrderResult:
        # translate OrderRequest → Tradovate PlaceOrderRequest or BracketOrderRequest
        # call internal _place_order / _place_bracket_order
        # return OrderResult

    async def cancel_order(self, account: BrokerAccount, broker_order_id: str) -> OrderResult:
        # call /order/cancelOrder with int(broker_order_id)

    async def flatten(self, account: BrokerAccount, symbol: str) -> OrderResult:
        # call /order/liquidatePosition
```

Keep all Tradovate-specific internals (`_authenticate()`, `_renew_token()`, `PlaceOrderRequest`, etc.) as private methods inside the class. The Tradovate models in `tradovate/models.py` become internal implementation details — nothing outside `tradovate/` should import them.

### Step 5: Build RithmicClient implementing BrokerClient

**New file: `rithmic/__init__.py`** — empty

**New file: `rithmic/client.py`**

Uses the `async_rithmic` package (`pip install async_rithmic`). This is the most mature Python Rithmic library with asyncio support, auto-reconnection, multi-account, and documented order API.

```python
from brokers.base import BrokerClient, BrokerAccount, OrderRequest, OrderResult

class RithmicClient(BrokerClient):
    """Rithmic R | Protocol API client via async_rithmic."""

    def __init__(self, account_config, rithmic_app_name, rithmic_app_version, rithmic_cert_path):
        self.config = account_config
        self._app_name = rithmic_app_name
        self._app_version = rithmic_app_version
        self._cert_path = rithmic_cert_path
        self._client = None  # async_rithmic.RithmicClient instance
        self._accounts: list[BrokerAccount] = []
        self._connected = False

    @property
    def broker_name(self) -> str:
        return "rithmic"

    @property
    def is_connected(self) -> bool:
        return self._connected and self._client is not None

    @property
    def needs_renewal(self) -> bool:
        return False  # Rithmic uses persistent WebSocket, no token renewal

    @property
    def accounts(self) -> list[BrokerAccount]:
        return self._accounts

    async def connect(self) -> None:
        """
        1. Create async_rithmic.RithmicClient with credentials
        2. Connect to ORDER_PLANT and PNL_PLANT (two WebSocket connections)
        3. Login on both plants
        4. Discover accounts via account list request
        5. Start heartbeat tasks
        """

    async def disconnect(self) -> None:
        """Logout and close all WebSocket connections."""

    async def renew(self) -> None:
        pass  # no-op — WebSocket heartbeats maintain the session

    async def place_order(self, request: OrderRequest) -> OrderResult:
        """
        Translate OrderRequest to async_rithmic order call.

        For market orders:
            client.submit_order(order_id, symbol, exchange, qty, OrderType.MARKET, TransactionType.BUY/SELL)

        For limit orders:
            client.submit_order(..., OrderType.LIMIT, price=request.price)

        For bracket orders (request.is_bracket == True):
            client.submit_bracket_order(
                order_id, symbol, exchange, qty, OrderType.MARKET, TransactionType.BUY/SELL,
                profit_offset=request.tp_ticks, stop_offset=request.sl_ticks
            )

        Map request.side → TransactionType.BUY / TransactionType.SELL
        Map request.order_type → async_rithmic OrderType
        """

    async def cancel_order(self, account: BrokerAccount, broker_order_id: str) -> OrderResult:
        """Cancel via async_rithmic cancel_order."""

    async def flatten(self, account: BrokerAccount, symbol: str) -> OrderResult:
        """
        Rithmic has no single flatten endpoint.
        Query current position via PNL_PLANT, then submit an opposing market order
        for the full qty to close the position.
        """

    async def get_positions(self, account: BrokerAccount) -> list[dict]:
        """Request PnL position snapshot from PNL_PLANT."""

    def health(self) -> dict:
        return {
            "broker": "rithmic",
            "connected": self._connected,
            "system_name": self.config.system_name,
            "accounts": [{"id": a.account_id, "name": a.account_name} for a in self._accounts],
        }
```

### Step 6: Refactor AccountManager to be broker-agnostic

**Modify: `accounts/manager.py`**

```python
from brokers.base import BrokerClient

class AccountManager:
    def __init__(self, settings: Settings):
        self.settings = settings
        self._clients: dict[str, BrokerClient] = {}     # was dict[str, TradovateClient]
        self._healthy: dict[str, bool] = {}

    async def authenticate_all(self) -> None:
        for acct_cfg in self.settings.accounts:          # was settings.tradovate_accounts
            if not acct_cfg.enabled:
                continue
            client = self._create_client(acct_cfg)       # factory method
            try:
                await client.connect()                    # was authenticate() + get_accounts()
                self._clients[acct_cfg.name] = client
                self._healthy[acct_cfg.name] = True
            except Exception as e:
                logger.error("Failed to connect %s (%s): %s", acct_cfg.name, acct_cfg.broker, e)
                self._healthy[acct_cfg.name] = False

    def _create_client(self, acct_cfg: AccountConfig) -> BrokerClient:
        if acct_cfg.broker == "tradovate":
            from tradovate.client import TradovateClient
            return TradovateClient(
                account_config=acct_cfg,
                cid=acct_cfg.cid or self.settings.tradovate_cid,
                sec=acct_cfg.sec or self.settings.tradovate_sec,
                device_id=self.settings.tradovate_device_id,
            )
        elif acct_cfg.broker == "rithmic":
            from rithmic.client import RithmicClient
            return RithmicClient(
                account_config=acct_cfg,
                rithmic_app_name=self.settings.rithmic_app_name,
                rithmic_app_version=self.settings.rithmic_app_version,
                rithmic_cert_path=self.settings.rithmic_cert_path,
            )
        else:
            raise ValueError(f"Unknown broker: {acct_cfg.broker}")

    async def _renewal_loop(self) -> None:
        """Only renews clients that need it (Tradovate yes, Rithmic no)."""
        while True:
            await asyncio.sleep(30)
            for name, client in self._clients.items():
                if not self._healthy.get(name):
                    continue
                if client.needs_renewal:
                    await client.renew()
```

### Step 7: Refactor OrderRouter to use BrokerClient interface

**Modify: `orders/router.py`**

Remove ALL imports from `tradovate.*`. Use only `brokers.base` types.

```python
from brokers.base import BrokerClient, OrderRequest, OrderResult, OrderSide

class OrderRouter:
    async def _execute_on_account(self, signal, signal_id, account_name, client: BrokerClient, ...):
        broker_account = client.accounts[0]
        scaled_qty = max(1, math.floor(signal.qty * qty_multiplier))

        if signal.action.is_exit:
            result = await client.flatten(broker_account, resolved_symbol)
            # log and return

        order = OrderRequest(
            account=broker_account,
            side=signal.action.to_order_side(),        # was to_order_action()
            symbol=resolved_symbol,
            qty=scaled_qty,
            order_type=signal.to_order_type(),          # was to_tradovate_order_type()
            price=signal.price,
            stop_price=signal.stop_price,
            tp_ticks=signal.tp,
            sl_ticks=signal.sl,
            is_bracket=signal.tp is not None or signal.sl is not None,
        )
        result = await client.place_order(order)
        # log and return
```

The router no longer knows or cares whether it's talking to Tradovate or Rithmic. It builds an `OrderRequest`, calls `client.place_order()`, and gets an `OrderResult`.

### Step 8: Update database schema

**Modify: `db/database.py`**

```sql
-- Rename tradovate_order_id → broker_order_id (TEXT not INTEGER)
-- Add broker column
CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    signal_id INTEGER NOT NULL REFERENCES signals(id),
    account_name TEXT NOT NULL,
    broker TEXT NOT NULL DEFAULT 'tradovate',
    broker_order_id TEXT,          -- was tradovate_order_id INTEGER
    action TEXT NOT NULL,
    symbol TEXT NOT NULL,
    qty INTEGER NOT NULL,
    order_type TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    placed_at TEXT NOT NULL DEFAULT (datetime('now')),
    filled_at TEXT,
    fill_price REAL,
    error TEXT
);
```

Update `db/queries.py` to match — rename `tradovate_order_id` params to `broker_order_id`, add `broker` param.

### Step 9: Update .env.example and config

**Modify: `.env.example`**

```env
# Accounts (JSON array — mixed brokers supported)
ACCOUNTS='[
  {"name": "apex-1", "broker": "tradovate", "username": "user1", "password": "pass1", "env": "demo", "enabled": true, "qty_multiplier": 1.0},
  {"name": "topstep-1", "broker": "rithmic", "username": "user2", "password": "pass2", "system_name": "Rithmic Paper Trading", "enabled": true, "qty_multiplier": 1.0}
]'

# Tradovate API Key (for Tradovate accounts)
TRADOVATE_CID=your-client-id
TRADOVATE_SEC=your-client-secret
TRADOVATE_DEVICE_ID=a-unique-uuid-for-this-server

# Rithmic settings (for Rithmic accounts)
RITHMIC_APP_NAME=MXTradeCopier
RITHMIC_APP_VERSION=1.0.0
RITHMIC_CERT_PATH=./rithmic_ssl_cert_auth_params
```

### Step 10: Update tests

All existing tests that reference Tradovate-specific types need updating:
- `test_client.py` — keep as Tradovate-specific unit tests (internal models)
- `test_router.py` — mock `BrokerClient` instead of `TradovateClient`
- `test_signal.py` — update enum references (`to_order_side()`, `to_order_type()`)
- `test_webhook.py` — should mostly work as-is (tests HTTP layer)

Add new tests:
- `test_broker_base.py` — verify OrderRequest/OrderResult construction
- `test_rithmic_client.py` — unit tests for RithmicClient (mocked async_rithmic)

---

## Rithmic Technical Reference

### R | Protocol API

Rithmic's API uses **Google Protocol Buffers over WebSocket (WSS)**. Each functional domain ("plant") requires its own dedicated WebSocket connection with separate login and heartbeat.

### Plants (Connection Types)

| Plant | Purpose | Needed for Copier? |
|---|---|---|
| ORDER_PLANT | Order placement, modification, cancellation, fill notifications | Yes |
| PNL_PLANT | Real-time P&L and position tracking | Yes |
| TICKER_PLANT | Live market data (ticks, quotes, L2) | No (optional for future price-aware features) |
| HISTORY_PLANT | Historical tick/bar data | No |

Each plant = 1 WebSocket connection per account. A copier with 10 Rithmic accounts needs 20 WebSocket connections minimum (ORDER + PNL per account).

### Environments

| System Name | Purpose |
|---|---|
| `Rithmic Test` | Free testing, limited functionality |
| `Rithmic Paper Trading` | Simulated trading with live CME data |
| `Rithmic 01` | Live production (retail brokers) |
| Prop firm names | Each firm has its own system name within Rithmic |

### Authentication Flow

1. Connect WebSocket to infrastructure server URL (per region)
2. Send `RequestLogin` protobuf message on each plant separately
3. Receive login response with account list
4. Maintain heartbeats (periodic `RequestHeartbeat` messages)

No token renewal — sessions are maintained by WebSocket heartbeat. Session dies if WebSocket drops; reconnect and re-login.

### Key Constraint: One Connection Per Login

Each Rithmic login (username) can only have one active session at a time. If your copier connects, it kicks off any other client (e.g., NinjaTrader) using the same login. Each prop firm account has its own login, so this is fine for the copier — but the user can't run NinjaTrader + copier on the same login simultaneously.

### Python Library: async_rithmic

Use `async_rithmic` (pip install async_rithmic). It is the most mature Python Rithmic implementation with:
- Asyncio-native
- Auto-reconnection with exponential backoff
- Multi-account support
- Market, limit, bracket orders
- Position/PnL streaming
- 100+ stars, actively maintained

```python
from async_rithmic import RithmicClient, OrderType, TransactionType

client = RithmicClient(
    user="username",
    password="password",
    system_name="Rithmic Paper Trading",
    app_name="MXTC",
    app_version="1.0",
)

await client.connect()
accounts = await client.list_accounts()

# Market order
await client.submit_order(
    order_id="unique-id",
    security_code="ESU5",
    exchange="CME",
    qty=1,
    order_type=OrderType.MARKET,
    transaction_type=TransactionType.BUY,
)

# Bracket order
await client.submit_bracket_order(
    order_id="unique-id",
    security_code="MESU5",
    exchange="CME",
    qty=1,
    order_type=OrderType.MARKET,
    transaction_type=TransactionType.BUY,
    profit_offset=10,
    stop_offset=5,
)
```

### Rithmic API Access Process

1. Apply at rithmic.com/api-request — provide company info and use case
2. Receive developer kit: .proto files, SSL cert, test credentials, docs
3. Build and test against Rithmic Test environment (free)
4. Move to Rithmic Paper Trading (live CME data)
5. Pass conformance testing — Rithmic reviews your app's behavior
6. Receive 4-character app prefix and production credentials
7. Costs: ~$100-125/month per User ID + $0.10 per contract filled

**Important: Apply for Rithmic API access immediately. Approval takes weeks. Build and test against the test environment while waiting for production access.**

### Symbol Format

Rithmic uses `security_code` + `exchange` separately:
- Symbol: `ESU5`, Exchange: `CME`
- Symbol: `MESU5`, Exchange: `CME`
- Symbol: `NQU5`, Exchange: `CME`

The symbol map needs to also store exchange:
```json
{"MES": {"symbol": "MESU5", "exchange": "CME"}, "NQ": {"symbol": "NQU5", "exchange": "CME"}}
```

Or keep it simple and default exchange to `CME` for all futures (which covers 99% of prop firm use cases).

### Flatten Implementation

Rithmic has no `/liquidatePosition` equivalent. To flatten:
1. Query current position via PNL_PLANT snapshot
2. If long 3 contracts → submit market SELL for 3
3. If short 2 contracts → submit market BUY for 2

---

## Updated Project Structure

```
mx-trade-copier/
├── main.py
├── config.py
├── requirements.txt
├── .env.example
│
├── brokers/                        # NEW — abstraction layer
│   ├── __init__.py
│   └── base.py                     # BrokerClient ABC, OrderRequest, OrderResult, enums
│
├── api/
│   ├── webhook.py
│   └── health.py
│
├── tradovate/                      # Existing — now implements BrokerClient
│   ├── client.py                   # TradovateClient(BrokerClient)
│   ├── models.py                   # Internal Tradovate API models (private to this module)
│   └── exceptions.py
│
├── rithmic/                        # NEW — Rithmic backend
│   ├── __init__.py
│   └── client.py                   # RithmicClient(BrokerClient) using async_rithmic
│
├── accounts/
│   └── manager.py                  # Refactored — broker-agnostic, factory pattern
│
├── orders/
│   └── router.py                   # Refactored — uses BrokerClient interface only
│
├── models/
│   └── signal.py                   # Refactored — broker-agnostic enums
│
├── db/
│   ├── database.py                 # Updated schema (broker_order_id, broker column)
│   └── queries.py
│
└── tests/
    ├── test_signal.py              # Updated for new enums
    ├── test_webhook.py
    ├── test_router.py              # Mocks BrokerClient
    ├── test_tradovate_client.py    # Tradovate-specific tests
    └── test_rithmic_client.py      # NEW — Rithmic-specific tests
```

## Requirements Changes

Add to `requirements.txt`:
```
async_rithmic>=1.6.0
```

## Build Order

1. Create `brokers/base.py` with the full ABC and data classes
2. Refactor `models/signal.py` — remove tradovate imports, use broker-agnostic enums
3. Refactor `config.py` — add broker field to AccountConfig, add Rithmic settings
4. Refactor `tradovate/client.py` — implement `BrokerClient`, keep internals private
5. Refactor `accounts/manager.py` — factory pattern, broker-agnostic
6. Refactor `orders/router.py` — use `BrokerClient` interface only
7. Update `db/` — rename column, add broker field
8. Update all tests — they should pass against the refactored code
9. Build `rithmic/client.py` — implement `BrokerClient` using async_rithmic
10. Add Rithmic tests
11. Update `.env.example`, README
12. Integration test: authenticate one Tradovate demo + one Rithmic test account, send a webhook, verify both receive orders

## Key Principle

After this refactor, adding a third broker (e.g., ProjectX for TopstepX) should require:
1. One new file: `projectx/client.py` implementing `BrokerClient`
2. One new `elif` in `AccountManager._create_client()`
3. Zero changes to the order router, webhook, signal model, or database

The abstraction pays for itself the moment you add broker #2.
