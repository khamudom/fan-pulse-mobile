import { getActualThirdPlaceQualifiers } from "@/lib/tournamentPhase";
import type { GroupRankings } from "@/types/bracket";
import type { Group } from "@/types";
import type { Match } from "@/types";

export interface GroupTeamResult {
  teamId: string;
  teamName: string;
  flag?: string;
  predictedPosition: number | null;
  actualPosition: number;
  positionCorrect: boolean;
  predictedAdvances: boolean;
  actuallyAdvances: boolean;
}

export interface GroupResultDetail {
  groupName: string;
  teams: GroupTeamResult[];
  topTwoCorrect: number;
}

export interface GroupPredictionScore {
  groupsPredicted: number;
  exactPositions: number;
  totalPositionSlots: number;
  advancingTeamsCorrect: number;
  advancingTeamsTotal: number;
  thirdPlaceCorrect: number;
  thirdPlaceTotal: number;
  groups: GroupResultDetail[];
}

export function scoreGroupPredictions(
  groupRankings: GroupRankings,
  thirdPlaceQualifiers: string[],
  groups: Group[],
  matches: Match[],
): GroupPredictionScore {
  const actualThirds = new Set(
    getActualThirdPlaceQualifiers(groups, matches),
  );
  const predictedThirds = new Set(thirdPlaceQualifiers);

  let exactPositions = 0;
  let totalPositionSlots = 0;
  let advancingTeamsCorrect = 0;
  let advancingTeamsTotal = 0;
  let groupsPredicted = 0;

  const groupDetails: GroupResultDetail[] = groups.map((group) => {
    const predictedOrder = groupRankings[group.name] ?? [];
    if (predictedOrder.length > 0) groupsPredicted += 1;

    const actualOrder = group.standings.map((standing) => standing.teamId);
    const actualTopTwo = new Set(actualOrder.slice(0, 2));
    const predictedTopTwo = new Set(predictedOrder.slice(0, 2));

    let topTwoCorrect = 0;
    for (const teamId of predictedTopTwo) {
      if (actualTopTwo.has(teamId)) topTwoCorrect += 1;
    }
    advancingTeamsCorrect += topTwoCorrect;
    advancingTeamsTotal += 2;

    const teams: GroupTeamResult[] = group.standings.map((standing, index) => {
      const actualPosition = index + 1;
      const predictedIndex = predictedOrder.indexOf(standing.teamId);
      const predictedPosition =
        predictedIndex >= 0 ? predictedIndex + 1 : null;
      const positionCorrect = predictedPosition === actualPosition;
      const predictedAdvances =
        predictedPosition === 1 || predictedPosition === 2;
      const actuallyAdvances = actualPosition === 1 || actualPosition === 2;

      if (predictedPosition !== null) {
        totalPositionSlots += 1;
        if (positionCorrect) exactPositions += 1;
      }

      return {
        teamId: standing.teamId,
        teamName: standing.teamName,
        flag: standing.flag,
        predictedPosition,
        actualPosition,
        positionCorrect,
        predictedAdvances,
        actuallyAdvances,
      };
    });

    return {
      groupName: group.name,
      teams,
      topTwoCorrect,
    };
  });

  let thirdPlaceCorrect = 0;
  for (const teamId of predictedThirds) {
    if (actualThirds.has(teamId)) thirdPlaceCorrect += 1;
  }

  return {
    groupsPredicted,
    exactPositions,
    totalPositionSlots,
    advancingTeamsCorrect,
    advancingTeamsTotal,
    thirdPlaceCorrect,
    thirdPlaceTotal: Math.max(actualThirds.size, predictedThirds.size),
    groups: groupDetails.sort((a, b) => a.groupName.localeCompare(b.groupName)),
  };
}
