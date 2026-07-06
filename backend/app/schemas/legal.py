from pydantic import BaseModel, Field


class UserProfileIn(BaseModel):
    device_id: str = Field(min_length=1, max_length=128)
    state: str = Field(min_length=2, max_length=64)
    city: str = Field(min_length=1, max_length=128)
    county: str = Field(min_length=1, max_length=128)
    tags: list[str] = Field(default_factory=list, max_length=20)
    email: str | None = Field(default=None, max_length=256)


class UserProfileOut(BaseModel):
    device_id: str
    state: str
    city: str
    county: str
    tags: list[str]
    email: str | None = None


class FeedItemOut(BaseModel):
    id: str
    title: str
    summary: str
    jurisdiction: str
    source_type: str
    effective_date: str | None
    who_is_affected: list[str]
    rights_affected: list[str]
    why_this_matters: str
    personal_impact: str
    source_citations: list[str]
    publication_date: str
    priority: str
    confidence: str
    impact_score: int


class RightsTopicOut(BaseModel):
    name: str
    summary: str
    laws: list[str]
    cases: list[str]
    questions: list[str]
    state_notes: str


class LegalQuestionIn(BaseModel):
    question: str = Field(min_length=3, max_length=1000)
    jurisdiction: str = Field(min_length=2, max_length=128)
    profile_tags: list[str] = Field(default_factory=list)


class MatchedSourceOut(BaseModel):
    title: str
    jurisdiction: str
    excerpt: str
    confidence: float


class LegalAnswerOut(BaseModel):
    quick_answer: str
    rights: list[str]
    responsibilities: list[str]
    relevant_laws: list[str]
    court_rulings: list[str]
    exceptions: list[str]
    deadlines: list[str]
    next_steps: list[str]
    sources: list[str]
    disclaimer: str
    matched_source: MatchedSourceOut | None = None


class BillStageOut(BaseModel):
    date: str
    label: str


class BillTimelineOut(BaseModel):
    id: str
    title: str
    jurisdiction: str
    source: str
    url: str
    stages: list[BillStageOut]


class CaseDetailOut(BaseModel):
    name: str
    court: str
    date: str
    citation: str
    issue: str
    holding: str
    reasoning: str
    rights: str
    impacted: str
    explanation: str
    source: str


class LegalSearchIn(BaseModel):
    query: str = Field(min_length=1, max_length=300)
    jurisdiction: str | None = None
    source_type: str | None = None
    date_from: str | None = None
    date_to: str | None = None
    rights_category: str | None = None


class ThreadIn(BaseModel):
    feed_item_id: str = Field(min_length=1, max_length=128)
    title: str = Field(min_length=1, max_length=512)
    jurisdiction: str = Field(min_length=1, max_length=128)
    summary: str = Field(min_length=1)


class PostOut(BaseModel):
    id: str
    device_id: str
    author_tag: str | None
    body: str
    created_at: str


class ThreadOut(BaseModel):
    id: str
    feed_item_id: str
    title: str
    jurisdiction: str
    summary: str
    posts: list[PostOut]


class PostIn(BaseModel):
    device_id: str = Field(min_length=1, max_length=128)
    tag: str | None = Field(default=None, max_length=64)
    body: str = Field(min_length=1, max_length=2000)
