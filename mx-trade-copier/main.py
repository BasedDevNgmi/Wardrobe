import logging
import sys
from contextlib import asynccontextmanager

from fastapi import FastAPI

from accounts.manager import AccountManager
from api.health import init_health
from api.health import router as health_router
from api.webhook import init_webhook
from api.webhook import router as webhook_router
from config import Settings
from db.database import close_db, init_db
from models.signal import set_symbol_map
from orders.router import OrderRouter

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
    handlers=[logging.StreamHandler(sys.stdout)],
)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    settings = Settings()
    logger.info("Starting MX Trade Copier")

    set_symbol_map(settings.symbol_map)
    logger.info("Symbol map: %s", settings.symbol_map)

    await init_db(settings.db_path)
    logger.info("Database initialized at %s", settings.db_path)

    account_manager = AccountManager(settings)
    await account_manager.authenticate_all()
    account_manager.start_renewal()

    order_router = OrderRouter(account_manager)
    init_webhook(settings, order_router)
    init_health(account_manager)

    ready = account_manager.get_ready_accounts()
    logger.info("MX Trade Copier ready: %d/%d accounts authenticated",
                len(ready), len(settings.tradovate_accounts))

    yield

    logger.info("Shutting down MX Trade Copier")
    await account_manager.shutdown()
    await close_db()
    logger.info("Shutdown complete")


app = FastAPI(title="MX Trade Copier", version="1.0.0", lifespan=lifespan)
app.include_router(webhook_router)
app.include_router(health_router)


if __name__ == "__main__":
    import uvicorn
    settings = Settings()
    uvicorn.run("main:app", host=settings.host, port=settings.port, reload=False)
