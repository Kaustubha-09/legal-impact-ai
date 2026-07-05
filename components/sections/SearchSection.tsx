import { FileSearch } from "lucide-react";
import { Badge, Button, Card, Input, Select } from "@/components/ui";
import { EmptyState } from "@/components/page-blocks";
import type { SearchResult } from "@/lib/api";

export function SearchSection({
  search,
  setSearch,
  activeSearch,
  setActiveSearch,
  jurisdiction,
  setJurisdiction,
  sourceType,
  setSourceType,
  filteredResults,
}: {
  search: string;
  setSearch: (value: string) => void;
  activeSearch: string;
  setActiveSearch: (value: string) => void;
  jurisdiction: string;
  setJurisdiction: (value: string) => void;
  sourceType: string;
  setSourceType: (value: string) => void;
  filteredResults: SearchResult[];
}) {
  return (
    <section className="mx-auto grid max-w-7xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
      <Card className="h-fit p-5" id="search">
        <h2 className="text-2xl font-bold">Legal search</h2>
        <p className="mt-1 text-sm text-muted-foreground">Search the local MVP source index by words, jurisdiction, and source type.</p>
        <div className="mt-5 space-y-3">
          <Input value={search} onChange={(event) => setSearch(event.target.value)} onKeyDown={(event) => event.key === "Enter" && setActiveSearch(search)} aria-label="Search legal sources" />
          <div className="grid gap-3 sm:grid-cols-2">
            <Select value={jurisdiction} onChange={(event) => setJurisdiction(event.target.value)} aria-label="Filter by jurisdiction"><option>All jurisdictions</option><option>Federal</option><option>California</option><option>U.S. Supreme Court</option></Select>
            <Select value={sourceType} onChange={(event) => setSourceType(event.target.value)} aria-label="Filter by source type"><option>All sources</option><option>Court opinion</option><option>Federal statute</option><option>State statute</option><option>Regulation</option></Select>
          </div>
          <Button className="w-full" onClick={() => setActiveSearch(search)}><FileSearch className="size-4" aria-hidden="true" />Search legal sources</Button>
        </div>
        <div className="mt-5 rounded-md border bg-muted/40 p-4">
          <p className="text-sm font-semibold">Source summary</p>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">{filteredResults.length ? `${filteredResults.length} matching source${filteredResults.length === 1 ? "" : "s"}. Results are summarized from the indexed source metadata; verify the official text before acting.` : "No indexed sources match these filters. Broaden the terms or remove a filter."}</p>
        </div>
      </Card>
      <div className="space-y-4">
        {filteredResults.length ? filteredResults.map((result) => (
          <Card key={result.title} className="p-5">
            <div className="flex flex-wrap gap-2"><Badge>{result.type}</Badge><Badge className="bg-accent text-accent-foreground">{result.jurisdiction}</Badge><Badge className="bg-card">{result.category}</Badge></div>
            <h3 className="mt-3 text-lg font-semibold">{result.title}</h3>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{result.summary}</p>
            <p className="mt-3 text-xs text-muted-foreground">Date: {result.date}</p>
          </Card>
        )) : <EmptyState title="No search results" text="The local source index does not have a matching document yet." />}
      </div>
    </section>
  );
}
