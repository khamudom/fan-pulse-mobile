const CITY_TIME_ZONES: Record<string, string> = {
  // United States — Pacific
  inglewood: "America/Los_Angeles",
  "los angeles": "America/Los_Angeles",
  seattle: "America/Los_Angeles",
  "santa clara": "America/Los_Angeles",
  "san francisco": "America/Los_Angeles",

  // United States — Mountain (none in 2026 host list)

  // United States — Central
  arlington: "America/Chicago",
  dallas: "America/Chicago",
  houston: "America/Chicago",
  "kansas city": "America/Chicago",

  // United States — Eastern
  atlanta: "America/New_York",
  foxborough: "America/New_York",
  boston: "America/New_York",
  "east rutherford": "America/New_York",
  "new york": "America/New_York",
  philadelphia: "America/New_York",
  "miami gardens": "America/New_York",
  miami: "America/New_York",

  // Canada
  toronto: "America/Toronto",
  vancouver: "America/Vancouver",

  // Mexico
  "mexico city": "America/Mexico_City",
  zapopan: "America/Mexico_City",
  guadalajara: "America/Mexico_City",
  guadalupe: "America/Monterrey",
  monterrey: "America/Monterrey",
};

const COUNTRY_FALLBACK: Record<string, string> = {
  "united states": "America/New_York",
  usa: "America/New_York",
  canada: "America/Toronto",
  mexico: "America/Mexico_City",
};

const DEFAULT_TIME_ZONE = "America/New_York";

function normalizeCity(value: string): string {
  return value.trim().toLowerCase();
}

export function getVenueTimeZone(city?: string, country?: string): string {
  if (city) {
    const normalized = normalizeCity(city);
    const direct = CITY_TIME_ZONES[normalized];
    if (direct) return direct;

    for (const [key, zone] of Object.entries(CITY_TIME_ZONES)) {
      if (normalized.includes(key) || key.includes(normalized)) {
        return zone;
      }
    }
  }

  if (country) {
    const fallback = COUNTRY_FALLBACK[normalizeCity(country)];
    if (fallback) return fallback;
  }

  return DEFAULT_TIME_ZONE;
}
