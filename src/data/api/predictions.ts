import type { PredictionsApiResponse } from "@/types/mockApi";
import { fanPulseMeta } from "./meta";

export const predictionsApiResponse: PredictionsApiResponse = {
  meta: fanPulseMeta("/v1/predictions/trends"),
  champion_options: [
    { id: "bra", label_en: "Brazil", category: "champion" },
    { id: "arg", label_en: "Argentina", category: "champion" },
    { id: "fra", label_en: "France", category: "champion" },
    { id: "eng", label_en: "England", category: "champion" },
    { id: "usa", label_en: "USA", category: "champion" },
    { id: "ger", label_en: "Germany", category: "champion" },
    { id: "esp", label_en: "Spain", category: "champion" },
    { id: "por", label_en: "Portugal", category: "champion" },
  ],
  golden_boot_options: [
    { id: "mbappe", label_en: "Kylian Mbappé", category: "golden_boot" },
    { id: "haaland", label_en: "Erling Haaland", category: "golden_boot" },
    { id: "vini", label_en: "Vinícius Júnior", category: "golden_boot" },
    { id: "messi", label_en: "Lionel Messi", category: "golden_boot" },
    { id: "kane", label_en: "Harry Kane", category: "golden_boot" },
    { id: "yamal", label_en: "Lamine Yamal", category: "golden_boot" },
  ],
  surprise_team_options: [
    { id: "mar", label_en: "Morocco", category: "surprise" },
    { id: "jpn", label_en: "Japan", category: "surprise" },
    { id: "usa", label_en: "USA", category: "surprise" },
    { id: "col", label_en: "Colombia", category: "surprise" },
    { id: "cro", label_en: "Croatia", category: "surprise" },
    { id: "kor", label_en: "South Korea", category: "surprise" },
  ],
  trends: [
    {
      id: "trend-champion",
      label_en: "Most picked champion",
      value_en: "Brazil (34%)",
      percentage: 34,
    },
    {
      id: "trend-boot",
      label_en: "Most picked Golden Boot",
      value_en: "Kylian Mbappé (28%)",
      percentage: 28,
    },
    {
      id: "trend-surprise",
      label_en: "Biggest surprise team",
      value_en: "Morocco (19%)",
      percentage: 19,
    },
    {
      id: "trend-upset",
      label_en: "Most predicted upset",
      value_en: "USA over England in Round of 16",
    },
  ],
  most_picked_champion: {
    team_name_en: "Brazil",
    percentage: 34,
  },
};
