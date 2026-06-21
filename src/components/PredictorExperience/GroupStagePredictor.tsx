"use client";

import Image from "next/image";
import { Badge } from "@khamudom/lumen-ui-react";
import { getThirdPlaceCandidates } from "@/lib/bracket";
import type { GroupRankings } from "@/types/bracket";
import type { Group, Team } from "@/types";
import styles from "./GroupStagePredictor.module.css";

const POSITION_LABELS = ["1st", "2nd", "3rd", "4th"];

interface GroupStagePredictorProps {
  groups: Group[];
  teams: Team[];
  rankings: GroupRankings;
  thirdPlaceQualifiers: string[];
  maxThirds: number;
  onRankTeam: (groupName: string, teamId: string) => void;
  onResetGroup: (groupName: string) => void;
  onToggleThird: (teamId: string) => void;
}

function TeamFlag({ flag, name }: { flag?: string; name: string }) {
  if (!flag) return <span className={styles.flagPlaceholder} aria-hidden="true" />;
  return (
    <Image
      src={flag}
      alt={`${name} flag`}
      width={22}
      height={15}
      className={styles.flag}
    />
  );
}

export function GroupStagePredictor({
  groups,
  teams,
  rankings,
  thirdPlaceQualifiers,
  maxThirds,
  onRankTeam,
  onResetGroup,
  onToggleThird,
}: GroupStagePredictorProps) {
  const sortedGroups = [...groups].sort((a, b) => a.name.localeCompare(b.name));
  const thirdCandidates = getThirdPlaceCandidates(rankings, teams, groups);
  const selectedCount = thirdPlaceQualifiers.length;

  return (
    <div className={styles.wrapper}>
      <p className={styles.instructions}>
        Tap teams in the order you think they will finish. The top two from each
        group advance automatically; third-place teams compete for the{" "}
        {maxThirds} best-third spots below.
      </p>

      <div className={styles.groupGrid}>
        {sortedGroups.map((group) => {
          const order = rankings[group.name] ?? [];
          const hasRanking = order.length > 0;

          return (
            <section
              key={group.name}
              className={styles.groupCard}
              aria-label={`Group ${group.name} prediction`}
            >
              <header className={styles.groupHeader}>
                <h3 className={styles.groupTitle}>Group {group.name}</h3>
                {hasRanking && (
                  <button
                    type="button"
                    className={styles.resetButton}
                    onClick={() => onResetGroup(group.name)}
                  >
                    Reset
                  </button>
                )}
              </header>

              <ul className={styles.teamList}>
                {group.standings.map((standing) => {
                  const position = order.indexOf(standing.teamId);
                  const ranked = position >= 0;
                  const advances = position === 0 || position === 1;
                  const isThird = position === 2;

                  return (
                    <li key={standing.teamId}>
                      <button
                        type="button"
                        className={`${styles.teamButton} ${ranked ? styles.teamRanked : ""} ${advances ? styles.teamAdvances : ""} ${isThird ? styles.teamThird : ""}`}
                        onClick={() => onRankTeam(group.name, standing.teamId)}
                        aria-pressed={ranked}
                      >
                        <span className={styles.positionBadge} aria-hidden="true">
                          {ranked ? position + 1 : ""}
                        </span>
                        <TeamFlag flag={standing.flag} name={standing.teamName} />
                        <span className={styles.teamName}>{standing.teamName}</span>
                        {advances && (
                          <Badge variant="default" appearance="tint" className={styles.advanceBadge}>
                            {POSITION_LABELS[position]}
                          </Badge>
                        )}
                        {isThird && (
                          <span className={styles.thirdTag}>3rd</span>
                        )}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </section>
          );
        })}
      </div>

      {thirdCandidates.length > 0 && (
        <section className={styles.thirdSection} aria-label="Best third-place teams">
          <div className={styles.thirdHeader}>
            <h3 className={styles.groupTitle}>Best Third-Place Teams</h3>
            <span
              className={`${styles.thirdCounter} ${selectedCount === maxThirds ? styles.thirdCounterFull : ""}`}
            >
              {selectedCount} / {maxThirds} selected
            </span>
          </div>
          <p className={styles.instructions}>
            Choose the {maxThirds} third-place teams you think will advance to the
            Round of 32.
          </p>
          <div className={styles.thirdGrid}>
            {thirdCandidates.map(({ team, group }) => {
              const selected = thirdPlaceQualifiers.includes(team.id);
              const atLimit = selectedCount >= maxThirds && !selected;

              return (
                <button
                  key={team.id}
                  type="button"
                  className={`${styles.thirdButton} ${selected ? styles.thirdSelected : ""}`}
                  onClick={() => onToggleThird(team.id)}
                  disabled={atLimit}
                  aria-pressed={selected}
                >
                  <TeamFlag flag={team.flag} name={team.name} />
                  <span className={styles.teamName}>{team.name}</span>
                  <span className={styles.thirdGroup}>Grp {group}</span>
                </button>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
