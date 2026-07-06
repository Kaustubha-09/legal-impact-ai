from __future__ import annotations

import math

import httpx

from app.core.config import settings

EMBEDDING_MODEL_NAME = "sentence-transformers/all-MiniLM-L6-v2"
EMBEDDING_DIMENSIONS = 384

# Hugging Face's router endpoint for a specific model's feature-extraction
# pipeline. Computing embeddings remotely (instead of loading
# sentence-transformers + PyTorch in-process) avoids the ~380MB runtime
# footprint that OOM-crashes a 512MB Render instance the first time a
# question falls through to RAG retrieval.
HF_INFERENCE_URL = f"https://router.huggingface.co/hf-inference/models/{EMBEDDING_MODEL_NAME}/pipeline/feature-extraction"


def _l2_normalize(vector: list[float]) -> list[float]:
    norm = math.sqrt(sum(component * component for component in vector))
    if norm == 0:
        return vector
    return [component / norm for component in vector]


def _mean_pool(token_embeddings: list[list[float]]) -> list[float]:
    dims = len(token_embeddings[0])
    sums = [0.0] * dims
    for token_vector in token_embeddings:
        for i, value in enumerate(token_vector):
            sums[i] += value
    count = len(token_embeddings)
    return [total / count for total in sums]


def embed_text(text: str) -> list[float]:
    if not settings.huggingface_api_key:
        raise RuntimeError(
            "HUGGINGFACE_API_KEY is not set. RAG retrieval requires it to compute embeddings "
            "via the Hugging Face Inference API — see README for setup."
        )
    response = httpx.post(
        HF_INFERENCE_URL,
        headers={"Authorization": f"Bearer {settings.huggingface_api_key}"},
        json={"inputs": text, "options": {"wait_for_model": True}},
        timeout=30.0,
    )
    response.raise_for_status()
    payload = response.json()

    # The API can return either a single pooled sentence vector
    # (list[float]) or per-token vectors (list[list[float]]) depending on
    # the model/endpoint version — handle both defensively.
    if isinstance(payload[0], list):
        vector = _mean_pool(payload)
    else:
        vector = payload

    return _l2_normalize(vector)
