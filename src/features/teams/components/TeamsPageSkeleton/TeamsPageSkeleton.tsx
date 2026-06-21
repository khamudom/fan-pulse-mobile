"use client";

import { Skeleton } from "@khamudom/lumen-ui-react";
import styles from "./TeamsPageSkeleton.module.css";

export function TeamsPageSkeleton() {
  return (
    <div aria-busy="true" aria-live="polite">
      <Skeleton className={styles.hero} />
      <div className="section">
        <div className="container">
          <Skeleton className={styles.title} />
          <div className={styles.grid}>
            {Array.from({ length: 8 }).map((_, index) => (
              <Skeleton key={index} className={styles.card} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
