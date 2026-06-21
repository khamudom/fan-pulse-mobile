import { TeamsExperience } from "@/components/TeamsExperience";
import { getTeams } from "@/services/worldCupApi";

export async function TeamsPageContent() {
  const { data: teams, source, error } = await getTeams();
  const groups = [...new Set(teams.map((team) => team.group).filter(Boolean))].sort() as string[];

  return (
    <TeamsExperience
      teams={teams}
      groups={groups}
      teamsSource={source}
      error={error}
    />
  );
}
