"use client";

import { useState } from "react";
import { MessageSquareText } from "lucide-react";
import { Button } from "@/components/ui";
import { ApiError, getOrCreateThread, postToThread, type Thread } from "@/lib/api";

export function ThreadPanel({
  feedItemId,
  title,
  jurisdiction,
  summary,
  deviceId,
  authorTag,
}: {
  feedItemId: string;
  title: string;
  jurisdiction: string;
  summary: string;
  deviceId: string;
  authorTag: string | null;
}) {
  const [expanded, setExpanded] = useState(false);
  const [thread, setThread] = useState<Thread | null>(null);
  const [loading, setLoading] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [error, setError] = useState("");
  const [posting, setPosting] = useState(false);

  async function toggleExpanded() {
    const next = !expanded;
    setExpanded(next);
    if (next && !thread) {
      setLoading(true);
      setError("");
      try {
        const loaded = await getOrCreateThread(feedItemId, title, jurisdiction, summary);
        setThread(loaded);
      } catch {
        setError("Couldn't load the discussion right now.");
      } finally {
        setLoading(false);
      }
    }
  }

  async function submitReply() {
    const trimmed = replyText.trim();
    if (!trimmed || !thread) return;
    setPosting(true);
    setError("");
    try {
      const updated = await postToThread(thread.id, deviceId, authorTag, trimmed);
      setThread(updated);
      setReplyText("");
    } catch (err) {
      if (err instanceof ApiError && err.status === 429) {
        setError("You're posting too fast. Please wait a few seconds.");
      } else if (err instanceof ApiError && err.status === 422) {
        setError("That post is too long (max 2000 characters).");
      } else {
        setError("Couldn't post your reply right now.");
      }
    } finally {
      setPosting(false);
    }
  }

  return (
    <div className="mt-4 border-t pt-4">
      <button
        type="button"
        onClick={toggleExpanded}
        className="flex items-center gap-2 text-sm font-medium text-primary hover:underline"
      >
        <MessageSquareText className="size-4" aria-hidden="true" />
        {expanded ? "Hide discussion" : `Discuss${thread ? ` (${thread.posts.length})` : ""}`}
      </button>
      {expanded && (
        <div className="mt-3 space-y-3">
          {loading && <p className="text-sm text-muted-foreground">Loading discussion…</p>}
          {!loading && thread && (
            <>
              {thread.posts.length === 0 ? (
                <p className="text-sm text-muted-foreground">No replies yet. Be the first to share your perspective.</p>
              ) : (
                <div className="space-y-2">
                  {thread.posts.map((post) => (
                    <div key={post.id} className="rounded-md border bg-background p-3 text-sm">
                      <p className="font-medium text-xs text-muted-foreground">{post.authorTag ? `A ${post.authorTag}` : "Anonymous"}</p>
                      <p className="mt-1 leading-6">{post.body}</p>
                    </div>
                  ))}
                </div>
              )}
              <div className="flex gap-2">
                <textarea
                  value={replyText}
                  onChange={(event) => setReplyText(event.target.value)}
                  placeholder="Share your perspective on this…"
                  maxLength={2000}
                  className="h-20 w-full rounded-md border bg-card px-3 py-2 text-sm outline-none transition placeholder:text-muted-foreground focus:ring-2 focus:ring-ring"
                />
              </div>
              <div className="flex items-center justify-between">
                {error && <p className="text-xs text-destructive">{error}</p>}
                <Button className="ml-auto" onClick={submitReply} disabled={posting || !replyText.trim()}>
                  {posting ? "Posting…" : "Post reply"}
                </Button>
              </div>
            </>
          )}
          {!loading && error && !thread && <p className="text-sm text-destructive">{error}</p>}
        </div>
      )}
    </div>
  );
}
