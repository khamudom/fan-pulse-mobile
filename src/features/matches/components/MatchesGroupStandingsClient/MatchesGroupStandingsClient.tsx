"use client";

import { useQuery } from "@tanstack/react-query";
import { MatchesGroupStandingsSection } from "../MatchesGroupStandingsSection/MatchesGroupStandingsSection";
import { MatchesGroupStandingsSkeleton } from "../MatchesPageSkeletons/MatchesPageSkeletons";
import { ErrorState } from "@/components/feedback/ErrorState";
import { groupsQueryOptions } from "@/queries/standingsQueries";

export function MatchesGroupStandingsClient() {
  const { data, isLoading, isError, error, refetch } = useQuery(
    groupsQueryOptions(),
  );

  if (isLoading && !data) {
    return <MatchesGroupStandingsSkeleton />;
  }

  if (isError) {
    return (
      <section className="section">
        <div className="container">
          <ErrorState
            title="Could not load group standings"
            message={error instanceof Error ? error.message : "Please try again."}
            onRetry={() => void refetch()}
          />
        </div>
      </section>
    );
  }

  return (
    <MatchesGroupStandingsSection
      groups={data?.data ?? []}
      groupsSource={data?.source ?? "api"}
      error={data?.error}
    />
  );
}
