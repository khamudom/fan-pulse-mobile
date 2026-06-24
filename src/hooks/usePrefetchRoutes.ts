"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { TAB_ITEMS } from "@/config/navigation";
import { matchQueryKeys, prefetchMatches } from "@/queries/matchQueries";
import { prefetchGroups } from "@/queries/standingsQueries";
import { prefetchTeams } from "@/queries/teamQueries";

export function usePrefetchRoutes() {
  const queryClient = useQueryClient();
  const router = useRouter();

  const prefetchTab = useCallback(
    (href: string) => {
      if (href === "/matches") {
        void prefetchMatches(queryClient);
        void prefetchGroups(queryClient);
      } else if (href === "/teams") {
        void prefetchTeams(queryClient);
      } else if (href === "/predictor") {
        void prefetchMatches(queryClient);
        void prefetchGroups(queryClient);
        void prefetchTeams(queryClient);
      } else if (href === "/") {
        void prefetchMatches(queryClient);
      }
    },
    [queryClient],
  );

  const prefetchAllTabs = useCallback(() => {
    void prefetchMatches(queryClient);
    void prefetchGroups(queryClient);
    void prefetchTeams(queryClient);
  }, [queryClient]);

  const prefetchMatchDetail = useCallback(
    (matchId: string) => {
      router.prefetch(`/matches/${matchId}`);
      void queryClient.prefetchQuery({
        queryKey: matchQueryKeys.detail(matchId),
        queryFn: async () => {
          const res = await fetch(`/api/worldcup/matches/${matchId}`);
          if (!res.ok) throw new Error("Failed to prefetch match");
          return res.json();
        },
      });
    },
    [queryClient, router],
  );

  const prefetchAdjacentDates = useCallback(
    (dates: string[], selectedDate: string) => {
      const idx = dates.indexOf(selectedDate);
      if (idx === -1) return;
      const adjacent = [dates[idx - 1], dates[idx + 1]].filter(Boolean);
      for (const date of adjacent) {
        if (!date) continue;
        void queryClient.ensureQueryData({
          queryKey: matchQueryKeys.list("cached"),
        });
      }
    },
    [queryClient],
  );

  return {
    prefetchTab,
    prefetchAllTabs,
    prefetchMatchDetail,
    prefetchAdjacentDates,
    prefetchOnHover: (href: string) => () => prefetchTab(href),
    warmRoutes: () => {
      TAB_ITEMS.forEach((tab) => router.prefetch(tab.href));
      prefetchAllTabs();
    },
  };
}
