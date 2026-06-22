import { DetailSwipeBack } from "@/components/app-shell/DetailSwipeBack";
import { TeamDetailView } from "@/features/teams/components/TeamDetailView/TeamDetailView";
import { findSquadByName } from "@/lib/myWorldCup";
import { getMatchesForTeam, getTeamById } from "@/services/worldCupApi";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  const { data: team } = await getTeamById(id);
  if (!team) return { title: "Team Not Found" };
  return { title: team.name };
}

export default async function TeamDetailPage({ params }: PageProps) {
  const { id } = await params;
  const { data: team } = await getTeamById(id);

  if (!team) notFound();

  const {
    data: matches,
    source: matchesSource,
    error: matchesError,
  } = await getMatchesForTeam(id);
  const squad = findSquadByName(team.name);

  return (
    <DetailSwipeBack>
      <div className="page">
        <TeamDetailView
          team={team}
          matches={matches}
          squad={squad}
          matchesSource={matchesSource}
          matchesError={matchesError}
        />
      </div>
    </DetailSwipeBack>
  );
}
