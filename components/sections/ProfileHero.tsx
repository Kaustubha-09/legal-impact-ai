import { LocateFixed, MapPin, Sparkles } from "lucide-react";
import { Badge, Button, Card, Input, Select } from "@/components/ui";
import { profileTags } from "@/lib/data";
import type { Profile } from "@/lib/types";

const stateOptions = [
  "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware",
  "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky",
  "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota", "Mississippi", "Missouri",
  "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey", "New Mexico", "New York",
  "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island",
  "South Carolina", "South Dakota", "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington",
  "West Virginia", "Wisconsin", "Wyoming", "District of Columbia",
];

const featureCards: [string, string][] = [
  ["Personalized", "State, city, county, and profile tags"],
  ["Cited", "Source-aware legal records"],
  ["Educational", "Not legal advice or a law firm"],
];

export function ProfileHero({
  profile,
  setProfile,
  isLocating,
  onUseCurrentLocation,
  onSaveProfile,
}: {
  profile: Profile;
  setProfile: (updater: (current: Profile) => Profile) => void;
  isLocating: boolean;
  onUseCurrentLocation: () => void;
  onSaveProfile: () => void;
}) {
  function toggleTag(tag: string) {
    setProfile((current) => ({
      ...current,
      tags: current.tags.includes(tag)
        ? current.tags.filter((item) => item !== tag)
        : [...current.tags, tag],
    }));
  }

  return (
    <section className="border-b bg-secondary/45">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[0.95fr_1.35fr] lg:px-8">
        <div className="flex flex-col justify-center gap-5">
          <Badge className="w-fit bg-card">Educational legal intelligence</Badge>
          <div className="space-y-3">
            <h2 className="max-w-xl text-4xl font-bold sm:text-5xl">Know what laws mean for you.</h2>
            <p className="max-w-2xl text-lg leading-8 text-muted-foreground">LifeLaw monitors laws, regulations, court decisions, and government actions, then explains their impact on your life.</p>
          </div>
          <a href="#onboarding" className="inline-flex h-10 w-fit items-center justify-center rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground hover:bg-primary/90">Create My Legal Profile</a>
          <div className="grid gap-3 sm:grid-cols-3">
            {featureCards.map(([title, text]) => <div key={title} className="rounded-md border bg-card/80 p-4"><p className="font-semibold">{title}</p><p className="mt-1 text-sm text-muted-foreground">{text}</p></div>)}
          </div>
        </div>
        <Card className="p-5" id="onboarding">
          <div className="mb-5 flex items-start justify-between gap-4"><div><h3 className="text-xl font-semibold">Your legal profile</h3><p className="mt-1 text-sm text-muted-foreground">Saved on this device and used to personalize the feed.</p></div><Sparkles className="size-5 text-primary" aria-hidden="true" /></div>
          <div className="grid gap-3 sm:grid-cols-3">
            <label className="space-y-1 text-sm font-medium">Country<Input value={profile.country} onChange={(event) => setProfile((current) => ({ ...current, country: event.target.value }))} /></label>
            <label className="space-y-1 text-sm font-medium">State<Select value={profile.state} onChange={(event) => setProfile((current) => ({ ...current, state: event.target.value }))}>{stateOptions.map((state) => <option key={state}>{state}</option>)}</Select></label>
            <label className="space-y-1 text-sm font-medium">City<Input value={profile.city} onChange={(event) => setProfile((current) => ({ ...current, city: event.target.value }))} /></label>
            <label className="space-y-1 text-sm font-medium">County<Input value={profile.county} onChange={(event) => setProfile((current) => ({ ...current, county: event.target.value }))} /></label>
            <label className="space-y-1 text-sm font-medium">Industry<Input value={profile.industry} placeholder="Optional" onChange={(event) => setProfile((current) => ({ ...current, industry: event.target.value }))} /></label>
            <label className="space-y-1 text-sm font-medium">Occupation<Input value={profile.occupation} placeholder="Optional" onChange={(event) => setProfile((current) => ({ ...current, occupation: event.target.value }))} /></label>
          </div>
          <div className="mt-3 flex flex-col gap-2 rounded-md border bg-muted/40 p-3 sm:flex-row sm:items-center sm:justify-between"><p className="text-xs leading-5 text-muted-foreground">Use your current location to fill the legal jurisdiction. Precise coordinates are used once and are not saved.</p><Button type="button" variant="secondary" disabled={isLocating} onClick={onUseCurrentLocation}>{isLocating ? "Locating" : <><LocateFixed className="size-4" aria-hidden="true" />Use current location</>}</Button></div>
          <div className="mt-5"><p className="mb-2 text-sm font-medium">Profile tags</p><div className="flex flex-wrap gap-2">{profileTags.map((tag) => <button key={tag} type="button" aria-pressed={profile.tags.includes(tag)} onClick={() => toggleTag(tag)} className={`rounded-full border px-3 py-2 text-sm font-medium transition ${profile.tags.includes(tag) ? 'border-primary bg-primary text-primary-foreground' : 'bg-card hover:bg-muted'}`}>{tag}</button>)}</div></div>
          <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><p className="flex items-center gap-2 text-sm text-muted-foreground"><MapPin className="size-4" aria-hidden="true" />Personalization: {profile.state} and federal sources.</p><Button onClick={onSaveProfile}>Save profile</Button></div>
        </Card>
      </div>
    </section>
  );
}
