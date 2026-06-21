"use client";

import { useIsClient } from "@/lib/useClientOnly";
import {
  formatKickoffInTimeZone,
  formatKickoffInUserTz,
} from "@/lib/timezone";
import styles from "./LocalKickoff.module.css";

export interface LocalKickoffProps {
  kickoffUtc?: string;
  venueTimeZone?: string;
  fallbackDate: string;
  fallbackTime?: string;
  mode?: "dateTime" | "time";
  className?: string;
  showVenueTime?: boolean;
}

export function LocalKickoff({
  kickoffUtc,
  venueTimeZone,
  fallbackDate,
  fallbackTime,
  mode = "dateTime",
  className,
  showVenueTime = true,
}: LocalKickoffProps) {
  const hydrated = useIsClient();
  const userTimeZone = hydrated
    ? Intl.DateTimeFormat().resolvedOptions().timeZone
    : "";

  if (!kickoffUtc || !hydrated) {
    const fallback =
      mode === "time"
        ? (fallbackTime ?? fallbackDate)
        : fallbackTime
          ? `${fallbackDate} · ${fallbackTime}`
          : fallbackDate;

    return <span className={className}>{fallback}</span>;
  }

  const formatted = formatKickoffInUserTz(kickoffUtc);
  const primary =
    mode === "time" ? formatted.time : `${formatted.date} · ${formatted.time}`;

  const showVenueSubtext =
    showVenueTime &&
    venueTimeZone &&
    userTimeZone &&
    venueTimeZone !== userTimeZone;

  const venueFormatted = showVenueSubtext
    ? formatKickoffInTimeZone(kickoffUtc, venueTimeZone)
    : null;
  const venueLine = venueFormatted
    ? mode === "time"
      ? venueFormatted.time
      : `${venueFormatted.date} · ${venueFormatted.time}`
    : null;

  return (
    <span className={[styles.wrap, className].filter(Boolean).join(" ")}>
      <time className={styles.primary} dateTime={formatted.dateTime}>
        {primary}
      </time>
      {venueLine ? (
        <span className={styles.venueSubtext}>{venueLine} local</span>
      ) : null}
    </span>
  );
}

export function getKickoffDateTimeValue(
  kickoffUtc?: string,
  fallbackDate?: string,
  fallbackTime?: string,
): string {
  if (kickoffUtc) return kickoffUtc;
  if (!fallbackDate) return "";
  if (!fallbackTime) return fallbackDate;
  return `${fallbackDate} ${fallbackTime}`;
}
