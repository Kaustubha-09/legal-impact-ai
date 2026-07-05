import { Building2, ExternalLink } from "lucide-react";
import { Badge, Card } from "@/components/ui";
import { CaseField } from "@/components/page-blocks";
import type { CaseDetail } from "@/lib/api";
import { jurisdictionBadgeClass } from "@/lib/jurisdiction";

export function CasesSection({
  liveCases,
  selectedCaseName,
  setSelectedCaseName,
  selectedCase,
}: {
  liveCases: CaseDetail[];
  selectedCaseName: string;
  setSelectedCaseName: (name: string) => void;
  selectedCase: CaseDetail;
}) {
  return (
    <section className="border-t bg-card" id="cases">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[0.7fr_1.3fr]">
          <div>
            <h2 className="text-2xl font-bold">Court ruling summaries</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">Select a case to review the issue, holding, reasoning, rights affected, impact, and source.</p>
            <div className="mt-5 space-y-2">
              {liveCases.map((courtCase) => (
                <button key={courtCase.name} type="button" aria-pressed={selectedCaseName === courtCase.name} onClick={() => setSelectedCaseName(courtCase.name)} className={`block w-full rounded-md border p-3 text-left text-sm font-medium ${selectedCaseName === courtCase.name ? "border-primary bg-secondary" : "bg-background hover:bg-muted"}`}>
                  {courtCase.name}<span className="mt-1 block text-xs font-normal text-muted-foreground">{courtCase.court}</span>
                </button>
              ))}
            </div>
          </div>
          <Card className="p-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div><Badge className={jurisdictionBadgeClass(selectedCase.court)}>{selectedCase.court}</Badge><h3 className="mt-3 text-xl font-semibold">{selectedCase.name}</h3><p className="mt-1 text-sm text-muted-foreground">{selectedCase.citation} - {selectedCase.date}</p></div>
              <Building2 className="size-6 text-primary" aria-hidden="true" />
            </div>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <CaseField title="Issue" text={selectedCase.issue} />
              <CaseField title="Holding" text={selectedCase.holding} />
              <CaseField title="Reasoning" text={selectedCase.reasoning} />
              <CaseField title="Rights affected" text={selectedCase.rights} />
              <CaseField title="Who is impacted" text={selectedCase.impacted} />
            </div>
            <div className="mt-4 rounded-md border bg-secondary/55 p-4"><p className="text-sm font-semibold">Plain-English explanation</p><p className="mt-2 text-sm leading-6 text-secondary-foreground">{selectedCase.explanation}</p></div>
            <a href={selectedCase.source} target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline">Read the source opinion <ExternalLink className="size-4" aria-hidden="true" /></a>
          </Card>
        </div>
      </div>
    </section>
  );
}
