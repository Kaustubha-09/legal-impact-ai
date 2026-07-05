from __future__ import annotations

import asyncio
from datetime import UTC, date as date_type
from datetime import datetime

import httpx
import resend

from app.core.config import settings
from app.core.db import SessionLocal
from app.models.legal import UserProfile
from app.services.catalog import get_personalized_feed
from app.services.congress import fetch_recent_federal_bills
from app.services.legiscan import fetch_recent_state_bills

APP_URL = "http://localhost:3000"
API_URL = "http://localhost:8000"


def _parse_date(value: str | None) -> date_type | None:
    if not value:
        return None
    try:
        return date_type.fromisoformat(value)
    except ValueError:
        return None


async def _fetch_live_items(state: str) -> list[dict]:
    try:
        federal_bills = await fetch_recent_federal_bills()
    except httpx.HTTPError:
        federal_bills = []
    try:
        state_bills = await fetch_recent_state_bills(state)
    except httpx.HTTPError:
        state_bills = []
    return federal_bills + state_bills


def _new_items_for_profile(profile: UserProfile, live_items: list[dict]) -> list[dict]:
    feed = get_personalized_feed(profile.state, profile.tags, live_items)
    if profile.last_digest_sent_at is None:
        cutoff = None
    else:
        cutoff = profile.last_digest_sent_at.date()
    new_items = []
    for item in feed:
        published = _parse_date(item.get("publication_date"))
        if published is None:
            continue
        if cutoff is None or published > cutoff:
            new_items.append(item)
    return new_items


def _render_email_html(items: list[dict], device_id: str) -> str:
    rows = "".join(
        f"<li><strong>{item['title']}</strong><br>{item['summary']}</li>"
        for item in items
    )
    unsubscribe_url = f"{API_URL}/api/unsubscribe/{device_id}"
    return (
        f"<h2>Your weekly LifeLaw update</h2>"
        f"<ul>{rows}</ul>"
        f"<p><a href=\"{APP_URL}\">Open LifeLaw</a></p>"
        f"<p style=\"font-size:12px;color:#666;\">"
        f"<a href=\"{unsubscribe_url}\">Unsubscribe</a></p>"
    )


def send_digest_email(to_email: str, items: list[dict], device_id: str) -> None:
    resend.api_key = settings.resend_api_key
    resend.Emails.send(
        {
            "from": "LifeLaw <onboarding@resend.dev>",
            "to": [to_email],
            "subject": "Your weekly LifeLaw update",
            "html": _render_email_html(items, device_id),
        }
    )


def run() -> None:
    with SessionLocal() as session:
        profiles = session.query(UserProfile).filter(UserProfile.email.isnot(None)).all()
        live_items_by_state: dict[str, list[dict]] = {}
        sent, skipped, failed = 0, 0, 0
        for profile in profiles:
            if profile.state not in live_items_by_state:
                live_items_by_state[profile.state] = asyncio.run(_fetch_live_items(profile.state))
            new_items = _new_items_for_profile(profile, live_items_by_state[profile.state])
            if not new_items:
                skipped += 1
                continue
            try:
                send_digest_email(profile.email, new_items, profile.clerk_user_id)
            except Exception as exc:  # noqa: BLE001 - one bad send must not stop the batch
                print(f"Failed to send digest to {profile.email}: {exc}")
                failed += 1
                continue
            profile.last_digest_sent_at = datetime.now(UTC).replace(tzinfo=None)
            session.commit()
            sent += 1
        print(f"Digest run complete. Sent: {sent}, skipped (nothing new): {skipped}, failed: {failed}.")


if __name__ == "__main__":
    run()
