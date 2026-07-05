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
        "publication_date": "Reference record",
        "priority": "Priority 2",
        "confidence": "Medium",
        "impact_score": 78,
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
        "publication_date": "Reference record",
        "priority": "Priority 3",
        "confidence": "Low",
        "impact_score": 64,
    },
    {
        "title": "Appeals court narrows phone search exception",
        "summary": "A recent appellate decision limits when officers can search digital content without a warrant after an arrest.",
        "jurisdiction": "9th Circuit",
        "source_type": "Court ruling",
        "effective_date": "2026-05-18",
        "who_is_affected": ["Student", "Immigrant", "Employee"],
        "rights_affected": ["Fourth Amendment", "Digital privacy"],
        "why_this_matters": "Phone searches can expose messages, location data, photos, and account information.",
        "personal_impact": "This ruling may affect what officers can access from your phone during covered encounters in this circuit.",
        "source_citations": ["CourtListener opinion", "U.S. Constitution, Fourth Amendment"],
        "publication_date": "Reference record",
        "priority": "Priority 2",
        "confidence": "Medium",
        "impact_score": 72,
    },
]

RIGHTS_TOPICS: list[dict[str, Any]] = [
    {
        "name": "Employment rights",
        "summary": "Pay, termination, discrimination, leave, classification, and workplace safety.",
        "laws": ["Fair Labor Standards Act", "Title VII", "OSHA"],
        "cases": ["Bostock v. Clayton County", "Epic Systems Corp. v. Lewis"],
        "questions": ["Can I be fired without notice?", "Do I qualify for overtime?"],
        "state_notes": "State wage, leave, and final-pay rules often add protections.",
    },
    {
        "name": "Housing rights",
        "summary": "Rent increases, habitability, eviction process, deposits, and discrimination.",
        "laws": ["Fair Housing Act", "State landlord-tenant codes"],
        "cases": ["Department of Housing v. Inclusive Communities Project"],
        "questions": ["Can my landlord raise rent?", "What notice is required before eviction?"],
        "state_notes": "Rent control and eviction notice rules are highly local.",
    },
    {
        "name": "Police encounters",
        "summary": "Searches, stops, questioning, arrests, warrants, and digital privacy.",
        "laws": ["Fourth Amendment", "Fifth Amendment"],
        "cases": ["Riley v. California", "Terry v. Ohio"],
        "questions": ["Can police search my phone?", "Do I have to answer questions?"],
        "state_notes": "State constitutions may provide broader privacy protections.",
    },
    {
        "name": "Immigration rights",
        "summary": "Status, work authorization, visa deadlines, notices, and removal proceedings.",
        "laws": ["Immigration and Nationality Act", "8 CFR"],
        "cases": ["Pereira v. Sessions"],
        "questions": ["What happens if my visa expires?", "Can I change employers on H-1B?"],
        "state_notes": "Federal law controls status, while state rules can affect benefits and licensing.",
    },
    {
        "name": "Student rights",
        "summary": "School discipline, disability accommodations, records, discrimination, and campus safety.",
        "laws": ["Title IX", "FERPA", "Individuals with Disabilities Education Act"],
        "cases": ["Goss v. Lopez", "Davis v. Monroe County Board of Education"],
        "questions": ["Can my school suspend me without a hearing?", "Who can see my student records?"],
        "state_notes": "Public school procedures and higher-education policies vary by state and institution.",
    },
    {
        "name": "Consumer rights",
        "summary": "Debt collection, credit reporting, billing disputes, warranties, and unfair business practices.",
        "laws": ["Fair Debt Collection Practices Act", "Fair Credit Reporting Act", "Truth in Lending Act"],
        "cases": ["TransUnion LLC v. Ramirez"],
        "questions": ["Can a debt collector call me at work?", "How do I dispute a credit report error?"],
        "state_notes": "State consumer-protection laws can add remedies and shorter complaint deadlines.",
    },
    {
        "name": "Healthcare rights",
        "summary": "Health-information privacy, insurance coverage, disability access, medical bills, and patient rights.",
        "laws": ["Health Insurance Portability and Accountability Act", "Affordable Care Act", "Americans with Disabilities Act"],
        "cases": ["Dobbs v. Jackson Women's Health Organization"],
        "questions": ["Who can see my health records?", "How can I appeal an insurance denial?"],
        "state_notes": "Coverage rules, patient protections, and medical-debt requirements can vary by state.",
    },
    {
        "name": "Privacy rights",
        "summary": "Personal data, digital searches, consumer privacy, workplace monitoring, and government surveillance.",
        "laws": ["Fourth Amendment", "California Consumer Privacy Act", "Electronic Communications Privacy Act"],
        "cases": ["Carpenter v. United States", "Riley v. California"],
        "questions": ["Can police search my phone?", "Can my employer monitor me?"],
        "state_notes": "State privacy laws can give residents additional rights to know, delete, or limit data use.",
    },
    {
        "name": "Family rights",
        "summary": "Family leave, caregiving, child support, custody, domestic violence protections, and benefits.",
        "laws": ["Family and Medical Leave Act", "Violence Against Women Act", "State family codes"],
        "cases": ["Troxel v. Granville"],
        "questions": ["Can I take leave to care for family?", "Where can I find custody information?"],
        "state_notes": "Custody, support, and family-protection rules are highly state and local.",
    },
    {
        "name": "Constitutional rights",
        "summary": "Speech, privacy, due process, equal protection, and limits on government action.",
        "laws": ["U.S. Constitution", "State constitutions", "Civil Rights Act"],
        "cases": ["Riley v. California", "Tinker v. Des Moines"],
        "questions": ["Can the government search my phone?", "What is due process?"],
        "state_notes": "State constitutions can provide protections beyond the federal baseline.",
    },
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
    if not normalized_tags:
        return FEED_ITEMS
    return [
        item
        for item in FEED_ITEMS
        if normalized_tags.intersection(tag.casefold() for tag in item["who_is_affected"])
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
