import type { BracketMatchDef, BracketRoundKey } from "@/types/bracket";

/** Official-style FIFA World Cup 2026 knockout bracket structure. */
export const BRACKET_MATCHES: BracketMatchDef[] = [
  // Round of 32 — left half
  { id: "M73", round: "r32", homeSlot: "2A", awaySlot: "2B", winnerSlot: "W73", nextMatchId: "M89", nextMatchSide: "home" },
  { id: "M74", round: "r32", homeSlot: "1E", awaySlot: "3ABCDF", winnerSlot: "W74", nextMatchId: "M89", nextMatchSide: "away" },
  { id: "M75", round: "r32", homeSlot: "1F", awaySlot: "2C", winnerSlot: "W75", nextMatchId: "M90", nextMatchSide: "home" },
  { id: "M76", round: "r32", homeSlot: "1C", awaySlot: "2F", winnerSlot: "W76", nextMatchId: "M90", nextMatchSide: "away" },
  { id: "M77", round: "r32", homeSlot: "1I", awaySlot: "3CDFGH", winnerSlot: "W77", nextMatchId: "M91", nextMatchSide: "home" },
  { id: "M78", round: "r32", homeSlot: "2E", awaySlot: "2I", winnerSlot: "W78", nextMatchId: "M91", nextMatchSide: "away" },
  { id: "M79", round: "r32", homeSlot: "1A", awaySlot: "3CEFHI", winnerSlot: "W79", nextMatchId: "M92", nextMatchSide: "home" },
  { id: "M80", round: "r32", homeSlot: "1L", awaySlot: "2K", winnerSlot: "W80", nextMatchId: "M92", nextMatchSide: "away" },
  // Round of 32 — right half
  { id: "M81", round: "r32", homeSlot: "1D", awaySlot: "3BEFIJ", winnerSlot: "W81", nextMatchId: "M93", nextMatchSide: "home" },
  { id: "M82", round: "r32", homeSlot: "2J", awaySlot: "2H", winnerSlot: "W82", nextMatchId: "M93", nextMatchSide: "away" },
  { id: "M83", round: "r32", homeSlot: "1G", awaySlot: "3AEHIJ", winnerSlot: "W83", nextMatchId: "M94", nextMatchSide: "home" },
  { id: "M84", round: "r32", homeSlot: "1H", awaySlot: "2G", winnerSlot: "W84", nextMatchId: "M94", nextMatchSide: "away" },
  { id: "M85", round: "r32", homeSlot: "1B", awaySlot: "3DEFGHI", winnerSlot: "W85", nextMatchId: "M95", nextMatchSide: "home" },
  { id: "M86", round: "r32", homeSlot: "2D", awaySlot: "2L", winnerSlot: "W86", nextMatchId: "M95", nextMatchSide: "away" },
  { id: "M87", round: "r32", homeSlot: "1J", awaySlot: "3ABGHIJ", winnerSlot: "W87", nextMatchId: "M96", nextMatchSide: "home" },
  { id: "M88", round: "r32", homeSlot: "1K", awaySlot: "3ABCDFG", winnerSlot: "W88", nextMatchId: "M96", nextMatchSide: "away" },

  // Round of 16
  { id: "M89", round: "r16", homeSlot: "W73", awaySlot: "W74", winnerSlot: "W89", nextMatchId: "M97", nextMatchSide: "home" },
  { id: "M90", round: "r16", homeSlot: "W75", awaySlot: "W76", winnerSlot: "W90", nextMatchId: "M97", nextMatchSide: "away" },
  { id: "M91", round: "r16", homeSlot: "W77", awaySlot: "W78", winnerSlot: "W91", nextMatchId: "M98", nextMatchSide: "home" },
  { id: "M92", round: "r16", homeSlot: "W79", awaySlot: "W80", winnerSlot: "W92", nextMatchId: "M98", nextMatchSide: "away" },
  { id: "M93", round: "r16", homeSlot: "W81", awaySlot: "W82", winnerSlot: "W93", nextMatchId: "M99", nextMatchSide: "home" },
  { id: "M94", round: "r16", homeSlot: "W83", awaySlot: "W84", winnerSlot: "W94", nextMatchId: "M99", nextMatchSide: "away" },
  { id: "M95", round: "r16", homeSlot: "W85", awaySlot: "W86", winnerSlot: "W95", nextMatchId: "M100", nextMatchSide: "home" },
  { id: "M96", round: "r16", homeSlot: "W87", awaySlot: "W88", winnerSlot: "W96", nextMatchId: "M100", nextMatchSide: "away" },

  // Quarter-finals
  { id: "M97", round: "qf", homeSlot: "W89", awaySlot: "W90", winnerSlot: "W97", nextMatchId: "M101", nextMatchSide: "home" },
  { id: "M98", round: "qf", homeSlot: "W91", awaySlot: "W92", winnerSlot: "W98", nextMatchId: "M101", nextMatchSide: "away" },
  { id: "M99", round: "qf", homeSlot: "W93", awaySlot: "W94", winnerSlot: "W99", nextMatchId: "M102", nextMatchSide: "home" },
  { id: "M100", round: "qf", homeSlot: "W95", awaySlot: "W96", winnerSlot: "W100", nextMatchId: "M102", nextMatchSide: "away" },

  // Semi-finals
  { id: "M101", round: "sf", homeSlot: "W97", awaySlot: "W98", winnerSlot: "W101", nextMatchId: "M104", nextMatchSide: "home" },
  { id: "M102", round: "sf", homeSlot: "W99", awaySlot: "W100", winnerSlot: "W102", nextMatchId: "M104", nextMatchSide: "away" },

  // Third place & Final
  { id: "M103", round: "third", homeSlot: "RU101", awaySlot: "RU102", winnerSlot: "W103" },
  { id: "M104", round: "final", homeSlot: "W101", awaySlot: "W102", winnerSlot: "W104" },
];

export const BRACKET_ROUND_ORDER: BracketRoundKey[] = [
  "r32",
  "r16",
  "qf",
  "sf",
  "final",
];

export const BRACKET_ROUND_LABELS: Record<BracketRoundKey, string> = {
  r32: "Round of 32",
  r16: "Round of 16",
  qf: "Quarter-finals",
  sf: "Semi-finals",
  final: "Final",
  third: "Third Place",
};

export const BRACKET_MATCH_MAP = new Map(
  BRACKET_MATCHES.map((match) => [match.id, match]),
);
