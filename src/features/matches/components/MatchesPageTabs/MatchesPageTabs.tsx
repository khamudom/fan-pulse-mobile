"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { Hero } from "@/components/display/Hero";
import { MatchesScheduleClient } from "../MatchesScheduleClient/MatchesScheduleClient";
import { MatchesGroupStandingsClient } from "../MatchesGroupStandingsClient/MatchesGroupStandingsClient";
import { prefetchGroups } from "@/queries/standingsQueries";
import styles from "./MatchesPageTabs.module.css";

type MatchesTab = "calendar" | "groups";

function resolveInitialTab(
  initialSection?: string,
  tabParam?: string | null,
): MatchesTab {
  if (tabParam === "groups" || tabParam === "calendar") {
    return tabParam;
  }
  if (initialSection === "group-standings") {
    return "groups";
  }
  return "calendar";
}

interface MatchesPageTabsProps {
  initialSection?: string;
}

export function MatchesPageTabs({ initialSection }: MatchesPageTabsProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [tab, setTab] = useState<MatchesTab>(() =>
    resolveInitialTab(initialSection, searchParams.get("tab")),
  );

  const selectTab = useCallback(
    (next: MatchesTab) => {
      setTab(next);

      if (next === "groups") {
        void prefetchGroups(queryClient);
      }

      const params = new URLSearchParams(searchParams.toString());
      if (next === "calendar") {
        params.delete("tab");
        params.delete("section");
      } else {
        params.set("tab", "groups");
        params.delete("section");
      }

      const query = params.toString();
      router.replace(query ? `/matches?${query}` : "/matches", { scroll: false });
    },
    [queryClient, router, searchParams],
  );

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0, behavior: "auto" });
  }, [tab]);

  return (
    <div className={styles.page}>
      <div className={styles.pageChrome}>
        <Hero title="Match Schedule" compact>
          <div className={styles.tabs} role="tablist" aria-label="Matches views">
            <button
              type="button"
              role="tab"
              id="matches-tab-calendar"
              aria-selected={tab === "calendar"}
              aria-controls="matches-panel-calendar"
              className={`${styles.tab} ${tab === "calendar" ? styles.tabActive : ""}`}
              onClick={() => selectTab("calendar")}
            >
              Calendar
            </button>
            <button
              type="button"
              role="tab"
              id="matches-tab-groups"
              aria-selected={tab === "groups"}
              aria-controls="matches-panel-groups"
              className={`${styles.tab} ${tab === "groups" ? styles.tabActive : ""}`}
              onClick={() => selectTab("groups")}
            >
              Groups
            </button>
          </div>
        </Hero>
      </div>

      <div ref={scrollRef} className={styles.scrollPanel}>
        {tab === "calendar" ? (
          <div
            role="tabpanel"
            id="matches-panel-calendar"
            aria-labelledby="matches-tab-calendar"
          >
            <MatchesScheduleClient />
          </div>
        ) : (
          <div
            role="tabpanel"
            id="matches-panel-groups"
            aria-labelledby="matches-tab-groups"
          >
            <MatchesGroupStandingsClient />
          </div>
        )}
      </div>
    </div>
  );
}
