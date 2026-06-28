import { BRACKET_MATCHES, BRACKET_MATCH_MAP, BRACKET_ROUND_LABELS, BRACKET_ROUND_ORDER } from "@/data/worldCupBracket";
import {
  buildKnockoutMatchMap,
  normalizeKnockoutMatchId,
} from "@/lib/knockoutMatchId";
import type {
  BracketMatchDef,
  BracketMatchState,
  BracketParticipant,
  BracketPredictionPayload,
  BracketState,
  BracketWinnerPicks,
  GroupRankings,
} from "@/types/bracket";

/** Best third-place teams that advance to the Round of 32 (FIFA 2026 rule). */
export const MAX_THIRD_PLACE_QUALIFIERS = 8;
import type { Group, Match, Team } from "@/types";

/** Collect third-place slot codes in bracket order (each assigned once). */
function collectThirdPlaceSlotCodes(): string[] {
  const slotCodes: string[] = [];
  const seen = new Set<string>();

  for (const def of BRACKET_MATCHES) {
    for (const slotCode of [def.homeSlot, def.awaySlot]) {
      if (/^3[A-L]+$/.test(slotCode) && !seen.has(slotCode)) {
        seen.add(slotCode);
        slotCodes.push(slotCode);
      }
    }
  }

  return slotCodes;
}

function findStandingTeam(
  teamId: string,
  groups: Group[],
): { name: string; flag?: string; group?: string } | undefined {
  for (const group of groups) {
    const standing = group.standings.find((s) => s.teamId === teamId);
    if (standing) {
      return { name: standing.teamName, flag: standing.flag, group: group.name };
    }
  }
  return undefined;
}

function teamParticipantById(
  teamId: string,
  slotCode: string,
  teamMap: Map<string, Team>,
  groups: Group[],
): BracketParticipant | undefined {
  const team = teamMap.get(teamId);
  if (team) return teamParticipant(team, slotCode);

  const standingTeam = findStandingTeam(teamId, groups);
  if (standingTeam) {
    return teamParticipant(
      {
        id: teamId,
        name: standingTeam.name,
        flag: standingTeam.flag,
        group: standingTeam.group,
      },
      slotCode,
    );
  }
  return undefined;
}

/** Group letter where a team was predicted to finish third. */
function groupOfThirdPlaceTeam(
  teamId: string,
  groupRankings: GroupRankings,
): string | undefined {
  for (const [groupName, order] of Object.entries(groupRankings)) {
    if (order[2] === teamId) return groupName;
  }
  return undefined;
}

/** Assign chosen third-place qualifiers to the eight third-place R32 slots. */
function assignThirdPlaceSlots(
  qualifierTeamIds: string[],
  groupRankings: GroupRankings,
  teamMap: Map<string, Team>,
  groups: Group[],
): Map<string, BracketParticipant> {
  const assignment = new Map<string, BracketParticipant>();
  const remaining = new Set(qualifierTeamIds);

  const slots = collectThirdPlaceSlotCodes()
    .map((slotCode) => ({
      slotCode,
      allowed: (slotCode.match(/^3([A-L]+)$/)?.[1] ?? "").split(""),
    }))
    // Most constrained slots first so greedy assignment stays valid.
    .sort((a, b) => a.allowed.length - b.allowed.length);

  const teamGroupOf = (teamId: string): string | undefined =>
    groupOfThirdPlaceTeam(teamId, groupRankings) ?? teamMap.get(teamId)?.group;

  for (const { slotCode, allowed } of slots) {
    const allowedSet = new Set(allowed);
    let chosen = [...remaining].find((teamId) => {
      const group = teamGroupOf(teamId);
      return group ? allowedSet.has(group) : false;
    });

    // Fallback: any remaining qualifier keeps the slot playable.
    chosen ??= [...remaining][0];

    if (!chosen) {
      assignment.set(slotCode, {
        label: `Best 3rd (${allowed.join("")})`,
        slotCode,
        isPlaceholder: true,
      });
      continue;
    }

    remaining.delete(chosen);
    const participant = teamParticipantById(chosen, slotCode, teamMap, groups);
    assignment.set(
      slotCode,
      participant ?? { label: chosen, slotCode, isPlaceholder: true },
    );
  }

  return assignment;
}

/**
 * Seed Round-of-32 group slots purely from the user's predicted group
 * standings. Slots stay empty (placeholders) until the user predicts them —
 * the picks bracket reflects only the user's group picks, not live data.
 */
function resolvePredictedGroupSlots(
  groups: Group[],
  teamMap: Map<string, Team>,
  groupRankings: GroupRankings,
  thirdPlaceQualifiers: string[],
): Map<string, BracketParticipant> {
  const resolved = new Map<string, BracketParticipant>();

  for (const def of BRACKET_MATCHES) {
    for (const slotCode of [def.homeSlot, def.awaySlot]) {
      if (resolved.has(slotCode)) continue;

      const groupMatch = slotCode.match(/^([12])([A-L])$/);
      if (groupMatch) {
        const [, position, groupName] = groupMatch;
        const predictedId = groupRankings[groupName]?.[Number(position) - 1];
        const predicted = predictedId
          ? teamParticipantById(predictedId, slotCode, teamMap, groups)
          : undefined;
        if (predicted) {
          resolved.set(slotCode, predicted);
        }
      }
    }
  }

  if (thirdPlaceQualifiers.length > 0) {
    const thirdSlots = assignThirdPlaceSlots(
      thirdPlaceQualifiers,
      groupRankings,
      teamMap,
      groups,
    );
    for (const slotCode of collectThirdPlaceSlotCodes()) {
      const predicted = thirdSlots.get(slotCode);
      if (predicted && !predicted.isPlaceholder) {
        resolved.set(slotCode, predicted);
      }
    }
  }

  return resolved;
}

/** Teams the user predicted to finish third in each group (advance candidates). */
export function getThirdPlaceCandidates(
  groupRankings: GroupRankings,
  teams: Team[],
  groups: Group[],
): { team: Team; group: string }[] {
  const teamMap = new Map(teams.map((team) => [team.id, team]));
  const candidates: { team: Team; group: string }[] = [];

  for (const [groupName, order] of Object.entries(groupRankings)) {
    const thirdId = order[2];
    if (!thirdId) continue;

    const team =
      teamMap.get(thirdId) ??
      (() => {
        const standingTeam = findStandingTeam(thirdId, groups);
        return standingTeam
          ? {
              id: thirdId,
              name: standingTeam.name,
              flag: standingTeam.flag,
              group: groupName,
            }
          : undefined;
      })();

    if (team) candidates.push({ team, group: groupName });
  }

  return candidates.sort((a, b) => a.group.localeCompare(b.group));
}

function participantFromSlot(
  slotCode: string,
  resolved: Map<string, BracketParticipant>,
): BracketParticipant {
  const resolvedParticipant = resolved.get(slotCode);
  if (resolvedParticipant) return resolvedParticipant;

  return {
    label: slotCode,
    slotCode,
    isPlaceholder: true,
  };
}

function teamParticipant(team: Team, slotCode?: string): BracketParticipant {
  return {
    label: team.name,
    team,
    slotCode,
    isPlaceholder: false,
  };
}

function isPlaceholderTeam(team: Team): boolean {
  return !team.id || team.id === "0" || team.name === "TBD";
}

/** Prefer a propagated winner over API placeholder labels in live mode. */
function participantForLiveSlot(
  slotCode: string,
  liveTeam: Team,
  resolved: Map<string, BracketParticipant>,
): BracketParticipant {
  const fromResolved = resolved.get(slotCode);
  if (fromResolved?.team && !fromResolved.isPlaceholder) {
    return fromResolved;
  }
  if (!isPlaceholderTeam(liveTeam)) {
    return teamParticipant(liveTeam, slotCode);
  }
  return fromResolved ?? participantFromSlot(slotCode, resolved);
}

function winnerFromMatch(match: Match): BracketParticipant | undefined {
  if (match.status !== "finished") return undefined;
  if (match.homeScore > match.awayScore) {
    return teamParticipant(match.homeTeam);
  }
  if (match.awayScore > match.homeScore) {
    return teamParticipant(match.awayTeam);
  }
  return undefined;
}

function buildLiveMatchMap(matches: Match[]): Map<string, Match> {
  return buildKnockoutMatchMap(
    matches.filter((match) => match.type && match.type !== "group"),
  );
}

function getLiveMatch(
  liveMatchMap: Map<string, Match>,
  bracketMatchId: string,
): Match | undefined {
  return liveMatchMap.get(normalizeKnockoutMatchId(bracketMatchId));
}

/**
 * Resolve the live bracket purely from the World Cup API knockout matches.
 * Round-of-32 slots stay empty until the API exposes the actual matchups
 * (i.e. once the group stage is decided); winner slots fill as results land.
 */
function buildLiveResolvedParticipants(
  matches: Match[],
): Map<string, BracketParticipant> {
  const resolved = new Map<string, BracketParticipant>();
  const liveMatchMap = buildLiveMatchMap(matches);

  for (const def of BRACKET_MATCHES) {
    for (const slotCode of [def.homeSlot, def.awaySlot]) {
      if (resolved.has(slotCode)) continue;

      const winnerRef = slotCode.match(/^W(\d+)$/);
      if (!winnerRef) continue;

      const sourceMatch = liveMatchMap.get(winnerRef[1]);
      if (sourceMatch) {
        const winner = winnerFromMatch(sourceMatch);
        if (winner) {
          resolved.set(slotCode, { ...winner, slotCode });
        }
      }
    }
  }

  for (const def of BRACKET_MATCHES) {
    const liveMatch = getLiveMatch(liveMatchMap, def.id);
    if (!liveMatch) continue;

    const winner = winnerFromMatch(liveMatch);
    if (winner) {
      resolved.set(def.winnerSlot, { ...winner, slotCode: def.winnerSlot });
    }
  }

  return resolved;
}

function buildPickResolvedParticipants(
  picks: BracketWinnerPicks,
  teams: Team[],
  groups: Group[],
  groupRankings: GroupRankings,
  thirdPlaceQualifiers: string[],
): Map<string, BracketParticipant> {
  const teamMap = new Map(teams.map((team) => [team.id, team]));
  const resolved = resolvePredictedGroupSlots(
    groups,
    teamMap,
    groupRankings,
    thirdPlaceQualifiers,
  );

  for (const def of BRACKET_MATCHES) {
    const pickedTeamId = picks[def.id];
    if (!pickedTeamId) continue;

    const team = teamMap.get(pickedTeamId);
    if (!team) continue;

    resolved.set(def.winnerSlot, teamParticipant(team, def.winnerSlot));
  }

  return resolved;
}

function buildMatchState(
  def: BracketMatchDef,
  resolved: Map<string, BracketParticipant>,
  liveMatch: Match | undefined,
  mode: "live" | "picks",
  picks: BracketWinnerPicks,
  teams: Team[],
): BracketMatchState {
  const useLiveMatch = mode === "live" && liveMatch;
  const home = useLiveMatch
    ? participantForLiveSlot(def.homeSlot, liveMatch.homeTeam, resolved)
    : participantFromSlot(def.homeSlot, resolved);
  const away = useLiveMatch
    ? participantForLiveSlot(def.awaySlot, liveMatch.awayTeam, resolved)
    : participantFromSlot(def.awaySlot, resolved);

  let winner: BracketParticipant | undefined;
  if (mode === "live" && liveMatch) {
    winner = winnerFromMatch(liveMatch);
  } else if (mode === "picks") {
    const pickedTeamId = picks[def.id];
    const teamMap = new Map(teams.map((team) => [team.id, team]));
    const pickedTeam = pickedTeamId ? teamMap.get(pickedTeamId) : undefined;
    if (pickedTeam) {
      winner = teamParticipant(pickedTeam, def.winnerSlot);
    }
  }

  const participantsReady = Boolean(home.team && away.team);
  const isPickable = mode === "picks" && participantsReady;

  return {
    id: def.id,
    round: def.round,
    label: def.id,
    home: winner?.team?.id === home.team?.id ? { ...home, isWinner: true } : home,
    away: winner?.team?.id === away.team?.id ? { ...away, isWinner: true } : away,
    winner,
    status: useLiveMatch ? liveMatch.status : "scheduled",
    homeScore: useLiveMatch ? liveMatch.homeScore : undefined,
    awayScore: useLiveMatch ? liveMatch.awayScore : undefined,
    date: useLiveMatch ? liveMatch.date : undefined,
    time: useLiveMatch ? liveMatch.time : undefined,
    kickoffUtc: useLiveMatch ? liveMatch.kickoffUtc : undefined,
    venueTimeZone: useLiveMatch ? liveMatch.venueTimeZone : undefined,
    canPick: isPickable,
  };
}

export function buildBracketState(options: {
  mode: "live" | "picks";
  matches?: Match[];
  groups?: Group[];
  teams?: Team[];
  picks?: BracketWinnerPicks;
  groupRankings?: GroupRankings;
  thirdPlaceQualifiers?: string[];
}): BracketState {
  const {
    mode,
    matches = [],
    groups = [],
    teams = [],
    picks = {},
    groupRankings = {},
    thirdPlaceQualifiers = [],
  } = options;

  const liveMatchMap = buildLiveMatchMap(matches);

  const resolved =
    mode === "live"
      ? buildLiveResolvedParticipants(matches)
      : buildPickResolvedParticipants(
          picks,
          teams,
          groups,
          groupRankings,
          thirdPlaceQualifiers,
        );

  const matchStates = buildAllMatchStates(
    resolved,
    liveMatchMap,
    mode,
    picks,
    teams,
    false,
  );

  const rounds = BRACKET_ROUND_ORDER.map((roundKey) => ({
    key: roundKey,
    label: BRACKET_ROUND_LABELS[roundKey],
    matches: matchStates.filter((match) => match.round === roundKey),
  }));

  const finalMatch = matchStates.find((match) => match.round === "final");
  const champion = finalMatch?.winner;

  return { rounds, champion };
}

function buildAllMatchStates(
  resolved: Map<string, BracketParticipant>,
  liveMatchMap: Map<string, Match>,
  mode: "live" | "picks",
  picks: BracketWinnerPicks,
  teams: Team[],
  includeThirdPlace: boolean,
): BracketMatchState[] {
  const defs = BRACKET_MATCHES.filter(
    (def) => def.round !== "third" || includeThirdPlace,
  );

  return defs.map((def) =>
    buildMatchState(
      def,
      resolved,
      getLiveMatch(liveMatchMap, def.id),
      mode,
      picks,
      teams,
    ),
  );
}

export function buildBracketMatchMap(options: {
  mode: "live" | "picks";
  matches?: Match[];
  groups?: Group[];
  teams?: Team[];
  picks?: BracketWinnerPicks;
  groupRankings?: GroupRankings;
  thirdPlaceQualifiers?: string[];
  includeThirdPlace?: boolean;
}): Map<string, BracketMatchState> {
  const {
    mode,
    matches = [],
    groups = [],
    teams = [],
    picks = {},
    groupRankings = {},
    thirdPlaceQualifiers = [],
    includeThirdPlace = false,
  } = options;

  const liveMatchMap = buildLiveMatchMap(matches);

  const resolved =
    mode === "live"
      ? buildLiveResolvedParticipants(matches)
      : buildPickResolvedParticipants(
          picks,
          teams,
          groups,
          groupRankings,
          thirdPlaceQualifiers,
        );

  const matchStates = buildAllMatchStates(
    resolved,
    liveMatchMap,
    mode,
    picks,
    teams,
    includeThirdPlace,
  );

  return new Map(matchStates.map((match) => [match.id, match]));
}

export function normalizeBracketPayload(value: unknown): BracketPredictionPayload {
  if (!value || typeof value !== "object") {
    return { winners: {} };
  }

  const payload = value as BracketPredictionPayload;
  return {
    winners: payload.winners ?? {},
    groupRankings: payload.groupRankings ?? {},
    thirdPlaceQualifiers: payload.thirdPlaceQualifiers ?? [],
    championTeamId: payload.championTeamId,
    championTeamName: payload.championTeamName,
    updatedAt: payload.updatedAt,
  };
}

export function getBracketProgress(picks: BracketWinnerPicks): {
  picked: number;
  total: number;
} {
  const knockoutMatches = BRACKET_MATCHES.filter((match) => match.round !== "third");
  const picked = knockoutMatches.filter((match) => Boolean(picks[match.id])).length;
  return { picked, total: knockoutMatches.length };
}

/** Remove this match and all downstream picks after a new winner is chosen. */
export function cascadeBracketPicks(
  matchId: string,
  teamId: string,
  currentPicks: BracketWinnerPicks,
): BracketWinnerPicks {
  const nextPicks: BracketWinnerPicks = { ...currentPicks, [matchId]: teamId };
  const def = BRACKET_MATCH_MAP.get(matchId);
  if (!def?.nextMatchId) return nextPicks;

  const downstreamIds = new Set<string>();
  const queue = [def.nextMatchId];

  while (queue.length > 0) {
    const id = queue.shift();
    if (!id || downstreamIds.has(id)) continue;
    downstreamIds.add(id);
    const matchDef = BRACKET_MATCH_MAP.get(id);
    if (matchDef?.nextMatchId) queue.push(matchDef.nextMatchId);
  }

  for (const id of downstreamIds) {
    delete nextPicks[id];
  }

  return nextPicks;
}

export function getChampionFromPicks(
  picks: BracketWinnerPicks,
  teams: Team[],
): Team | undefined {
  const finalPickId = picks.M104;
  if (!finalPickId) return undefined;
  return teams.find((team) => team.id === finalPickId);
}

/** First knockout match the user can still pick in picks mode. */
export function getKnockoutPickScore(
  picks: BracketWinnerPicks,
  matches: Match[],
): { correct: number; decided: number; total: number } {
  const liveMatchMap = buildLiveMatchMap(matches);

  const knockoutMatches = BRACKET_MATCHES.filter((match) => match.round !== "third");
  let correct = 0;
  let decided = 0;

  for (const def of knockoutMatches) {
    const pickedTeamId = picks[def.id];
    if (!pickedTeamId) continue;

    const liveMatch = getLiveMatch(liveMatchMap, def.id);
    if (!liveMatch || liveMatch.status !== "finished") continue;

    decided += 1;
    const winner = winnerFromMatch(liveMatch);
    if (winner?.team?.id === pickedTeamId) {
      correct += 1;
    }
  }

  return { correct, decided, total: knockoutMatches.length };
}

export function getNextPickableMatchId(
  matches: Match[],
  groups: Group[],
  teams: Team[],
  picks: BracketWinnerPicks,
  groupRankings: GroupRankings = {},
  thirdPlaceQualifiers: string[] = [],
): string | undefined {
  const bracket = buildBracketState({
    mode: "picks",
    matches,
    groups,
    teams,
    picks,
    groupRankings,
    thirdPlaceQualifiers,
  });

  for (const round of bracket.rounds) {
    for (const match of round.matches) {
      if (match.canPick && !picks[match.id]) {
        return match.id;
      }
    }
  }

  return undefined;
}
