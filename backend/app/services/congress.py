from __future__ import annotations

from typing import Any

import httpx

from app.core.config import settings

CONGRESS_API_BASE = "https://api.congress.gov/v3"

TAG_KEYWORDS: dict[str, list[str]] = {
    "Employee": ["labor", "employee", "employment", "wage", "worker"],
    "Gig worker": ["gig", "independent contractor", "freelance"],
    "Tenant": ["tenant", "rent", "renter", "eviction", "housing"],
    "Homeowner": ["homeowner", "mortgage", "property tax"],
    "Student": ["student", "education", "school", "college", "university"],
    "Immigrant": ["immigra", "visa", "asylum", "refugee"],
    "H-1B": ["h-1b", "h1b", "specialty occupation"],
    "Parent": ["child", "family leave", "childcare"],
    "Business owner": ["small business", "business owner", "entrepreneur"],
    "Veteran": ["veteran", "military service"],
    "Healthcare patient": ["health care", "healthcare", "medicare", "medicaid", "patient"],
}


def _guess_tags(title: str) -> list[str]:
    haystack = title.casefold()
    return [tag for tag, keywords in TAG_KEYWORDS.items() if any(k in haystack for k in keywords)]


def _to_feed_item(bill: dict[str, Any]) -> dict[str, Any] | None:
    title = bill.get("title", "").strip()
    if not title:
        return None
    tags = _guess_tags(title)
    if not tags:
        return None
    latest_action = bill.get("latestAction", {})
    congress = bill.get("congress")
    bill_type = str(bill.get("type", "")).lower()
    number = bill.get("number")
    citation = f"{bill.get('type', '')} {number} ({congress}th Congress)".strip()
    return {
        "title": title,
        "summary": latest_action.get("text") or "No recent action text available.",
        "jurisdiction": "Federal",
        "source_type": "Bill",
        "effective_date": latest_action.get("actionDate"),
        "who_is_affected": tags,
        "rights_affected": [],
        "why_this_matters": (
            "This bill is moving through Congress and may affect people in the tagged categories "
            "if it becomes law."
        ),
        "personal_impact": f"Tracks {citation} — check the latest action and full text before relying on it.",
        "source_citations": [f"congress.gov: {citation}", f"https://www.congress.gov/bill/{congress}th-congress/{bill_type}/{number}"],
        "publication_date": bill.get("updateDate", "Unknown"),
        "priority": "Priority 2",
        "confidence": "Medium",
        "impact_score": 60,
    }


async def fetch_recent_federal_bills(limit: int = 20) -> list[dict[str, Any]]:
    if not settings.congress_api_key:
        return []
    # The congress.gov API expects a literal "+" in the sort value; httpx's
    # default urlencoding would turn it into %2B, which the API ignores.
    query = (
        f"api_key={settings.congress_api_key}&format=json&sort=updateDate+desc&limit={limit}"
    )
    async with httpx.AsyncClient(timeout=10.0) as client:
        response = await client.get(f"{CONGRESS_API_BASE}/bill?{query}")
        response.raise_for_status()
    bills = response.json().get("bills", [])
    items = [_to_feed_item(bill) for bill in bills]
    return [item for item in items if item is not None]
