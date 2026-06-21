import {
  getTodaysStory as fetchTodaysStory,
  type WorldCupStory,
} from "@/services/contentApi";

export type { WorldCupStory };

export function formatStoryDate(date = new Date()): string {
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function getTodaysStory(date = new Date()): WorldCupStory {
  return fetchTodaysStory(date).data;
}
