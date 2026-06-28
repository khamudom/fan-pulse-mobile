import { BRACKET_MATCHES } from "@/data/worldCupBracket";
import type { BracketRoundKey } from "@/types/bracket";
import type { Group, Match, Team } from "@/types";

export function isGroupMatch(match: Match): boolean {
  return !match.type || match.type === "group";
}

export function isKnockoutMatch(match: Match): boolean {
  return Boolean(match.type && match.type !== "group");
}

/** True once every group-stage match in the feed has finished. */
export function isGroupStageComplete(matches: Match[]): boolean {
  const groupMatches = matches.filter(isGroupMatch);
  if (groupMatches.length === 0) return false;
  return groupMatches.every((match) => match.status === "finished");
}

export function getKnockoutMatches(matches: Match[]): Match[] {
  return matches.filter(isKnockoutMatch);
}

const ROUND_OF_32_IDS = new Set(
  BRACKET_MATCHES.filter((def) => def.round === "r32").map((def) => def.id),
);

/** Teams that appear in the Round of 32 draw from live match data. */
export function getRoundOf32Teams(matches: Match[]): Team[] {
  const teams = new Map<string, Team>();

  for (const match of matches) {
    const matchId = match.id.toUpperCase();
    if (!ROUND_OF_32_IDS.has(matchId)) continue;

    for (const team of [match.homeTeam, match.awayTeam]) {
      if (team.name !== "TBD" && team.id) {
        teams.set(team.id, team);
      }
    }
  }

  return [...teams.values()].sort((a, b) => a.name.localeCompare(b.name));
}

/** Third-place teams that actually advanced to the Round of 32. */
export function getActualThirdPlaceQualifiers(
  groups: Group[],
  matches: Match[],
): string[] {
  const r32TeamIds = new Set(getRoundOf32Teams(matches).map((team) => team.id));

  return groups
    .map((group) => group.standings[2]?.teamId)
    .filter((teamId): teamId is string => Boolean(teamId && r32TeamIds.has(teamId)));
}

export function getActiveKnockoutRound(
  matches: Match[],
): BracketRoundKey | undefined {
  const liveMatchMap = new Map(
    getKnockoutMatches(matches).map((match) => [match.id.toUpperCase(), match]),
  );

  for (const round of ["r32", "r16", "qf", "sf", "final"] as BracketRoundKey[]) {
    const roundDefs = BRACKET_MATCHES.filter((def) => def.round === round);
    const hasUnfinished = roundDefs.some((def) => {
      const liveMatch = liveMatchMap.get(def.id);
      return !liveMatch || liveMatch.status !== "finished";
    });
    if (hasUnfinished) return round;
  }

  return undefined;
}
