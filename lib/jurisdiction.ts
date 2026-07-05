export type JurisdictionLevel = "federal" | "state" | "court" | "local";

export function classifyJurisdiction(jurisdiction: string): JurisdictionLevel {
  const value = jurisdiction.toLowerCase();
  if (value.includes("supreme court") || value.includes("circuit") || value.includes("court")) return "court";
  if (value === "federal" || value.includes("u.s.") || value.includes("united states")) return "federal";
  if (value.includes("county") || value.includes("city") || value.includes("municipal")) return "local";
  return "state";
}

const JURISDICTION_BADGE_CLASS: Record<JurisdictionLevel, string> = {
  federal: "bg-jurisdictionFederal text-jurisdictionFederal-foreground",
  state: "bg-jurisdictionState text-jurisdictionState-foreground",
  court: "bg-jurisdictionCourt text-jurisdictionCourt-foreground",
  local: "bg-jurisdictionLocal text-jurisdictionLocal-foreground",
};

export function jurisdictionBadgeClass(jurisdiction: string): string {
  return JURISDICTION_BADGE_CLASS[classifyJurisdiction(jurisdiction)];
}
