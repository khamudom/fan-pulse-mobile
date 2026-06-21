import type { PollsApiResponse } from "@/types/mockApi";
import { fanPulseMeta } from "./meta";

export const pollsApiResponse: PollsApiResponse = {
  meta: fanPulseMeta("/v1/polls"),
  polls: [
    {
      id: "wc-winner",
      question_en: "Who will win the World Cup?",
      total_votes: 12847,
      options: [
        { id: "usa", label_en: "USA", votes: 1927, percentage: 15 },
        { id: "brazil", label_en: "Brazil", votes: 4368, percentage: 34 },
        { id: "argentina", label_en: "Argentina", votes: 3212, percentage: 25 },
        { id: "france", label_en: "France", votes: 1927, percentage: 15 },
        { id: "england", label_en: "England", votes: 1413, percentage: 11 },
      ],
    },
  ],
};
