"use client";

import { useEffect, useRef } from "react";
import { useInvalidateAndRefresh } from "@/hooks/useInvalidateAndRefresh";
import { syncBriefingTimeZone } from "@/actions/briefing";

/** Keeps the briefing timezone cookie in sync with the browser for server-side date logic. */
export function BriefingTimeZoneSync() {
  const invalidateAndRefresh = useInvalidateAndRefresh();
  const synced = useRef(false);

  useEffect(() => {
    if (synced.current) return;
    synced.current = true;

    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    void syncBriefingTimeZone(timeZone).then((updated) => {
      if (updated) {
        invalidateAndRefresh();
      }
    });
  }, [invalidateAndRefresh]);

  return null;
}
