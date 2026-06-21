import { Hero } from "@/components/display/Hero";
import {
  MatchesGroupStandingsSkeleton,
  MatchesScheduleSkeleton,
} from "@/features/matches/components/MatchesPageSkeletons/MatchesPageSkeletons";

export default function Loading() {
  return (
    <div className="page">
      <Hero
        title="Match Schedule"
        tagline="World Cup 2026"
        subtitle="Follow the tournament day by day — pick a date and see what unfolds."
        compact
      />
      <MatchesScheduleSkeleton />
      <MatchesGroupStandingsSkeleton />
    </div>
  );
}
