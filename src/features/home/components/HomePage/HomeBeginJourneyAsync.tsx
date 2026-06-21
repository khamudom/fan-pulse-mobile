import { getTeams } from "@/services/worldCupApi";
import { BeginYourJourney } from "../BeginYourJourney";

export async function HomeBeginJourneyAsync() {
  const { data: teams, source } = await getTeams();

  return <BeginYourJourney teams={teams} teamsSource={source} />;
}
