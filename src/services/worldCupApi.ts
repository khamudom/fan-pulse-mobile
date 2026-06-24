import "server-only";

import { cache } from "react";
import {
  fetchWorldCupResource,
  type WorldCupFetchMode,
} from "@/lib/worldcup/client";
import { WORLD_CUP_API_AUTH_REQUIRED, WORLD_CUP_API_UNAVAILABLE } from "@/lib/worldcup/config";
import {
  parseLocalDateTimeString,
  zonedLocalToUtcIso,
} from "@/lib/timezone";
import { getVenueTimeZone } from "@/lib/venueTimeZones";
import type {
  ApiResult,
  Group,
  Match,
  MatchStatus,
  Stadium,
  Team,
} from "@/types";

export type FetchMode = WorldCupFetchMode;

function worldCupFetchErrorMessage(error: unknown): string {
  if (error instanceof Error && error.message === WORLD_CUP_API_AUTH_REQUIRED) {
    return WORLD_CUP_API_AUTH_REQUIRED;
  }
  return WORLD_CUP_API_UNAVAILABLE;
}

function logWorldCupFetchFailure(scope: string, error: unknown): void {
  const message =
    error instanceof Error ? error.message : "World Cup API request failed";
  const isRecoverable =
    message !== WORLD_CUP_API_AUTH_REQUIRED &&
    (/responded with 5\d\d/.test(message) ||
      /fetch failed|timeout|network|socket hang up/i.test(message));

  if (isRecoverable) {
    console.warn(`[worldCupApi] ${scope}: ${message}`);
    return;
  }

  console.error(`[worldCupApi] ${scope}: ${message}`);
}

interface ApiGame {
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

interface ApiTeam {
  id: string;
  name_en: string;
  name_fa?: string;
  flag: string;
  fifa_code: string;
  iso2: string;
  groups: string;
}

interface ApiStadium {
  id: string;
  name_en: string;
  fifa_name: string;
  city_en: string;
  country_en: string;
  capacity: number;
  region: string;
}

interface ApiGroupTeam {
  team_id: string;
  mp: string;
  w: string;
  d: string;
  l: string;
  pts: string;
  gf: string;
  ga: string;
  gd: string;
}

interface ApiGroup {
  name: string;
  teams: ApiGroupTeam[];
}

async function fetchTeamsJson(mode: FetchMode = "cached") {
  return fetchWorldCupResource<{ teams: ApiTeam[] }>("teams", { mode });
}

const fetchTeamsCached = cache(async () => fetchTeamsJson("cached"));

async function getTeamsUncached(): Promise<ApiResult<Team[]>> {
  try {
    const response = await fetchTeamsCached();
    if (!response.teams.length) {
      return { data: [], source: "api", error: "World Cup API returned no teams" };
    }

    const teams = response.teams.map((team) => ({
      id: team.id,
      name: team.name_en,
      nameFa: team.name_fa,
      flag: team.flag,
      fifaCode: team.fifa_code,
      iso2: team.iso2,
      group: team.groups,
    }));

    return { data: teams, source: "api" };
  } catch (error) {
    logWorldCupFetchFailure("getTeams", error);
    return { data: [], source: "api", error: worldCupFetchErrorMessage(error) };
  }
}

async function getMatchesUncached(
  mode: FetchMode = "cached",
): Promise<ApiResult<Match[]>> {
  try {
    const gamesRes = await fetchWorldCupResource<{ games: ApiGame[] }>("games", {
      mode,
    });

    if (!gamesRes.games.length) {
      return { data: [], source: "api", error: "World Cup API returned no matches" };
    }

    const [teamsRes, stadiumsRes] = await Promise.all([
      fetchTeamsCached().catch(() => ({ teams: [] as ApiTeam[] })),
      fetchWorldCupResource<{ stadiums: ApiStadium[] }>("stadiums", {
        mode: "cached",
      }).catch(() => ({ stadiums: [] as ApiStadium[] })),
    ]);

    const teamMap = new Map(teamsRes.teams.map((team) => [team.id, team]));
    const stadiumMap = new Map(
      stadiumsRes.stadiums.map((stadium) => [stadium.id, stadium]),
    );

    const matches = gamesRes.games.map((game) =>
      mapGameToMatch(game, teamMap, stadiumMap),
    );

    return { data: matches, source: "api" };
  } catch (error) {
    logWorldCupFetchFailure("getMatches", error);
    return { data: [], source: "api", error: worldCupFetchErrorMessage(error) };
  }
}

function parseStatus(finished: string, timeElapsed: string): MatchStatus {
  const finishedUpper = finished?.toUpperCase();
  if (finishedUpper === "TRUE") return "finished";
  if (timeElapsed === "notstarted") return "scheduled";
  if (timeElapsed === "halftime") return "halftime";
  if (timeElapsed && timeElapsed !== "notstarted") return "live";
  return "scheduled";
}

function formatDisplayTime(timePart: string): string {
  const [hourPart, minutePart = "00"] = timePart.split(":");
  const hour = parseInt(hourPart, 10);

  if (Number.isNaN(hour)) return timePart;

  const period = hour >= 12 ? "PM" : "AM";
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${minutePart.padStart(2, "0")} ${period}`;
}

function parseDateTime(localDate: string): { date: string; time: string } {
  const parts = localDate?.split(" ") ?? [];
  const datePart = parts[0] ?? "";
  const timePart = parts[1] ?? "";
  const [month, day, year] = datePart.split("/");
  const displayDate =
    year && month && day
      ? `${month.padStart(2, "0")}-${day.padStart(2, "0")}-${year}`
      : datePart;
  return { date: displayDate, time: formatDisplayTime(timePart) };
}

function toIsoDate(date: string): string {
  const isoMatch = date.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (isoMatch) return date;

  const displayMatch = date.match(/^(\d{1,2})-(\d{1,2})-(\d{4})$/);
  if (!displayMatch) return date;

  const [, month, day, year] = displayMatch;
  return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
}

function mapApiTeam(
  id: string,
  name: string,
  flag?: string,
  group?: string,
  fifaCode?: string,
): Team {
  return { id, name, flag, group, fifaCode };
}

function mapGameToMatch(
  game: ApiGame,
  teamMap: Map<string, ApiTeam>,
  stadiumMap: Map<string, ApiStadium>,
): Match {
  const homeApi = teamMap.get(game.home_team_id);
  const awayApi = teamMap.get(game.away_team_id);
  const stadium = stadiumMap.get(game.stadium_id);
  const { date, time } = parseDateTime(game.local_date);
  const venueTimeZone = getVenueTimeZone(stadium?.city_en, stadium?.country_en);
  const localDateTime = parseLocalDateTimeString(game.local_date);
  const kickoffUtc = localDateTime
    ? zonedLocalToUtcIso(localDateTime, venueTimeZone)
    : undefined;

  return {
    id: game.id,
    homeTeam: mapApiTeam(
      game.home_team_id,
      game.home_team_name_en || homeApi?.name_en || "TBD",
      homeApi?.flag,
      game.group,
      homeApi?.fifa_code,
    ),
    awayTeam: mapApiTeam(
      game.away_team_id,
      game.away_team_name_en || awayApi?.name_en || "TBD",
      awayApi?.flag,
      game.group,
      awayApi?.fifa_code,
    ),
    homeScore: parseInt(game.home_score, 10) || 0,
    awayScore: parseInt(game.away_score, 10) || 0,
    group: game.group,
    matchday: game.matchday,
    date,
    time,
    kickoffUtc,
    venueTimeZone,
    stadiumId: game.stadium_id,
    stadiumName: stadium?.name_en,
    city: stadium?.city_en,
    status: parseStatus(game.finished, game.time_elapsed),
    type: game.type,
  };
}

export const getTeams = cache(getTeamsUncached);
export const getMatches = cache(getMatchesUncached);

async function getMatchByIdUncached(
  id: string,
  mode: FetchMode = "cached",
): Promise<ApiResult<Match | null>> {
  const { data: initialMatches, source: initialSource, error } =
    await getMatches(mode);
  let matches = initialMatches;
  let source = initialSource;
  let match = matches.find((item) => item.id === id) ?? null;

  if (!match && mode === "fresh" && error) {
    const cached = await getMatches("cached");
    match = cached.data.find((item) => item.id === id) ?? null;
    if (match) {
      return { data: match, source: cached.source, error };
    }
    if (!matches.length && cached.data.length) {
      matches = cached.data;
      source = cached.source;
    }
  }

  if (!match) {
    return {
      data: null,
      source,
      error: error ?? "Match not found",
    };
  }

  return { data: match, source, error };
}

export const getMatchById = cache(getMatchByIdUncached);

export async function getTeamById(id: string): Promise<ApiResult<Team | null>> {
  const { data: teams, source, error } = await getTeams();
  const team = teams.find((item) => item.id === id) ?? null;

  if (!team) {
    return {
      data: null,
      source,
      error: error ?? "Team not found",
    };
  }

  return { data: team, source, error };
}

export async function getMatchesForTeam(
  teamId: string,
  mode: FetchMode = "cached",
): Promise<ApiResult<Match[]>> {
  const { data: matches, source, error } = await getMatches(mode);
  const filtered = matches
    .filter(
      (match) =>
        match.homeTeam.id === teamId || match.awayTeam.id === teamId,
    )
    .sort((a, b) => {
      const aKickoff = a.kickoffUtc ?? a.date;
      const bKickoff = b.kickoffUtc ?? b.date;
      return aKickoff.localeCompare(bKickoff);
    });

  return { data: filtered, source, error };
}

async function getGroupsUncached(): Promise<ApiResult<Group[]>> {
  try {
    const [groupsRes, teamsRes] = await Promise.all([
      fetchWorldCupResource<{ groups: ApiGroup[] }>("groups"),
      fetchTeamsCached(),
    ]);

    if (!groupsRes.groups.length) {
      return { data: [], source: "api", error: "World Cup API returned no groups" };
    }

    const teamMap = new Map(teamsRes.teams.map((team) => [team.id, team]));

    const groups: Group[] = groupsRes.groups.map((group) => ({
      name: group.name,
      standings: group.teams.map((standing) => {
        const team = teamMap.get(standing.team_id);
        return {
          teamId: standing.team_id,
          teamName: team?.name_en ?? `Team ${standing.team_id}`,
          flag: team?.flag,
          played: parseInt(standing.mp, 10) || 0,
          won: parseInt(standing.w, 10) || 0,
          drawn: parseInt(standing.d, 10) || 0,
          lost: parseInt(standing.l, 10) || 0,
          goalsFor: parseInt(standing.gf, 10) || 0,
          goalsAgainst: parseInt(standing.ga, 10) || 0,
          goalDifference: parseInt(standing.gd, 10) || 0,
          points: parseInt(standing.pts, 10) || 0,
        };
      }),
    }));

    return {
      data: groups.sort((a, b) => a.name.localeCompare(b.name)),
      source: "api",
    };
  } catch (error) {
    logWorldCupFetchFailure("getGroups", error);
    return { data: [], source: "api", error: worldCupFetchErrorMessage(error) };
  }
}

async function getStadiumsUncached(): Promise<ApiResult<Stadium[]>> {
  try {
    const stadiumsRes = await fetchWorldCupResource<{ stadiums: ApiStadium[] }>(
      "stadiums",
    );

    if (!stadiumsRes.stadiums.length) {
      return {
        data: [],
        source: "api",
        error: "World Cup API returned no stadiums",
      };
    }

    const gamesRes = await fetchWorldCupResource<{ games: ApiGame[] }>("games", {
      mode: "cached",
    }).catch(() => ({ games: [] as ApiGame[] }));

    const matchCountByStadium = new Map<string, number>();
    for (const game of gamesRes.games) {
      const count = matchCountByStadium.get(game.stadium_id) ?? 0;
      matchCountByStadium.set(game.stadium_id, count + 1);
    }

    const stadiums: Stadium[] = stadiumsRes.stadiums.map((stadium) => ({
      id: stadium.id,
      name: stadium.name_en,
      fifaName: stadium.fifa_name,
      city: stadium.city_en,
      country: stadium.country_en,
      capacity: stadium.capacity,
      region: stadium.region,
      matchCount: matchCountByStadium.get(stadium.id) ?? 0,
    }));

    return { data: stadiums, source: "api" };
  } catch (error) {
    logWorldCupFetchFailure("getStadiums", error);
    return { data: [], source: "api", error: worldCupFetchErrorMessage(error) };
  }
}

export const getGroups = cache(getGroupsUncached);
export const getStadiums = cache(getStadiumsUncached);

export async function getTodaysMatches(): Promise<ApiResult<Match[]>> {
  const { data: matches, source, error } = await getMatches();
  const today = new Date();
  const todayStr = today.toISOString().slice(0, 10);

  const todays = matches.filter((match) => {
    const isoDate = toIsoDate(match.date);
    if (isoDate === todayStr) return true;
    const matchDate = new Date(isoDate);
    return (
      !Number.isNaN(matchDate.getTime()) &&
      matchDate.toDateString() === today.toDateString()
    );
  });

  if (todays.length === 0) {
    const upcoming = [...matches]
      .filter((match) => match.status === "scheduled" || match.status === "notstarted")
      .slice(0, 6);

    return {
      data: upcoming,
      source,
      error,
    };
  }

  return { data: todays.slice(0, 8), source, error };
}

export async function getFeaturedMatch(): Promise<ApiResult<Match | null>> {
  const { data: matches, source, error } = await getMatches();
  const live = matches.find((match) => match.status === "live");
  if (live) return { data: live, source, error };

  const scheduled = matches.find(
    (match) => match.status === "scheduled" || match.status === "notstarted",
  );
  if (scheduled) return { data: scheduled, source, error };
  if (matches[0]) return { data: matches[0], source, error };

  return { data: null, source, error };
}
