import { MatchesGroupStandingsSection } from "../MatchesGroupStandingsSection/MatchesGroupStandingsSection";
import { getGroups } from "@/services/worldCupApi";

interface MatchesGroupStandingsAsyncProps {
  initialSection?: string;
}

export async function MatchesGroupStandingsAsync({
  initialSection,
}: MatchesGroupStandingsAsyncProps) {
  const { data: groups, source, error } = await getGroups();

  return (
    <MatchesGroupStandingsSection
      groups={groups}
      groupsSource={source}
      error={error}
      initialSection={initialSection}
    />
  );
}
