from __future__ import annotations

from typing import Any


FEED_ITEMS: list[dict[str, Any]] = [
    {
        "title": "Federal agency updates worker classification guidance",
        "summary": "Guidance clarifies when contract and gig work may be treated as employment for wage protections.",
        "jurisdiction": "Federal",
        "source_type": "Government guidance",
        "effective_date": "2026-07-01",
        "who_is_affected": ["Employee", "Gig worker", "Business owner"],
        "rights_affected": ["Wage protections", "Benefit eligibility", "Recordkeeping"],
        "why_this_matters": "Classification affects minimum wage, overtime, payroll taxes, and employer responsibilities.",
        "personal_impact": "Workers and businesses should compare this guidance with their work arrangement and state rules.",
        "source_citations": ["Federal Register", "U.S. Department of Labor"],
    },
    {
        "title": "State rent notice bill advances from committee",
        "summary": "A proposed bill would require longer notice before certain rent increases and lease nonrenewals.",
        "jurisdiction": "California",
        "source_type": "Bill",
        "effective_date": "Pending",
        "who_is_affected": ["Tenant", "Parent", "Student"],
        "rights_affected": ["Housing stability", "Notice requirements"],
        "why_this_matters": "Notice windows determine how much time renters have to budget, negotiate, or look for housing.",
        "personal_impact": "Covered tenants could receive more advance notice if the bill becomes law.",
        "source_citations": ["State legislature bill text", "Housing committee analysis"],
    },
]

RIGHTS_TOPICS = [
    "Employment rights",
    "Housing rights",
    "Police encounters",
    "Immigration rights",
    "Student rights",
    "Consumer rights",
    "Constitutional rights",
]

LEGAL_DOCUMENTS: list[dict[str, str]] = [
    {
        "title": "Riley v. California",
        "type": "Court opinion",
        "jurisdiction": "U.S. Supreme Court",
        "date": "2014-06-25",
        "category": "Constitutional rights",
        "summary": "Police generally need a warrant before searching digital information on a cell phone seized during an arrest.",
    },
    {
        "title": "Fair Housing Act",
        "type": "Federal statute",
        "jurisdiction": "Federal",
        "date": "Current",
        "category": "Housing rights",
        "summary": "Prohibits housing discrimination based on protected characteristics in many housing transactions.",
    },
    {
        "title": "H-1B specialty occupation regulation",
        "type": "Regulation",
        "jurisdiction": "Federal",
        "date": "Current",
        "category": "Immigration rights",
        "summary": "Defines specialty occupation criteria, petition requirements, and employer filing responsibilities.",
    },
]


def get_personalized_feed(state: str, tags: list[str]) -> list[dict[str, Any]]:
    normalized_tags = {tag.casefold() for tag in tags}
    return [
        item
        for item in FEED_ITEMS
        if item["jurisdiction"] in {"Federal", state}
        and normalized_tags.intersection(tag.casefold() for tag in item["who_is_affected"])
    ]


def search_documents(
    query: str,
    jurisdiction: str | None,
    source_type: str | None,
    rights_category: str | None,
) -> list[dict[str, str]]:
    terms = [term for term in query.casefold().split() if term]
    results: list[dict[str, str]] = []
    for document in LEGAL_DOCUMENTS:
        haystack = " ".join(document.values()).casefold()
        if terms and not all(term in haystack for term in terms):
            continue
        if jurisdiction and document["jurisdiction"] != jurisdiction:
            continue
        if source_type and document["type"] != source_type:
            continue
        if rights_category and document["category"] != rights_category:
            continue
        results.append(document)
    return results
