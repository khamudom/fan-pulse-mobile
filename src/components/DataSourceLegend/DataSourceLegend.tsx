"use client";

import { useState } from "react";
import { DataSourceBadge } from "@/components/display/DataSourceBadge";
import styles from "./DataSourceLegend.module.css";

const items = [
  {
    source: "api" as const,
    description: "Teams, matches, standings, and stadiums from worldcup26.ir",
  },
  {
    source: "local" as const,
    description:
      "Demo content from src/data/api/ — stories, players, polls, comparisons, and AI routes",
  },
];

export function DataSourceLegend() {
  const [dismissed, setDismissed] = useState(false);

  if (process.env.NODE_ENV !== "development" || dismissed) {
    return null;
  }

  return (
    <div className={styles.legend} aria-label="Data source legend">
      <div className={styles.header}>
        <p className={styles.title}>Data sources</p>
        <button
          type="button"
          className={styles.dismiss}
          onClick={() => setDismissed(true)}
          aria-label="Dismiss data source legend"
        >
          ×
        </button>
      </div>
      <ul className={styles.list}>
        {items.map((item) => (
          <li key={item.source}>
            <DataSourceBadge source={item.source} />
            <span>{item.description}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
