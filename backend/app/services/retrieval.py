from __future__ import annotations

from app.core.db import SessionLocal
from app.models.legal import LegalSource
from app.services.embeddings import embed_text

# Cosine distance cutoff below which a retrieved document is considered a
# confident match. Tuned empirically against the current small catalog;
# revisit once the corpus grows.
MATCH_DISTANCE_THRESHOLD = 0.75


def retrieve_best_match(question: str) -> dict | None:
    query_vector = embed_text(question)
    with SessionLocal() as session:
        result = (
            session.query(LegalSource, LegalSource.embedding.cosine_distance(query_vector).label("distance"))
            .filter(LegalSource.embedding.is_not(None))
            .order_by("distance")
            .first()
        )
        if result is None:
            return None
        source, distance = result
        if distance > MATCH_DISTANCE_THRESHOLD:
            return None
        return {
            "title": source.title,
            "jurisdiction": source.jurisdiction,
            "metadata": source.metadata_json,
            "distance": float(distance),
        }
