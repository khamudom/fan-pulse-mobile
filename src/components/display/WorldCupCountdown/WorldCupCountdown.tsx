"use client";

import Link from "next/link";
import { Button } from "@khamudom/lumen-ui-react";
import { WORLD_CUP_2026 } from "@/config/tournament";
import { useNow } from "@/lib/useClientOnly";
import { getCountdownParts, type CountdownParts } from "@/lib/countdown";
import styles from "./WorldCupCountdown.module.css";

type CountdownPhase = "countdown" | "live" | "complete";

function getCountdownPhase(now: Date): CountdownPhase {
  if (now >= WORLD_CUP_2026.end) return "complete";
  if (now >= WORLD_CUP_2026.kickoff) return "live";
  return "countdown";
}

const countdownUnits: { key: keyof CountdownParts; label: string }[] = [
  { key: "days", label: "days" },
  { key: "hours", label: "hours" },
  { key: "minutes", label: "mins" },
  { key: "seconds", label: "secs" },
];

export function WorldCupCountdown() {
  const { now: currentDate, isReady: isHydrated } = useNow();
  const phase = isHydrated ? getCountdownPhase(currentDate) : "countdown";
  const countdown = isHydrated
    ? getCountdownParts(WORLD_CUP_2026.kickoff, currentDate)
    : {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        totalMs: 0,
      };

  return (
    <div className={styles.wrap} aria-label="FIFA World Cup 2026 countdown">
      <p className={styles.eyebrow}>{WORLD_CUP_2026.dateRangeLabel}</p>

      {phase === "countdown" ? (
        <div
          className={styles.countdown}
          role="timer"
          aria-live="polite"
          aria-label={
            isHydrated
              ? `${countdown.days} days, ${countdown.hours} hours, ${countdown.minutes} minutes, ${countdown.seconds} seconds until kickoff`
              : "Countdown to kickoff"
          }
        >
          {countdownUnits.map(({ key, label }) => (
            <div key={key} className={styles.unit}>
              <span className={styles.value}>
                {String(countdown[key]).padStart(2, "0")}
              </span>
              <span className={styles.label}>{label}</span>
            </div>
          ))}
        </div>
      ) : (
        <div className={styles.statusGroup}>
          <p className={styles.status}>
            {phase === "live" ? "Tournament underway" : "Tournament complete"}
          </p>
          <div className={styles.statusAction}>
            <Link href="/matches" style={{ textDecoration: "none" }}>
              <Button variant="primary">
                {phase === "live" ? "Check out the matches" : "View results"}
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
