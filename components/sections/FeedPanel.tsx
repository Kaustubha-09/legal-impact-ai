import { Bell, Bookmark } from "lucide-react";
import { Badge, Button, Card, Input, Select } from "@/components/ui";
import { BookmarkButton, EmptyState, ImpactBlock, InfoBlock, SavedList } from "@/components/page-blocks";
import type { FeedItem } from "@/lib/api";

export function FeedPanel({
  showSaved,
  setShowSaved,
  savedItems,
  savedTopics,
  toggleSaved,
  newFeedItems,
  markFeedSeen,
  feedQuery,
  setFeedQuery,
  feedPriority,
  setFeedPriority,
  feedSort,
  setFeedSort,
  filteredFeed,
}: {
  showSaved: boolean;
  setShowSaved: (updater: (current: boolean) => boolean) => void;
  savedItems: string[];
  savedTopics: string[];
  toggleSaved: (title: string, kind: "item" | "topic") => void;
  newFeedItems: FeedItem[];
  markFeedSeen: () => void;
  feedQuery: string;
  setFeedQuery: (value: string) => void;
  feedPriority: string;
  setFeedPriority: (value: string) => void;
  feedSort: string;
  setFeedSort: (value: string) => void;
  filteredFeed: FeedItem[];
}) {
  return (
    <div className="space-y-6" id="feed">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between"><div><h2 className="text-2xl font-bold">Personalized legal feed</h2><p className="text-sm text-muted-foreground">Reference records ranked by your selected profile tags.</p></div><Button variant="secondary" onClick={() => setShowSaved((current) => !current)}><Bookmark className="size-4" aria-hidden="true" />{showSaved ? "Show feed" : `Saved items (${savedItems.length + savedTopics.length})`}</Button></div>
      {!showSaved && newFeedItems.length > 0 && <div className="flex flex-col gap-2 rounded-md border border-primary/30 bg-secondary/50 p-3 text-sm sm:flex-row sm:items-center sm:justify-between"><p className="flex items-center gap-2 font-medium text-secondary-foreground"><Bell className="size-4" aria-hidden="true" />{newFeedItems.length} new update{newFeedItems.length === 1 ? "" : "s"} match your profile since your last visit.</p><Button variant="secondary" onClick={markFeedSeen}>Mark all as read</Button></div>}
      {!showSaved && <div className="grid gap-3 rounded-md border bg-card p-3 sm:grid-cols-3"><Input value={feedQuery} placeholder="Filter feed" onChange={(event) => setFeedQuery(event.target.value)} aria-label="Filter legal feed" /><Select value={feedPriority} onChange={(event) => setFeedPriority(event.target.value)} aria-label="Filter feed priority"><option>All priorities</option><option>Priority 1</option><option>Priority 2</option><option>Priority 3</option><option>Priority 4</option></Select><Select value={feedSort} onChange={(event) => setFeedSort(event.target.value)} aria-label="Sort legal feed"><option>Impact score</option><option>Title</option></Select></div>}
      {showSaved ? <SavedList items={[...savedItems, ...savedTopics]} /> : filteredFeed.length ? <div className="space-y-4">{filteredFeed.map((item) => <Card key={item.id} className="p-5"><div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between"><div className="space-y-3"><div className="flex flex-wrap gap-2">{newFeedItems.some((newItem) => newItem.id === item.id) && <Badge className="border-primary bg-primary text-primary-foreground">New</Badge>}<Badge>{item.sourceType}</Badge><Badge className="bg-accent text-accent-foreground">{item.jurisdiction}</Badge><Badge className="bg-card">{item.publicationDate}</Badge><Badge className="bg-secondary">{item.priority}</Badge><Badge className="bg-card">Confidence: {item.confidence}</Badge><Badge className="bg-card">Impact {item.impactScore}/100</Badge></div><h3 className="text-xl font-semibold">{item.title}</h3><p className="text-sm leading-6 text-muted-foreground">{item.summary}</p></div><BookmarkButton saved={savedItems.includes(item.title)} label={item.title} onClick={() => toggleSaved(item.title, "item")} /></div><div className="mt-5 grid gap-4 md:grid-cols-2"><ImpactBlock title="Who is affected" values={item.affected} /><ImpactBlock title="Rights affected" values={item.rights} /></div><div className="mt-5 grid gap-4 lg:grid-cols-2"><InfoBlock title="Why this matters" text={item.whyItMatters} /><InfoBlock title="Personal impact" text={item.personalImpact} highlighted /></div><p className="mt-4 text-xs text-muted-foreground">Sources: {item.citations.join(", ")}</p></Card>)}</div> : <EmptyState title="No reference records match" text="Broaden the feed filters or update your profile tags." />}
    </div>
  );
}
