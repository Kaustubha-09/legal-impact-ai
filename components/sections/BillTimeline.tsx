"use client";

import { useState } from "react";
import { History } from "lucide-react";
import { ApiError, fetchBillTimeline, type BillTimeline as BillTimelineData } from "@/lib/api";

export function BillTimeline({
  feedItemId,
  title,
  jurisdiction,
}: {
  feedItemId: string;
  title: string;
  jurisdiction: string;
}) {
  const [expanded, setExpanded] = useState(false);
  const [timeline, setTimeline] = useState<BillTimelineData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [notFound, setNotFound] = useState(false);

  async function toggleExpanded() {
    const next = !expanded;
    setExpanded(next);
    if (next && !timeline && !notFound) {
      setLoading(true);
      setError("");
      try {
        const loaded = await fetchBillTimeline(feedItemId, title, jurisdiction);
        setTimeline(loaded);
      } catch (err) {
        if (err instanceof ApiError && err.status === 404) {
          setNotFound(true);
        } else {
          setError("Couldn't load the timeline right now.");
        }
      } finally {
        setLoading(false);
      }
    }
  }

  return (
    <div className="mt-4 border-t pt-4">
      <button
        type="button"
        onClick={toggleExpanded}
        className="flex items-center gap-2 text-sm font-medium text-primary hover:underline"
      >
        <History className="size-4" aria-hidden="true" />
        {expanded ? "Hide timeline" : "View timeline"}
      </button>
      {expanded && (
        <div className="mt-3 space-y-3">
          {loading && <p className="text-sm text-muted-foreground">Loading timeline…</p>}
          {!loading && notFound && (
            <p className="text-sm text-muted-foreground">No timeline is available for this bill yet.</p>
          )}
          {!loading && error && <p className="text-sm text-destructive">{error}</p>}
          {!loading && timeline && (
            <div className="space-y-3">
              <ol className="space-y-3 border-l-2 border-primary/30 pl-4">
                {timeline.stages.map((stage, index) => (
                  <li key={`${stage.date}-${index}`} className="relative">
                    <span className="absolute -left-[1.4rem] top-1 size-2 rounded-full bg-primary" aria-hidden="true" />
                    <p className="text-xs font-medium text-muted-foreground">{stage.date}</p>
                    <p className="text-sm leading-6">{stage.label}</p>
                  </li>
                ))}
              </ol>
              <p className="text-xs text-muted-foreground">
                Source: <a href={timeline.url} target="_blank" rel="noreferrer" className="underline">{timeline.source}</a>
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
