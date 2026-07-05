"use client";

import {
  AlertCircle,
  Bell,
  Bookmark,
  Building2,
  Check,
  CheckCircle2,
  ExternalLink,
  FileSearch,
  Gavel,
  Landmark,
  LocateFixed,
  MapPin,
  MessageSquareText,
  Plus,
  Search,
  ShieldCheck,
  Sparkles,
  Trash2,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Badge, Button, Card, Input, Select } from "@/components/ui";
import { ConfidenceBadge, ImpactCard, PriorityBadge } from "@/components/impact";
import {
  courtCases,
  feedItems,
  getLifeImpactAnswer,
  getQuestionSuggestions,
  type LegalAnswer,
  profileTags,
  qaExamples,
  qaSample,
  rightsTopics,
  searchResults,
} from "@/lib/data";
import { askLegalQuestion, fetchFeed, fetchRightsTopics, type FeedItem, type RightsTopic } from "@/lib/api";

const nav = [
  { label: "Feed", icon: Bell },
  { label: "Ask AI", icon: MessageSquareText },
  { label: "Rights", icon: ShieldCheck },
  { label: "Search", icon: FileSearch },
  { label: "Cases", icon: Gavel },
];

type Profile = {
  country: string;
  state: string;
  city: string;
  county: string;
  industry: string;
  occupation: string;
  tags: string[];
};

const defaultProfile: Profile = {
  country: "United States",
  state: "California",
  city: "San Francisco",
  county: "San Francisco County",
  industry: "",
  occupation: "",
  tags: ["Tenant", "H-1B", "Gig worker"],
};

const stateOptions = [
  "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware",
  "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky",
  "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota", "Mississippi", "Missouri",
  "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey", "New Mexico", "New York",
  "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island",
  "South Carolina", "South Dakota", "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington",
  "West Virginia", "Wisconsin", "Wyoming", "District of Columbia",
];

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

  useEffect(() => {
    setProfile({ ...defaultProfile, ...loadStored<Partial<Profile>>("legal-impact-profile", {}) });
    setSavedItems(loadStored<string[]>("legal-impact-saved-items", []));
    setSavedTopics(loadStored<string[]>("legal-impact-saved-topics", []));
    setWatchlists(loadStored<string[]>("legal-impact-watchlists", watchlists));
    setSeenFeedIds(loadStored<string[]>("legal-impact-seen-feed-ids", []));
    setProfileLoaded(true);
  }, []);

  useEffect(() => {
    fetchRightsTopics()
      .then(setLiveRightsTopics)
      .catch(() => showNotice("Couldn't reach the LifeLaw backend, showing local rights topics instead."));
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
  }, [rightsQuery]);
  const filteredResults = useMemo(() => {
    const term = activeSearch.trim().toLowerCase();
    return searchResults.filter((result) => {
      const matchesTerm = !term || [result.title, result.summary, result.category].join(" ").toLowerCase().includes(term);
      const matchesJurisdiction = jurisdiction === "All jurisdictions" || result.jurisdiction === jurisdiction;
      const matchesSource = sourceType === "All sources" || result.type === sourceType;
      return matchesTerm && matchesJurisdiction && matchesSource;
    });
  }, [activeSearch, jurisdiction, sourceType]);
  const selectedCase = courtCases.find((courtCase) => courtCase.name === selectedCaseName) ?? courtCases[0];

  function showNotice(message: string) {
    setNotice(message);
    window.setTimeout(() => setNotice(""), 2800);
  }

  function toggleTag(tag: string) {
    setProfile((current) => ({
      ...current,
      tags: current.tags.includes(tag)
        ? current.tags.filter((item) => item !== tag)
        : [...current.tags, tag],
    }));
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

      <section className="border-b bg-secondary/45">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[0.95fr_1.35fr] lg:px-8">
          <div className="flex flex-col justify-center gap-5">
            <Badge className="w-fit bg-card">Educational legal intelligence</Badge>
            <div className="space-y-3">
              <h2 className="max-w-xl text-4xl font-bold sm:text-5xl">Know what laws mean for you.</h2>
              <p className="max-w-2xl text-lg leading-8 text-muted-foreground">LifeLaw monitors laws, regulations, court decisions, and government actions, then explains their impact on your life.</p>
            </div>
            <a href="#onboarding" className="inline-flex h-10 w-fit items-center justify-center rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground hover:bg-primary/90">Create My Legal Profile</a>
            <div className="grid gap-3 sm:grid-cols-3">
              {[['Personalized', 'State, city, county, and profile tags'], ['Cited', 'Source-aware legal records'], ['Educational', 'Not legal advice or a law firm']].map(([title, text]) => <div key={title} className="rounded-md border bg-card/80 p-4"><p className="font-semibold">{title}</p><p className="mt-1 text-sm text-muted-foreground">{text}</p></div>)}
            </div>
          </div>
          <Card className="p-5" id="onboarding">
            <div className="mb-5 flex items-start justify-between gap-4"><div><h3 className="text-xl font-semibold">Your legal profile</h3><p className="mt-1 text-sm text-muted-foreground">Saved on this device and used to personalize the feed.</p></div><Sparkles className="size-5 text-primary" aria-hidden="true" /></div>
            <div className="grid gap-3 sm:grid-cols-3">
              <label className="space-y-1 text-sm font-medium">Country<Input value={profile.country} onChange={(event) => setProfile((current) => ({ ...current, country: event.target.value }))} /></label>
              <label className="space-y-1 text-sm font-medium">State<Select value={profile.state} onChange={(event) => setProfile((current) => ({ ...current, state: event.target.value }))}>{stateOptions.map((state) => <option key={state}>{state}</option>)}</Select></label>
              <label className="space-y-1 text-sm font-medium">City<Input value={profile.city} onChange={(event) => setProfile((current) => ({ ...current, city: event.target.value }))} /></label>
              <label className="space-y-1 text-sm font-medium">County<Input value={profile.county} onChange={(event) => setProfile((current) => ({ ...current, county: event.target.value }))} /></label>
              <label className="space-y-1 text-sm font-medium">Industry<Input value={profile.industry} placeholder="Optional" onChange={(event) => setProfile((current) => ({ ...current, industry: event.target.value }))} /></label>
              <label className="space-y-1 text-sm font-medium">Occupation<Input value={profile.occupation} placeholder="Optional" onChange={(event) => setProfile((current) => ({ ...current, occupation: event.target.value }))} /></label>
            </div>
            <div className="mt-3 flex flex-col gap-2 rounded-md border bg-muted/40 p-3 sm:flex-row sm:items-center sm:justify-between"><p className="text-xs leading-5 text-muted-foreground">Use your current location to fill the legal jurisdiction. Precise coordinates are used once and are not saved.</p><Button type="button" variant="secondary" disabled={isLocating} onClick={useCurrentLocation}>{isLocating ? "Locating" : <><LocateFixed className="size-4" aria-hidden="true" />Use current location</>}</Button></div>
            <div className="mt-5"><p className="mb-2 text-sm font-medium">Profile tags</p><div className="flex flex-wrap gap-2">{profileTags.map((tag) => <button key={tag} type="button" aria-pressed={profile.tags.includes(tag)} onClick={() => toggleTag(tag)} className={`rounded-full border px-3 py-2 text-sm font-medium transition ${profile.tags.includes(tag) ? 'border-primary bg-primary text-primary-foreground' : 'bg-card hover:bg-muted'}`}>{tag}</button>)}</div></div>
            <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><p className="flex items-center gap-2 text-sm text-muted-foreground"><MapPin className="size-4" aria-hidden="true" />Personalization: {profile.state} and federal sources.</p><Button onClick={() => showNotice("Profile saved on this device.")}>Save profile</Button></div>
          </Card>
        </div>
      </section>

      <section className="border-b bg-muted/45">
        <div className="mx-auto flex max-w-7xl items-start gap-3 px-4 py-3 text-sm sm:px-6 lg:px-8">
          <AlertCircle className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
          <p><span className="font-semibold">Live federal bill tracking enabled.</span> The feed blends a curated reference library with recent bills pulled live from Congress.gov.</p>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[1.3fr_0.7fr] lg:px-8">
        <div className="space-y-6" id="feed">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between"><div><h2 className="text-2xl font-bold">Personalized legal feed</h2><p className="text-sm text-muted-foreground">Reference records ranked by your selected profile tags.</p></div><Button variant="secondary" onClick={() => setShowSaved((current) => !current)}><Bookmark className="size-4" aria-hidden="true" />{showSaved ? "Show feed" : `Saved items (${savedItems.length + savedTopics.length})`}</Button></div>
          {!showSaved && newFeedItems.length > 0 && <div className="flex flex-col gap-2 rounded-md border border-primary/30 bg-secondary/50 p-3 text-sm sm:flex-row sm:items-center sm:justify-between"><p className="flex items-center gap-2 font-medium text-secondary-foreground"><Bell className="size-4" aria-hidden="true" />{newFeedItems.length} new update{newFeedItems.length === 1 ? "" : "s"} match your profile since your last visit.</p><Button variant="secondary" onClick={markFeedSeen}>Mark all as read</Button></div>}
          {!showSaved && <div className="grid gap-3 rounded-md border bg-card p-3 sm:grid-cols-3"><Input value={feedQuery} placeholder="Filter feed" onChange={(event) => setFeedQuery(event.target.value)} aria-label="Filter legal feed" /><Select value={feedPriority} onChange={(event) => setFeedPriority(event.target.value)} aria-label="Filter feed priority"><option>All priorities</option><option>Priority 1</option><option>Priority 2</option><option>Priority 3</option><option>Priority 4</option></Select><Select value={feedSort} onChange={(event) => setFeedSort(event.target.value)} aria-label="Sort legal feed"><option>Impact score</option><option>Title</option></Select></div>}
          {showSaved ? <SavedList items={[...savedItems, ...savedTopics]} /> : filteredFeed.length ? <div className="space-y-4">{filteredFeed.map((item) => <Card key={item.id} className="p-5"><div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between"><div className="space-y-3"><div className="flex flex-wrap gap-2">{newFeedItems.some((newItem) => newItem.id === item.id) && <Badge className="border-primary bg-primary text-primary-foreground">New</Badge>}<Badge>{item.sourceType}</Badge><Badge className="bg-accent text-accent-foreground">{item.jurisdiction}</Badge><Badge className="bg-card">{item.publicationDate}</Badge><Badge className="bg-secondary">{item.priority}</Badge><Badge className="bg-card">Confidence: {item.confidence}</Badge><Badge className="bg-card">Impact {item.impactScore}/100</Badge></div><h3 className="text-xl font-semibold">{item.title}</h3><p className="text-sm leading-6 text-muted-foreground">{item.summary}</p></div><BookmarkButton saved={savedItems.includes(item.title)} label={item.title} onClick={() => toggleSaved(item.title, "item")} /></div><div className="mt-5 grid gap-4 md:grid-cols-2"><ImpactBlock title="Who is affected" values={item.affected} /><ImpactBlock title="Rights affected" values={item.rights} /></div><div className="mt-5 grid gap-4 lg:grid-cols-2"><InfoBlock title="Why this matters" text={item.whyItMatters} /><InfoBlock title="Personal impact" text={item.personalImpact} highlighted /></div><p className="mt-4 text-xs text-muted-foreground">Sources: {item.citations.join(", ")}</p></Card>)}</div> : <EmptyState title="No reference records match" text="Broaden the feed filters or update your profile tags." />}
        </div>

        <aside className="space-y-6">
          <Card className="p-5" id="ask-ai"><div className="flex items-start justify-between gap-3"><div><h2 className="text-xl font-semibold">LifeLaw Q&A</h2><p className="mt-1 text-sm text-muted-foreground">Life-impact analysis from the LifeLaw backend, using your saved profile.</p></div><Badge className="bg-card">{isAsking ? "Asking…" : "Backend analysis"}</Badge></div><div className="mt-4 flex gap-2"><Input value={query} placeholder="Type a legal question" onChange={(event) => setQuery(event.target.value)} onKeyDown={(event) => event.key === "Enter" && askQuestion()} /><Button aria-label="Ask question" onClick={() => askQuestion()} disabled={isAsking}><Search className="size-4" aria-hidden="true" /></Button></div><div className="mt-3 flex flex-wrap gap-2">{qaExamples.map((example) => <button key={example} type="button" onClick={() => askQuestion(example)} className="rounded-full border bg-background px-3 py-1.5 text-xs font-medium hover:bg-muted">{example}</button>)}</div><div className="mt-4 rounded-md border bg-muted/40 p-4" aria-live="polite"><p className="text-sm font-semibold">Quick answer</p><p className="mt-2 text-sm leading-6 text-muted-foreground">{answer.quick_answer}</p><LifeImpactSummary answer={answer} />{suggestions.length > 0 && <div className="mt-4 rounded-md border border-primary/30 bg-card p-3"><p className="text-sm font-semibold">Help me refine this question</p><p className="mt-1 text-xs leading-5 text-muted-foreground">A more specific question can produce a better answer.</p><div className="mt-3 flex flex-wrap gap-2">{suggestions.map((suggestion) => <button key={suggestion} type="button" onClick={() => askQuestion(suggestion)} className="rounded-full border bg-background px-3 py-1.5 text-left text-xs font-medium hover:bg-muted">{suggestion}</button>)}</div></div>}<StructuredAnswer label="Rights" values={answer.rights} /><StructuredAnswer label="Responsibilities" values={answer.responsibilities} /><StructuredAnswer label="Relevant laws" values={answer.relevant_laws} /><StructuredAnswer label="Court rulings" values={answer.court_rulings} /><StructuredAnswer label="Exceptions" values={answer.exceptions} /><StructuredAnswer label="Deadlines" values={answer.deadlines} /><StructuredAnswer label="Next steps" values={answer.next_steps} /><StructuredAnswer label="Sources" values={answer.sources} /><p className="mt-4 rounded-md border bg-card p-3 text-xs leading-5 text-muted-foreground">{answer.disclaimer}</p></div></Card>

          <Card className="p-5" id="saved-alerts"><div className="flex items-center gap-2"><Bell className="size-5 text-primary" aria-hidden="true" /><h2 className="text-xl font-semibold">Watchlists and alerts</h2></div><p className="mt-1 text-sm text-muted-foreground">Track topics and review a personalized weekly digest.</p><div className="mt-4 flex gap-2"><Input value={watchInput} placeholder="Add a watchlist topic" onChange={(event) => setWatchInput(event.target.value)} onKeyDown={(event) => event.key === "Enter" && addWatchlist()} /><Button aria-label="Add watchlist" onClick={addWatchlist}><Plus className="size-4" aria-hidden="true" /></Button></div><div className="mt-3 space-y-2">{watchlists.map((watch) => <div key={watch} className="flex items-center justify-between gap-3 rounded-md border bg-background p-3"><span className="text-sm font-medium">{watch}</span><button type="button" aria-label={`Remove ${watch} watchlist`} onClick={() => setWatchlists((current) => current.filter((item) => item !== watch))} className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-destructive"><Trash2 className="size-4" aria-hidden="true" /></button></div>)}</div><Button className="mt-4 w-full" variant="secondary" onClick={() => setShowWeeklySummary((current) => !current)}>{showWeeklySummary ? "Hide weekly summary" : 'Weekly "What changed for me?"'}</Button>{showWeeklySummary && <div className="mt-3 rounded-md border border-primary/30 bg-secondary/50 p-3 text-sm leading-6 text-secondary-foreground"><strong>This week:</strong> {filteredFeed.length ? `${filteredFeed.length} updates match ${profile.tags.join(", ") || "your profile"}. Review the saved feed items and your watchlists for changes.` : "No current feed items match your profile. Add tags or a watchlist to broaden monitoring."}</div>}</Card>
        </aside>
      </section>

      <section className="border-y bg-card" id="rights"><div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8"><div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between"><div><h2 className="text-2xl font-bold">Rights library</h2><p className="text-sm text-muted-foreground">Plain-English topics with laws, cases, common questions, and state notes.</p></div><Input className="md:max-w-sm" value={rightsQuery} placeholder="Search rights topics" onChange={(event) => setRightsQuery(event.target.value)} /></div>{filteredTopics.length ? <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">{filteredTopics.map((topic) => <Card key={topic.name} className="p-4"><div className="flex items-start justify-between gap-3"><ShieldCheck className="size-5 text-primary" aria-hidden="true" /><BookmarkButton saved={savedTopics.includes(topic.name)} label={topic.name} onClick={() => toggleSaved(topic.name, "topic")} /></div><h3 className="mt-3 font-semibold">{topic.name}</h3><p className="mt-2 min-h-16 text-sm leading-6 text-muted-foreground">{topic.summary}</p><div className="mt-4 space-y-2 text-xs text-muted-foreground"><p><span className="font-semibold text-foreground">Laws:</span> {topic.laws.join(", ")}</p><p><span className="font-semibold text-foreground">Cases:</span> {topic.cases.join(", ")}</p><p><span className="font-semibold text-foreground">Common questions:</span> {topic.questions.join(" ")}</p><p><span className="font-semibold text-foreground">State note:</span> {topic.stateNotes}</p></div></Card>)}</div> : <div className="mt-6"><EmptyState title="No rights topics found" text="Try a broader term such as housing, work, consumer, or privacy." /></div>}</div></section>

      <section className="mx-auto grid max-w-7xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8"><Card className="h-fit p-5" id="search"><h2 className="text-2xl font-bold">Legal search</h2><p className="mt-1 text-sm text-muted-foreground">Search the local MVP source index by words, jurisdiction, and source type.</p><div className="mt-5 space-y-3"><Input value={search} onChange={(event) => setSearch(event.target.value)} onKeyDown={(event) => event.key === "Enter" && setActiveSearch(search)} aria-label="Search legal sources" /><div className="grid gap-3 sm:grid-cols-2"><Select value={jurisdiction} onChange={(event) => setJurisdiction(event.target.value)} aria-label="Filter by jurisdiction"><option>All jurisdictions</option><option>Federal</option><option>California</option><option>U.S. Supreme Court</option></Select><Select value={sourceType} onChange={(event) => setSourceType(event.target.value)} aria-label="Filter by source type"><option>All sources</option><option>Court opinion</option><option>Federal statute</option><option>State statute</option><option>Regulation</option></Select></div><Button className="w-full" onClick={() => setActiveSearch(search)}><FileSearch className="size-4" aria-hidden="true" />Search legal sources</Button></div><div className="mt-5 rounded-md border bg-muted/40 p-4"><p className="text-sm font-semibold">Source summary</p><p className="mt-2 text-sm leading-6 text-muted-foreground">{filteredResults.length ? `${filteredResults.length} matching source${filteredResults.length === 1 ? "" : "s"}. Results are summarized from the indexed source metadata; verify the official text before acting.` : "No indexed sources match these filters. Broaden the terms or remove a filter."}</p></div></Card><div className="space-y-4">{filteredResults.length ? filteredResults.map((result) => <Card key={result.title} className="p-5"><div className="flex flex-wrap gap-2"><Badge>{result.type}</Badge><Badge className="bg-accent text-accent-foreground">{result.jurisdiction}</Badge><Badge className="bg-card">{result.category}</Badge></div><h3 className="mt-3 text-lg font-semibold">{result.title}</h3><p className="mt-2 text-sm leading-6 text-muted-foreground">{result.summary}</p><p className="mt-3 text-xs text-muted-foreground">Date: {result.date}</p></Card>) : <EmptyState title="No search results" text="The local source index does not have a matching document yet." />}</div></section>

      <section className="border-t bg-card" id="cases"><div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8"><div className="grid gap-6 lg:grid-cols-[0.7fr_1.3fr]"><div><h2 className="text-2xl font-bold">Court ruling summaries</h2><p className="mt-2 text-sm leading-6 text-muted-foreground">Select a case to review the issue, holding, reasoning, rights affected, impact, and source.</p><div className="mt-5 space-y-2">{courtCases.map((courtCase) => <button key={courtCase.name} type="button" aria-pressed={selectedCaseName === courtCase.name} onClick={() => setSelectedCaseName(courtCase.name)} className={`block w-full rounded-md border p-3 text-left text-sm font-medium ${selectedCaseName === courtCase.name ? "border-primary bg-secondary" : "bg-background hover:bg-muted"}`}>{courtCase.name}<span className="mt-1 block text-xs font-normal text-muted-foreground">{courtCase.court}</span></button>)}</div></div><Card className="p-5"><div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between"><div><Badge>{selectedCase.court}</Badge><h3 className="mt-3 text-xl font-semibold">{selectedCase.name}</h3><p className="mt-1 text-sm text-muted-foreground">{selectedCase.citation} - {selectedCase.date}</p></div><Building2 className="size-6 text-primary" aria-hidden="true" /></div><div className="mt-5 grid gap-4 md:grid-cols-2"><CaseField title="Issue" text={selectedCase.issue} /><CaseField title="Holding" text={selectedCase.holding} /><CaseField title="Reasoning" text={selectedCase.reasoning} /><CaseField title="Rights affected" text={selectedCase.rights} /><CaseField title="Who is impacted" text={selectedCase.impacted} /></div><div className="mt-4 rounded-md border bg-secondary/55 p-4"><p className="text-sm font-semibold">Plain-English explanation</p><p className="mt-2 text-sm leading-6 text-secondary-foreground">{selectedCase.explanation}</p></div><a href={selectedCase.source} target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline">Read the source opinion <ExternalLink className="size-4" aria-hidden="true" /></a></Card></div></div></section>

      <footer className="mx-auto max-w-7xl px-4 py-6 text-sm text-muted-foreground sm:px-6 lg:px-8"><div className="flex flex-col gap-3 border-t pt-6 md:flex-row md:items-center md:justify-between"><p>LifeLaw is an educational legal intelligence platform, not a law firm.</p><p className="flex items-center gap-2"><AlertCircle className="size-4" aria-hidden="true" />Verify official sources and consult a licensed attorney for legal guidance.</p></div></footer>
    </main>
  );
}

function BookmarkButton({ saved, label, onClick }: { saved: boolean; label: string; onClick: () => void }) {
  return <Button variant="ghost" aria-label={`${saved ? "Remove" : "Bookmark"} ${label}`} aria-pressed={saved} onClick={onClick}><Bookmark className={`size-5 ${saved ? "fill-primary text-primary" : ""}`} aria-hidden="true" /></Button>;
}

function SavedList({ items }: { items: string[] }) {
  return items.length ? <Card className="p-5"><h3 className="font-semibold">Saved items</h3><ul className="mt-3 space-y-2">{items.map((item) => <li key={item} className="flex items-center gap-2 text-sm"><Check className="size-4 text-primary" aria-hidden="true" />{item}</li>)}</ul></Card> : <EmptyState title="Nothing saved yet" text="Bookmark a feed update or rights topic to keep it here." />;
}

function EmptyState({ title, text }: { title: string; text: string }) {
  return <Card className="p-5"><p className="font-semibold">{title}</p><p className="mt-1 text-sm leading-6 text-muted-foreground">{text}</p></Card>;
}

function ImpactBlock({ title, values }: { title: string; values: string[] }) {
  return <div className="rounded-md border bg-background p-4"><p className="text-sm font-semibold">{title}</p><div className="mt-2 flex flex-wrap gap-2">{values.map((value) => <Badge key={value} className="bg-card">{value}</Badge>)}</div></div>;
}

function InfoBlock({ title, text, highlighted = false }: { title: string; text: string; highlighted?: boolean }) {
  return <div className={`rounded-md border p-4 ${highlighted ? "border-primary/30 bg-secondary/60" : "bg-muted/45"}`}><p className="text-sm font-semibold">{title}</p><p className="mt-2 text-sm leading-6 text-muted-foreground">{text}</p></div>;
}

function StructuredAnswer({ label, values }: { label: string; values: string[] }) {
  return <div className="mt-4"><p className="text-sm font-semibold">{label}</p><ul className="mt-2 space-y-2">{values.map((value) => <li key={value} className="flex gap-2 text-sm leading-6 text-muted-foreground"><CheckCircle2 className="mt-1 size-4 shrink-0 text-primary" aria-hidden="true" /><span>{value}</span></li>)}</ul></div>;
}

function LifeImpactSummary({ answer }: { answer: LegalAnswer }) {
  if (!answer.what_changed && !answer.affects_you?.length) return null;

  return <section className="mt-4 border-t pt-4" aria-label="Life impact analysis">
    <div className="flex flex-wrap gap-2">
      {answer.source_type && <Badge className="bg-card">{answer.source_type}</Badge>}
      <PriorityBadge priority={answer.priority} />
      <ConfidenceBadge confidence={answer.confidence} />
    </div>
    {answer.what_changed && <ImpactCard title="What changed" text={answer.what_changed} />}
    {answer.why_it_matters && <ImpactCard title="Why it matters" text={answer.why_it_matters} />}
    {answer.affects_you && <StructuredAnswer label="Does this affect you?" values={answer.affects_you} />}
    {answer.not_affected && <StructuredAnswer label="Who may not be affected" values={answer.not_affected} />}
    {answer.positive_impacts && <StructuredAnswer label="Potential positive impacts" values={answer.positive_impacts} />}
    {answer.negative_impacts && <StructuredAnswer label="Potential negative impacts" values={answer.negative_impacts} />}
    {answer.risks && <StructuredAnswer label="Risks" values={answer.risks} />}
    {answer.opportunities && <StructuredAnswer label="Opportunities" values={answer.opportunities} />}
    {answer.facts && <StructuredAnswer label="Facts" values={answer.facts} />}
    {answer.interpretations && <StructuredAnswer label="Interpretation" values={answer.interpretations} />}
    {answer.predictions && <StructuredAnswer label="Prediction" values={answer.predictions} />}
  </section>;
}

function CaseField({ title, text }: { title: string; text: string }) {
  return <div className="rounded-md border bg-background p-4"><p className="text-sm font-semibold">{title}</p><p className="mt-2 text-sm leading-6 text-muted-foreground">{text}</p></div>;
}
