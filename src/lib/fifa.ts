import type { Team } from "@/types";

const FIFA_WC2026_TEAMS_BASE =
  "https://www.fifa.com/en/tournaments/mens/worldcup/canadamexicousa2026/teams";

/** FIFA URL slugs that differ from a simple lowercased team name */
const FIFA_SLUG_OVERRIDES: Record<string, string> = {
  "Bosnia and Herzegovina": "bosnia-herzegovina",
  "Cape Verde": "cabo-verde",
  "Czech Republic": "czechia",
  "Democratic Republic of the Congo": "congo-dr",
  Iran: "ir-iran",
  "Ivory Coast": "cote-d-ivoire",
  Turkey: "turkiye",
  "United States": "usa",
  "South Korea": "korea-republic",
};

export function getFifaTeamNewsUrl(slug: string): string {
  return `${FIFA_WC2026_TEAMS_BASE}/${slug}/team-news`;
}

export function getTeamFifaNewsUrl(team: Team): string {
  return getFifaTeamNewsUrl(getTeamFifaSlug(team));
}

export function getTeamFifaSlug(team: Team): string {
  if (team.fifaSlug) return team.fifaSlug;

  const override =
    FIFA_SLUG_OVERRIDES[team.name] ??
    (team.fifaCode ? FIFA_SLUG_OVERRIDES[team.fifaCode] : undefined);
  if (override) return override;

  return team.name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}
