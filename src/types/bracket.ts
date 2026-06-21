import type { Match, Team } from "@/types";

export type BracketRoundKey =
  | "r32"
  | "r16"
  | "qf"
  | "sf"
  | "final"
  | "third";

export interface BracketParticipant {
  label: string;
  team?: Team;
  slotCode?: string;
  isWinner?: boolean;
  isPlaceholder?: boolean;
}

export interface BracketMatchDef {
  id: string;
  round: BracketRoundKey;
  homeSlot: string;
  awaySlot: string;
  winnerSlot: string;
  nextMatchId?: string;
  nextMatchSide?: "home" | "away";
}

export interface BracketMatchState {
  id: string;
  round: BracketRoundKey;
  label: string;
  home: BracketParticipant;
  away: BracketParticipant;
  winner?: BracketParticipant;
  status: Match["status"];
  homeScore?: number;
  awayScore?: number;
  date?: string;
  time?: string;
  kickoffUtc?: string;
  venueTimeZone?: string;
  canPick: boolean;
}

export interface BracketRoundState {
  key: BracketRoundKey;
  label: string;
  matches: BracketMatchState[];
}

export interface BracketState {
  rounds: BracketRoundState[];
  champion?: BracketParticipant;
}

export type BracketWinnerPicks = Record<string, string>;

/** groupName -> ordered teamIds [1st, 2nd, 3rd, 4th] as predicted to finish. */
export type GroupRankings = Record<string, string[]>;

export interface BracketPredictionPayload {
  winners: BracketWinnerPicks;
  /** Predicted final group standings (ordered team ids per group). */
  groupRankings?: GroupRankings;
  /** Team ids of the third-place teams the user predicts will advance. */
  thirdPlaceQualifiers?: string[];
  championTeamId?: string;
  championTeamName?: string;
  updatedAt?: string;
}

export interface SavedBracketPrediction {
  id: string;
  userId: string;
  payload: BracketPredictionPayload;
  createdAt: string;
  updatedAt: string;
}
