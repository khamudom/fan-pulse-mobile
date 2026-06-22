"use client";

import { useAppStore, type TransitionDirection } from "@/stores/appStore";

export function useRouteTransition() {
  const transitionDirection = useAppStore((s) => s.transitionDirection);
  const setTransitionDirection = useAppStore((s) => s.setTransitionDirection);
  const reducedMotion = useAppStore((s) => s.preferences.reducedMotion);

  const prepareTransition = (direction: TransitionDirection) => {
    setTransitionDirection(direction);
  };

  return {
    transitionDirection,
    reducedMotion,
    prepareTransition,
  };
}
