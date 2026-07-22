import json

from db.database import get_db


async def insert_signal(
    raw_payload: str,
    action: str,
    symbol: str,
    qty: int,
    order_type: str,
    price: float | None = None,
    stop_price: float | None = None,
    tp: float | None = None,
    sl: float | None = None,
) -> int:
    db = await get_db()
    cursor = await db.execute(
        """INSERT INTO signals (raw_payload, action, symbol, qty, order_type, price, stop_price, tp, sl)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)""",
        (raw_payload, action, symbol, qty, order_type, price, stop_price, tp, sl),
    )
    await db.commit()
    return cursor.lastrowid


async def insert_order(
    signal_id: int,
    account_name: str,
    action: str,
    symbol: str,
    qty: int,
    order_type: str,
    tradovate_order_id: int | None = None,
    status: str = "pending",
    fill_price: float | None = None,
    error: str | None = None,
) -> int:
    db = await get_db()
    cursor = await db.execute(
        """INSERT INTO orders (signal_id, account_name, tradovate_order_id, action, symbol, qty, order_type, status, fill_price, error)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)""",
        (signal_id, account_name, tradovate_order_id, action, symbol, qty, order_type, status, fill_price, error),
    )
    await db.commit()
    return cursor.lastrowid


async def update_order_status(
    order_id: int,
    status: str,
    tradovate_order_id: int | None = None,
    fill_price: float | None = None,
    error: str | None = None,
) -> None:
    db = await get_db()
    fields = ["status = ?"]
    values: list = [status]
    if tradovate_order_id is not None:
        fields.append("tradovate_order_id = ?")
        values.append(tradovate_order_id)
    if fill_price is not None:
        fields.append("fill_price = ?")
        values.append(fill_price)
        fields.append("filled_at = datetime('now')")
    if error is not None:
        fields.append("error = ?")
        values.append(error)
    values.append(order_id)
    await db.execute(
        f"UPDATE orders SET {', '.join(fields)} WHERE id = ?",
        values,
    )
    await db.commit()


async def insert_log(level: str, component: str, message: str, details: dict | None = None) -> None:
    db = await get_db()
    await db.execute(
        "INSERT INTO logs (level, component, message, details) VALUES (?, ?, ?, ?)",
        (level, component, message, json.dumps(details) if details else None),
    )
    await db.commit()


async def get_recent_signals(limit: int = 50) -> list[dict]:
    db = await get_db()
    cursor = await db.execute(
        "SELECT * FROM signals ORDER BY id DESC LIMIT ?", (limit,)
    )
    rows = await cursor.fetchall()
    return [dict(row) for row in rows]


async def get_orders_for_signal(signal_id: int) -> list[dict]:
    db = await get_db()
    cursor = await db.execute(
        "SELECT * FROM orders WHERE signal_id = ? ORDER BY id", (signal_id,)
    )
    rows = await cursor.fetchall()
    return [dict(row) for row in rows]
