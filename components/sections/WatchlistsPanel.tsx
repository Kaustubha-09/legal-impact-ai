import { Bell, Plus, Trash2 } from "lucide-react";
import { Button, Card, Input } from "@/components/ui";
import type { FeedItem } from "@/lib/api";
import { jurisdictionBadgeClass } from "@/lib/jurisdiction";

export function WatchlistsPanel({
  watchlists,
  setWatchlists,
  watchInput,
  setWatchInput,
  addWatchlist,
  showWeeklySummary,
  setShowWeeklySummary,
  feedCount,
  newFeedItems,
  profileTags,
}: {
  watchlists: string[];
  setWatchlists: (updater: (current: string[]) => string[]) => void;
  watchInput: string;
  setWatchInput: (value: string) => void;
  addWatchlist: () => void;
  showWeeklySummary: boolean;
  setShowWeeklySummary: (updater: (current: boolean) => boolean) => void;
  feedCount: number;
  newFeedItems: FeedItem[];
  profileTags: string[];
}) {
  return (
    <Card className="p-5" id="saved-alerts">
      <div className="flex items-center gap-2"><Bell className="size-5 text-primary" aria-hidden="true" /><h2 className="text-xl font-semibold">Watchlists and alerts</h2></div>
      <p className="mt-1 text-sm text-muted-foreground">Track topics and review a personalized weekly digest.</p>
      <div className="mt-4 flex gap-2"><Input value={watchInput} placeholder="Add a watchlist topic" onChange={(event) => setWatchInput(event.target.value)} onKeyDown={(event) => event.key === "Enter" && addWatchlist()} /><Button aria-label="Add watchlist" onClick={addWatchlist}><Plus className="size-4" aria-hidden="true" /></Button></div>
      <div className="mt-3 space-y-2">{watchlists.map((watch) => <div key={watch} className="flex items-center justify-between gap-3 rounded-md border bg-background p-3"><span className="text-sm font-medium">{watch}</span><button type="button" aria-label={`Remove ${watch} watchlist`} onClick={() => setWatchlists((current) => current.filter((item) => item !== watch))} className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-destructive"><Trash2 className="size-4" aria-hidden="true" /></button></div>)}</div>
      <Button className="mt-4 w-full" variant="secondary" onClick={() => setShowWeeklySummary((current) => !current)}>{showWeeklySummary ? "Hide weekly summary" : 'Weekly "What changed for me?"'}</Button>
      {showWeeklySummary && (
        <div className="mt-3 rounded-md border border-primary/30 bg-secondary/50 p-3 text-sm text-secondary-foreground">
          {feedCount === 0 ? (
            <p className="leading-6">No current feed items match your profile. Add tags or a watchlist to broaden monitoring.</p>
          ) : newFeedItems.length === 0 ? (
            <p className="leading-6">You&apos;re all caught up — no changes since your last visit for {profileTags.join(", ") || "your profile"}.</p>
          ) : (
            <>
              <p className="font-medium leading-6">
                {newFeedItems.length} new update{newFeedItems.length === 1 ? "" : "s"} since your last visit:
              </p>
              <ul className="mt-2 space-y-2">
                {newFeedItems.map((item) => (
                  <li key={item.id} className="rounded border bg-background p-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`rounded px-1.5 py-0.5 text-xs font-medium ${jurisdictionBadgeClass(item.jurisdiction)}`}>{item.jurisdiction}</span>
                      <span className="text-xs text-muted-foreground">{item.sourceType}</span>
                    </div>
                    <p className="mt-1 text-sm font-medium leading-5">{item.title}</p>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      )}
    </Card>
  );
}
