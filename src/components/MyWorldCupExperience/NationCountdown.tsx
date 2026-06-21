"use client";

import { useEffect, useState } from "react";
import { getCountdownParts, type CountdownParts } from "@/lib/countdown";
import styles from "./MyWorldCupExperience.module.css";

const units: { key: keyof CountdownParts; label: string }[] = [
  { key: "days", label: "days" },
  { key: "hours", label: "hrs" },
  { key: "minutes", label: "min" },
  { key: "seconds", label: "sec" },
];

const empty: CountdownParts = {
  days: 0,
  hours: 0,
  minutes: 0,
  seconds: 0,
  totalMs: 0,
};

interface NationCountdownProps {
  kickoffMs: number;
}

export function NationCountdown({ kickoffMs }: NationCountdownProps) {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    const tick = () => setNow(new Date());
    const initial = window.setTimeout(tick, 0);
    const timer = window.setInterval(tick, 1000);
    return () => {
      window.clearTimeout(initial);
      window.clearInterval(timer);
    };
  }, []);

  const target = new Date(kickoffMs);
  const countdown = now ? getCountdownParts(target, now) : empty;
  const kickedOff = now ? countdown.totalMs <= 0 : false;

  if (kickedOff) {
    return (
      <p className={styles.countdownLive} role="timer" aria-live="polite">
        Kickoff is here — your team is playing now.
      </p>
    );
  }

  return (
    <div
      className={styles.countdown}
      role="timer"
      aria-live="polite"
      aria-label={
        now
          ? `${countdown.days} days, ${countdown.hours} hours, ${countdown.minutes} minutes until kickoff`
          : "Countdown to kickoff"
      }
    >
      {units.map(({ key, label }) => (
        <div key={key} className={styles.countdownUnit}>
          <span className={styles.countdownValue}>
            {String(countdown[key]).padStart(2, "0")}
          </span>
          <span className={styles.countdownLabel}>{label}</span>
        </div>
      ))}
    </div>
  );
}
