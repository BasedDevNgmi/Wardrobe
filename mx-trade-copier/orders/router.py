import asyncio
import json
import logging
import math

from accounts.manager import AccountManager
from db import queries
from models.signal import Signal
from tradovate.exceptions import TradovateError
from tradovate.models import (
    BracketOrderRequest,
    BracketParams,
    OrderAction,
    PlaceOrderRequest,
)

logger = logging.getLogger(__name__)

STAGGER_MS = 25


class OrderResult:
    def __init__(self, account_name: str, success: bool, order_id: int | None = None, error: str | None = None):
        self.account_name = account_name
        self.success = success
        self.order_id = order_id
        self.error = error

    def to_dict(self) -> dict:
        return {
            "account": self.account_name,
            "success": self.success,
            "order_id": self.order_id,
            "error": self.error,
        }


class OrderRouter:
    def __init__(self, account_manager: AccountManager):
        self.account_manager = account_manager

    async def route_signal(self, signal: Signal, raw_payload: str) -> list[OrderResult]:
        signal_id = await queries.insert_signal(
            raw_payload=raw_payload,
            action=signal.action.value,
            symbol=signal.symbol,
            qty=signal.qty,
            order_type=signal.order_type,
            price=signal.price,
            stop_price=signal.stop_price,
            tp=signal.tp,
            sl=signal.sl,
        )

        ready = self.account_manager.get_ready_accounts()
        if not ready:
            logger.warning("No ready accounts to route signal %d", signal_id)
            return []

        resolved_symbol = signal.resolved_symbol()
        logger.info(
            "Routing signal %d: %s %s x%d to %d accounts",
            signal_id, signal.action.value, resolved_symbol, signal.qty, len(ready),
        )

        tasks = []
        for i, (name, client) in enumerate(ready):
            delay = i * (STAGGER_MS / 1000.0)
            acct_cfg = next(
                (a for a in self.account_manager.settings.tradovate_accounts if a.name == name),
                None,
            )
            qty_multiplier = acct_cfg.qty_multiplier if acct_cfg else 1.0
            tasks.append(
                self._execute_on_account(
                    signal=signal,
                    signal_id=signal_id,
                    account_name=name,
                    client=client,
                    resolved_symbol=resolved_symbol,
                    qty_multiplier=qty_multiplier,
                    delay=delay,
                )
            )

        results = await asyncio.gather(*tasks, return_exceptions=True)

        order_results = []
        for r in results:
            if isinstance(r, Exception):
                logger.error("Unexpected error during order routing: %s", r)
                order_results.append(OrderResult(account_name="unknown", success=False, error=str(r)))
            else:
                order_results.append(r)

        succeeded = sum(1 for r in order_results if r.success)
        failed = sum(1 for r in order_results if not r.success)
        logger.info("Signal %d routed: %d succeeded, %d failed", signal_id, succeeded, failed)

        return order_results

    async def _execute_on_account(
        self,
        signal: Signal,
        signal_id: int,
        account_name: str,
        client,
        resolved_symbol: str,
        qty_multiplier: float,
        delay: float,
    ) -> OrderResult:
        if delay > 0:
            await asyncio.sleep(delay)

        if not client.accounts:
            error = f"No Tradovate accounts found for {account_name}"
            logger.error(error)
            await queries.insert_order(
                signal_id=signal_id,
                account_name=account_name,
                action=signal.action.value,
                symbol=resolved_symbol,
                qty=signal.qty,
                order_type=signal.order_type,
                status="error",
                error=error,
            )
            return OrderResult(account_name=account_name, success=False, error=error)

        tv_account = client.accounts[0]
        scaled_qty = max(1, math.floor(signal.qty * qty_multiplier))

        try:
            if signal.action.is_exit:
                return await self._liquidate(
                    signal_id, account_name, client, tv_account, resolved_symbol, signal,
                )

            if signal.tp is not None or signal.sl is not None:
                return await self._bracket_order(
                    signal_id, account_name, client, tv_account, resolved_symbol, signal, scaled_qty,
                )

            return await self._market_order(
                signal_id, account_name, client, tv_account, resolved_symbol, signal, scaled_qty,
            )

        except TradovateError as e:
            logger.error("Order failed on %s: %s", account_name, e)
            await queries.insert_order(
                signal_id=signal_id,
                account_name=account_name,
                action=signal.action.value,
                symbol=resolved_symbol,
                qty=scaled_qty,
                order_type=signal.order_type,
                status="error",
                error=str(e),
            )
            return OrderResult(account_name=account_name, success=False, error=str(e))

    async def _market_order(self, signal_id, account_name, client, tv_account, symbol, signal, qty) -> OrderResult:
        request = PlaceOrderRequest(
            account_spec=tv_account.name,
            account_id=tv_account.id,
            action=signal.action.to_order_action(),
            symbol=symbol,
            order_qty=qty,
            order_type=signal.to_tradovate_order_type(),
            price=signal.price,
            stop_price=signal.stop_price,
        )
        resp = await client.place_order(request)

        db_id = await queries.insert_order(
            signal_id=signal_id,
            account_name=account_name,
            tradovate_order_id=resp.order_id,
            action=signal.action.value,
            symbol=symbol,
            qty=qty,
            order_type=signal.order_type,
            status="placed",
        )
        logger.info("Order placed on %s: order_id=%d", account_name, resp.order_id)
        return OrderResult(account_name=account_name, success=True, order_id=resp.order_id)

    async def _bracket_order(self, signal_id, account_name, client, tv_account, symbol, signal, qty) -> OrderResult:
        bracket = {
            "qty": qty,
            "profitTarget": signal.tp,
            "stopLoss": signal.sl if signal.sl and signal.sl > 0 else -(signal.sl or 0),
            "trailingStop": False,
        }
        params = BracketParams(
            entry_version={
                "orderQty": qty,
                "orderType": signal.to_tradovate_order_type().value,
                "timeInForce": "Day",
            },
            brackets=[bracket],
        )
        request = BracketOrderRequest(
            account_spec=tv_account.name,
            account_id=tv_account.id,
            action=signal.action.to_order_action(),
            symbol=symbol,
            params=params,
        )
        resp = await client.place_bracket_order(request.to_api_dict())
        order_id = resp.get("orderId", resp.get("id", 0))

        await queries.insert_order(
            signal_id=signal_id,
            account_name=account_name,
            tradovate_order_id=order_id,
            action=signal.action.value,
            symbol=symbol,
            qty=qty,
            order_type="bracket",
            status="placed",
        )
        logger.info("Bracket order placed on %s: order_id=%s", account_name, order_id)
        return OrderResult(account_name=account_name, success=True, order_id=order_id)

    async def _liquidate(self, signal_id, account_name, client, tv_account, symbol, signal) -> OrderResult:
        resp = await client.liquidate_position(tv_account.id, symbol)

        await queries.insert_order(
            signal_id=signal_id,
            account_name=account_name,
            action=signal.action.value,
            symbol=symbol,
            qty=0,
            order_type="liquidate",
            status="placed",
        )
        logger.info("Liquidated %s on %s", symbol, account_name)
        return OrderResult(account_name=account_name, success=True)
