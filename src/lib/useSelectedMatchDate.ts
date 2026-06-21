"use client";

import { useMemo, useState } from "react";
import { getDefaultSelectedDate } from "@/lib/matchDate";
import { useClientTime } from "@/lib/useClientOnly";

export function useSelectedMatchDate(
  dates: string[],
  serverDefaultDate = "",
) {
  const [userPickedDate, setUserPickedDate] = useState<string | null>(null);
  const { now: clientDate, isReady } = useClientTime();

  const selectedDate = useMemo(() => {
    if (userPickedDate) return userPickedDate;
    if (isReady) return getDefaultSelectedDate(dates, clientDate);
    return serverDefaultDate || dates[0] || "";
  }, [userPickedDate, isReady, clientDate, dates, serverDefaultDate]);

  const isDateReady = Boolean(selectedDate);

  return [selectedDate, setUserPickedDate, isDateReady] as const;
}
