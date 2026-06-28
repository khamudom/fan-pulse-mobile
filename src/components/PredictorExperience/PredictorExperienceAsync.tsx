import { getMyBracketPrediction } from "@/actions/bracketPredictions";
import { EmptyState } from "@/components/feedback/EmptyState";
import { PredictorExperience } from "@/components/PredictorExperience";
import { USE_PROTOTYPE_DATA } from "@/config/dataSource";
import { getAuthContext } from "@/lib/auth";
import { isGroupStageComplete } from "@/lib/tournamentPhase";
import { getGroups, getMatches, getTeams } from "@/services/worldCupApi";

export async function PredictorExperienceAsync() {
  const [{ user }, matchesResult, groupsResult, teamsResult, savedBracket] =
    await Promise.all([
      getAuthContext(),
      getMatches(),
      getGroups(),
      getTeams(),
      getMyBracketPrediction(),
    ]);

  const knockoutPhase = isGroupStageComplete(matchesResult.data);
  const hasLiveData =
    matchesResult.data.length > 0 && groupsResult.data.length > 0;

  if (!USE_PROTOTYPE_DATA && !knockoutPhase) {
    return (
      <EmptyState
        title="Predictor uses prototype data"
        message="Enable USE_PROTOTYPE_DATA in src/config/dataSource.ts to preview polls and bracket picks before the knockout stage. Match, team, and stadium pages show live API data."
        actionLabel="View matches"
        actionHref="/matches"
      />
    );
  }

  if (knockoutPhase && !hasLiveData) {
    return (
      <EmptyState
        title="Knockout data unavailable"
        message={
          matchesResult.error ??
          groupsResult.error ??
          "World Cup knockout data is not available right now. Try again shortly."
        }
        actionLabel="View matches"
        actionHref="/matches"
      />
    );
  }

  return (
    <PredictorExperience
      matches={matchesResult.data}
      groups={groupsResult.data}
      teams={teamsResult.data}
      matchSource={matchesResult.source}
      isSignedIn={Boolean(user)}
      savedBracket={savedBracket?.payload ?? null}
    />
  );
}
