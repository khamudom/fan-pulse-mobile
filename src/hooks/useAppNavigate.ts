"use client";

import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { useAppStore } from "@/stores/appStore";

export function useAppNavigate() {
  const router = useRouter();
  const setTransitionDirection = useAppStore((s) => s.setTransitionDirection);

  const navigate = useCallback(
    (href: string, direction: "forward" | "back" | "none" = "forward") => {
      setTransitionDirection(direction);
      router.push(href);
    },
    [router, setTransitionDirection],
  );

  const goBack = useCallback(() => {
    setTransitionDirection("back");
    router.back();
  }, [router, setTransitionDirection]);

  const replace = useCallback(
    (href: string) => {
      setTransitionDirection("none");
      router.replace(href);
    },
    [router, setTransitionDirection],
  );

  return { navigate, goBack, replace };
}
