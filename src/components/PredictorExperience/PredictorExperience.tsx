"use client";

import Link from "next/link";
import { useMemo, useState, useTransition } from "react";
import { Button, Alert, Card, CardContent } from "@khamudom/lumen-ui-react";
import { saveMyBracketPrediction } from "@/actions/bracketPredictions";
import { DataSourceBadge } from "@/components/display/DataSourceBadge";
import { toDataSourceBadge, type ApiDataSource } from "@/lib/dataSourceBadge";
import {
  BracketModeToggle,
  WorldCupBracket,
  type BracketMode,
} from "@/components/WorldCupBracket";
import { GroupStagePredictor } from "./GroupStagePredictor";
import { mockMostPickedChampion } from "@/data/mockPredictions";
import {
  cascadeBracketPicks,
  getChampionFromPicks,
  getThirdPlaceCandidates,
  MAX_THIRD_PLACE_QUALIFIERS,
} from "@/lib/bracket";
import type {
  BracketPredictionPayload,
  BracketWinnerPicks,
  GroupRankings,
} from "@/types/bracket";
import type { Group, Match, Team } from "@/types";
import styles from "./PredictorExperience.module.css";

interface PredictorExperienceProps {
  matches: Match[];
  groups: Group[];
  teams: Team[];
  matchSource: ApiDataSource;
  isSignedIn: boolean;
  savedBracket?: BracketPredictionPayload | null;
}

export function PredictorExperience({
  matches,
  groups,
  teams,
  matchSource,
  isSignedIn,
  savedBracket,
}: PredictorExperienceProps) {
  const [submitted, setSubmitted] = useState(false);
  const [bracketMode, setBracketMode] = useState<BracketMode>("picks");
  const [picks, setPicks] = useState<BracketWinnerPicks>(
    savedBracket?.winners ?? {},
  );
  const [groupRankings, setGroupRankings] = useState<GroupRankings>(
    savedBracket?.groupRankings ?? {},
  );
  const [thirdPlaceQualifiers, setThirdPlaceQualifiers] = useState<string[]>(
    savedBracket?.thirdPlaceQualifiers ?? [],
  );
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [isSaving, startSaving] = useTransition();

  const championFromBracket = useMemo(
    () => getChampionFromPicks(picks, teams),
    [picks, teams],
  );

  const clearSaveState = () => {
    setSaveMessage(null);
    setSaveError(null);
  };

  const pruneThirdQualifiers = (nextRankings: GroupRankings) => {
    const validIds = new Set(
      getThirdPlaceCandidates(nextRankings, teams, groups).map(
        (c) => c.team.id,
      ),
    );
    setThirdPlaceQualifiers((prev) => prev.filter((id) => validIds.has(id)));
  };

  const handleRankTeam = (groupName: string, teamId: string) => {
    clearSaveState();
    const order = groupRankings[groupName] ?? [];
    const exists = order.includes(teamId);
    const nextOrder = exists
      ? order.filter((id) => id !== teamId)
      : order.length < 4
        ? [...order, teamId]
        : order;
    const next = { ...groupRankings, [groupName]: nextOrder };
    setGroupRankings(next);
    pruneThirdQualifiers(next);
  };

  const handleResetGroup = (groupName: string) => {
    clearSaveState();
    const next = { ...groupRankings };
    delete next[groupName];
    setGroupRankings(next);
    pruneThirdQualifiers(next);
  };

  const handleToggleThird = (teamId: string) => {
    clearSaveState();
    setThirdPlaceQualifiers((prev) => {
      if (prev.includes(teamId)) return prev.filter((id) => id !== teamId);
      if (prev.length >= MAX_THIRD_PLACE_QUALIFIERS) return prev;
      return [...prev, teamId];
    });
  };

  const handlePickWinner = (matchId: string, team: Team) => {
    clearSaveState();
    setPicks((current) => cascadeBracketPicks(matchId, team.id, current));
  };

  const handleResetBracket = () => {
    clearSaveState();
    setPicks({});
  };

  const handleSaveBracket = () => {
    clearSaveState();

    if (!isSignedIn) {
      setSaveError("Sign in to save your bracket picks.");
      return;
    }

    startSaving(async () => {
      const result = await saveMyBracketPrediction({
        winners: picks,
        groupRankings,
        thirdPlaceQualifiers,
        championTeamId: championFromBracket?.id,
        championTeamName: championFromBracket?.name,
      });

      if (result.error) {
        setSaveError(result.error);
        return;
      }

      setSubmitted(true);
      setSaveMessage(
        result.isNew
          ? "Your bracket is saved and you earned prediction points."
          : "Your bracket picks were updated.",
      );
    });
  };

  return (
    <div className={styles.wrapper}>
      <section aria-labelledby="group-predictions">
        <div className={styles.sectionHeader}>
          <h2 id="group-predictions" className={styles.sectionTitle}>
            Group Stage Predictions
          </h2>
          <DataSourceBadge
            source={toDataSourceBadge(matchSource, matches.length > 0)}
          />
        </div>
        <p className={styles.sectionDesc}>
          Group advancement is decided by final standings, not knockout games.
          Predict where each team finishes, then build your knockout bracket
          below.
        </p>
        <GroupStagePredictor
          groups={groups}
          teams={teams}
          rankings={groupRankings}
          thirdPlaceQualifiers={thirdPlaceQualifiers}
          maxThirds={MAX_THIRD_PLACE_QUALIFIERS}
          onRankTeam={handleRankTeam}
          onResetGroup={handleResetGroup}
          onToggleThird={handleToggleThird}
        />
      </section>

      <section
        className={styles.bracketSection}
        aria-labelledby="knockout-bracket"
      >
        <div className={styles.bracketHeader}>
          <div>
            <h2 id="knockout-bracket" className={styles.sectionTitle}>
              Knockout Bracket
            </h2>
            <p className={styles.sectionDesc}>
              Seeded from your group predictions. Tap teams to advance them
              through each round — March Madness style. Switch to Live Bracket
              to follow real results.
            </p>
          </div>
          <div className={styles.bracketActions}>
            <DataSourceBadge
            source={toDataSourceBadge(matchSource, matches.length > 0)}
          />
            <BracketModeToggle mode={bracketMode} onChange={setBracketMode} />
          </div>
        </div>

        {!isSignedIn && bracketMode === "picks" && (
          <Alert className={styles.signInAlert}>
            You can preview picks here. <Link href="/login">Sign in</Link> to
            save your bracket.
          </Alert>
        )}

        <WorldCupBracket
          mode={bracketMode}
          matches={matches}
          groups={groups}
          teams={teams}
          picks={picks}
          groupRankings={groupRankings}
          thirdPlaceQualifiers={thirdPlaceQualifiers}
          onPickWinner={bracketMode === "picks" ? handlePickWinner : undefined}
        />

        {bracketMode === "picks" && (
          <div className={styles.saveRow}>
            <Button onClick={handleSaveBracket} disabled={isSaving}>
              {isSaving ? "Saving..." : "Save Bracket Picks"}
            </Button>
            <Button
              variant="outline"
              type="button"
              onClick={handleResetBracket}
              disabled={isSaving || Object.keys(picks).length === 0}
            >
              Reset Bracket
            </Button>
            {championFromBracket && (
              <p className={styles.stat}>
                Your champion: <strong>{championFromBracket.name}</strong>
              </p>
            )}
          </div>
        )}

        {saveError && (
          <Alert variant="destructive" className={styles.saveAlert}>
            {saveError}
          </Alert>
        )}
        {saveMessage && (
          <Alert className={styles.saveAlert}>{saveMessage}</Alert>
        )}
      </section>

      {submitted && (
        <Card className={styles.confirmation} role="status">
          <CardContent>
            <h2 className={styles.confirmTitle}>Your prediction is saved</h2>
            <p>
              Champion selected:{" "}
              <strong>{championFromBracket?.name ?? "Not set"}</strong>
            </p>
            <div className={styles.confirmActions}>
              <Button variant="outline" type="button">
                Share (mock)
              </Button>
              <p className={styles.stat}>
                Most picked champion: {mockMostPickedChampion.team} (
                {mockMostPickedChampion.percentage}%)
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
