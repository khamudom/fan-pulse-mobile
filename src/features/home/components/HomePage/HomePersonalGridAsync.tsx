import { getAuthContext } from "@/lib/auth";
import { getFanJourney } from "@/lib/fanJourney";
import { getMatches } from "@/services/worldCupApi";
import { HomePersonalGrid } from "./HomePersonalGrid";

export async function HomePersonalGridAsync() {
  const [{ profile, stats }, matchesResult] = await Promise.all([
    getAuthContext(),
    getMatches(),
  ]);

  if (!profile?.onboarding_complete) {
    return null;
  }

  const journey = getFanJourney(matchesResult.data, profile);

  return (
    <HomePersonalGrid
      journey={journey}
      profile={profile}
      stats={stats}
      matchesSource={matchesResult.source}
      dataError={
        matchesResult.data.length === 0 ? matchesResult.error : undefined
      }
    />
  );
}
