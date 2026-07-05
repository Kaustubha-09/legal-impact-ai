import { AlertTriangle, CheckCircle2 } from "lucide-react";
import { Badge, Card } from "@/components/ui";

export function PriorityBadge({ priority }: { priority?: string }) {
  if (!priority) return null;
  const urgent = priority === "Priority 1";
  return <Badge className={urgent ? "border-destructive bg-card text-destructive" : "bg-secondary"}>{priority}</Badge>;
}

export function ConfidenceBadge({ confidence }: { confidence?: string }) {
  return confidence ? <Badge className="bg-card">Confidence: {confidence}</Badge> : null;
}

export function ImpactCard({ title, text, urgent = false }: { title: string; text: string; urgent?: boolean }) {
  const Icon = urgent ? AlertTriangle : CheckCircle2;
  return <Card className="p-4"><div className="flex items-start gap-2"><Icon className={`mt-0.5 size-4 shrink-0 ${urgent ? "text-destructive" : "text-primary"}`} aria-hidden="true" /><div><p className="text-sm font-semibold">{title}</p><p className="mt-1 text-sm leading-6 text-muted-foreground">{text}</p></div></div></Card>;
}
