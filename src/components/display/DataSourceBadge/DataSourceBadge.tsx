"use client";

import { Badge } from "@khamudom/lumen-ui-react";
import type { ComponentProps } from "react";
import styles from "./DataSourceBadge.module.css";

type BadgeProps = ComponentProps<typeof Badge>;

export type DataSourceBadgeSource = "api" | "local" | "unavailable";

type DataSourceBadgeProps = {
  source: DataSourceBadgeSource;
  label?: string;
};

const defaults: Record<DataSourceBadgeSource, string> = {
  api: "Live API",
  local: "Local API",
  unavailable: "No data",
};

const badgeStyles: Record<
  DataSourceBadgeSource,
  Pick<BadgeProps, "variant" | "appearance">
> = {
  api: { variant: "success", appearance: "outline" },
  local: { variant: "default", appearance: "tint" },
  unavailable: { variant: "default", appearance: "outline" },
};

export function DataSourceBadge({ source, label }: DataSourceBadgeProps) {
  if (process.env.NODE_ENV === "production") {
    return null;
  }

  return (
    <Badge
      {...badgeStyles[source]}
      className={`${styles.badge} ${styles[source]}`}
    >
      {label ?? defaults[source]}
    </Badge>
  );
}
