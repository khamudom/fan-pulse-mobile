"use client";

import Image from "next/image";
import { Card, CardContent } from "@khamudom/lumen-ui-react";
import type { GroupPredictionScore } from "@/lib/groupPredictionScore";
import styles from "./GroupStageResults.module.css";

interface GroupStageResultsProps {
  score: GroupPredictionScore;
}

function TeamFlag({ flag, name }: { flag?: string; name: string }) {
  if (!flag) {
    return <span className={styles.flagPlaceholder} aria-hidden="true" />;
  }

  return (
    <Image
      src={flag}
      alt=""
      width={22}
      height={15}
      className={styles.flag}
    />
  );
}

function positionLabel(position: number): string {
  if (position === 1) return "1st";
  if (position === 2) return "2nd";
  if (position === 3) return "3rd";
  return `${position}th`;
}

export function GroupStageResults({ score }: GroupStageResultsProps) {
  const hasPredictions = score.totalPositionSlots > 0;

  return (
    <div className={styles.wrapper}>
      <Card className={styles.summaryCard}>
        <CardContent className={styles.summaryContent}>
          <h3 className={styles.summaryTitle}>Your group stage score</h3>
          {hasPredictions ? (
            <div className={styles.summaryGrid}>
              <div className={styles.statBlock}>
                <span className={styles.statValue}>
                  {score.exactPositions}/{score.totalPositionSlots}
                </span>
                <span className={styles.statLabel}>Exact positions</span>
              </div>
              <div className={styles.statBlock}>
                <span className={styles.statValue}>
                  {score.advancingTeamsCorrect}/{score.advancingTeamsTotal}
                </span>
                <span className={styles.statLabel}>Advancing teams</span>
              </div>
              <div className={styles.statBlock}>
                <span className={styles.statValue}>
                  {score.thirdPlaceCorrect}/{score.thirdPlaceTotal || 8}
                </span>
                <span className={styles.statLabel}>Third-place picks</span>
              </div>
            </div>
          ) : (
            <p className={styles.noPredictions}>
              You did not save group predictions before the group stage ended.
            </p>
          )}
        </CardContent>
      </Card>

      <div className={styles.groupGrid}>
        {score.groups.map((group) => (
          <section
            key={group.groupName}
            className={styles.groupCard}
            aria-label={`Group ${group.groupName} results`}
          >
            <header className={styles.groupHeader}>
              <h3 className={styles.groupTitle}>Group {group.groupName}</h3>
              {hasPredictions && (
                <span className={styles.groupScore}>
                  {group.topTwoCorrect}/2 advancers
                </span>
              )}
            </header>

            <ul className={styles.teamList}>
              {group.teams.map((team) => {
                const hasPrediction = team.predictedPosition !== null;
                const showCorrect = hasPrediction && team.positionCorrect;
                const showWrong = hasPrediction && !team.positionCorrect;

                return (
                  <li key={team.teamId}>
                    <div
                      className={`${styles.teamRow} ${showCorrect ? styles.teamCorrect : ""} ${showWrong ? styles.teamWrong : ""}`}
                    >
                      <span className={styles.actualPosition}>
                        {team.actualPosition}
                      </span>
                      <TeamFlag flag={team.flag} name={team.teamName} />
                      <span className={styles.teamName}>{team.teamName}</span>
                      {hasPrediction ? (
                        <span
                          className={`${styles.predictionTag} ${showCorrect ? styles.predictionCorrect : styles.predictionWrong}`}
                        >
                          You: {positionLabel(team.predictedPosition!)}
                        </span>
                      ) : (
                        <span className={styles.predictionTagMuted}>—</span>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
