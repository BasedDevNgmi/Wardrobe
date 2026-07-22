import json

from fastapi import APIRouter, Response

from accounts.manager import AccountManager

router = APIRouter()

_account_manager: AccountManager | None = None


def init_health(account_manager: AccountManager) -> None:
    global _account_manager
    _account_manager = account_manager


@router.get("/health")
async def health_check() -> Response:
    if _account_manager is None:
        return Response(
            status_code=503,
            content=json.dumps({"status": "not_initialized"}),
            media_type="application/json",
        )

    statuses = _account_manager.account_status()
    ready = _account_manager.get_ready_accounts()

    result = {
        "status": "ok" if ready else "degraded",
        "ready_accounts": len(ready),
        "total_accounts": len(statuses),
        "accounts": statuses,
    }

    status_code = 200 if ready else 503
    return Response(
        status_code=status_code,
        content=json.dumps(result, default=str),
        media_type="application/json",
    )
