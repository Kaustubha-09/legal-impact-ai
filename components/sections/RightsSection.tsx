import { ShieldCheck } from "lucide-react";
import { Card, Input } from "@/components/ui";
import { BookmarkButton, EmptyState } from "@/components/page-blocks";
import type { RightsTopic } from "@/lib/api";

export function RightsSection({
  rightsQuery,
  setRightsQuery,
  filteredTopics,
  savedTopics,
  toggleSaved,
}: {
  rightsQuery: string;
  setRightsQuery: (value: string) => void;
  filteredTopics: RightsTopic[];
  savedTopics: string[];
  toggleSaved: (title: string, kind: "item" | "topic") => void;
}) {
  return (
    <section className="border-y bg-card" id="rights">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div><h2 className="text-2xl font-bold">Rights library</h2><p className="text-sm text-muted-foreground">Plain-English topics with laws, cases, common questions, and state notes.</p></div>
          <Input className="md:max-w-sm" value={rightsQuery} placeholder="Search rights topics" onChange={(event) => setRightsQuery(event.target.value)} />
        </div>
        {filteredTopics.length ? (
          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filteredTopics.map((topic) => (
              <Card key={topic.name} className="p-4">
                <div className="flex items-start justify-between gap-3"><ShieldCheck className="size-5 text-primary" aria-hidden="true" /><BookmarkButton saved={savedTopics.includes(topic.name)} label={topic.name} onClick={() => toggleSaved(topic.name, "topic")} /></div>
                <h3 className="mt-3 font-semibold">{topic.name}</h3>
                <p className="mt-2 min-h-16 text-sm leading-6 text-muted-foreground">{topic.summary}</p>
                <div className="mt-4 space-y-2 text-xs text-muted-foreground">
                  <p><span className="font-semibold text-foreground">Laws:</span> {topic.laws.join(", ")}</p>
                  <p><span className="font-semibold text-foreground">Cases:</span> {topic.cases.join(", ")}</p>
                  <p><span className="font-semibold text-foreground">Common questions:</span> {topic.questions.join(" ")}</p>
                  <p><span className="font-semibold text-foreground">State note:</span> {topic.stateNotes}</p>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="mt-6"><EmptyState title="No rights topics found" text="Try a broader term such as housing, work, consumer, or privacy." /></div>
        )}
      </div>
    </section>
  );
}
