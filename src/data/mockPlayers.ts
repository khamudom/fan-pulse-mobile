import { getPlayers } from "@/services/contentApi";

export const mockGoldenBootRace = getPlayers("golden_boot").data;
export const mockTopScorers = getPlayers("top_scorers").data;
export const mockMostAssists = getPlayers("most_assists").data;
export const mockDiscussedPlayers = getPlayers("discussed").data;
