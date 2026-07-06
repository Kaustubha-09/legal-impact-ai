from datetime import datetime, timedelta

import httpx
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.db import get_db
from app.models.legal import DiscussionPost, DiscussionThread, UserProfile
from app.schemas.legal import (
    CaseDetailOut,
    FeedItemOut,
    LegalAnswerOut,
    LegalQuestionIn,
    LegalSearchIn,
    PostIn,
    PostOut,
    RightsTopicOut,
    ThreadIn,
    ThreadOut,
    UserProfileIn,
    UserProfileOut,
)
from app.services.ai import answer_legal_question
from app.services.catalog import CASE_DETAILS, RIGHTS_TOPICS, get_personalized_feed, search_documents
from app.services.congress import fetch_recent_federal_bills
from app.services.legiscan import fetch_recent_state_bills
from app.services.sources import planned_source_connectors

router = APIRouter()


@router.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@router.post("/profiles", response_model=UserProfileOut)
def save_profile(profile: UserProfileIn, db: Session = Depends(get_db)) -> UserProfileOut:
    existing = db.query(UserProfile).filter(UserProfile.clerk_user_id == profile.device_id).first()
    if existing:
        existing.state = profile.state
        existing.city = profile.city
        existing.county = profile.county
        existing.tags = profile.tags
        existing.email = profile.email
    else:
        existing = UserProfile(
            clerk_user_id=profile.device_id,
            state=profile.state,
            city=profile.city,
            county=profile.county,
            tags=profile.tags,
            email=profile.email,
        )
        db.add(existing)
    db.commit()
    db.refresh(existing)
    return UserProfileOut(
        device_id=existing.clerk_user_id,
        state=existing.state,
        city=existing.city,
        county=existing.county,
        tags=existing.tags,
        email=existing.email,
    )


@router.get("/profiles/{device_id}", response_model=UserProfileOut)
def get_profile(device_id: str, db: Session = Depends(get_db)) -> UserProfileOut:
    profile = db.query(UserProfile).filter(UserProfile.clerk_user_id == device_id).first()
    if profile is None:
        raise HTTPException(status_code=404, detail="No profile found for this device")
    return UserProfileOut(
        device_id=profile.clerk_user_id,
        state=profile.state,
        city=profile.city,
        county=profile.county,
        tags=profile.tags,
        email=profile.email,
    )


@router.get("/unsubscribe/{device_id}")
def unsubscribe(device_id: str, db: Session = Depends(get_db)) -> dict[str, str]:
    profile = db.query(UserProfile).filter(UserProfile.clerk_user_id == device_id).first()
    if profile is None:
        raise HTTPException(status_code=404, detail="No profile found for this device")
    profile.email = None
    db.commit()
    return {"status": "unsubscribed"}


@router.get("/feed")
async def personalized_feed(state: str = "CA", tags: str = "Tenant") -> dict[str, object]:
    selected_tags = [tag.strip() for tag in tags.split(",") if tag.strip()]
    try:
        federal_bills = await fetch_recent_federal_bills()
    except httpx.HTTPError:
        federal_bills = []
    try:
        state_bills = await fetch_recent_state_bills(state)
    except httpx.HTTPError:
        state_bills = []
    live_bills = federal_bills + state_bills
    items = [FeedItemOut(**item) for item in get_personalized_feed(state, selected_tags, live_bills)]
    return {
        "state": state,
        "tags": selected_tags,
        "items": items,
    }


@router.post("/qa", response_model=LegalAnswerOut)
def legal_qa(payload: LegalQuestionIn) -> LegalAnswerOut:
    return answer_legal_question(payload)


@router.get("/rights")
def rights_library() -> dict[str, list[RightsTopicOut]]:
    return {"topics": [RightsTopicOut(**topic) for topic in RIGHTS_TOPICS]}


@router.post("/search")
def legal_search(payload: LegalSearchIn) -> dict[str, object]:
    results = search_documents(
        payload.query,
        payload.jurisdiction,
        payload.source_type,
        payload.rights_category,
    )
    return {
        "query": payload.query,
        "results": results,
        "summary": (
            f"Found {len(results)} indexed source record(s). Verify the official source text before acting."
            if results
            else "No indexed sources match these filters. Broaden the query or remove a filter."
        ),
    }


@router.get("/sources")
def source_connectors() -> dict[str, str]:
    return planned_source_connectors()


@router.get("/cases")
def case_library() -> dict[str, list[CaseDetailOut]]:
    return {"cases": [CaseDetailOut(**case) for case in CASE_DETAILS]}


def _to_thread_out(thread: DiscussionThread) -> ThreadOut:
    return ThreadOut(
        id=thread.id,
        feed_item_id=thread.feed_item_id,
        title=thread.title,
        jurisdiction=thread.jurisdiction,
        summary=thread.summary,
        posts=[
            PostOut(
                id=post.id,
                device_id=post.device_id,
                author_tag=post.author_tag,
                body=post.body,
                created_at=post.created_at.isoformat(),
            )
            for post in thread.posts
        ],
    )


@router.post("/threads", response_model=ThreadOut)
def get_or_create_thread(payload: ThreadIn, db: Session = Depends(get_db)) -> ThreadOut:
    thread = db.query(DiscussionThread).filter(DiscussionThread.feed_item_id == payload.feed_item_id).first()
    if thread is None:
        thread = DiscussionThread(
            feed_item_id=payload.feed_item_id,
            title=payload.title,
            jurisdiction=payload.jurisdiction,
            summary=payload.summary,
        )
        db.add(thread)
        db.commit()
        db.refresh(thread)
    return _to_thread_out(thread)


POST_RATE_LIMIT = timedelta(seconds=10)


@router.post("/threads/{thread_id}/posts", response_model=ThreadOut)
def create_post(thread_id: str, payload: PostIn, db: Session = Depends(get_db)) -> ThreadOut:
    thread = db.query(DiscussionThread).filter(DiscussionThread.id == thread_id).first()
    if thread is None:
        raise HTTPException(status_code=404, detail="Thread not found")

    last_post = (
        db.query(DiscussionPost)
        .filter(DiscussionPost.device_id == payload.device_id)
        .order_by(DiscussionPost.created_at.desc())
        .first()
    )
    if last_post is not None and datetime.utcnow() - last_post.created_at < POST_RATE_LIMIT:
        raise HTTPException(status_code=429, detail="You're posting too fast. Please wait a few seconds.")

    post = DiscussionPost(
        thread_id=thread.id,
        device_id=payload.device_id,
        author_tag=payload.tag,
        body=payload.body,
    )
    db.add(post)
    db.commit()
    db.refresh(thread)
    return _to_thread_out(thread)
