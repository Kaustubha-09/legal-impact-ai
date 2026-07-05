from datetime import date, datetime
from uuid import uuid4

from pgvector.sqlalchemy import Vector
from sqlalchemy import Date, DateTime, ForeignKey, String, Text
from sqlalchemy.dialects.postgresql import ARRAY, JSONB, UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.db import Base


class UserProfile(Base):
    __tablename__ = "user_profiles"

    id: Mapped[str] = mapped_column(UUID(as_uuid=False), primary_key=True, default=lambda: str(uuid4()))
    clerk_user_id: Mapped[str] = mapped_column(String(128), unique=True, index=True)
    state: Mapped[str] = mapped_column(String(64))
    city: Mapped[str] = mapped_column(String(128))
    county: Mapped[str] = mapped_column(String(128))
    tags: Mapped[list[str]] = mapped_column(ARRAY(String), default=list)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)


class LegalSource(Base):
    __tablename__ = "legal_sources"

    id: Mapped[str] = mapped_column(UUID(as_uuid=False), primary_key=True, default=lambda: str(uuid4()))
    title: Mapped[str] = mapped_column(String(512), index=True)
    source_type: Mapped[str] = mapped_column(String(64), index=True)
    jurisdiction: Mapped[str] = mapped_column(String(128), index=True)
    source_url: Mapped[str] = mapped_column(Text)
    citation: Mapped[str | None] = mapped_column(String(256))
    published_date: Mapped[date | None] = mapped_column(Date)
    raw_text: Mapped[str] = mapped_column(Text)
    metadata_json: Mapped[dict] = mapped_column(JSONB, default=dict)
    embedding: Mapped[list[float] | None] = mapped_column(Vector(1536))


class FeedItem(Base):
    __tablename__ = "feed_items"

    id: Mapped[str] = mapped_column(UUID(as_uuid=False), primary_key=True, default=lambda: str(uuid4()))
    source_id: Mapped[str] = mapped_column(ForeignKey("legal_sources.id"))
    title: Mapped[str] = mapped_column(String(512))
    summary: Mapped[str] = mapped_column(Text)
    jurisdiction: Mapped[str] = mapped_column(String(128), index=True)
    source_type: Mapped[str] = mapped_column(String(64), index=True)
    effective_date: Mapped[str | None] = mapped_column(String(64))
    affected_tags: Mapped[list[str]] = mapped_column(ARRAY(String), default=list)
    rights_affected: Mapped[list[str]] = mapped_column(ARRAY(String), default=list)
    why_this_matters: Mapped[str] = mapped_column(Text)
    citations: Mapped[list[str]] = mapped_column(ARRAY(String), default=list)

    source = relationship("LegalSource")


class SavedItem(Base):
    __tablename__ = "saved_items"

    id: Mapped[str] = mapped_column(UUID(as_uuid=False), primary_key=True, default=lambda: str(uuid4()))
    clerk_user_id: Mapped[str] = mapped_column(String(128), index=True)
    item_type: Mapped[str] = mapped_column(String(64))
    item_id: Mapped[str] = mapped_column(String(128), index=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)


class Watchlist(Base):
    __tablename__ = "watchlists"

    id: Mapped[str] = mapped_column(UUID(as_uuid=False), primary_key=True, default=lambda: str(uuid4()))
    clerk_user_id: Mapped[str] = mapped_column(String(128), index=True)
    name: Mapped[str] = mapped_column(String(256))
    query: Mapped[str] = mapped_column(Text)
    filters: Mapped[dict] = mapped_column(JSONB, default=dict)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
