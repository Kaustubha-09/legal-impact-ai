"use client";

import { AlertCircle, Bell, FileSearch, Gavel, Landmark, MessageSquareText, ShieldCheck } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { ProfileHero } from "@/components/sections/ProfileHero";
import { FeedPanel } from "@/components/sections/FeedPanel";
import { AskAiPanel } from "@/components/sections/AskAiPanel";
import { WatchlistsPanel } from "@/components/sections/WatchlistsPanel";
import { RightsSection } from "@/components/sections/RightsSection";
import { SearchSection } from "@/components/sections/SearchSection";
import { CasesSection } from "@/components/sections/CasesSection";
import {
  courtCases,
  feedItems,
  getLifeImpactAnswer,
  getQuestionSuggestions,
  type LegalAnswer,
  qaSample,
  rightsTopics,
  searchResults,
} from "@/lib/data";
import {
  askLegalQuestion,
  fetchCases,
  fetchDeviceProfile,
  fetchFeed,
  fetchRightsTopics,
  saveDeviceProfile,
  searchLegal,
  type CaseDetail,
  type FeedItem,
  type RightsTopic,
  type SearchResult,
} from "@/lib/api";
import type { Profile } from "@/lib/types";

const nav = [
  { label: "Feed", icon: Bell },
  { label: "Ask AI", icon: MessageSquareText },
  { label: "Rights", icon: ShieldCheck },
  { label: "Search", icon: FileSearch },
  { label: "Cases", icon: Gavel },
];

const defaultProfile: Profile = {
  country: "United States",
  state: "California",
  city: "San Francisco",
  county: "San Francisco County",
  industry: "",
  occupation: "",
  tags: ["Tenant", "H-1B", "Gig worker"],
  email: "",
};

function loadStored<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const value = window.localStorage.getItem(key);
    return value ? (JSON.parse(value) as T) : fallback;
  } catch {
    return fallback;
  }
}

export default function Home() {
  const [profile, setProfile] = useState<Profile>(defaultProfile);
  const [profileLoaded, setProfileLoaded] = useState(false);
  const [query, setQuery] = useState("Can my landlord raise rent?");
  const [answer, setAnswer] = useState<LegalAnswer>(qaSample);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isAsking, setIsAsking] = useState(false);
  const [savedItems, setSavedItems] = useState<string[]>([]);
  const [savedTopics, setSavedTopics] = useState<string[]>([]);
  const [showSaved, setShowSaved] = useState(false);
  const [rightsQuery, setRightsQuery] = useState("");
  const [feedQuery, setFeedQuery] = useState("");
  const [feedPriority, setFeedPriority] = useState("All priorities");
  const [feedSort, setFeedSort] = useState("Impact score");
  const [search, setSearch] = useState("phone search warrant");
  const [activeSearch, setActiveSearch] = useState("phone search warrant");
  const [jurisdiction, setJurisdiction] = useState("All jurisdictions");
  const [sourceType, setSourceType] = useState("All sources");
  const [selectedCaseName, setSelectedCaseName] = useState(courtCases[0].name);
  const [liveCases, setLiveCases] = useState<CaseDetail[]>(courtCases);
  const [watchlists, setWatchlists] = useState<string[]>([
    "H-1B fee changes",
    "Rent increase notices",
    "Phone search rulings",
  ]);
  const [watchInput, setWatchInput] = useState("");
  const [showWeeklySummary, setShowWeeklySummary] = useState(false);
  const [notice, setNotice] = useState("");
  const [isLocating, setIsLocating] = useState(false);
  const [liveFeedItems, setLiveFeedItems] = useState<FeedItem[]>(feedItems);
  const [liveRightsTopics, setLiveRightsTopics] = useState<RightsTopic[]>(rightsTopics);
  const [seenFeedIds, setSeenFeedIds] = useState<string[]>([]);
  const [deviceId, setDeviceId] = useState("");

  useEffect(() => {
    const storedProfile = loadStored<Partial<Profile> | null>("legal-impact-profile", null);
    setProfile({ ...defaultProfile, ...(storedProfile ?? {}) });
    setSavedItems(loadStored<string[]>("legal-impact-saved-items", []));
    setSavedTopics(loadStored<string[]>("legal-impact-saved-topics", []));
    setWatchlists(loadStored<string[]>("legal-impact-watchlists", watchlists));
    setSeenFeedIds(loadStored<string[]>("legal-impact-seen-feed-ids", []));

    let id = window.localStorage.getItem("legal-impact-device-id");
    if (!id) {
      id = crypto.randomUUID();
      window.localStorage.setItem("legal-impact-device-id", id);
    }
    setDeviceId(id);

    if (!storedProfile) {
      fetchDeviceProfile(id)
        .then((remote) => {
          if (remote) {
            setProfile({
              ...defaultProfile,
              state: remote.state,
              city: remote.city,
              county: remote.county,
              tags: remote.tags,
              email: remote.email ?? "",
            });
          }
        })
        .catch(() => {});
    }

    setProfileLoaded(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    fetchRightsTopics()
      .then(setLiveRightsTopics)
      .catch(() => showNotice("Couldn't reach the LifeLaw backend, showing local rights topics instead."));
  }, []);

  useEffect(() => {
    fetchCases()
      .then((cases) => {
        setLiveCases(cases);
        if (cases.length > 0) setSelectedCaseName(cases[0].name);
      })
      .catch(() => showNotice("Couldn't reach the LifeLaw backend, showing local case summaries instead."));
  }, []);

  useEffect(() => {
    if (!profileLoaded) return;
    fetchFeed(profile.state, profile.tags)
      .then(setLiveFeedItems)
      .catch(() => showNotice("Couldn't reach the LifeLaw backend, showing a local feed instead."));
  }, [profileLoaded, profile.state, profile.tags]);

  useEffect(() => {
    if (profileLoaded) window.localStorage.setItem("legal-impact-profile", JSON.stringify(profile));
  }, [profile, profileLoaded]);
  useEffect(() => window.localStorage.setItem("legal-impact-saved-items", JSON.stringify(savedItems)), [savedItems]);
  useEffect(() => window.localStorage.setItem("legal-impact-saved-topics", JSON.stringify(savedTopics)), [savedTopics]);
  useEffect(() => window.localStorage.setItem("legal-impact-watchlists", JSON.stringify(watchlists)), [watchlists]);
  useEffect(() => {
    if (profileLoaded) window.localStorage.setItem("legal-impact-seen-feed-ids", JSON.stringify(seenFeedIds));
  }, [seenFeedIds, profileLoaded]);

  const filteredFeed = useMemo(() => {
    const term = feedQuery.trim().toLowerCase();
    const matches = liveFeedItems.filter((item) => {
      const profileMatch = item.affected.some((tag) => profile.tags.includes(tag));
      const queryMatch = !term || [item.title, item.summary, item.jurisdiction, ...item.affected].join(" ").toLowerCase().includes(term);
      const priorityMatch = feedPriority === "All priorities" || item.priority === feedPriority;
      return profileMatch && queryMatch && priorityMatch;
    });
    return [...matches].sort((a, b) => feedSort === "Impact score" ? b.impactScore - a.impactScore : a.title.localeCompare(b.title));
  }, [feedPriority, feedQuery, feedSort, liveFeedItems, profile.tags]);
  const newFeedItems = useMemo(
    () => (profileLoaded ? filteredFeed.filter((item) => !seenFeedIds.includes(item.id)) : []),
    [filteredFeed, seenFeedIds, profileLoaded],
  );

  function markFeedSeen() {
    setSeenFeedIds((current) => Array.from(new Set([...current, ...filteredFeed.map((item) => item.id)])));
  }
  const filteredTopics = useMemo(() => {
    const term = rightsQuery.trim().toLowerCase();
    if (!term) return liveRightsTopics;
    return liveRightsTopics.filter((topic) =>
      [topic.name, topic.summary, ...topic.laws, ...topic.cases, ...topic.questions]
        .join(" ")
        .toLowerCase()
        .includes(term),
    );
  }, [rightsQuery, liveRightsTopics]);
  const [liveResults, setLiveResults] = useState<SearchResult[]>([]);

  useEffect(() => {
    searchLegal(activeSearch.trim() || " ", jurisdiction, sourceType)
      .then(setLiveResults)
      .catch(() => {
        showNotice("Couldn't reach the LifeLaw backend, showing local search results instead.");
        const term = activeSearch.trim().toLowerCase();
        setLiveResults(
          searchResults.filter((result) => {
            const matchesTerm = !term || [result.title, result.summary, result.category].join(" ").toLowerCase().includes(term);
            const matchesJurisdiction = jurisdiction === "All jurisdictions" || result.jurisdiction === jurisdiction;
            const matchesSource = sourceType === "All sources" || result.type === sourceType;
            return matchesTerm && matchesJurisdiction && matchesSource;
          }),
        );
      });
  }, [activeSearch, jurisdiction, sourceType]);
  const filteredResults = liveResults;
  const selectedCase = liveCases.find((courtCase) => courtCase.name === selectedCaseName) ?? liveCases[0];

  function showNotice(message: string) {
    setNotice(message);
    window.setTimeout(() => setNotice(""), 2800);
  }

  function persistProfile() {
    if (!deviceId) return;
    saveDeviceProfile({ deviceId, state: profile.state, city: profile.city, county: profile.county, tags: profile.tags, email: profile.email || null })
      .then(() => showNotice("Profile saved on this device and synced."))
      .catch(() => showNotice("Profile saved on this device (couldn't reach the backend to sync)."));
  }

  function useCurrentLocation() {
    if (!navigator.geolocation) {
      showNotice("Location is not supported in this browser. Enter your jurisdiction manually.");
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const response = await fetch("/api/location", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            }),
          });
          const location = (await response.json()) as { state?: string; county?: string; city?: string; error?: string };
          if (!response.ok || !location.state || !location.county) throw new Error(location.error);
          setProfile((current) => ({
            ...current,
            state: location.state ?? current.state,
            county: location.county ?? current.county,
            city: location.city || current.city,
          }));
          showNotice("Location resolved. Confirm the city and county before saving.");
        } catch (error) {
          showNotice(error instanceof Error && error.message ? error.message : "Location could not be resolved.");
        } finally {
          setIsLocating(false);
        }
      },
      () => {
        setIsLocating(false);
        showNotice("Location was not shared. Enter your jurisdiction manually.");
      },
      { enableHighAccuracy: false, timeout: 10_000, maximumAge: 300_000 },
    );
  }

  async function askQuestion(question = query) {
    const trimmed = question.trim();
    if (!trimmed) return;
    setQuery(question);
    setSuggestions(getQuestionSuggestions(trimmed));
    setIsAsking(true);
    try {
      const response = await askLegalQuestion(trimmed, profile.state, profile.tags);
      setAnswer(response);
    } catch {
      showNotice("Couldn't reach the LifeLaw backend, showing a local answer instead.");
      setAnswer(getLifeImpactAnswer(trimmed, profile));
    } finally {
      setIsAsking(false);
    }
  }

  function toggleSaved(title: string, kind: "item" | "topic") {
    const setter = kind === "item" ? setSavedItems : setSavedTopics;
    setter((current) => {
      const isSaved = current.includes(title);
      showNotice(isSaved ? "Removed from saved items." : "Saved for later.");
      return isSaved ? current.filter((item) => item !== title) : [...current, title];
    });
  }

  function addWatchlist() {
    const value = watchInput.trim();
    if (!value) return;
    setWatchlists((current) => (current.includes(value) ? current : [...current, value]));
    setWatchInput("");
    showNotice("Watchlist added.");
  }

  return (
    <main className="min-h-screen">
      <section className="border-b bg-card">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-4 py-5 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex size-11 items-center justify-center rounded-md bg-primary text-primary-foreground">
                <Landmark className="size-6" aria-hidden="true" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">LifeLaw</h1>
                <p className="text-sm text-muted-foreground">Personalized legal intelligence for real-life decisions.</p>
              </div>
            </div>
            <nav aria-label="Page sections" className="flex flex-wrap gap-2">
              {nav.map((item) => (
                <a key={item.label} href={`#${item.label.toLowerCase().replace(" ", "-")}`} className="inline-flex h-9 items-center gap-2 rounded-md border bg-background px-3 text-sm font-medium hover:bg-muted">
                  <item.icon className="size-4" aria-hidden="true" />{item.label}
                </a>
              ))}
            </nav>
          </div>
          {notice && <p role="status" className="rounded-md bg-secondary px-3 py-2 text-sm font-medium text-secondary-foreground">{notice}</p>}
        </div>
      </section>

      <ProfileHero
        profile={profile}
        setProfile={setProfile}
        isLocating={isLocating}
        onUseCurrentLocation={useCurrentLocation}
        onSaveProfile={persistProfile}
      />

      <section className="border-b bg-muted/45">
        <div className="mx-auto flex max-w-7xl items-start gap-3 px-4 py-3 text-sm sm:px-6 lg:px-8">
          <AlertCircle className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
          <p><span className="font-semibold">Live federal bill tracking enabled.</span> The feed blends a curated reference library with recent bills pulled live from Congress.gov.</p>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[1.3fr_0.7fr] lg:px-8">
        <FeedPanel
          showSaved={showSaved}
          setShowSaved={setShowSaved}
          savedItems={savedItems}
          savedTopics={savedTopics}
          toggleSaved={toggleSaved}
          newFeedItems={newFeedItems}
          markFeedSeen={markFeedSeen}
          feedQuery={feedQuery}
          setFeedQuery={setFeedQuery}
          feedPriority={feedPriority}
          setFeedPriority={setFeedPriority}
          feedSort={feedSort}
          setFeedSort={setFeedSort}
          filteredFeed={filteredFeed}
          deviceId={deviceId}
          authorTag={profile.tags[0] ?? null}
        />

        <aside className="space-y-6">
          <AskAiPanel
            query={query}
            setQuery={setQuery}
            isAsking={isAsking}
            askQuestion={askQuestion}
            answer={answer}
            suggestions={suggestions}
          />
          <WatchlistsPanel
            watchlists={watchlists}
            setWatchlists={setWatchlists}
            watchInput={watchInput}
            setWatchInput={setWatchInput}
            addWatchlist={addWatchlist}
            showWeeklySummary={showWeeklySummary}
            setShowWeeklySummary={setShowWeeklySummary}
            feedCount={filteredFeed.length}
            profileTags={profile.tags}
          />
        </aside>
      </section>

      <RightsSection
        rightsQuery={rightsQuery}
        setRightsQuery={setRightsQuery}
        filteredTopics={filteredTopics}
        savedTopics={savedTopics}
        toggleSaved={toggleSaved}
      />

      <SearchSection
        search={search}
        setSearch={setSearch}
        activeSearch={activeSearch}
        setActiveSearch={setActiveSearch}
        jurisdiction={jurisdiction}
        setJurisdiction={setJurisdiction}
        sourceType={sourceType}
        setSourceType={setSourceType}
        filteredResults={filteredResults}
      />

      <CasesSection
        liveCases={liveCases}
        selectedCaseName={selectedCaseName}
        setSelectedCaseName={setSelectedCaseName}
        selectedCase={selectedCase}
      />

      <footer className="mx-auto max-w-7xl px-4 py-6 text-sm text-muted-foreground sm:px-6 lg:px-8"><div className="flex flex-col gap-3 border-t pt-6 md:flex-row md:items-center md:justify-between"><p>LifeLaw is an educational legal intelligence platform, not a law firm.</p><p className="flex items-center gap-2"><AlertCircle className="size-4" aria-hidden="true" />Verify official sources and consult a licensed attorney for legal guidance.</p></div></footer>
    </main>
  );
}
