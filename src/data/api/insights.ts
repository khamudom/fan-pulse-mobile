import type { InsightsApiResponse } from "@/types/mockApi";
import { fanPulseMeta } from "./meta";

export const insightsApiResponse: InsightsApiResponse = {
  meta: fanPulseMeta("/v1/insights"),
  match_insights: [
    {
      id: "mi-1",
      prompt_en: "Why does this match matter?",
      response_en:
        "This fixture could decide who tops the group and avoids a tougher knockout path.",
    },
    {
      id: "mi-2",
      prompt_en: "Who has the tactical advantage?",
      response_en:
        "The team with stronger recent form and midfield control has the edge in tight matches.",
    },
    {
      id: "mi-3",
      prompt_en: "What would an upset look like?",
      response_en:
        "An early goal and disciplined defending could flip expectations in a high-stakes clash.",
    },
  ],
  tournament_insights: [
    {
      id: "ti-1",
      title_en: "Champion Predictions",
      body_en:
        "Brazil is currently the most predicted champion with 34% of all fan submissions.",
      category: "Predictions",
    },
    {
      id: "ti-2",
      title_en: "Argentina Momentum",
      body_en:
        "Argentina fan confidence increased 12% after their latest victory.",
      category: "Sentiment",
    },
    {
      id: "ti-3",
      title_en: "USA Engagement",
      body_en:
        "USA engagement is growing faster than any other team on FanPulse.",
      category: "Trending",
    },
    {
      id: "ti-4",
      title_en: "Most Discussed",
      body_en:
        "France is currently the most discussed team among fans this week.",
      category: "Discussion",
    },
  ],
  ai_prompts: [
    {
      id: "ai-1",
      prompt_en: "Who has the easiest path?",
      response_en:
        "Based on group composition and bracket positioning, teams in Groups A and F appear to have a clearer route to the quarterfinals.",
    },
    {
      id: "ai-2",
      prompt_en: "Who is most likely to win?",
      response_en:
        "Brazil and Argentina lead fan predictions, with France close behind in overall tournament confidence.",
    },
    {
      id: "ai-3",
      prompt_en: "Which match should I watch today?",
      response_en:
        "Today's featured clash has knockout implications — expect high intensity from the opening whistle.",
    },
    {
      id: "ai-4",
      prompt_en: "What team is trending?",
      response_en:
        "USA fan engagement is surging, with prediction volume up 18% over the last 48 hours.",
    },
  ],
};
