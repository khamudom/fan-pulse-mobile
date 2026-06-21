import { getCountdownParts } from "@/lib/countdown";
import type { Match } from "@/types";
import type { Profile } from "@/types/database";

function toIsoDate(date: string): string {
  const isoMatch = date.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (isoMatch) return date;

  const displayMatch = date.match(/^(\d{1,2})-(\d{1,2})-(\d{4})$/);
  if (!displayMatch) return date;

  const [, month, day, year] = displayMatch;
  return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
}

function parseMatchDateTime(match: Match): Date | null {
  if (match.kickoffUtc) {
    const kickoff = new Date(match.kickoffUtc);
    return Number.isNaN(kickoff.getTime()) ? null : kickoff;
  }

  const iso = toIsoDate(match.date);
  const timeMatch = match.time.match(/(\d+):(\d+)\s*(AM|PM)?/i);
  if (!timeMatch) return new Date(`${iso}T12:00:00`);

  let hour = parseInt(timeMatch[1], 10);
  const minute = parseInt(timeMatch[2], 10);
  const period = timeMatch[3]?.toUpperCase();

  if (period === "PM" && hour < 12) hour += 12;
  if (period === "AM" && hour === 12) hour = 0;

  const d = new Date(`${iso}T${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}:00`);
  return Number.isNaN(d.getTime()) ? null : d;
}

function teamMatchesFavorite(match: Match, favorite: string): boolean {
  const aliases = getFavoriteTeamNames(favorite);
  return aliases.some(
    (name) => match.homeTeam.name === name || match.awayTeam.name === name,
  );
}

const FAVORITE_TEAM_ALIASES: Record<string, string[]> = {
  "United States": ["United States", "USA"],
  USA: ["United States", "USA"],
  "South Korea": ["South Korea", "Korea Republic"],
};

function getFavoriteTeamNames(favorite: string): string[] {
  return FAVORITE_TEAM_ALIASES[favorite] ?? [favorite];
}

function teamMatchesProfile(match: Match, profile: Profile): boolean {
  const teams = [profile.favorite_country, profile.secondary_country].filter(
    (team): team is string => Boolean(team),
  );
  if (teams.length === 0) return false;
  return teams.some((favorite) => teamMatchesFavorite(match, favorite));
}

function isLiveMatchStatus(status: Match["status"]): boolean {
  return status === "live" || status === "halftime";
}

export interface FanJourneyResult {
  nextMatch: Match | null;
  lastMatch: Match | null;
  kickoff: Date | null;
  countdown: ReturnType<typeof getCountdownParts> | null;
  label: string;
  lastMatchLabel: string | null;
  opponent: string | null;
}

function getMatchOpponent(match: Match, favorite: string): string {
  return match.homeTeam.name === favorite
    ? match.awayTeam.name
    : match.homeTeam.name;
}

function getLastFinishedMatch(
  matches: Match[],
  favorite: string
): Match | null {
  const finished = matches
    .filter(
      (m) =>
        m.status === "finished" && teamMatchesFavorite(m, favorite)
    )
    .map((m) => ({ match: m, kickoff: parseMatchDateTime(m) }))
    .filter((item): item is { match: Match; kickoff: Date } => !!item.kickoff)
    .sort((a, b) => b.kickoff.getTime() - a.kickoff.getTime());

  return finished[0]?.match ?? null;
}

export function getFanJourney(
  matches: Match[],
  profile: Profile | null,
  now = new Date()
): FanJourneyResult {
  // Journey panels track the user's primary nation only — not secondary_country.
  if (!profile?.favorite_country) {
    return {
      nextMatch: null,
      lastMatch: null,
      kickoff: null,
      countdown: null,
      label: "Set up My World Cup",
      lastMatchLabel: null,
      opponent: null,
    };
  }

  const favorite = profile.favorite_country;
  const lastMatch = getLastFinishedMatch(matches, favorite);
  const lastMatchLabel = lastMatch
    ? `${favorite} vs ${getMatchOpponent(lastMatch, favorite)}`
    : null;

  const live = matches.find(
    (m) => isLiveMatchStatus(m.status) && teamMatchesFavorite(m, favorite)
  );

  if (live) {
    const opponent = getMatchOpponent(live, favorite);

    return {
      nextMatch: live,
      lastMatch,
      kickoff: parseMatchDateTime(live),
      countdown: null,
      label: `${favorite} vs ${opponent}`,
      lastMatchLabel,
      opponent,
    };
  }

  const upcoming = matches
    .filter(
      (m) =>
        (m.status === "scheduled" || m.status === "notstarted") &&
        teamMatchesFavorite(m, favorite)
    )
    .map((m) => ({ match: m, kickoff: parseMatchDateTime(m) }))
    .filter((item): item is { match: Match; kickoff: Date } => {
      if (!item.kickoff) return false;
      return item.kickoff.getTime() > now.getTime();
    })
    .sort((a, b) => a.kickoff.getTime() - b.kickoff.getTime());

  const next = upcoming[0];
  if (!next) {
    return {
      nextMatch: null,
      lastMatch,
      kickoff: null,
      countdown: null,
      label: `${favorite} has no upcoming matches`,
      lastMatchLabel,
      opponent: null,
    };
  }

  const opponent = getMatchOpponent(next.match, favorite);

  return {
    nextMatch: next.match,
    lastMatch,
    kickoff: next.kickoff,
    countdown: getCountdownParts(next.kickoff, now),
    label: `${favorite} vs ${opponent}`,
    lastMatchLabel,
    opponent,
  };
}

export function formatCountdownLabel(
  countdown: ReturnType<typeof getCountdownParts>
): string {
  const parts: string[] = [];
  if (countdown.days > 0) parts.push(`${countdown.days}d`);
  if (countdown.hours > 0 || countdown.days > 0) parts.push(`${countdown.hours}h`);
  parts.push(`${countdown.minutes}m`);
  return parts.join(" ");
}
