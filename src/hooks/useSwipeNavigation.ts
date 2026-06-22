"use client";

import { useDrag } from "@use-gesture/react";
import { usePathname } from "next/navigation";
import { useMemo, type RefObject } from "react";
import { getRouteClass } from "@/config/navigation";
import { useAppNavigate } from "@/hooks/useAppNavigate";
import { useAppStore } from "@/stores/appStore";
import { getUniqueMatchDates } from "@/lib/matchDate";
import type { Match } from "@/types";

interface UseSwipeNavigationOptions {
  enabled?: boolean;
  matches?: Match[];
  onDateChange?: (date: string) => void;
}

export function useSwipeNavigation(
  ref: RefObject<HTMLElement | null>,
  options: UseSwipeNavigationOptions = {},
) {
  const pathname = usePathname();
  const { enabled = true, matches = [], onDateChange } = options;
  const { goBack } = useAppNavigate();
  const selectedMatchDate = useAppStore((s) => s.selectedMatchDate);
  const setSelectedMatchDate = useAppStore((s) => s.setSelectedMatchDate);
  const setTransitionDirection = useAppStore((s) => s.setTransitionDirection);
  const reducedMotion = useAppStore((s) => s.preferences.reducedMotion);
  const isDetail = getRouteClass(pathname) === "detail";

  const dates = useMemo(() => getUniqueMatchDates(matches), [matches]);

  useDrag(
    ({ active, movement: [mx], direction: [dx], velocity: [vx], event, swipe: [swipeX] }) => {
      if (!enabled || reducedMotion) return;

      const el = ref.current;
      if (!el) return;

      const startX = "clientX" in event ? (event as PointerEvent).clientX : 0;

      if (isDetail && !active && swipeX !== 0 && startX < 24 && dx > 0) {
        goBack();
        return;
      }

      if (matches.length > 0 && !isDetail && Math.abs(mx) > 0 && active) {
        const offset = Math.max(-80, Math.min(80, mx * 0.3));
        el.style.transform = `translateX(${offset}px)`;
        return;
      }

      if (matches.length > 0 && !isDetail && !active && (swipeX !== 0 || Math.abs(vx) > 0.5)) {
        el.style.transform = "";
        if (!dates.length || !selectedMatchDate) return;

        const idx = dates.indexOf(selectedMatchDate);
        if (idx === -1) return;

        const nextIdx = dx < 0 ? idx + 1 : idx - 1;
        if (nextIdx < 0 || nextIdx >= dates.length) return;

        const nextDate = dates[nextIdx];
        setTransitionDirection(dx < 0 ? "forward" : "back");
        setSelectedMatchDate(nextDate);
        onDateChange?.(nextDate);
      }

      if (!active) {
        el.style.transform = "";
      }
    },
    {
      target: ref,
      axis: "x",
      filterTaps: true,
      threshold: 10,
      swipe: { velocity: 0.3, distance: 50 },
    },
  );
}

export function useEdgeSwipeBack(ref: RefObject<HTMLElement | null>) {
  const { goBack } = useAppNavigate();
  const reducedMotion = useAppStore((s) => s.preferences.reducedMotion);

  useDrag(
    ({ active, movement: [mx], direction: [dx], swipe: [swipeX], event }) => {
      if (reducedMotion) return;
      const startX = "clientX" in event ? (event as PointerEvent).clientX : 0;
      if (startX > 24) return;

      if (!active && (swipeX > 0 || (dx > 0 && mx > 80))) {
        goBack();
      }
    },
    {
      target: ref,
      axis: "x",
      filterTaps: true,
      threshold: 10,
      swipe: { velocity: 0.3, distance: 50 },
    },
  );
}
