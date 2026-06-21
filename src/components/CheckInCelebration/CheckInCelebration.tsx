"use client";

import { useEffect, useState } from "react";
import { getStreakMessage } from "@/lib/accolades";
import styles from "./CheckInCelebration.module.css";

interface CheckInCelebrationProps {
  streak: number;
  pointsEarned: number;
}

export function CheckInCelebration({
  streak,
  pointsEarned,
}: CheckInCelebrationProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => setVisible(false), 8000);
    return () => window.clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div className={styles.banner} role="status" aria-live="polite">
      <div className={styles.content}>
        <span className={styles.sparkle} aria-hidden>
          ✨
        </span>
        <p className={styles.text}>
          Welcome back! +{pointsEarned} points · {streak}-day streak.{" "}
          {getStreakMessage(streak)}
        </p>
      </div>
      <button
        type="button"
        className={styles.dismiss}
        onClick={() => setVisible(false)}
      >
        Nice!
      </button>
    </div>
  );
}
