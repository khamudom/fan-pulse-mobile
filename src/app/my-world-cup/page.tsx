import Link from "next/link";
import { redirect } from "next/navigation";
import { Hero } from "@/components/display/Hero";
import { MyWorldCupForm } from "@/components/MyWorldCupForm";
import { MyWorldCupExperience } from "@/components/MyWorldCupExperience";
import { getAuthContext } from "@/lib/auth";
import { assembleMyWorldCup } from "@/lib/myWorldCup";
import { getMatches, getTeams } from "@/services/worldCupApi";
import styles from "./page.module.css";

export const metadata = {
  title: "My World Cup",
};

export default async function MyWorldCupPage({
  searchParams,
}: {
  searchParams: Promise<{ country?: string; edit?: string }>;
}) {
  const { user, profile } = await getAuthContext();
  if (!user) redirect("/login");

  const { country, edit } = await searchParams;
  const editing = edit === "1" || edit === "true";
  const showExperience = !!profile?.onboarding_complete && !editing;

  const [teamsResult, matchesResult] = await Promise.all([
    getTeams(),
    showExperience ? getMatches() : Promise.resolve({ data: [], source: "api" as const }),
  ]);

  if (showExperience && profile) {
    const data = assembleMyWorldCup(teamsResult.data, matchesResult.data, profile);
    return (
      <div className="page">
        <MyWorldCupExperience
          profile={profile}
          data={data}
          teamsSource={teamsResult.source}
          matchesSource={matchesResult.source}
        />
      </div>
    );
  }

  return (
    <div className="page">
      <Hero
        title="Build My World Cup"
        subtitle="Pick the nation you'll stand behind — then live every match, every player, every moment."
        compact
      />
      <section className="section">
        <div className={`container ${styles.narrow}`}>
          {profile?.onboarding_complete ? (
            <p className={styles.backLink}>
              <Link href="/my-world-cup">← Back to my World Cup experience</Link>
            </p>
          ) : null}
          <MyWorldCupForm
            teams={teamsResult.data}
            teamsSource={teamsResult.source}
            profile={profile}
            initialCountry={
              country?.trim() || profile?.favorite_country || undefined
            }
          />
        </div>
      </section>
    </div>
  );
}
