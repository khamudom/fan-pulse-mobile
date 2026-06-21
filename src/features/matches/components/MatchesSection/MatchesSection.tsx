"use client";

import { useMemo } from "react";
import { SectionHeader } from "@/components/display/SectionHeader";
import { MatchDateTimeline } from "../MatchDateTimeline";
import { MatchFilters } from "../MatchFilters";
import { DataSourceBadge } from "@/components/display/DataSourceBadge";
import {
  formatSelectedDateLabel,
  getMatchesOnDate,
  getUniqueMatchDates,
} from "@/lib/matchDate";
import { useSelectedMatchDate } from "@/lib/useSelectedMatchDate";
import type { Match } from "@/types";

interface MatchesSectionProps {
  matches: Match[];
  groups: string[];
  teams: string[];
  stadiums: string[];
}

export function MatchesSection({
  matches,
  groups,
  teams,
  stadiums,
}: MatchesSectionProps) {
  const dates = useMemo(() => getUniqueMatchDates(matches), [matches]);
  const [selectedDate, setSelectedDate, isDateReady] = useSelectedMatchDate(dates);

  const matchesOnDate = useMemo(
    () => getMatchesOnDate(matches, selectedDate),
    [matches, selectedDate]
  );

  const subtitle = !isDateReady
    ? `${matches.length} matches`
    : selectedDate
      ? `${matchesOnDate.length} match${matchesOnDate.length === 1 ? "" : "es"} · ${formatSelectedDateLabel(selectedDate)}`
      : `${matches.length} matches`;

  return (
    <>
      <MatchDateTimeline
        dates={dates}
        selectedDate={selectedDate}
        onSelectDate={setSelectedDate}
      />
      <SectionHeader
        title="All Matches"
        subtitle={subtitle}
        action={
          <DataSourceBadge
            source={matches.length === 0 ? "unavailable" : "api"}
          />
        }
      />
      <MatchFilters
        matches={matches}
        groups={groups}
        teams={teams}
        stadiums={stadiums}
        selectedDate={selectedDate}
      />
    </>
  );
}
