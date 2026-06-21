import { Suspense } from "react";
import { Hero } from "@/components/display/Hero";
import { MatchesGroupStandingsAsync } from "@/features/matches/components/MatchesGroupStandingsAsync/MatchesGroupStandingsAsync";
import { MatchesScheduleAsync } from "@/features/matches/components/MatchesScheduleAsync/MatchesScheduleAsync";
import {
  MatchesGroupStandingsSkeleton,
  MatchesScheduleSkeleton,
} from "@/features/matches/components/MatchesPageSkeletons/MatchesPageSkeletons";

export const metadata = {
  title: "Matches",
  description: "World Cup 2026 match schedule and group standings.",
};

export default async function MatchesPage({
  searchParams,
}: {
  searchParams: Promise<{ section?: string }>;
}) {
  const { section } = await searchParams;

  return (
    <div className="page">
      <Hero
        title="Match Schedule"
        tagline="World Cup 2026"
        subtitle="Follow the tournament day by day — pick a date and see what unfolds."
        compact
      />

      <Suspense fallback={<MatchesScheduleSkeleton />}>
        <MatchesScheduleAsync />
      </Suspense>

      <Suspense fallback={<MatchesGroupStandingsSkeleton />}>
        <MatchesGroupStandingsAsync initialSection={section} />
      </Suspense>
    </div>
  );
}
