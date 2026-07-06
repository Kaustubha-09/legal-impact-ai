from __future__ import annotations

from typing import Any

import httpx

from app.core.config import settings
from app.services.congress import TAG_KEYWORDS

LEGISCAN_API_BASE = "https://api.legiscan.com/"

STATE_NAME_TO_CODE: dict[str, str] = {
    "Alabama": "AL", "Alaska": "AK", "Arizona": "AZ", "Arkansas": "AR", "California": "CA",
    "Colorado": "CO", "Connecticut": "CT", "Delaware": "DE", "Florida": "FL", "Georgia": "GA",
    "Hawaii": "HI", "Idaho": "ID", "Illinois": "IL", "Indiana": "IN", "Iowa": "IA",
    "Kansas": "KS", "Kentucky": "KY", "Louisiana": "LA", "Maine": "ME", "Maryland": "MD",
    "Massachusetts": "MA", "Michigan": "MI", "Minnesota": "MN", "Mississippi": "MS",
    "Missouri": "MO", "Montana": "MT", "Nebraska": "NE", "Nevada": "NV", "New Hampshire": "NH",
    "New Jersey": "NJ", "New Mexico": "NM", "New York": "NY", "North Carolina": "NC",
    "North Dakota": "ND", "Ohio": "OH", "Oklahoma": "OK", "Oregon": "OR", "Pennsylvania": "PA",
    "Rhode Island": "RI", "South Carolina": "SC", "South Dakota": "SD", "Tennessee": "TN",
    "Texas": "TX", "Utah": "UT", "Vermont": "VT", "Virginia": "VA", "Washington": "WA",
    "West Virginia": "WV", "Wisconsin": "WI", "Wyoming": "WY", "District of Columbia": "DC",
}

CODE_TO_STATE_NAME: dict[str, str] = {code: name for name, code in STATE_NAME_TO_CODE.items()}


def _guess_tags(text: str) -> list[str]:
    haystack = text.casefold()
    return [tag for tag, keywords in TAG_KEYWORDS.items() if any(k in haystack for k in keywords)]


def _to_feed_item(bill: dict[str, Any], state_name: str, state_code: str) -> dict[str, Any] | None:
    title = bill.get("title", "").strip()
    description = bill.get("description", "")
    if not title:
        return None
    tags = _guess_tags(f"{title} {description}")
    if not tags:
        return None
    number = bill.get("number", "")
    return {
        "id": f"legiscan-{state_code}-{number}",
        "title": title,
        "summary": description or bill.get("last_action") or "No summary available.",
        "jurisdiction": state_name,
        "source_type": "Bill",
        "effective_date": bill.get("last_action_date"),
        "who_is_affected": tags,
        "rights_affected": [],
        "why_this_matters": (
            f"This bill is moving through the {state_name} legislature and may affect people in the "
            "tagged categories if it becomes law."
        ),
        "personal_impact": f"Tracks {state_code} {number} — check the latest action and full text before relying on it.",
        "source_citations": [f"legiscan.com: {state_code} {number}", bill.get("url", "")],
        "publication_date": bill.get("last_action_date", "Unknown"),
        "priority": "Priority 2",
        "confidence": "Medium",
        "impact_score": 58,
    }


async def fetch_recent_state_bills(state: str, limit: int = 20) -> list[dict[str, Any]]:
    if not settings.legiscan_api_key:
        return []
    state_code = STATE_NAME_TO_CODE.get(state)
    state_name = state
    if not state_code:
        # Caller may have passed a two-letter code (e.g. the /feed endpoint's
        # own "CA" default) instead of a full name — resolve the other way too.
        if state.upper() in CODE_TO_STATE_NAME:
            state_code = state.upper()
            state_name = CODE_TO_STATE_NAME[state_code]
        else:
            return []
    params = {
        "key": settings.legiscan_api_key,
        "op": "getMasterList",
        "state": state_code,
    }
    async with httpx.AsyncClient(timeout=10.0) as client:
        response = await client.get(LEGISCAN_API_BASE, params=params)
        response.raise_for_status()
    payload = response.json()
    if payload.get("status") != "OK":
        return []
    masterlist = payload.get("masterlist", {})
    bills = [value for key, value in masterlist.items() if key != "session" and isinstance(value, dict)]
    bills.sort(key=lambda bill: bill.get("last_action_date") or "", reverse=True)
    items = [_to_feed_item(bill, state_name, state_code) for bill in bills[:limit]]
    return [item for item in items if item is not None]
