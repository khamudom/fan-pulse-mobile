import { BRACKET_MATCHES } from "@/data/worldCupBracket";
import type { BracketMatchState, BracketRoundKey } from "@/types/bracket";

export type BracketTabId = "r32_r16" | "r16_qf" | "final";

export const BRACKET_VIEW_TABS: { id: BracketTabId; label: string }[] = [
  { id: "r32_r16", label: "1/16" },
  { id: "r16_qf", label: "1/8" },
  { id: "final", label: "Final" },
];

export interface BracketFeederPair {
  sourceAId: string;
  sourceBId: string;
  destinationId: string;
}

export interface BracketFeederGroup {
  sourceA: BracketMatchState;
  sourceB: BracketMatchState;
  destination: BracketMatchState;
}

export function getDefaultBracketTab(
  activeRound: BracketRoundKey | undefined,
): BracketTabId {
  if (!activeRound || activeRound === "r32") return "r32_r16";
  if (activeRound === "r16") return "r16_qf";
  return "final";
}

export function getFeederPairs(
  fromRound: BracketRoundKey,
  toRound: BracketRoundKey,
): BracketFeederPair[] {
  const destinations = BRACKET_MATCHES.filter((match) => match.round === toRound);

  return destinations.map((dest) => {
    const sources = BRACKET_MATCHES.filter(
      (match) => match.round === fromRound && match.nextMatchId === dest.id,
    );
    const homeSource =
      sources.find((match) => match.nextMatchSide === "home") ?? sources[0];
    const awaySource =
      sources.find((match) => match.nextMatchSide === "away") ?? sources[1];

    return {
      sourceAId: homeSource.id,
      sourceBId: awaySource.id,
      destinationId: dest.id,
    };
  });
}

export function resolveFeederGroups(
  pairs: BracketFeederPair[],
  matchMap: Map<string, BracketMatchState>,
): BracketFeederGroup[] {
  return pairs.flatMap(({ sourceAId, sourceBId, destinationId }) => {
    const sourceA = matchMap.get(sourceAId);
    const sourceB = matchMap.get(sourceBId);
    const destination = matchMap.get(destinationId);

    if (!sourceA || !sourceB || !destination) return [];

    return [{ sourceA, sourceB, destination }];
  });
}
