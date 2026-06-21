import type { MatchComparisonApiResponse } from "@/types/mockApi";
import { fanPulseMeta } from "./meta";

export const defaultMatchComparisonResponse: MatchComparisonApiResponse = {
  meta: fanPulseMeta("/v1/matches/default/comparison"),
  match_id: "default",
  comparisons: [
    {
      team_id: "home",
      team_name_en: "Home Team",
      recent_form: ["W", "W", "D", "W", "L"],
      goals_scored: 8,
      fan_confidence: 72,
      key_player_en: "Star Forward",
    },
    {
      team_id: "away",
      team_name_en: "Away Team",
      recent_form: ["W", "W", "D", "W", "L"],
      goals_scored: 7,
      fan_confidence: 67,
      key_player_en: "Star Forward",
    },
  ],
};

export function matchComparisonApiResponse(
  matchId: string,
  homeTeamName: string,
  awayTeamName: string,
): MatchComparisonApiResponse {
  return {
    meta: fanPulseMeta(`/v1/matches/${matchId}/comparison`),
    match_id: matchId,
    comparisons: [
      {
        team_id: "home",
        team_name_en: homeTeamName,
        recent_form: ["W", "W", "D", "W", "L"],
        goals_scored: 8,
        fan_confidence: 72,
        key_player_en: "Star Forward",
      },
      {
        team_id: "away",
        team_name_en: awayTeamName,
        recent_form: ["W", "W", "D", "W", "L"],
        goals_scored: 7,
        fan_confidence: 67,
        key_player_en: "Star Forward",
      },
    ],
  };
}
