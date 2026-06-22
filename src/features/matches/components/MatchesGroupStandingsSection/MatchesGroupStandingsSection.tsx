import { GroupStandings } from "../GroupStandings";
import { SectionHeader } from "@/components/display/SectionHeader";
import { DataSourceBadge } from "@/components/display/DataSourceBadge";
import { EmptyState } from "@/components/feedback/EmptyState";
import { toDataSourceBadge, type ApiDataSource } from "@/lib/dataSourceBadge";
import type { Group } from "@/types";

interface MatchesGroupStandingsSectionProps {
  groups: Group[];
  groupsSource: ApiDataSource;
  error?: string;
}

export function MatchesGroupStandingsSection({
  groups,
  groupsSource,
  error,
}: MatchesGroupStandingsSectionProps) {
  return (
    <section className="section">
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
