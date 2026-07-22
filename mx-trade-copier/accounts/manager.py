import asyncio
import logging

from config import Settings
from tradovate.client import TradovateClient
from tradovate.exceptions import TradovateError

logger = logging.getLogger(__name__)

RENEWAL_CHECK_INTERVAL = 30


class AccountManager:
    def __init__(self, settings: Settings):
        self.settings = settings
        self._clients: dict[str, TradovateClient] = {}
        self._healthy: dict[str, bool] = {}
        self._renewal_task: asyncio.Task | None = None

    @property
    def clients(self) -> dict[str, TradovateClient]:
        return self._clients

    def get_ready_accounts(self) -> list[tuple[str, TradovateClient]]:
        return [
            (name, client)
            for name, client in self._clients.items()
            if self._healthy.get(name, False) and client.is_authenticated
        ]

    def account_status(self) -> dict[str, dict]:
        statuses = {}
        for name, client in self._clients.items():
            cfg = next((a for a in self.settings.tradovate_accounts if a.name == name), None)
            statuses[name] = {
                "authenticated": client.is_authenticated,
                "healthy": self._healthy.get(name, False),
                "enabled": cfg.enabled if cfg else False,
                "seconds_until_expiry": client.seconds_until_expiry,
                "accounts": [{"id": a.id, "name": a.name} for a in client.accounts],
            }
        return statuses

    async def authenticate_all(self) -> None:
        for acct_cfg in self.settings.tradovate_accounts:
            if not acct_cfg.enabled:
                logger.info("Skipping disabled account: %s", acct_cfg.name)
                continue

            client = TradovateClient(
                account_config=acct_cfg,
                cid=self.settings.tradovate_cid,
                sec=self.settings.tradovate_sec,
                device_id=self.settings.tradovate_device_id,
            )
            try:
                await client.authenticate()
                await client.get_accounts()
                self._clients[acct_cfg.name] = client
                self._healthy[acct_cfg.name] = True
                logger.info("Account %s authenticated and ready", acct_cfg.name)
            except TradovateError as e:
                logger.error("Failed to authenticate %s: %s", acct_cfg.name, e)
                self._clients[acct_cfg.name] = client
                self._healthy[acct_cfg.name] = False

    async def _renewal_loop(self) -> None:
        while True:
            await asyncio.sleep(RENEWAL_CHECK_INTERVAL)
            for name, client in self._clients.items():
                if not self._healthy.get(name, False):
                    continue
                try:
                    if client.needs_renewal:
                        logger.info("Renewing token for %s", name)
                        await client.renew_token()
                except TradovateError as e:
                    logger.error("Token renewal failed for %s: %s", name, e)
                    self._healthy[name] = False

    def start_renewal(self) -> None:
        if self._renewal_task is None or self._renewal_task.done():
            self._renewal_task = asyncio.create_task(self._renewal_loop())
            logger.info("Token renewal background task started")

    async def shutdown(self) -> None:
        if self._renewal_task and not self._renewal_task.done():
            self._renewal_task.cancel()
            try:
                await self._renewal_task
            except asyncio.CancelledError:
                pass
        for name, client in self._clients.items():
            await client.close()
            logger.info("Closed client for %s", name)
        self._clients.clear()
        self._healthy.clear()
