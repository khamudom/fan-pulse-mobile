import { DetailSwipeBack } from "@/components/app-shell/DetailSwipeBack";
import { ErrorState } from "@/components/feedback/ErrorState";
import { notFound } from "next/navigation";
import { MatchDetailView } from "@/features/matches";
import { USE_PROTOTYPE_DATA } from "@/config/dataSource";
import { getSessionUser } from "@/lib/auth";
import { getMyMatchPrediction } from "@/actions/points";
import { getMatchById } from "@/services/worldCupApi";
import { WORLD_CUP_API_UNAVAILABLE } from "@/lib/worldcup/config";

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

  const [{ data: match, source, error }, user, userPrediction] =
    await Promise.all([
      getMatchById(id, "cached"),
      getSessionUser(),
      getMyMatchPrediction(id),
    ]);

  if (!match) {
    if (error && error !== "Match not found") {
      return (
        <DetailSwipeBack>
          <div className="page section">
            <div className="container">
              <ErrorState
                title="Match unavailable"
                message={error ?? WORLD_CUP_API_UNAVAILABLE}
              />
            </div>
          </div>
        </DetailSwipeBack>
      );
    }

    notFound();
  }

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
