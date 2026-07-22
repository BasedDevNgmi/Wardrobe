# MX Trade Copier

Self-hosted futures trade copier. TradingView webhook → fans out orders to multiple Tradovate accounts (Apex Trader Funding).

## Quick Start

```bash
# Clone and set up
cd mx-trade-copier
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Configure
cp .env.example .env
# Edit .env with your Tradovate credentials and webhook secret

# Run
python main.py
```

The server starts on `http://0.0.0.0:8000`.

## Configuration

All config is in `.env`. Key settings:

| Variable | Description |
|---|---|
| `WEBHOOK_SECRET` | Shared secret for authenticating TradingView webhooks |
| `TRADOVATE_CID` | Tradovate API client ID |
| `TRADOVATE_SEC` | Tradovate API client secret |
| `TRADOVATE_DEVICE_ID` | Unique UUID for this server instance |
| `TRADOVATE_ACCOUNTS` | JSON array of account configs (see `.env.example`) |
| `SYMBOL_MAP` | Map generic symbols to front-month contracts (e.g., `MES` → `MESU5`) |

Each account in `TRADOVATE_ACCOUNTS` has:
- `name` — friendly label
- `username` / `password` — Tradovate login
- `env` — `"demo"` or `"live"`
- `enabled` — toggle without restart
- `qty_multiplier` — scale position size (leader does 2, follower does 1 with multiplier 0.5)

## TradingView Alert Setup

1. Create a Pine Script strategy or indicator with alerts
2. Set the alert notification to **Webhook URL**: `https://your-server:8000/webhook`
3. Set the alert message body:

```json
{
    "secret": "your-webhook-secret",
    "action": "{{strategy.order.action}}",
    "symbol": "MES",
    "qty": {{strategy.order.contracts}},
    "order_type": "market"
}
```

### Supported Actions

| Action | Effect |
|---|---|
| `buy` | Place buy order on all enabled accounts |
| `sell` | Place sell order on all enabled accounts |
| `flat` | Liquidate position on all enabled accounts |
| `close` | Same as `flat` |

### Bracket Orders (TP/SL)

Include `tp` and `sl` fields in ticks:

```json
{
    "secret": "your-webhook-secret",
    "action": "buy",
    "symbol": "MES",
    "qty": 1,
    "order_type": "market",
    "tp": 10,
    "sl": -5
}
```

## API Endpoints

| Method | Path | Description |
|---|---|---|
| `POST` | `/webhook` | Receive TradingView signals |
| `GET` | `/health` | Account status and readiness |

## Architecture

```
TradingView Alert (webhook POST)
        │
        ▼
  FastAPI Server (uvicorn)
        │
        ├── Webhook Receiver (validates secret, parses signal)
        ├── Account Manager (auth tokens for N accounts, auto-renewal)
        ├── Order Router (fans out to all enabled followers, async)
        └── SQLite Logger (every signal and order logged)
```

Single Python process. All async. Token auto-renewal runs in background.

## Deployment

### Systemd

```bash
sudo cp mx-trade-copier.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable mx-trade-copier
sudo systemctl start mx-trade-copier
```

### HTTPS

TradingView requires HTTPS for webhooks. Options:
- **Caddy** reverse proxy (auto TLS)
- **nginx** + Let's Encrypt
- **Cloudflare Tunnel** (zero-config HTTPS)

## Testing

```bash
pytest
```

## Symbol Map

Update `SYMBOL_MAP` in `.env` when contracts roll. Futures use full contract codes:

| Generic | Example Contract |
|---|---|
| `MES` | `MESU5` (Sep 2025) |
| `MNQ` | `MNQU5` |
| `ES` | `ESU5` |
| `NQ` | `NQU5` |

Contract months: F(Jan) G(Feb) H(Mar) J(Apr) K(May) M(Jun) N(Jul) Q(Aug) U(Sep) V(Oct) X(Nov) Z(Dec)
