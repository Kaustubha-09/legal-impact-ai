from __future__ import annotations

from typing import Any


FEED_ITEMS: list[dict[str, Any]] = [
    {
        "id": "static-worker-classification-guidance",
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
        "id": "static-rent-notice-bill",
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
        "id": "static-phone-search-exception",
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
    {
        "title": "California Tenant Protection Act",
        "type": "State statute",
        "jurisdiction": "California",
        "date": "Current",
        "category": "Housing rights",
        "summary": "Sets statewide baseline protections for certain rent increases and just-cause eviction requirements.",
    },
    {
        "title": "Fair Labor Standards Act",
        "type": "Federal statute",
        "jurisdiction": "Federal",
        "date": "Current",
        "category": "Employment rights",
        "summary": "Establishes federal minimum wage, overtime, recordkeeping, and child labor standards.",
    },
    {
        "title": "Bostock v. Clayton County",
        "type": "Court opinion",
        "jurisdiction": "U.S. Supreme Court",
        "date": "2020-06-15",
        "category": "Employment rights",
        "summary": "Firing someone for being gay or transgender violates Title VII's prohibition on sex discrimination.",
    },
    {
        "title": "Fair Debt Collection Practices Act",
        "type": "Federal statute",
        "jurisdiction": "Federal",
        "date": "Current",
        "category": "Consumer rights",
        "summary": "Restricts abusive, unfair, or deceptive practices by third-party debt collectors, including when and how they may contact consumers.",
    },
]

CASE_DETAILS: list[dict[str, str]] = [
    {
        "name": "Riley v. California",
        "court": "U.S. Supreme Court",
        "date": "June 25, 2014",
        "citation": "573 U.S. 373",
        "issue": "Whether officers may search digital phone contents without a warrant after arrest.",
        "holding": "A warrant is generally required before searching digital information on a seized phone.",
        "reasoning": "Modern phones hold extensive personal data and are not comparable to ordinary physical items carried at arrest.",
        "rights": "Fourth Amendment privacy and digital search protections.",
        "impacted": "People whose phones are seized during covered arrests or investigations.",
        "explanation": "Your phone can contain far more private information than a wallet or bag. Officers usually need a warrant before reviewing its digital contents.",
        "source": "https://supreme.justia.com/cases/federal/us/573/373/",
    },
    {
        "name": "Bostock v. Clayton County",
        "court": "U.S. Supreme Court",
        "date": "June 15, 2020",
        "citation": "590 U.S. 644",
        "issue": "Whether Title VII prohibits employment discrimination because of sexual orientation or transgender status.",
        "holding": "Firing someone for being gay or transgender violates Title VII's prohibition on sex discrimination.",
        "reasoning": "An employer who treats a person differently for these reasons necessarily relies on sex.",
        "rights": "Workplace equal-treatment protections under federal law.",
        "impacted": "Employees and employers covered by Title VII.",
        "explanation": "Federal employment law generally protects covered workers from being fired for being gay or transgender.",
        "source": "https://supreme.justia.com/cases/federal/us/590/17-1618/",
    },
    {
        "name": "Terry v. Ohio",
        "court": "U.S. Supreme Court",
        "date": "June 10, 1968",
        "citation": "392 U.S. 1",
        "issue": "Whether police may stop and pat down a person without probable cause for arrest.",
        "holding": "Officers may briefly stop and frisk a person if they have reasonable, articulable suspicion of criminal activity and danger.",
        "reasoning": "A brief stop and limited pat-down for weapons is a lesser intrusion than an arrest and can be justified by less than probable cause.",
        "rights": "Fourth Amendment protection against unreasonable searches and seizures, bounded by the reasonable-suspicion standard.",
        "impacted": "Anyone stopped or frisked by police in a street encounter.",
        "explanation": "Police can stop and pat you down for weapons if they have a specific reason to suspect you're involved in a crime and may be armed, even without enough evidence to arrest you.",
        "source": "https://supreme.justia.com/cases/federal/us/392/1/",
    },
    {
        "name": "Carpenter v. United States",
        "court": "U.S. Supreme Court",
        "date": "June 22, 2018",
        "citation": "585 U.S. 296",
        "issue": "Whether police need a warrant to obtain historical cell-site location records from a phone company.",
        "holding": "The government generally needs a warrant to access historical cell-site location information.",
        "reasoning": "Cell-site records create a detailed record of a person's movements and carry the same privacy concerns as other protected digital information.",
        "rights": "Fourth Amendment privacy protections extended to digital location data held by third parties.",
        "impacted": "Anyone whose phone location history is sought by law enforcement.",
        "explanation": "Your phone's location history is private enough that police usually need a warrant to get it from your carrier, similar to needing a warrant to search your phone directly.",
        "source": "https://supreme.justia.com/cases/federal/us/585/16-402/",
    },
    {
        "name": "Goss v. Lopez",
        "court": "U.S. Supreme Court",
        "date": "January 22, 1975",
        "citation": "419 U.S. 565",
        "issue": "Whether public school students facing suspension are entitled to notice and a hearing.",
        "holding": "Students facing suspension of 10 days or less are entitled to notice of the charges and an opportunity to respond before removal.",
        "reasoning": "Public education is a property interest protected by due process, so students cannot be deprived of it without at least minimal procedural safeguards.",
        "rights": "Due process rights in public school disciplinary proceedings.",
        "impacted": "Public school students facing suspension or expulsion.",
        "explanation": "If a public school wants to suspend you, it generally has to tell you what you're accused of and give you a chance to explain your side first.",
        "source": "https://supreme.justia.com/cases/federal/us/419/565/",
    },
]


def get_personalized_feed(
    state: str, tags: list[str], extra_items: list[dict[str, Any]] | None = None
) -> list[dict[str, Any]]:
    normalized_tags = {tag.casefold() for tag in tags}
    items = FEED_ITEMS + (extra_items or [])
    if not normalized_tags:
        return items
    return [
        item
        for item in items
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
