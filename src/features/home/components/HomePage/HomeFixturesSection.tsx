"use client";

import { useMemo } from "react";
import { DataSourceBadge } from "@/components/display/DataSourceBadge";
import { EmptyState } from "@/components/feedback/EmptyState";
import { ProgrammeSchedule } from "../ProgrammeSchedule";
import { ViewAllLink } from "@/components/display/ViewAllLink";
import { toDataSourceBadge, type ApiDataSource } from "@/lib/dataSourceBadge";
import { WORLD_CUP_API_UNAVAILABLE } from "@/lib/worldcup/config";
import { useClientTime } from "@/lib/useClientOnly";
import type { Match } from "@/types";
import styles from "@/app/page.module.css";
import { getUpcomingProgrammeMatches } from "./utils";

type HomeFixturesSectionProps = {
  matches: Match[];
  initialProgrammeMatches: Match[];
  source: ApiDataSource;
  sourceError?: string;
  subtitle: string;
  favoriteCountry?: string | null;
  showSignoff?: boolean;
};

export function HomeFixturesSection({
  matches,
  initialProgrammeMatches,
  source,
  sourceError,
  subtitle,
  favoriteCountry,
  showSignoff = false,
}: HomeFixturesSectionProps) {
  const { now, isReady } = useClientTime();

  const programmeMatches = useMemo(() => {
    if (!isReady) return initialProgrammeMatches;
    return getUpcomingProgrammeMatches(matches, 12, now);
  }, [initialProgrammeMatches, isReady, matches, now]);

  const hasProgrammeMatches = programmeMatches.length > 0;

  return (
    <section className={styles.fixturesSection}>
      <div className="container">
        <div className={styles.fixturesHeader}>
          <div>
            <h2 className={styles.fixturesTitle}>Fixtures</h2>
            <p className={styles.fixturesSubtitle}>{subtitle}</p>
          </div>
          <div className={styles.sectionActions}>
            <DataSourceBadge
              source={toDataSourceBadge(source, hasProgrammeMatches)}
            />
            <ViewAllLink href="/matches" label="View all matches" />
          </div>
        </div>

        {hasProgrammeMatches ? (
          <ProgrammeSchedule
            matches={programmeMatches}
            favoriteCountry={favoriteCountry}
          />
        ) : (
          <EmptyState
            title="No matches to show"
            message={sourceError ?? WORLD_CUP_API_UNAVAILABLE}
            actionLabel="Browse all matches"
            actionHref="/matches"
          />
        )}

        {showSignoff ? (
          <footer className={styles.fixturesSignoff}>
            <p>Every day is a new chapter.</p>
          </footer>
        ) : null}
      </div>
    </section>
  );
}
