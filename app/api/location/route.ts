import { NextRequest, NextResponse } from "next/server";

type Geography = { NAME?: unknown; BASENAME?: unknown };

function geographyName(value: unknown): string {
  if (!Array.isArray(value) || !value[0] || typeof value[0] !== "object") return "";
  const geography = value[0] as Geography;
  return typeof geography.BASENAME === "string"
    ? geography.BASENAME
    : typeof geography.NAME === "string"
      ? geography.NAME
      : "";
}

export async function POST(request: NextRequest) {
  let body: { latitude?: unknown; longitude?: unknown };
  try {
    body = (await request.json()) as { latitude?: unknown; longitude?: unknown };
  } catch {
    return NextResponse.json({ error: "Invalid location request." }, { status: 400 });
  }

  const latitude = typeof body.latitude === "number" ? body.latitude : Number.NaN;
  const longitude = typeof body.longitude === "number" ? body.longitude : Number.NaN;
  if (!Number.isFinite(latitude) || !Number.isFinite(longitude) || Math.abs(latitude) > 90 || Math.abs(longitude) > 180) {
    return NextResponse.json({ error: "Invalid coordinates." }, { status: 400 });
  }

  const params = new URLSearchParams({
    x: longitude.toString(),
    y: latitude.toString(),
    benchmark: "Public_AR_Current",
    vintage: "Current_Current",
    format: "json",
  });

  try {
    const response = await fetch(
      `https://geocoding.geo.census.gov/geocoder/geographies/coordinates?${params}`,
      { signal: AbortSignal.timeout(8_000) },
    );
    if (!response.ok) throw new Error("Census lookup failed");
    const payload = (await response.json()) as { result?: { geographies?: Record<string, unknown> } };
    const geographies = payload.result?.geographies;
    const state = geographyName(geographies?.States);
    const county = geographyName(geographies?.Counties);
    const city = geographyName(geographies?.["Incorporated Places"]) || geographyName(geographies?.["County Subdivisions"]);
    if (!state || !county) throw new Error("No jurisdiction found");
    return NextResponse.json({ state, county, city });
  } catch {
    return NextResponse.json(
      { error: "We could not resolve a legal jurisdiction from this location. Enter it manually instead." },
      { status: 502 },
    );
  }
}
