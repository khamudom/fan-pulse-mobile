import { contentData } from "@/services/contentApi";
import type { PlayerStoryline } from "@/types";

export const followablePlayers: PlayerStoryline[] = contentData.followablePlayers;

export function getPlayersByTeam(teamName: string): PlayerStoryline[] {
  return followablePlayers.filter((p) => p.team === teamName);
}
