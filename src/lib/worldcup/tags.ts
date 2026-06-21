export const worldCupCacheTags = {
  all: "worldcup",
  teams: "worldcup:teams",
  games: "worldcup:games",
  groups: "worldcup:groups",
  stadiums: "worldcup:stadiums",
} as const;

export type WorldCupCacheTag =
  (typeof worldCupCacheTags)[keyof typeof worldCupCacheTags];
