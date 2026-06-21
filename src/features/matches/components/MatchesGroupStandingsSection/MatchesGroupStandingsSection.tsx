"use client";

import { useEffect, useRef } from "react";
import { GroupStandings } from "../GroupStandings";
import { SectionHeader } from "@/components/display/SectionHeader";
import { DataSourceBadge } from "@/components/display/DataSourceBadge";
import { EmptyState } from "@/components/feedback/EmptyState";
import { toDataSourceBadge, type ApiDataSource } from "@/lib/dataSourceBadge";
import type { Group } from "@/types";
import styles from "../MatchesExperience/MatchesExperience.module.css";

interface MatchesGroupStandingsSectionProps {
  groups: Group[];
  groupsSource: ApiDataSource;
  error?: string;
  initialSection?: string;
}

export function MatchesGroupStandingsSection({
  groups,
  groupsSource,
  error,
  initialSection,
}: MatchesGroupStandingsSectionProps) {
  const groupStandingsRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const shouldScroll =
      initialSection === "group-standings" ||
      window.location.hash === "#group-standings";
    if (!shouldScroll) return;

    const scrollToStandings = () => {
      groupStandingsRef.current?.scrollIntoView({
        behavior: "auto",
        block: "start",
      });
    };

    scrollToStandings();
    const frame = requestAnimationFrame(scrollToStandings);
    return () => cancelAnimationFrame(frame);
  }, [initialSection]);

  return (
    <section
      ref={groupStandingsRef}
      id="group-standings"
      className={`section sectionAlt ${styles.groupStandingsSection}`}
    >
      <div className="container">
        <SectionHeader
          title="Group Standings"
          subtitle="See who's leading the race to the knockout stage."
          action={
            <DataSourceBadge
              source={toDataSourceBadge(groupsSource, groups.length > 0)}
            />
          }
        />
        {groups.length > 0 ? (
          <GroupStandings groups={groups} />
        ) : (
          <EmptyState
            title="No group standings available"
            message={
              error ??
              "Standings will appear here once the group stage begins."
            }
          />
        )}
      </div>
    </section>
  );
}
