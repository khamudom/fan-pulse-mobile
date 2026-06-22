import { MatchesGroupStandingsSection } from "../MatchesGroupStandingsSection/MatchesGroupStandingsSection";
import { getGroups } from "@/services/worldCupApi";

export async function MatchesGroupStandingsAsync() {
  const { data: groups, source, error } = await getGroups();

  return (
    <MatchesGroupStandingsSection
      groups={groups}
      groupsSource={source}
      error={error}
    />
  );
}
