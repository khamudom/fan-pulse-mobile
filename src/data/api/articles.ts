import type { ArticlesApiResponse } from "@/types/mockApi";
import { fanPulseMeta } from "./meta";

export const articlesApiResponse: ArticlesApiResponse = {
  meta: fanPulseMeta("/v1/articles"),
  articles: [
    {
      id: "1",
      title_en: "USA's Road to the Knockout Stage",
      excerpt_en:
        "How the host nation is building momentum ahead of the group stage finale.",
      category: "Team Focus",
      published_at: "2026-06-14T10:00:00Z",
    },
    {
      id: "2",
      title_en: "Brazil vs Argentina: A Rivalry Renewed",
      excerpt_en:
        "The South American giants could meet earlier than expected in 2026.",
      category: "Match Preview",
      published_at: "2026-06-13T14:30:00Z",
    },
    {
      id: "3",
      title_en: "Host Cities Ready for World Cup Fever",
      excerpt_en:
        "From Mexico City to New York, stadiums are preparing for record crowds.",
      category: "Host Cities",
      published_at: "2026-06-12T09:15:00Z",
    },
    {
      id: "4",
      title_en: "Golden Boot Race Heats Up",
      excerpt_en:
        "Early tournament scorers are separating themselves in the race for the award.",
      category: "Players",
      published_at: "2026-06-11T16:45:00Z",
    },
    {
      id: "5",
      title_en: "Group of Death or Group of Dreams?",
      excerpt_en:
        "Analysts debate which group will produce the most drama in 2026.",
      category: "Tournament",
      published_at: "2026-06-10T11:00:00Z",
    },
    {
      id: "6",
      title_en: "Fan Sentiment Surges for Underdogs",
      excerpt_en:
        "Poll data shows rising confidence in surprise teams across the bracket.",
      category: "Fan Pulse",
      published_at: "2026-06-09T08:30:00Z",
    },
  ],
};
