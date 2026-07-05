import { Search } from "lucide-react";
import { Badge, Button, Card, Input } from "@/components/ui";
import { LifeImpactSummary, StructuredAnswer } from "@/components/page-blocks";
import { qaExamples, type LegalAnswer } from "@/lib/data";

export function AskAiPanel({
  query,
  setQuery,
  isAsking,
  askQuestion,
  answer,
  suggestions,
}: {
  query: string;
  setQuery: (value: string) => void;
  isAsking: boolean;
  askQuestion: (question?: string) => void;
  answer: LegalAnswer;
  suggestions: string[];
}) {
  return (
    <Card className="p-5" id="ask-ai">
      <div className="flex items-start justify-between gap-3"><div><h2 className="text-xl font-semibold">LifeLaw Q&A</h2><p className="mt-1 text-sm text-muted-foreground">Life-impact analysis from the LifeLaw backend, using your saved profile.</p></div><Badge className="bg-card">{isAsking ? "Asking…" : "Backend analysis"}</Badge></div>
      <div className="mt-4 flex gap-2"><Input value={query} placeholder="Type a legal question" onChange={(event) => setQuery(event.target.value)} onKeyDown={(event) => event.key === "Enter" && askQuestion()} /><Button aria-label="Ask question" onClick={() => askQuestion()} disabled={isAsking}><Search className="size-4" aria-hidden="true" /></Button></div>
      <div className="mt-3 flex flex-wrap gap-2">{qaExamples.map((example) => <button key={example} type="button" onClick={() => askQuestion(example)} className="rounded-full border bg-background px-3 py-1.5 text-xs font-medium hover:bg-muted">{example}</button>)}</div>
      <div className="mt-4 rounded-md border bg-muted/40 p-4" aria-live="polite">
        <p className="text-sm font-semibold">Quick answer</p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">{answer.quick_answer}</p>
        <LifeImpactSummary answer={answer} />
        {suggestions.length > 0 && <div className="mt-4 rounded-md border border-primary/30 bg-card p-3"><p className="text-sm font-semibold">Help me refine this question</p><p className="mt-1 text-xs leading-5 text-muted-foreground">A more specific question can produce a better answer.</p><div className="mt-3 flex flex-wrap gap-2">{suggestions.map((suggestion) => <button key={suggestion} type="button" onClick={() => askQuestion(suggestion)} className="rounded-full border bg-background px-3 py-1.5 text-left text-xs font-medium hover:bg-muted">{suggestion}</button>)}</div></div>}
        <StructuredAnswer label="Rights" values={answer.rights} />
        <StructuredAnswer label="Responsibilities" values={answer.responsibilities} />
        <StructuredAnswer label="Relevant laws" values={answer.relevant_laws} />
        <StructuredAnswer label="Court rulings" values={answer.court_rulings} />
        <StructuredAnswer label="Exceptions" values={answer.exceptions} />
        <StructuredAnswer label="Deadlines" values={answer.deadlines} />
        <StructuredAnswer label="Next steps" values={answer.next_steps} />
        <StructuredAnswer label="Sources" values={answer.sources} />
        <p className="mt-4 rounded-md border bg-card p-3 text-xs leading-5 text-muted-foreground">{answer.disclaimer}</p>
      </div>
    </Card>
  );
}
