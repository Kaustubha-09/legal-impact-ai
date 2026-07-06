import type { LegalAnswer } from "@/lib/data";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}/api${path}`, {
    headers: { "Content-Type": "application/json" },
    ...init,
  });
  if (!response.ok) {
    let detail = "";
    try {
      const body = (await response.json()) as { detail?: string };
      detail = body.detail ?? "";
    } catch {
      // response body wasn't JSON, ignore
    }
    throw new ApiError(detail || `Request to ${path} failed with status ${response.status}`, response.status);
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

export type DeviceProfile = {
  deviceId: string;
  state: string;
  city: string;
  county: string;
  tags: string[];
  email: string | null;
};

export async function saveDeviceProfile(profile: DeviceProfile): Promise<void> {
  await apiFetch("/profiles", {
    method: "POST",
    body: JSON.stringify({
      device_id: profile.deviceId,
      state: profile.state,
      city: profile.city,
      county: profile.county,
      tags: profile.tags,
      email: profile.email || null,
    }),
  });
}

export async function fetchDeviceProfile(deviceId: string): Promise<DeviceProfile | null> {
  const response = await fetch(`${API_BASE_URL}/api/profiles/${deviceId}`);
  if (response.status === 404) return null;
  if (!response.ok) throw new ApiError(`Request to /profiles/${deviceId} failed with status ${response.status}`, response.status);
  const data = (await response.json()) as { device_id: string; state: string; city: string; county: string; tags: string[]; email: string | null };
  return { deviceId: data.device_id, state: data.state, city: data.city, county: data.county, tags: data.tags, email: data.email };
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

export type ThreadPost = {
  id: string;
  deviceId: string;
  authorTag: string | null;
  body: string;
  createdAt: string;
};

export type Thread = {
  id: string;
  feedItemId: string;
  title: string;
  jurisdiction: string;
  summary: string;
  posts: ThreadPost[];
};

type ThreadApi = {
  id: string;
  feed_item_id: string;
  title: string;
  jurisdiction: string;
  summary: string;
  posts: Array<{ id: string; device_id: string; author_tag: string | null; body: string; created_at: string }>;
};

function mapThread(thread: ThreadApi): Thread {
  return {
    id: thread.id,
    feedItemId: thread.feed_item_id,
    title: thread.title,
    jurisdiction: thread.jurisdiction,
    summary: thread.summary,
    posts: thread.posts.map((post) => ({
      id: post.id,
      deviceId: post.device_id,
      authorTag: post.author_tag,
      body: post.body,
      createdAt: post.created_at,
    })),
  };
}

export async function getOrCreateThread(
  feedItemId: string,
  title: string,
  jurisdiction: string,
  summary: string,
): Promise<Thread> {
  const data = await apiFetch<ThreadApi>("/threads", {
    method: "POST",
    body: JSON.stringify({ feed_item_id: feedItemId, title, jurisdiction, summary }),
  });
  return mapThread(data);
}

export async function postToThread(threadId: string, deviceId: string, tag: string | null, body: string): Promise<Thread> {
  const data = await apiFetch<ThreadApi>(`/threads/${threadId}/posts`, {
    method: "POST",
    body: JSON.stringify({ device_id: deviceId, tag, body }),
  });
  return mapThread(data);
}

export type BillStage = { date: string; label: string };

export type BillTimeline = {
  id: string;
  title: string;
  jurisdiction: string;
  source: string;
  url: string;
  stages: BillStage[];
};

// Only feed items backed by a live Congress.gov/LegiScan bill have a
// timeline — static catalog entries and cases never will, so callers can
// skip rendering the "View timeline" trigger for those without a wasted
// request.
export function hasBillTimeline(feedItemId: string): boolean {
  return feedItemId.startsWith("congress-") || feedItemId.startsWith("legiscan-");
}

export async function fetchBillTimeline(feedItemId: string, title: string, jurisdiction: string): Promise<BillTimeline> {
  const params = new URLSearchParams({ title, jurisdiction });
  return apiFetch<BillTimeline>(`/bills/${feedItemId}/timeline?${params.toString()}`);
}
