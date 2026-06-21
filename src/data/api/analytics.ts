import type { AnalyticsApiResponse } from "@/types/mockApi";
import { fanPulseMeta } from "./meta";

export const analyticsApiResponse: AnalyticsApiResponse = {
  meta: fanPulseMeta("/v1/analytics/dashboard"),
  metrics: [
    { id: "matches-played", label_en: "Matches Played", value: 42 },
    { id: "goals-scored", label_en: "Goals Scored", value: 118 },
    { id: "teams-remaining", label_en: "Teams Remaining", value: 24 },
    {
      id: "predictions",
      label_en: "Total Fan Predictions",
      value: "48.2K",
    },
    { id: "poll-votes", label_en: "Total Poll Votes", value: "12.8K" },
    {
      id: "discussed",
      label_en: "Most Discussed Team",
      value: "France",
    },
  ],
  fan_sentiment: [
    { team_name_en: "Brazil", confidence: 82 },
    { team_name_en: "Argentina", confidence: 79 },
    { team_name_en: "France", confidence: 74 },
    { team_name_en: "England", confidence: 68 },
    { team_name_en: "USA", confidence: 61 },
  ],
  trending_teams: [
    {
      id: "1",
      name_en: "USA",
      popularity_change_en: "+18%",
      fan_confidence: 61,
      prediction_percentage: 15,
    },
    {
      id: "2",
      name_en: "Brazil",
      popularity_change_en: "+8%",
      fan_confidence: 82,
      prediction_percentage: 34,
    },
    {
      id: "3",
      name_en: "Morocco",
      popularity_change_en: "+14%",
      fan_confidence: 55,
      prediction_percentage: 19,
    },
    {
      id: "4",
      name_en: "Argentina",
      popularity_change_en: "+12%",
      fan_confidence: 79,
      prediction_percentage: 25,
    },
  ],
  timeline: [
    {
      id: "1",
      title_en: "Opening Match",
      date_en: "June 11, 2026",
      description_en: "Mexico City kicks off the 48-team tournament.",
      status: "completed",
    },
    {
      id: "2",
      title_en: "Group Stage",
      date_en: "June 11 – July 1, 2026",
      description_en: "104 matches across 12 groups A through L.",
      status: "current",
    },
    {
      id: "3",
      title_en: "Knockout Stage",
      date_en: "July 4, 2026",
      description_en: "Round of 32 begins with expanded bracket.",
      status: "upcoming",
    },
    {
      id: "4",
      title_en: "Quarterfinals",
      date_en: "July 10–11, 2026",
      description_en: "Eight teams remain in the hunt.",
      status: "upcoming",
    },
    {
      id: "5",
      title_en: "Semifinals",
      date_en: "July 14–15, 2026",
      description_en: "The final four battle for a place in the final.",
      status: "upcoming",
    },
    {
      id: "6",
      title_en: "Final",
      date_en: "July 19, 2026",
      description_en: "MetLife Stadium, New Jersey — crowning a champion.",
      status: "upcoming",
    },
  ],
  group_analysis: {
    leaders: [
      { group: "A", leader_name_en: "Mexico" },
      { group: "B", leader_name_en: "England" },
      { group: "C", leader_name_en: "Brazil" },
      { group: "D", leader_name_en: "France" },
    ],
    most_competitive_en: "Group E",
    highest_scoring_en: "Group C",
    most_surprising_en: "Group H",
  },
  match_highlights: {
    most_viewed_en: "USA vs Mexico",
    highest_scoring_en: "Germany vs Japan (4-3)",
    biggest_upset_en: "Morocco 2-1 Spain",
    closest_match_en: "Portugal 0-0 France (penalties)",
  },
  host_city_insights: {
    most_active_city_en: "Mexico City",
    featured_stadium_en: "Estadio Azteca",
    highest_scoring_stadium_en: "AT&T Stadium",
    upcoming_venue_en: "MetLife Stadium — Final",
  },
  overview: {
    stage_en: "Group Stage",
    matches_played: 42,
    teams_remaining: 48,
    total_predictions: 48200,
  },
};
