import type { PredictorApiResponse } from "@/types/mockApi";
import { fanPulseMeta } from "./meta";

export const predictorApiResponse: PredictorApiResponse = {
  meta: fanPulseMeta("/v1/predictor/bracket"),
  groups: ["A", "B", "C", "D", "E", "F", "G", "H"],
  group_advance_teams: [
    { group: "A", team_name_en: "Mexico", slot: 1 },
    { group: "A", team_name_en: "South Korea", slot: 2 },
    { group: "B", team_name_en: "England", slot: 1 },
    { group: "B", team_name_en: "Senegal", slot: 2 },
    { group: "C", team_name_en: "Brazil", slot: 1 },
    { group: "C", team_name_en: "Morocco", slot: 2 },
    { group: "D", team_name_en: "France", slot: 1 },
    { group: "D", team_name_en: "Turkey", slot: 2 },
  ],
  knockout_rounds: [
    {
      round_en: "Round of 32",
      matchups_en: ["1A vs 3C", "2B vs 2D"],
    },
    {
      round_en: "Round of 16",
      matchups_en: ["Winner R32-1 vs Winner R32-2"],
    },
    {
      round_en: "Quarterfinals",
      matchups_en: ["QF1", "QF2"],
    },
    {
      round_en: "Semifinals",
      matchups_en: ["SF1", "SF2"],
    },
    {
      round_en: "Final",
      matchups_en: ["Champion"],
    },
  ],
};
