from __future__ import annotations

import logging
from typing import Any

import httpx

from app.core.config import settings
from app.services.congress import CONGRESS_API_BASE
from app.services.legiscan import LEGISCAN_API_BASE

logger = logging.getLogger(__name__)


def _build_stage(date: str | None, label: str | None) -> dict[str, str] | None:
    if not date:
        return None
    return {"date": date, "label": label or "Action recorded"}


async def fetch_federal_bill_stages(congress: str, bill_type: str, number: str) -> dict[str, Any] | None:
    """Normalize Congress.gov's per-bill actions into (date, label) stages."""
    if not settings.congress_api_key:
        return None
    url = f"{CONGRESS_API_BASE}/bill/{congress}/{bill_type}/{number}/actions"
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get(url, params={"api_key": settings.congress_api_key, "format": "json"})
            response.raise_for_status()
    except httpx.HTTPError as error:
        # Unlike the existing fail-soft pattern in routes.py (which swallows
        # this silently), log it — a bad key or outage should be
        # distinguishable from "this bill has no actions yet".
        logger.warning("Congress.gov bill-detail fetch failed for %s/%s/%s: %s", congress, bill_type, number, error)
        return None
    actions = response.json().get("actions", [])
    stages = [
        stage
        for stage in (_build_stage(action.get("actionDate"), action.get("text") or action.get("type")) for action in actions)
        if stage is not None
    ]
    stages.sort(key=lambda stage: stage["date"])
    return {
        "stages": stages,
        "source": "Congress.gov",
        "url": f"https://www.congress.gov/bill/{congress}th-congress/{bill_type}/{number}",
    }


async def fetch_state_bill_stages(bill_id: str) -> dict[str, Any] | None:
    """Normalize LegiScan's per-bill history into (date, label) stages."""
    if not settings.legiscan_api_key:
        return None
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get(
                LEGISCAN_API_BASE, params={"key": settings.legiscan_api_key, "op": "getBill", "id": bill_id}
            )
            response.raise_for_status()
    except httpx.HTTPError as error:
        logger.warning("LegiScan bill-detail fetch failed for bill_id=%s: %s", bill_id, error)
        return None
    payload = response.json()
    if payload.get("status") != "OK":
        logger.warning("LegiScan bill-detail returned non-OK status for bill_id=%s: %s", bill_id, payload.get("status"))
        return None
    bill = payload.get("bill", {})
    history = bill.get("history", [])
    stages = [
        stage
        for stage in (_build_stage(item.get("date"), item.get("action")) for item in history)
        if stage is not None
    ]
    stages.sort(key=lambda stage: stage["date"])
    return {
        "stages": stages,
        "source": "LegiScan",
        "url": bill.get("state_link") or bill.get("url") or "",
    }


async def get_bill_detail(feed_item_id: str, title: str, jurisdiction: str) -> dict[str, Any] | None:
    """Dispatch to the right source fetcher based on the feed item id shape,
    then wrap the normalized stages with the display fields the frontend needs.
    Returns None if the id doesn't match a known source shape, or if the
    upstream fetch failed/found nothing — the caller (routes.py) turns that
    into a 404, not a 500, since "no timeline yet" is an expected case for a
    just-introduced bill.
    """
    parts = feed_item_id.split("-")
    detail: dict[str, Any] | None = None
    if feed_item_id.startswith("congress-") and len(parts) == 4:
        _, congress, bill_type, number = parts
        detail = await fetch_federal_bill_stages(congress, bill_type, number)
    elif feed_item_id.startswith("legiscan-") and len(parts) == 3:
        _, _state_code, bill_id = parts
        detail = await fetch_state_bill_stages(bill_id)

    if detail is None:
        return None

    return {
        "id": feed_item_id,
        "title": title,
        "jurisdiction": jurisdiction,
        "source": detail["source"],
        "url": detail["url"],
        "stages": detail["stages"],
    }
