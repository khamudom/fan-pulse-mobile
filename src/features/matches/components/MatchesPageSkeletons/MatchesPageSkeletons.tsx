"use client";

import { Skeleton } from "@khamudom/lumen-ui-react";
import styles from "./MatchesPageSkeletons.module.css";

export function MatchesScheduleSkeleton() {
  return (
    <section className="section" aria-busy="true" aria-live="polite">
      <div className="container">
        <Skeleton className={styles.title} />
        <Skeleton className={styles.timeline} />
        <div className={styles.grid}>
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className={styles.card} />
          ))}
        </div>
      </div>
    </section>
  );
}

export function MatchesGroupStandingsSkeleton() {
  return (
    <section className="section" aria-busy="true" aria-live="polite">
      <div className="container">
        <Skeleton className={styles.title} />
        <Skeleton className={styles.standings} />
      </div>
    </section>
  );
}
