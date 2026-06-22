"use client";

import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useRef } from "react";
import { MatchesScheduleSection } from "../MatchesScheduleSection/MatchesScheduleSection";
import { MatchesScheduleSkeleton } from "../MatchesPageSkeletons/MatchesPageSkeletons";
import { ErrorState } from "@/components/feedback/ErrorState";
import { getDefaultSelectedDate, getUniqueMatchDates } from "@/lib/matchDate";
import { matchesQueryOptions } from "@/queries/matchQueries";
import { usePrefetchRoutes } from "@/hooks/usePrefetchRoutes";
import { useSwipeNavigation } from "@/hooks/useSwipeNavigation";
import { useAppStore } from "@/stores/appStore";

export function MatchesScheduleClient() {
  const containerRef = useRef<HTMLDivElement>(null);
  const selectedMatchDate = useAppStore((s) => s.selectedMatchDate);
  const setSelectedMatchDate = useAppStore((s) => s.setSelectedMatchDate);
  const { prefetchAdjacentDates, prefetchMatchDetail } = usePrefetchRoutes();

  const { data, isLoading, isError, error, isFetching, refetch } = useQuery(
    matchesQueryOptions("cached"),
  );

  const matches = useMemo(() => data?.data ?? [], [data?.data]);
  const dates = useMemo(() => getUniqueMatchDates(matches), [matches]);
  const initialSelectedDate = useMemo(
    () => getDefaultSelectedDate(dates, new Date()),
    [dates],
  );

  useEffect(() => {
    if (!selectedMatchDate && initialSelectedDate) {
      setSelectedMatchDate(initialSelectedDate);
    }
  }, [selectedMatchDate, initialSelectedDate, setSelectedMatchDate]);

  useEffect(() => {
    if (selectedMatchDate && dates.length) {
      prefetchAdjacentDates(dates, selectedMatchDate);
    }
  }, [selectedMatchDate, dates, prefetchAdjacentDates]);

  useSwipeNavigation(containerRef, {
    enabled: matches.length > 0,
    matches,
    onDateChange: setSelectedMatchDate,
  });

  if (isLoading && !data) {
    return <MatchesScheduleSkeleton />;
  }

  if (isError) {
    return (
      <section className="section">
        <div className="container">
          <ErrorState
            title="Could not load matches"
            message={error instanceof Error ? error.message : "Please try again."}
            onRetry={() => void refetch()}
          />
        </div>
      </section>
    );
  }

  return (
    <div ref={containerRef}>
      {isFetching && data ? (
        <div className="sr-only" aria-live="polite">
          Refreshing matches
        </div>
      ) : null}
      <MatchesScheduleSection
        matches={matches}
        matchesSource={data?.source ?? "api"}
        error={data?.error}
        initialSelectedDate={selectedMatchDate ?? initialSelectedDate}
        onPrefetchMatch={prefetchMatchDetail}
      />
    </div>
  );
}
