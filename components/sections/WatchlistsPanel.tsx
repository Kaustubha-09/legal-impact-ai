import { Bell, Plus, Trash2 } from "lucide-react";
import { Button, Card, Input } from "@/components/ui";

export function WatchlistsPanel({
  watchlists,
  setWatchlists,
  watchInput,
  setWatchInput,
  addWatchlist,
  showWeeklySummary,
  setShowWeeklySummary,
  feedCount,
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
  profileTags: string[];
}) {
  return (
    <Card className="p-5" id="saved-alerts">
      <div className="flex items-center gap-2"><Bell className="size-5 text-primary" aria-hidden="true" /><h2 className="text-xl font-semibold">Watchlists and alerts</h2></div>
      <p className="mt-1 text-sm text-muted-foreground">Track topics and review a personalized weekly digest.</p>
      <div className="mt-4 flex gap-2"><Input value={watchInput} placeholder="Add a watchlist topic" onChange={(event) => setWatchInput(event.target.value)} onKeyDown={(event) => event.key === "Enter" && addWatchlist()} /><Button aria-label="Add watchlist" onClick={addWatchlist}><Plus className="size-4" aria-hidden="true" /></Button></div>
      <div className="mt-3 space-y-2">{watchlists.map((watch) => <div key={watch} className="flex items-center justify-between gap-3 rounded-md border bg-background p-3"><span className="text-sm font-medium">{watch}</span><button type="button" aria-label={`Remove ${watch} watchlist`} onClick={() => setWatchlists((current) => current.filter((item) => item !== watch))} className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-destructive"><Trash2 className="size-4" aria-hidden="true" /></button></div>)}</div>
      <Button className="mt-4 w-full" variant="secondary" onClick={() => setShowWeeklySummary((current) => !current)}>{showWeeklySummary ? "Hide weekly summary" : 'Weekly "What changed for me?"'}</Button>
      {showWeeklySummary && <div className="mt-3 rounded-md border border-primary/30 bg-secondary/50 p-3 text-sm leading-6 text-secondary-foreground"><strong>This week:</strong> {feedCount ? `${feedCount} updates match ${profileTags.join(", ") || "your profile"}. Review the saved feed items and your watchlists for changes.` : "No current feed items match your profile. Add tags or a watchlist to broaden monitoring."}</div>}
    </Card>
  );
}
