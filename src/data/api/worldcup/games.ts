/** Mock fallback — mirrors GET https://worldcup26.ir/get/games */

export interface WorldCupApiGame {
  id: string;
  home_team_id: string;
  away_team_id: string;
  home_score: string;
  away_score: string;
  group: string;
  matchday: string;
  local_date: string;
  stadium_id: string;
  finished: string;
  time_elapsed: string;
  type: string;
  home_team_name_en: string;
  away_team_name_en: string;
}

export const mockGamesApiResponse = {
  games: [
    {
      id: "featured-1",
      home_team_id: "1",
      away_team_id: "2",
      home_score: "0",
      away_score: "0",
      group: "D",
      matchday: "3",
      local_date: "06/28/2026 20:00",
      stadium_id: "3",
      finished: "FALSE",
      time_elapsed: "notstarted",
      type: "group",
      home_team_name_en: "USA",
      away_team_name_en: "England",
    },
    {
      id: "featured-2",
      home_team_id: "3",
      away_team_id: "4",
      home_score: "2",
      away_score: "1",
      group: "C",
      matchday: "2",
      local_date: "06/20/2026 18:00",
      stadium_id: "2",
      finished: "TRUE",
      time_elapsed: "90",
      type: "group",
      home_team_name_en: "Brazil",
      away_team_name_en: "Argentina",
    },
    {
      id: "featured-3",
      home_team_id: "5",
      away_team_id: "6",
      home_score: "1",
      away_score: "1",
      group: "E",
      matchday: "1",
      local_date: "06/15/2026 15:00",
      stadium_id: "4",
      finished: "FALSE",
      time_elapsed: "67",
      type: "group",
      home_team_name_en: "France",
      away_team_name_en: "Germany",
    },
  ] satisfies WorldCupApiGame[],
};
