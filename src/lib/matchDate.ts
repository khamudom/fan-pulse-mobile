import type { Match } from "@/types";

export function toIsoDate(date: string): string {
  const isoMatch = date.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (isoMatch) return date;

  const displayMatch = date.match(/^(\d{1,2})-(\d{1,2})-(\d{4})$/);
  if (!displayMatch) return date;

  const [, month, day, year] = displayMatch;
  return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
}

export function isMatchOnDate(date: string, targetIsoDate: string): boolean {
  if (!date || !targetIsoDate) return false;
  return toIsoDate(date) === targetIsoDate;
}

function getMatchKickoffTimestamp(match: Match): number {
  if (match.kickoffUtc) {
    const kickoff = new Date(match.kickoffUtc).getTime();
    if (!Number.isNaN(kickoff)) return kickoff;
  }

  const iso = toIsoDate(match.date);
  const timeMatch = match.time.match(/(\d+):(\d+)\s*(AM|PM)?/i);
  if (!timeMatch) {
    const fallback = new Date(`${iso}T12:00:00`).getTime();
    return Number.isNaN(fallback) ? 0 : fallback;
  }

  let hour = parseInt(timeMatch[1], 10);
  const minute = parseInt(timeMatch[2], 10);
  const period = timeMatch[3]?.toUpperCase();

  if (period === "PM" && hour < 12) hour += 12;
  if (period === "AM" && hour === 12) hour = 0;

  const kickoff = new Date(
    `${iso}T${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}:00`,
  ).getTime();
  return Number.isNaN(kickoff) ? 0 : kickoff;
}

export function compareMatchesByKickoff(a: Match, b: Match): number {
  return getMatchKickoffTimestamp(a) - getMatchKickoffTimestamp(b);
}

export function sortMatchesByKickoff(matches: Match[]): Match[] {
  return [...matches].sort(compareMatchesByKickoff);
}

export function getMatchesOnDate(matches: Match[], targetIsoDate: string): Match[] {
  return sortMatchesByKickoff(
    matches.filter((match) => isMatchOnDate(match.date, targetIsoDate)),
  );
}

export function getUniqueMatchDates(matches: Match[]): string[] {
  const dates = new Set<string>();
  for (const match of matches) {
    dates.add(toIsoDate(match.date));
  }
  return [...dates].sort();
}

export function getLocalTodayIso(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/** Calendar date (YYYY-MM-DD) for an instant in an IANA timezone. */
export function getIsoDateInTimeZone(date: Date, timeZone: string): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

export function addCalendarDays(isoDate: string, days: number): string {
  const [year, month, day] = isoDate.split("-").map(Number);
  const shifted = new Date(year, month - 1, day + days);
  const y = shifted.getFullYear();
  const m = String(shifted.getMonth() + 1).padStart(2, "0");
  const d = String(shifted.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function getDefaultSelectedDate(
  dates: string[],
  referenceDate: Date = new Date(),
): string {
  if (dates.length === 0) return "";

  const today = getLocalTodayIso(referenceDate);
  if (dates.includes(today)) return today;

  const upcoming = dates.find((date) => date >= today);
  return upcoming ?? dates[0];
}

export function formatTimelineDay(isoDate: string): {
  weekday: string;
  label: string;
} {
  const [year, month, day] = isoDate.split("-").map(Number);
  const date = new Date(year, month - 1, day);

  return {
    weekday: date.toLocaleDateString("en-US", { weekday: "short" }).toUpperCase(),
    label: date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
    }),
  };
}

export function formatSelectedDateLabel(isoDate: string): string {
  const [year, month, day] = isoDate.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}
