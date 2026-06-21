"use client";

import { useIsClient, useNow } from "@/lib/useClientOnly";

export type LocalTodayDateProps = {
  locale?: string;
  options?: Intl.DateTimeFormatOptions;
  fallback?: string;
  className?: string;
};

const DEFAULT_OPTIONS: Intl.DateTimeFormatOptions = {
  weekday: "long",
  month: "long",
  day: "numeric",
};

export function LocalTodayDate({
  locale = "en-US",
  options = DEFAULT_OPTIONS,
  fallback = "today",
  className,
}: LocalTodayDateProps) {
  const { now, isReady: isHydrated } = useNow(0);

  return (
    <span className={className} suppressHydrationWarning>
      {isHydrated ? now.toLocaleDateString(locale, options) : fallback}
    </span>
  );
}
