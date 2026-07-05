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
