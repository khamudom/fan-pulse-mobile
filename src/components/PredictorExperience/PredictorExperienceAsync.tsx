import { getMyBracketPrediction } from "@/actions/bracketPredictions";
import { EmptyState } from "@/components/feedback/EmptyState";
import { PredictorExperience } from "@/components/PredictorExperience";
import { USE_PROTOTYPE_DATA } from "@/config/dataSource";
import { getAuthContext } from "@/lib/auth";
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

  if (!USE_PROTOTYPE_DATA) {
    return (
      <EmptyState
        title="Predictor uses prototype data"
        message="Enable USE_PROTOTYPE_DATA in src/config/dataSource.ts to preview polls and bracket picks. Match, team, and stadium pages show live API data."
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
