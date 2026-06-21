import { getAuthContext } from "@/lib/auth";
import { getFanJourney } from "@/lib/fanJourney";
import { getMatches } from "@/services/worldCupApi";
import { WelcomeBackHero } from "../WelcomeBackHero";

export async function HomeWelcomeHeroAsync() {
  const [{ profile, stats }, { data: matches }] = await Promise.all([
    getAuthContext(),
    getMatches(),
  ]);

  if (!profile?.onboarding_complete) {
    return null;
  }

  const journey = getFanJourney(matches, profile);

  return (
    <WelcomeBackHero profile={profile} stats={stats} journey={journey} />
  );
}
