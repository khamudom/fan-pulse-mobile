import { Suspense } from "react";
import { MatchesPageTabs } from "@/features/matches/components/MatchesPageTabs/MatchesPageTabs";
import { MatchesScheduleSkeleton } from "@/features/matches/components/MatchesPageSkeletons/MatchesPageSkeletons";

export const metadata = {
  title: "Matches",
  description: "World Cup 2026 match schedule and group standings.",
};

export default async function MatchesPage({
  searchParams,
}: {
  searchParams: Promise<{ section?: string; tab?: string }>;
}) {
  const { section, tab } = await searchParams;
  const initialSection =
    section ?? (tab === "groups" ? "group-standings" : undefined);

  return (
    <Suspense fallback={<MatchesScheduleSkeleton />}>
      <MatchesPageTabs initialSection={initialSection} />
    </Suspense>
  );
}
