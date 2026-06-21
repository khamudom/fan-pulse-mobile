"use client";

import { Badge } from "@khamudom/lumen-ui-react";
import styles from "./SponsorBadge.module.css";

interface SponsorBadgeProps {
  sponsor: string;
  label?: string;
}

export function SponsorBadge({
  sponsor,
  label = "Presented by",
}: SponsorBadgeProps) {
  return (
    <div className={styles.wrapper} role="note" aria-label={`${label} ${sponsor}`}>
      <Badge variant="default" appearance="tint" className={styles.badge}>
        {label}
      </Badge>
      <span className={styles.sponsor}>{sponsor}</span>
    </div>
  );
}
