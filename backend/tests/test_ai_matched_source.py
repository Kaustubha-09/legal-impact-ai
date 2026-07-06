from unittest.mock import patch

from app.schemas.legal import LegalQuestionIn
from app.services.ai import answer_legal_question


FAKE_MATCH = {
    "title": "Consumer rights",
    "jurisdiction": "Multi-state",
    "metadata": {
        "kind": "rights_topic",
        "name": "Consumer rights",
        "summary": "Debt collection, credit reporting, billing disputes, warranties, and unfair business practices.",
        "laws": ["Fair Debt Collection Practices Act"],
        "cases": [],
        "state_notes": "State consumer-protection laws can add remedies.",
    },
    "raw_text": "Consumer rights. " + ("x" * 300),
    "distance": 0.295,
}


def _question(text: str) -> LegalQuestionIn:
    return LegalQuestionIn(question=text, jurisdiction="CA", profile_tags=[])


def test_matched_source_populated_on_confident_retrieval():
    with patch("app.services.ai.retrieve_best_match", return_value=FAKE_MATCH):
        answer = answer_legal_question(_question("What consumer protections exist against debt collectors?"))

    assert answer.matched_source is not None
    assert answer.matched_source.title == "Consumer rights"
    assert answer.matched_source.jurisdiction == "Multi-state"
    # confidence = 1 - distance, rounded to 3 places
    assert answer.matched_source.confidence == 0.705
    # excerpt is truncated to EXCERPT_LENGTH (200) chars plus an ellipsis marker
    assert len(answer.matched_source.excerpt) <= 201
    assert answer.matched_source.excerpt.startswith("Consumer rights.")


def test_matched_source_absent_when_retrieval_finds_no_confident_match():
    with patch("app.services.ai.retrieve_best_match", return_value=None):
        answer = answer_legal_question(_question("A totally unrelated question with no corpus match at all"))

    assert answer.matched_source is None


def test_matched_source_absent_on_regex_fast_path_answer():
    # Regex fast-path answers (e.g. eviction) are curated, not retrieved from
    # the corpus, so matched_source must stay None even though the answer
    # itself is confident and correct.
    answer = answer_legal_question(_question("Can my landlord evict me without notice?"))

    assert answer.matched_source is None
    assert len(answer.rights) > 0
