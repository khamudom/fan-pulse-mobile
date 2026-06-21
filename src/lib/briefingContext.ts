import {
  addCalendarDays,
  getIsoDateInTimeZone,
  toIsoDate,
} from "@/lib/matchDate";
import type { Match } from "@/types";
import type { Profile } from "@/types/database";

export function getBriefingTodayIso(now: Date, timeZone: string): string {
  return getIsoDateInTimeZone(now, timeZone);
}

function teamMatchesProfile(match: Match, profile: Profile): boolean {
  const teams = [profile.favorite_country, profile.secondary_country].filter(Boolean);
  if (teams.length === 0) return false;
  return teams.some(
    (team) => match.homeTeam.name === team || match.awayTeam.name === team,
  );
}

export function getBriefingTodayMatches(
  matches: Match[],
  now: Date,
  timeZone: string,
): Match[] {
  const todayIso = getBriefingTodayIso(now, timeZone);
  return matches.filter((match) => toIsoDate(match.date) === todayIso);
}

export function getBriefingYesterdayMatches(
  matches: Match[],
  profile: Profile | null,
  now: Date,
  timeZone: string,
): Match[] {
  const yesterdayIso = addCalendarDays(getBriefingTodayIso(now, timeZone), -1);
  const yesterday = matches.filter(
    (match) =>
      match.status === "finished" && toIsoDate(match.date) === yesterdayIso,
  );

  if (!profile?.favorite_country && !profile?.secondary_country) {
    return yesterday;
  }

  const relevant = yesterday.filter((match) => teamMatchesProfile(match, profile));
  return relevant.length > 0 ? relevant : yesterday.slice(0, 5);
}
