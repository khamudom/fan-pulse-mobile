"use client";

import { useEffect, useMemo } from "react";
import { MatchDateTimeline } from "../MatchDateTimeline";
import { MatchCard } from "../MatchCard";
import { SectionHeader } from "@/components/display/SectionHeader";
import { DataSourceBadge } from "@/components/display/DataSourceBadge";
import { EmptyState } from "@/components/feedback/EmptyState";
import { toDataSourceBadge, type ApiDataSource } from "@/lib/dataSourceBadge";
import {
  formatSelectedDateLabel,
  getMatchesOnDate,
  getUniqueMatchDates,
} from "@/lib/matchDate";
import { useAppStore } from "@/stores/appStore";
import type { Match } from "@/types";
import styles from "../MatchesExperience/MatchesExperience.module.css";

interface MatchesScheduleSectionProps {
  matches: Match[];
  matchesSource: ApiDataSource;
  error?: string;
  initialSelectedDate?: string;
  onPrefetchMatch?: (matchId: string) => void;
}

function getMatchesDayIntro(matchCount: number, dateLabel: string): string {
  if (matchCount === 0) {
    return `No fixtures on ${dateLabel}. Choose another date to keep following the tournament.`;
  }
  if (matchCount === 1) {
    return `One match on ${dateLabel} — a single moment in a much longer journey.`;
  }
  return `${matchCount} matches on ${dateLabel}. Scroll through the day and see who takes the stage.`;
}

export function MatchesScheduleSection({
  matches,
  matchesSource,
  error,
  initialSelectedDate = "",
  onPrefetchMatch,
}: MatchesScheduleSectionProps) {
  const dates = useMemo(() => getUniqueMatchDates(matches), [matches]);
  const selectedDate = useAppStore((s) => s.selectedMatchDate) ?? initialSelectedDate;
  const setSelectedMatchDate = useAppStore((s) => s.setSelectedMatchDate);
  const isDateReady = Boolean(selectedDate);

  useEffect(() => {
    if (!useAppStore.getState().selectedMatchDate && initialSelectedDate) {
      setSelectedMatchDate(initialSelectedDate);
    }
  }, [initialSelectedDate, setSelectedMatchDate]);
  const matchesOnDate = useMemo(
    () => getMatchesOnDate(matches, selectedDate),
    [matches, selectedDate],
  );
  const dateLabel = selectedDate ? formatSelectedDateLabel(selectedDate) : "";

  if (matches.length === 0) {
    return (
      <section className="section">
        <div className="container">
          <EmptyState
            title="No matches available"
            message={
              error ??
              "Match data isn't available yet. Check back closer to the tournament."
            }
          />
        </div>
      </section>
    );
  }

  return (
    <section className="section">
      <div className="container">
        <SectionHeader
          title="Pick a day"
          subtitle="The tournament moves fast. Jump to the date you care about."
        />
        <MatchDateTimeline
          dates={dates}
          selectedDate={selectedDate}
          onSelectDate={setSelectedMatchDate}
        />

        <SectionHeader
          title={dateLabel || "Matches"}
          subtitle={
            isDateReady
              ? `${matchesOnDate.length} match${matchesOnDate.length === 1 ? "" : "es"}`
              : `${matches.length} match${matches.length === 1 ? "" : "es"}`
          }
          action={
            <DataSourceBadge
              source={toDataSourceBadge(matchesSource, matches.length > 0)}
            />
          }
        />
        {isDateReady ? (
          <p className={styles.dateIntro}>
            {getMatchesDayIntro(matchesOnDate.length, dateLabel)}
          </p>
        ) : null}

        {!isDateReady ? null : matchesOnDate.length === 0 ? (
          <EmptyState
            title="No matches on this day"
            message="Try selecting another date on the timeline above."
          />
        ) : (
          <div className={styles.matchGrid}>
            {matchesOnDate.map((match) => (
              <MatchCard
                key={match.id}
                match={match}
                onPrefetch={() => onPrefetchMatch?.(match.id)}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
