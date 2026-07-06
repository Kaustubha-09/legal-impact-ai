from app.schemas.legal import LegalAnswerOut, LegalQuestionIn, MatchedSourceOut
from app.services.retrieval import retrieve_best_match
import re

DISCLAIMER = (
    "This information is for educational purposes only and is not legal advice. "
    "Laws vary by jurisdiction. Consult a licensed attorney for legal guidance."
)

# How much of the source document's raw text to surface as an excerpt in the
# "show your work" RAG transparency UI. Truncated at the API layer, not the
# frontend, so the contract is unambiguous for any future consumer.
EXCERPT_LENGTH = 200


def _build_matched_source(match: dict) -> MatchedSourceOut:
    raw_text = match["raw_text"].strip()
    excerpt = raw_text[:EXCERPT_LENGTH] + ("…" if len(raw_text) > EXCERPT_LENGTH else "")
    # retrieve_best_match returns cosine distance (lower = closer match).
    # Displayed to the user as "confidence" (higher = better) so the UI
    # doesn't have to explain an inverted scale.
    confidence = max(0.0, 1.0 - match["distance"])
    return MatchedSourceOut(
        title=match["title"],
        jurisdiction=match["jurisdiction"],
        excerpt=excerpt,
        confidence=round(confidence, 3),
    )


def _answer_from_retrieved_document(match: dict) -> LegalAnswerOut:
    metadata = match["metadata"]
    matched_source = _build_matched_source(match)
    if metadata["kind"] == "rights_topic":
        return LegalAnswerOut(
            quick_answer=metadata["summary"],
            rights=[f"Right to understand {metadata['name'].lower()} in your jurisdiction."],
            responsibilities=["Confirm how these general rights apply to your specific facts and state."],
            relevant_laws=metadata["laws"],
            court_rulings=metadata["cases"] or ["No case-specific ruling is selected without more facts."],
            exceptions=[metadata["state_notes"]],
            deadlines=["Deadlines are not identified from this reference record."],
            next_steps=[
                f"Review the {metadata['name']} topic in the rights library for related laws and cases.",
                "Contact a licensed attorney or legal aid office for guidance on your specific facts.",
            ],
            sources=metadata["laws"],
            disclaimer=DISCLAIMER,
            matched_source=matched_source,
        )
    return LegalAnswerOut(
        quick_answer=metadata["summary"],
        rights=["Right to review the official source text before relying on this summary."],
        responsibilities=["Confirm how this record applies to your specific facts and jurisdiction."],
        relevant_laws=[metadata["type"]],
        court_rulings=[match["title"]] if metadata["type"] == "Court opinion" else ["No case-specific ruling cited."],
        exceptions=["Facts, dates, and jurisdiction can change how this record applies."],
        deadlines=["Deadlines are not identified from this reference record."],
        next_steps=[
            "Read the full source text before relying on this summary.",
            "Contact a licensed attorney or legal aid office for guidance on your specific facts.",
        ],
        sources=[f"{match['title']} ({metadata['jurisdiction']})"],
        disclaimer=DISCLAIMER,
        matched_source=matched_source,
    )


def answer_legal_question(payload: LegalQuestionIn) -> LegalAnswerOut:
    if not payload.jurisdiction:
        return LegalAnswerOut(
            quick_answer="A jurisdiction is required before this can be answered.",
            rights=["Right to understand which jurisdiction and legal topic apply."],
            responsibilities=["Provide the state, city, dates, documents, and key facts when possible."],
            relevant_laws=["The relevant law depends on the legal topic and jurisdiction."],
            court_rulings=["Case law depends on the jurisdiction and issue."],
            exceptions=[
                "Facts, deadlines, contracts, immigration status, court orders, and local rules can change the answer."
            ],
            deadlines=["Deadlines cannot be identified without the issue, jurisdiction, and dates."],
            next_steps=["Add your state, city, or court jurisdiction."],
            sources=[
                "Official statutes, court rules, agency guidance, and court opinions should be checked for the final answer."
            ],
            disclaimer=DISCLAIMER,
        )

    question = _normalize_question(payload.question)
    if _matches(
        question,
        [
            r"\b(i\s+got|i\s+was|been|get|got)\s+(fired|terminated|laid\s+off)\b",
            r"\bwrongful\s+(termination|firing|dismissal)\b",
            r"\bcan\s+(my\s+)?(boss|employer|company)\s+fire\s+me\b",
            r"\bfired\s+(without\s+notice|for\s+no\s+reason|after\s+complaining)\b",
        ],
        ["fired", "terminated", "termination", "laid off", "wrongful"],
    ):
        return LegalAnswerOut(
            quick_answer=(
                f"In {payload.jurisdiction}, many jobs may be at-will, but an employer "
                "still cannot fire someone for an illegal reason such as discrimination, "
                "retaliation, protected leave, or wage complaints."
            ),
            rights=[
                "Right to final wages on the timeline required by state law.",
                "Right to be free from discrimination and retaliation.",
                "Right to request unemployment benefits if eligible.",
            ],
            responsibilities=[
                "Keep termination notices, pay stubs, messages, and performance records.",
                "File agency complaints or benefit claims before applicable deadlines.",
            ],
            relevant_laws=[
                "State labor code",
                "Title VII of the Civil Rights Act",
                "Fair Labor Standards Act",
            ],
            court_rulings=["No case-specific ruling is selected without more facts."],
            exceptions=[
                "Union contracts, employment contracts, public employment, protected leave, and whistleblower facts can change the analysis."
            ],
            deadlines=[
                "Agency filing deadlines vary by claim type. Some wage, discrimination, and unemployment deadlines can be short."
            ],
            next_steps=[
                "Write down the date, reason given, and people involved.",
                "Collect final pay, benefits, leave, and termination documents.",
                "Contact the appropriate labor agency or a licensed employment attorney.",
            ],
            sources=[
                "U.S. Equal Employment Opportunity Commission",
                "U.S. Department of Labor",
                "State labor agency resources",
            ],
            disclaimer=DISCLAIMER,
        )

    if _matches(
        question,
        [
            r"\b(landlord|property\s+manager|owner)\b.*\b(evict|eviction|kick\s+out|lock\s+out|remove)\b",
            r"\b(evict|eviction|lockout|lock\s+out|notice\s+to\s+quit|unlawful\s+detainer)\b",
            r"\bcan\s+my\s+landlord\s+(evict|kick\s+me\s+out|lock\s+me\s+out)\b",
            r"\bgot\s+an?\s+(eviction|notice\s+to\s+quit|pay\s+or\s+quit)\b",
        ],
        ["evict", "eviction", "lockout", "lock out", "notice to quit"],
    ):
        return LegalAnswerOut(
            quick_answer=(
                f"In {payload.jurisdiction}, a landlord usually cannot remove you without "
                "following the legal eviction process. That typically means proper written "
                "notice, a court case, and a lawful court order before removal."
            ),
            rights=[
                "Right to receive the required written notice before an eviction case can proceed.",
                "Right to respond in court if an eviction case is filed.",
                "Right not to be locked out, have utilities shut off, or be removed without the legal process.",
            ],
            responsibilities=[
                "Read any notice carefully and track the deadline on it.",
                "Keep paying rent that is not disputed unless a qualified legal professional advises otherwise.",
                "Respond quickly if court papers are served.",
            ],
            relevant_laws=[
                "State landlord-tenant law",
                "Local eviction protection ordinances",
                "Fair Housing Act",
            ],
            court_rulings=["No case-specific ruling is selected without more facts."],
            exceptions=[
                "Rules can differ for subsidized housing, room rentals, owner move-in claims, foreclosure, domestic violence protections, and local just-cause ordinances."
            ],
            deadlines=[
                "Notice and court-response deadlines can be short. The exact deadline depends on the notice type and court papers."
            ],
            next_steps=[
                "Identify the notice type and date served.",
                "Check whether your city or county has local eviction protections.",
                "Contact a tenant clinic, legal aid office, or licensed attorney quickly if court papers arrive.",
            ],
            sources=[
                "State court self-help eviction resources",
                "State civil code",
                "Local housing department guidance",
                "Fair Housing Act",
            ],
            disclaimer=DISCLAIMER,
        )

    if _matches(
        question,
        [
            r"\b(landlord|property\s+manager|owner)\b.*\b(raise|increase|hike|change)\b.*\b(rent|lease)\b",
            r"\b(rent|lease)\b.*\b(raise|increase|hike|notice|eviction|evict)\b",
            r"\bcan\s+my\s+landlord\b",
            r"\btenant\b.*\b(rent|notice|eviction|lease)\b",
        ],
        ["landlord", "rent", "lease", "tenant", "eviction"],
    ):
        return LegalAnswerOut(
            quick_answer=(
                f"In {payload.jurisdiction}, whether a landlord can raise rent depends "
                "on the property type, local rent rules, lease terms, and required notice period."
            ),
            rights=[
                "Right to receive legally required written notice before covered increases.",
                "Right to challenge increases that violate state or local rent limits.",
            ],
            responsibilities=[
                "Review your lease and local notices.",
                "Continue paying undisputed rent unless a qualified legal professional advises otherwise.",
            ],
            relevant_laws=["State landlord-tenant code", "Local rent stabilization ordinances"],
            court_rulings=["No case-specific ruling is selected without more facts."],
            exceptions=[
                "Single-family homes, newer buildings, and subsidized housing can follow different rules."
            ],
            deadlines=["Notice periods can depend on the size of the increase and local law."],
            next_steps=[
                "Confirm your city and property type.",
                "Compare the notice with state and local rent increase rules.",
                "Contact a tenant clinic or licensed attorney for guidance on your facts.",
            ],
            sources=["State civil code", "Local housing department guidance"],
            disclaimer=DISCLAIMER,
        )

    if _matches(
        question,
        [
            r"\b(police|officer|cop|law\s+enforcement)\b.*\b(search|look\s+through|unlock|take|seize)\b.*\b(phone|cell|device)\b",
            r"\b(phone|cell|device)\b.*\b(search|warrant|unlock|passcode|seize)\b",
            r"\bdo\s+i\s+have\s+to\s+(unlock|give).*\b(phone|passcode)\b",
            r"\bwarrant\b.*\b(phone|cell|device|search)\b",
        ],
        ["police", "search", "phone", "cell", "warrant"],
    ):
        return LegalAnswerOut(
            quick_answer=(
                "In the United States, police generally need a warrant to search the "
                "digital contents of a cell phone seized during an arrest, but emergency "
                "and consent situations can change the answer."
            ),
            rights=[
                "Fourth Amendment protection against unreasonable searches and seizures.",
                "Right to refuse consent to a search in many situations.",
                "Right to remain silent when questioning could incriminate you.",
            ],
            responsibilities=[
                "Do not physically resist a search.",
                "Clearly state if you do not consent, and ask whether you are free to leave.",
            ],
            relevant_laws=["U.S. Constitution, Fourth Amendment", "U.S. Constitution, Fifth Amendment"],
            court_rulings=["Riley v. California, 573 U.S. 373 (2014)", "Terry v. Ohio, 392 U.S. 1 (1968)"],
            exceptions=[
                "Consent, emergencies, border searches, probation or parole conditions, and valid warrants can change the result."
            ],
            deadlines=[
                "If evidence was seized, deadlines to challenge it depend on the court schedule and criminal procedure rules."
            ],
            next_steps=[
                "Ask for a warrant if officers request phone access.",
                "Do not share passcodes until you receive legal guidance.",
                "Write down what happened and speak with a licensed criminal defense attorney.",
            ],
            sources=[
                "U.S. Constitution, Fourth Amendment",
                "Riley v. California, 573 U.S. 373 (2014)",
                "Terry v. Ohio, 392 U.S. 1 (1968)",
            ],
            disclaimer=DISCLAIMER,
        )

    if _matches(
        question,
        [
            r"\bhow\s+does\s+(bail|bond)\s+work\b",
            r"\b(bail|bond|arraignment)\b",
            r"\b(get|getting|got)\s+out\s+of\s+jail\b",
            r"\b(release|detained|custody)\b.*\b(court|jail|charge|criminal)\b",
        ],
        ["bail", "bond", "arraignment", "jail", "detained"],
    ):
        return LegalAnswerOut(
            quick_answer=(
                f"Bail rules in {payload.jurisdiction} depend on the charge, risk "
                "assessment, court rules, and judge. In general, bail is a court process "
                "for deciding release conditions while a criminal case is pending."
            ),
            rights=[
                "Right to be informed of charges.",
                "Right to counsel in criminal proceedings.",
                "Right to challenge unlawful detention or excessive bail where applicable.",
            ],
            responsibilities=[
                "Appear at all court dates.",
                "Follow release conditions such as no-contact, travel, or check-in orders.",
            ],
            relevant_laws=[
                "U.S. Constitution, Eighth Amendment",
                "State criminal procedure and bail statutes",
                "Local court rules",
            ],
            court_rulings=["United States v. Salerno, 481 U.S. 739 (1987)"],
            exceptions=[
                "Some charges, probation holds, immigration holds, or public-safety findings can limit release options."
            ],
            deadlines=["Arraignment and bail-review timing depends on state procedure and arrest timing."],
            next_steps=[
                "Find the exact court, charge, and next hearing time.",
                "Ask about public defender eligibility if you do not have counsel.",
                "Keep proof of court dates and release conditions.",
            ],
            sources=[
                "U.S. Constitution, Eighth Amendment",
                "United States v. Salerno, 481 U.S. 739 (1987)",
                "State court criminal procedure resources",
            ],
            disclaimer=DISCLAIMER,
        )

    if _matches(
        question,
        [
            r"\b(visa|status|i-94|h-1b|f-1|green\s+card)\b.*\b(expire|expires|expired|overstay|deadline|grace)\b",
            r"\bwhat\s+happens\b.*\b(visa|status|i-94)\b",
            r"\b(overstay|unlawful\s+presence|out\s+of\s+status)\b",
            r"\b(can\s+i|how\s+do\s+i)\b.*\b(extend|change)\b.*\b(visa|status)\b",
        ],
        ["visa", "expires", "expired", "overstay", "h-1b", "f-1", "green card"],
    ):
        return LegalAnswerOut(
            quick_answer=(
                "If a visa or immigration status may expire, the impact depends on your "
                "status type, I-94 date, pending applications, grace periods, and whether "
                "you are authorized to work or study."
            ),
            rights=[
                "Right to receive notices in immigration proceedings.",
                "Right to consult an immigration attorney at your own expense.",
                "Some people may be eligible to request extensions, changes of status, or other relief.",
            ],
            responsibilities=[
                "Track the I-94 admitted-until date, not only the visa stamp date.",
                "Avoid unauthorized work and keep copies of filings and notices.",
            ],
            relevant_laws=["Immigration and Nationality Act", "8 CFR immigration regulations"],
            court_rulings=["No case-specific ruling is selected without more facts."],
            exceptions=[
                "H-1B, F-1, green card, asylum, TPS, and pending adjustment situations follow different rules."
            ],
            deadlines=[
                "Expiration, grace-period, extension, and unlawful-presence deadlines can be strict and fact-specific."
            ],
            next_steps=[
                "Check your latest I-94 and approval notices.",
                "Identify whether any application is pending.",
                "Speak with a licensed immigration attorney or accredited representative quickly.",
            ],
            sources=["USCIS policy resources", "U.S. Customs and Border Protection I-94 guidance", "8 CFR"],
            disclaimer=DISCLAIMER,
        )

    retrieved = retrieve_best_match(question)
    if retrieved is not None:
        return _answer_from_retrieved_document(retrieved)

    return LegalAnswerOut(
        quick_answer=(
            f'For "{payload.question}", the exact answer in {payload.jurisdiction} depends '
            "on the dates, documents, and facts. As a general educational starting point, "
            "identify the legal area, preserve evidence, check deadlines, and confirm the "
            "rule from official state, federal, or court sources before taking action."
        ),
        rights=[
            "Right to ask which law, court rule, agency rule, contract, or government action controls the issue.",
            "Right to review official notices, orders, contracts, policies, or records connected to the problem.",
            "Right to seek help from a licensed attorney, legal aid office, court self-help center, or qualified agency.",
        ],
        responsibilities=[
            "Identify the state, city, county, court, agency, or immigration status involved.",
            "Keep copies of notices, emails, texts, photos, receipts, contracts, court papers, and dates.",
            "Avoid missing response, appeal, filing, payment, hearing, or renewal deadlines.",
        ],
        relevant_laws=[
            "State statutes and local ordinances for your location.",
            "Federal statutes and regulations if the issue involves employment, housing discrimination, immigration, constitutional rights, benefits, consumer credit, or interstate activity.",
            "Contracts, leases, school policies, workplace policies, court rules, or agency rules if they apply.",
        ],
        court_rulings=[
            "No specific court ruling is selected from the MVP dataset for this typed question.",
            "A production RAG system should search controlling federal, state, and local cases before citing a case.",
        ],
        exceptions=[
            "Emergency facts, signed agreements, prior court orders, protected status, government benefits, immigration status, and local rules can change the answer.",
            "Different rules may apply to minors, students, workers, tenants, immigrants, business owners, and people in criminal proceedings.",
        ],
        deadlines=[
            "Deadlines may apply to notices, agency complaints, court responses, appeals, benefit claims, immigration filings, and statutes of limitation.",
            "If you received a notice or court paper, treat the date served and the response deadline as urgent.",
        ],
        next_steps=[
            "Add the jurisdiction and key facts to the question.",
            "Find the official source: court website, agency guidance, statute, regulation, or signed document.",
            "Write a timeline with dates, people involved, documents received, and what outcome you want.",
            "Contact a licensed attorney, legal aid office, court self-help center, or relevant agency for guidance on your facts.",
        ],
        sources=[
            "State court self-help resources",
            "Local government and agency guidance",
            "Federal agency guidance where applicable",
            "Official statutes, regulations, and court rules",
        ],
        disclaimer=DISCLAIMER,
    )


def _normalize_question(question: str) -> str:
    return re.sub(r"\s+", " ", re.sub(r"[^\w\s-]", " ", question.lower())).strip()


def _matches(question: str, patterns: list[str], keywords: list[str]) -> bool:
    return any(re.search(pattern, question) for pattern in patterns) or any(
        keyword in question for keyword in keywords
    )
