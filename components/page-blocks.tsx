import { Bookmark, Check, CheckCircle2 } from "lucide-react";
import { Badge, Button, Card } from "@/components/ui";
import { ConfidenceBadge, ImpactCard, PriorityBadge } from "@/components/impact";
import type { LegalAnswer } from "@/lib/data";

export function BookmarkButton({ saved, label, onClick }: { saved: boolean; label: string; onClick: () => void }) {
  return <Button variant="ghost" aria-label={`${saved ? "Remove" : "Bookmark"} ${label}`} aria-pressed={saved} onClick={onClick}><Bookmark className={`size-5 ${saved ? "fill-primary text-primary" : ""}`} aria-hidden="true" /></Button>;
}

export function SavedList({ items }: { items: string[] }) {
  return items.length ? <Card className="p-5"><h3 className="font-semibold">Saved items</h3><ul className="mt-3 space-y-2">{items.map((item) => <li key={item} className="flex items-center gap-2 text-sm"><Check className="size-4 text-primary" aria-hidden="true" />{item}</li>)}</ul></Card> : <EmptyState title="Nothing saved yet" text="Bookmark a feed update or rights topic to keep it here." />;
}

export function EmptyState({ title, text }: { title: string; text: string }) {
  return <Card className="p-5"><p className="font-semibold">{title}</p><p className="mt-1 text-sm leading-6 text-muted-foreground">{text}</p></Card>;
}

export function ImpactBlock({ title, values }: { title: string; values: string[] }) {
  return <div className="rounded-md border bg-background p-4"><p className="text-sm font-semibold">{title}</p><div className="mt-2 flex flex-wrap gap-2">{values.map((value) => <Badge key={value} className="bg-card">{value}</Badge>)}</div></div>;
}

export function InfoBlock({ title, text, highlighted = false }: { title: string; text: string; highlighted?: boolean }) {
  return <div className={`rounded-md border p-4 ${highlighted ? "border-primary/30 bg-secondary/60" : "bg-muted/45"}`}><p className="text-sm font-semibold">{title}</p><p className="mt-2 text-sm leading-6 text-muted-foreground">{text}</p></div>;
}

export function StructuredAnswer({ label, values }: { label: string; values: string[] }) {
  return <div className="mt-4"><p className="text-sm font-semibold">{label}</p><ul className="mt-2 space-y-2">{values.map((value) => <li key={value} className="flex gap-2 text-sm leading-6 text-muted-foreground"><CheckCircle2 className="mt-1 size-4 shrink-0 text-primary" aria-hidden="true" /><span>{value}</span></li>)}</ul></div>;
}

export function LifeImpactSummary({ answer }: { answer: LegalAnswer }) {
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

export function CaseField({ title, text }: { title: string; text: string }) {
  return <div className="rounded-md border bg-background p-4"><p className="text-sm font-semibold">{title}</p><p className="mt-2 text-sm leading-6 text-muted-foreground">{text}</p></div>;
}
