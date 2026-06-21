"use client";

import { Skeleton } from "@khamudom/lumen-ui-react";
import styles from "./LoadingState.module.css";

interface LoadingStateProps {
  label?: string;
  rows?: number;
}

export function LoadingState({
  label = "Loading…",
  rows = 3,
}: LoadingStateProps) {
  return (
    <div className={styles.wrapper} role="status" aria-live="polite" aria-busy="true">
      <span className="sr-only">{label}</span>
      <p className={styles.label} aria-hidden="true">
        {label}
      </p>
      <div className={styles.skeletons}>
        {Array.from({ length: rows }).map((_, i) => (
          <Skeleton key={i} className={styles.skeleton} />
        ))}
      </div>
    </div>
  );
}
