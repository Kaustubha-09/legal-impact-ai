from __future__ import annotations

from datetime import date as date_type

from sqlalchemy.orm import Session

from app.core.db import Base, SessionLocal, engine
from app.models.legal import LegalSource
from app.services.catalog import LEGAL_DOCUMENTS, RIGHTS_TOPICS
from app.services.embeddings import embed_text


def _parse_date(value: str | None) -> date_type | None:
    if not value:
        return None
    try:
        return date_type.fromisoformat(value)
    except ValueError:
        return None


def _build_rights_topic_rows() -> list[LegalSource]:
    rows = []
    for topic in RIGHTS_TOPICS:
        text = (
            f"{topic['name']}. {topic['summary']} "
            f"Common questions: {'; '.join(topic['questions'])} "
            f"State notes: {topic['state_notes']}"
        )
        rows.append(
            LegalSource(
                title=topic["name"],
                source_type="rights_topic",
                jurisdiction="Multi-state",
                source_url="",
                citation=None,
                published_date=None,
                raw_text=text,
                metadata_json={
                    "kind": "rights_topic",
                    "name": topic["name"],
                    "summary": topic["summary"],
                    "laws": topic["laws"],
                    "cases": topic["cases"],
                    "questions": topic["questions"],
                    "state_notes": topic["state_notes"],
                },
                embedding=embed_text(text),
            )
        )
    return rows


def _build_legal_document_rows() -> list[LegalSource]:
    rows = []
    for document in LEGAL_DOCUMENTS:
        text = f"{document['title']}. {document['summary']}"
        rows.append(
            LegalSource(
                title=document["title"],
                source_type="legal_document",
                jurisdiction=document["jurisdiction"],
                source_url="",
                citation=document["type"],
                published_date=_parse_date(document["date"]),
                raw_text=text,
                metadata_json={
                    "kind": "legal_document",
                    "type": document["type"],
                    "category": document["category"],
                    "jurisdiction": document["jurisdiction"],
                    "summary": document["summary"],
                },
                embedding=embed_text(text),
            )
        )
    return rows


def ingest_catalog_documents(session: Session) -> int:
    session.query(LegalSource).filter(
        LegalSource.source_type.in_(["rights_topic", "legal_document"])
    ).delete(synchronize_session=False)
    rows = _build_rights_topic_rows() + _build_legal_document_rows()
    session.add_all(rows)
    session.commit()
    return len(rows)


def run() -> None:
    Base.metadata.create_all(engine)
    with SessionLocal() as session:
        count = ingest_catalog_documents(session)
    print(f"Ingested {count} documents into legal_sources.")


if __name__ == "__main__":
    run()
