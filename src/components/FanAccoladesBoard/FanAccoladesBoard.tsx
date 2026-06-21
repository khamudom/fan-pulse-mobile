"use client";

import Link from "next/link";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@khamudom/lumen-ui-react";
import {
  FAN_ACCOLADES,
  getAccoladeBoard,
  getAccoladeCriteria,
  getStreakMessage,
} from "@/lib/accolades";
import type { UserStats } from "@/types/database";
import styles from "./FanAccoladesBoard.module.css";

interface FanAccoladesBoardProps {
  stats: UserStats | null;
  variant?: "compact" | "full";
}

function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

export function FanAccoladesBoard({
  stats,
  variant = "full",
}: FanAccoladesBoardProps) {
  const streak = stats?.current_streak ?? 0;
  const checkedInToday = stats?.last_check_in === todayIso();
  const board = getAccoladeBoard(stats);
  const isCompact = variant === "compact";
  const recentEarned = [...board.earned].reverse().slice(0, 3);

  return (
    <Card className={styles.card}>
      <CardHeader className={styles.header}>
        <CardTitle as="h3">Fan Accolades</CardTitle>
      </CardHeader>
      <CardContent>
        <div className={styles.streakRow}>
          <span className={styles.streakBadge}>
            <span className={styles.streakEmoji} aria-hidden>
              {streak >= 7 ? "🏟️" : streak >= 3 ? "🔥" : "⚽"}
            </span>
            {streak}-day streak
          </span>
          {checkedInToday ? (
            <span className={styles.streakCopy}>
              {getStreakMessage(streak)} Checked in today.
            </span>
          ) : (
            <span className={styles.streakCopy}>
              {getStreakMessage(streak)}
            </span>
          )}
        </div>

        {board.next ? (
          <div className={styles.nextUp}>
            <span className={styles.nextLabel}>Next up</span>
            <div className={styles.nextTitle}>
              <span aria-hidden>{board.next.emoji}</span>
              {board.next.title}
            </div>
            <p className={styles.nextTagline}>{board.next.tagline}</p>
            <div className={styles.progressTrack}>
              <div
                className={styles.progressFill}
                style={{ width: `${board.nextProgress}%` }}
              />
            </div>
            <p className={styles.progressMeta}>
              {board.nextRemaining > 0
                ? `${board.nextRemaining} more to unlock`
                : "Almost there!"}
            </p>
          </div>
        ) : null}

        {isCompact ? (
          <>
            <span className={styles.sectionLabel}>Your badges</span>
            {recentEarned.length > 0 ? (
              <div className={styles.badgeGridCompact}>
                {recentEarned.map((accolade) => (
                  <div
                    key={accolade.id}
                    className={`${styles.badge} ${styles.badgeCompact} ${styles.badgeEarned}`}
                    title={accolade.tagline}
                  >
                    <span className={styles.badgeEmoji} aria-hidden>
                      {accolade.emoji}
                    </span>
                    <span className={styles.badgeTitle}>{accolade.title}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className={styles.emptyHint}>
                Earn your first badge — every fan journey starts with a kickoff.
              </p>
            )}
            <div className={styles.actions}>
              <Link href="/challenges">
                <Button variant="primary">View accolades</Button>
              </Link>
            </div>
          </>
        ) : (
          <>
            <span className={styles.sectionLabel}>
              {board.earned.length} of {FAN_ACCOLADES.length} unlocked
            </span>
            <div className={styles.badgeGrid}>
              {FAN_ACCOLADES.map((accolade) => {
                const earned = board.earned.some((a) => a.id === accolade.id);
                const isNext = board.next?.id === accolade.id;

                return (
                  <div
                    key={accolade.id}
                    className={[
                      styles.badge,
                      earned ? styles.badgeEarned : styles.badgeLocked,
                      isNext ? styles.badgeNext : "",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                  >
                    <span className={styles.badgeEmoji} aria-hidden>
                      {accolade.emoji}
                    </span>
                    <span className={styles.badgeTitle}>{accolade.title}</span>
                    <p className={styles.badgeTagline}>{accolade.tagline}</p>
                    <span
                      className={`${styles.badgeCriteria} ${
                        earned ? styles.badgeCriteriaEarned : ""
                      }`}
                    >
                      {earned ? "✓ " : ""}
                      {getAccoladeCriteria(accolade)}
                    </span>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
