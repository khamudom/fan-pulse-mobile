import { MatchesScheduleSection } from "../MatchesScheduleSection/MatchesScheduleSection";
import { getDefaultSelectedDate, getUniqueMatchDates } from "@/lib/matchDate";
import { getMatches } from "@/services/worldCupApi";

export async function MatchesScheduleAsync() {
  const { data: matches, source, error } = await getMatches();
  const dates = getUniqueMatchDates(matches);
  const initialSelectedDate = getDefaultSelectedDate(dates, new Date());

  return (
    <MatchesScheduleSection
      matches={matches}
      matchesSource={source}
      error={error}
      initialSelectedDate={initialSelectedDate}
    />
  );
}
