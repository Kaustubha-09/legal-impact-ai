import httpx
from fastapi import APIRouter

from app.schemas.legal import (
    FeedItemOut,
    LegalAnswerOut,
    LegalQuestionIn,
    LegalSearchIn,
    RightsTopicOut,
    UserProfileIn,
)
from app.services.ai import answer_legal_question
from app.services.catalog import RIGHTS_TOPICS, get_personalized_feed, search_documents
from app.services.congress import fetch_recent_federal_bills
from app.services.sources import planned_source_connectors

router = APIRouter()


@router.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@router.post("/profiles")
def save_profile(profile: UserProfileIn) -> dict[str, object]:
    return {"saved": True, "profile": profile.model_dump()}


@router.get("/feed")
async def personalized_feed(state: str = "CA", tags: str = "Tenant") -> dict[str, object]:
    selected_tags = [tag.strip() for tag in tags.split(",") if tag.strip()]
    try:
        live_bills = await fetch_recent_federal_bills()
    except httpx.HTTPError:
        live_bills = []
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
