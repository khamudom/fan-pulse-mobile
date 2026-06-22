import { DetailSwipeBack } from "@/components/app-shell/DetailSwipeBack";
import { notFound } from "next/navigation";
import { MatchDetailView } from "@/features/matches";
import { USE_PROTOTYPE_DATA } from "@/config/dataSource";
import { getSessionUser } from "@/lib/auth";
import { getMyMatchPrediction } from "@/actions/points";
import { getMatchById } from "@/services/worldCupApi";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  const { data: match } = await getMatchById(id);
  if (!match) return { title: "Match Not Found" };
  return {
    title: `${match.homeTeam.name} vs ${match.awayTeam.name}`,
  };
}

export default async function MatchDetailPage({ params }: PageProps) {
  const { id } = await params;
  // Fetch fresh so an in-progress match shows the current score on load.
  const { data: match, source } = await getMatchById(id, "fresh");

  if (!match) notFound();

  const user = await getSessionUser();
  const userPrediction = user ? await getMyMatchPrediction(id) : null;

  return (
    <DetailSwipeBack>
      <div className="page">
        <MatchDetailView
          match={match}
          matchSource={source}
          showPrototypeData={USE_PROTOTYPE_DATA}
          isSignedIn={Boolean(user)}
          userPrediction={userPrediction}
        />
      </div>
    </DetailSwipeBack>
  );
}
