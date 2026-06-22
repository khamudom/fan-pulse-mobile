import { worldCupSquads, type WorldCupSquad } from "@/data/api/worldcup/squads";
import { getFanJourney, type FanJourneyResult } from "@/lib/fanJourney";
import type { Match, Team } from "@/types";
import type { Profile } from "@/types/database";

function normalizeName(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
}

export function findTeamByName(teams: Team[], name?: string | null): Team | null {
  if (!name) return null;
  const target = normalizeName(name);
  return teams.find((t) => normalizeName(t.name) === target) ?? null;
}

export function findSquadByName(name?: string | null): WorldCupSquad | null {
  if (!name) return null;
  const target = normalizeName(name);
  return (
    worldCupSquads.find((s) => normalizeName(s.team_name_en) === target) ?? null
  );
}

function getGroupRivals(teams: Team[], team: Team | null): Team[] {
  if (!team?.group) return [];
  return teams
    .filter((t) => t.group === team.group && t.id !== team.id)
    .sort((a, b) => a.name.localeCompare(b.name));
}

function getNationFixtures(matches: Match[], team: Team | null): Match[] {
  if (!team) return [];
  const target = normalizeName(team.name);
  return matches
    .filter(
      (m) =>
        normalizeName(m.homeTeam.name) === target ||
        normalizeName(m.awayTeam.name) === target,
    )
    .sort((a, b) => toIsoDate(a.date).localeCompare(toIsoDate(b.date)));
}

function toIsoDate(date: string): string {
  const isoMatch = date.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (isoMatch) return date;
  const displayMatch = date.match(/^(\d{1,2})-(\d{1,2})-(\d{4})$/);
  if (!displayMatch) return date;
  const [, month, day, year] = displayMatch;
  return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
}

export interface MyWorldCupData {
  favoriteTeam: Team | null;
  secondaryTeam: Team | null;
  squad: WorldCupSquad | null;
  secondarySquad: WorldCupSquad | null;
  rivals: Team[];
  secondaryRivals: Team[];
  fixtures: Match[];
  secondaryFixtures: Match[];
  journey: FanJourneyResult;
}

export function assembleMyWorldCup(
  teams: Team[],
  matches: Match[],
  profile: Profile | null,
  now = new Date(),
): MyWorldCupData {
  const favoriteTeam = findTeamByName(teams, profile?.favorite_country);
  const secondaryTeam = findTeamByName(teams, profile?.secondary_country);

  return {
    favoriteTeam,
    secondaryTeam,
    squad: findSquadByName(profile?.favorite_country),
    secondarySquad: findSquadByName(profile?.secondary_country),
    rivals: getGroupRivals(teams, favoriteTeam),
    secondaryRivals: getGroupRivals(teams, secondaryTeam),
    fixtures: getNationFixtures(matches, favoriteTeam),
    secondaryFixtures: getNationFixtures(matches, secondaryTeam),
    journey: getFanJourney(matches, profile, now),
  };
}
