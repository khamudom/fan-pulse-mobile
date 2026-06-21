import { getLocalTodayIso, toIsoDate } from "@/lib/matchDate";
import type { Match } from "@/types";

function isUpcomingStatus(status: Match["status"]): boolean {
  return (
    status === "scheduled" ||
    status === "notstarted" ||
    status === "live"
  );
}

export function getUpcomingProgrammeMatches(
  matches: Match[],
  limit = 12,
  referenceDate: Date = new Date(),
): Match[] {
  const todayIso = getLocalTodayIso(referenceDate);
  const endDate = new Date(referenceDate);
  endDate.setDate(endDate.getDate() + 1);
  const endIso = getLocalTodayIso(endDate);

  return [...matches]
    .filter((match) => {
      const matchDate = toIsoDate(match.date);
      return matchDate === todayIso || isUpcomingStatus(match.status);
    })
    .sort((a, b) => {
      const dateCompare = toIsoDate(a.date).localeCompare(toIsoDate(b.date));
      if (dateCompare !== 0) return dateCompare;
      return a.time.localeCompare(b.time);
    })
    .filter((match) => {
      const matchDate = toIsoDate(match.date);
      return matchDate >= todayIso && matchDate <= endIso;
    })
    .slice(0, limit);
}
