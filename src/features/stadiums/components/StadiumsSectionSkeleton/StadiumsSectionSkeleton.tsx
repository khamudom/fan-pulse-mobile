"use client";

import { Skeleton } from "@khamudom/lumen-ui-react";
import styles from "./StadiumsSectionSkeleton.module.css";

export function StadiumsSectionSkeleton() {
  return (
    <section className="section" aria-busy="true" aria-live="polite">
      <div className="container">
        <Skeleton className={styles.title} />
        <div className={styles.grid}>
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} className={styles.card} />
          ))}
        </div>
      </div>
    </section>
  );
}
