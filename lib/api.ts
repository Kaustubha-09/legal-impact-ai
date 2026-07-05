import type { LegalAnswer } from "@/lib/data";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export class ApiError extends Error {}

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}/api${path}`, {
    headers: { "Content-Type": "application/json" },
    ...init,
  });
  if (!response.ok) {
    throw new ApiError(`Request to ${path} failed with status ${response.status}`);
  }
  return response.json() as Promise<T>;
}

export function askLegalQuestion(
  question: string,
  jurisdiction: string,
  profileTags: string[],
): Promise<LegalAnswer> {
  return apiFetch<LegalAnswer>("/qa", {
    method: "POST",
    body: JSON.stringify({ question, jurisdiction, profile_tags: profileTags }),
  });
}

export type SearchResult = {
  title: string;
  type: string;
  jurisdiction: string;
  date: string;
  category: string;
  summary: string;
};

export async function searchLegal(
  query: string,
  jurisdiction: string,
  sourceType: string,
): Promise<SearchResult[]> {
  const data = await apiFetch<{ results: SearchResult[] }>("/search", {
    method: "POST",
    body: JSON.stringify({
      query,
      jurisdiction: jurisdiction === "All jurisdictions" ? null : jurisdiction,
      source_type: sourceType === "All sources" ? null : sourceType,
    }),
  });
  return data.results;
}

export type CaseDetail = {
  name: string;
  court: string;
  date: string;
  citation: string;
  issue: string;
  holding: string;
  reasoning: string;
  rights: string;
  impacted: string;
  explanation: string;
  source: string;
};

export async function fetchCases(): Promise<CaseDetail[]> {
  const data = await apiFetch<{ cases: CaseDetail[] }>("/cases");
  return data.cases;
}

type FeedItemApi = {
  id: string;
  title: string;
  summary: string;
  jurisdiction: string;
  source_type: string;
  effective_date: string | null;
  who_is_affected: string[];
  rights_affected: string[];
  why_this_matters: string;
  personal_impact: string;
  source_citations: string[];
  publication_date: string;
  priority: string;
  confidence: string;
  impact_score: number;
};

export type FeedItem = {
  id: string;
  title: string;
  summary: string;
  jurisdiction: string;
  sourceType: string;
  effectiveDate: string | null;
  affected: string[];
  rights: string[];
  whyItMatters: string;
  personalImpact: string;
  citations: string[];
  publicationDate: string;
  priority: string;
  confidence: string;
  impactScore: number;
};

function mapFeedItem(item: FeedItemApi): FeedItem {
  return {
    id: item.id,
    title: item.title,
    summary: item.summary,
    jurisdiction: item.jurisdiction,
    sourceType: item.source_type,
    effectiveDate: item.effective_date,
    affected: item.who_is_affected,
    rights: item.rights_affected,
    whyItMatters: item.why_this_matters,
    personalImpact: item.personal_impact,
    citations: item.source_citations,
    publicationDate: item.publication_date,
    priority: item.priority,
    confidence: item.confidence,
    impactScore: item.impact_score,
  };
}

export async function fetchFeed(state: string, tags: string[]): Promise<FeedItem[]> {
  const params = new URLSearchParams({ state, tags: tags.join(",") });
  const data = await apiFetch<{ items: FeedItemApi[] }>(`/feed?${params.toString()}`);
  return data.items.map(mapFeedItem);
}

type RightsTopicApi = {
  name: string;
  summary: string;
  laws: string[];
  cases: string[];
  questions: string[];
  state_notes: string;
};

export type RightsTopic = {
  name: string;
  summary: string;
  laws: string[];
  cases: string[];
  questions: string[];
  stateNotes: string;
};

function mapRightsTopic(topic: RightsTopicApi): RightsTopic {
  return {
    name: topic.name,
    summary: topic.summary,
    laws: topic.laws,
    cases: topic.cases,
    questions: topic.questions,
    stateNotes: topic.state_notes,
  };
}

export async function fetchRightsTopics(): Promise<RightsTopic[]> {
  const data = await apiFetch<{ topics: RightsTopicApi[] }>("/rights");
  return data.topics.map(mapRightsTopic);
}
