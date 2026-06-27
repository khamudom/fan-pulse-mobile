import { Suspense } from "react";
import Link from "next/link";
import { homeHeroBackground, homeHeroTrophy } from "@/assets/homeHero";
import { Hero } from "@/components/display/Hero";
import { WorldCupCountdown } from "@/components/display/WorldCupCountdown";
import { SectionHeader } from "@/components/display/SectionHeader";
import {
  BeginJourneySkeleton,
  BriefingSkeleton,
  FixturesSkeleton,
  HomeBeginJourneyAsync,
  HomeBriefingAsync,
  HomeFeatures,
  HomeFixturesAsync,
  HomePersonalGridAsync,
  HomeWelcomeHeroAsync,
  PersonalGridSkeleton,
  PersonalizedHeaderSkeleton,
} from "@/features/home";
import { getProfile, getSessionUser } from "@/lib/auth";
import styles from "./page.module.css";

export default async function HomePage() {
  const user = await getSessionUser();
  const profile = user ? await getProfile(user.id) : null;

  if (user && profile?.onboarding_complete) {
    return (
      <div className={`page ${styles.homePage}`}>
        <Suspense fallback={<PersonalizedHeaderSkeleton />}>
          <HomeWelcomeHeroAsync />
        </Suspense>

        <Suspense fallback={<BriefingSkeleton />}>
          <HomeBriefingAsync />
        </Suspense>

        <Suspense fallback={<PersonalGridSkeleton />}>
          <HomePersonalGridAsync />
        </Suspense>

        <Suspense fallback={<FixturesSkeleton />}>
          <HomeFixturesAsync
            subtitle="Upcoming fixtures on your watchlist"
            showSignoff
            personalized
          />
        </Suspense>
      </div>
    );
  }

  const showBeginJourney = Boolean(user && !profile?.onboarding_complete);

  return (
    <div className={`page ${styles.homePage}`}>
      <Hero
        title="The World Is Gathering."
        stats={["48 Nations.", "104 Matches.", "39 Days."]}
        tagline="One World Cup Journey."
        subtitle="Choose the nation you'll stand behind and begin your journey to the Final."
        backgroundImage={homeHeroBackground}
        centerImage={homeHeroTrophy}
        actions={
          user
            ? [
                {
                  label: "Choose My Nation",
                  href: "/my-world-cup",
                  variant: "primary",
                },
                {
                  label: "Explore The Tournament",
                  href: "/matches",
                  variant: "outline",
                },
              ]
            : []
        }
        aside={<WorldCupCountdown />}
      />

      {showBeginJourney ? (
        <Suspense fallback={<BeginJourneySkeleton />}>
          <HomeBeginJourneyAsync />
        </Suspense>
      ) : null}

      <Suspense fallback={<FixturesSkeleton />}>
        <HomeFixturesAsync subtitle="Upcoming fixtures from the tournament" />
      </Suspense>

      <section className="section">
        <div className="container">
          <SectionHeader
            title="Everything you need for World Cup 2026"
            subtitle="One destination for schedules, predictions, insights, and fan engagement."
          />
          <HomeFeatures />
          {!user ? (
            <p className={styles.cta}>
              <Link href="/login">Sign in</Link> to unlock your personalized
              World Cup journey.
            </p>
          ) : null}
        </div>
      </section>
    </div>
  );
}
