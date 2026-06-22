"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Input } from "@khamudom/lumen-ui-react";
import { Hero } from "@/components/display/Hero";
import { DataSourceBadge } from "@/components/display/DataSourceBadge";
import { EmptyState } from "@/components/feedback/EmptyState";
import { useAppNavigate } from "@/hooks/useAppNavigate";
import { useRouter } from "next/navigation";
import { toDataSourceBadge, type ApiDataSource } from "@/lib/dataSourceBadge";
import { useIsClient } from "@/lib/useClientOnly";
import type { Team } from "@/types";
import styles from "./TeamsExperience.module.css";

interface TeamsExperienceProps {
  teams: Team[];
  groups: string[];
  teamsSource: ApiDataSource;
  error?: string;
}

function ChevronIcon({ direction }: { direction: "left" | "right" }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
    >
      <path
        d={direction === "left" ? "M10 12L6 8L10 4" : "M6 4L10 8L6 12"}
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function getExploreIntro(group: string, count: number): string {
  if (!group) {
    return "";
  }
  if (count === 1) {
    return `Group ${group} — one nation stands alone in this view. Explore every group to meet them all.`;
  }
  return `Group ${group} — ${count} nations share a path through the group stage. Only two advance.`;
}

function getGroupTabSubtitle(group: string, teamsInGroup: number): string {
  return `${teamsInGroup} nation${teamsInGroup === 1 ? "" : "s"}`;
}

const teamsHeroProps = {
  title: "Meet the Nations",
  subtitle:
    "Wander through the groups — or search for the nation that calls to you.",
  backgroundImage: "/images/wc-flags.webp",
  backgroundImageFit: "fullWidth" as const,
};

export function TeamsExperience({
  teams,
  groups,
  teamsSource,
  error,
}: TeamsExperienceProps) {
  const [search, setSearch] = useState("");
  const [group, setGroup] = useState("");
  const mounted = useIsClient();
  const scrollRef = useRef<HTMLDivElement>(null);
  const selectedRef = useRef<HTMLButtonElement>(null);

  const sortedTeams = useMemo(
    () => [...teams].sort((a, b) => a.name.localeCompare(b.name)),
    [teams],
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return sortedTeams.filter((team) => {
      const matchesSearch = !q || team.name.toLowerCase().includes(q);
      const matchesGroup = !group || team.group === group;
      return matchesSearch && matchesGroup;
    });
  }, [sortedTeams, search, group]);

  const teamsByGroup = useMemo(() => {
    const map = new Map<string, number>();
    for (const team of teams) {
      if (team.group) {
        map.set(team.group, (map.get(team.group) ?? 0) + 1);
      }
    }
    return map;
  }, [teams]);

  useEffect(() => {
    selectedRef.current?.scrollIntoView({
      inline: "center",
      block: "nearest",
      behavior: "smooth",
    });
  }, [group]);

  const scrollGroups = (direction: "left" | "right") => {
    scrollRef.current?.scrollBy({
      left: direction === "left" ? -220 : 220,
      behavior: "smooth",
    });
  };

  const exploreIntro = getExploreIntro(group, filtered.length);

  if (teams.length === 0) {
    return (
      <>
        <Hero {...teamsHeroProps} />
        <section className="section">
          <div className="container">
            <EmptyState
              title="No teams available"
              message={error ?? "The World Cup API returned no team data."}
            />
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <Hero
        {...teamsHeroProps}
        stats={[
          `${teams.length} Nations.`,
          `${groups.length || 12} Groups.`,
          "One Tournament.",
        ]}
      />

      <section className={styles.experience} aria-label="Team nations">
        <div className={styles.backdrop} aria-hidden="true" />
        <div className={styles.sparkles} aria-hidden="true">
          <span className={styles.sparkle}>✦</span>
          <span className={styles.sparkle}>✦</span>
          <span className={styles.sparkle}>✦</span>
          <span className={styles.sparkle}>✦</span>
          <span className={styles.sparkle}>✦</span>
        </div>

        <div className={`container ${styles.inner}`}>
          <div className={styles.sourceRow}>
            <DataSourceBadge
              source={toDataSourceBadge(teamsSource, teams.length > 0)}
            />
          </div>

          {exploreIntro ? (
            <p className={styles.groupIntro} role="status">
              {exploreIntro}
            </p>
          ) : null}

          {groups.length > 0 ? (
            <div className={styles.groupPicker}>
              <button
                type="button"
                className={styles.groupNav}
                aria-label="Scroll groups left"
                onClick={() => scrollGroups("left")}
              >
                <ChevronIcon direction="left" />
              </button>

              <div
                ref={scrollRef}
                className={styles.groupScroll}
                role="tablist"
                aria-label="World Cup groups"
              >
                <button
                  ref={!group ? selectedRef : undefined}
                  type="button"
                  role="tab"
                  aria-selected={!group}
                  className={`${styles.groupTab} ${!group ? styles.groupTabSelected : ""}`}
                  onClick={() => setGroup("")}
                >
                  <span className={styles.groupTabLabel}>All</span>
                  <span className={styles.groupTabName}>
                    {teams.length} nations
                  </span>
                </button>
                {groups.map((g) => {
                  const isSelected = group === g;
                  const count = teamsByGroup.get(g) ?? 0;
                  return (
                    <button
                      key={g}
                      ref={isSelected ? selectedRef : undefined}
                      type="button"
                      role="tab"
                      aria-selected={isSelected}
                      className={`${styles.groupTab} ${isSelected ? styles.groupTabSelected : ""}`}
                      onClick={() => setGroup(g)}
                    >
                      <span className={styles.groupTabLabel}>Group</span>
                      <span className={styles.groupTabName}>
                        {g} · {getGroupTabSubtitle(g, count)}
                      </span>
                    </button>
                  );
                })}
              </div>

              <button
                type="button"
                className={styles.groupNav}
                aria-label="Scroll groups right"
                onClick={() => scrollGroups("right")}
              >
                <ChevronIcon direction="right" />
              </button>
            </div>
          ) : null}

          <div className={styles.searchRow}>
            {mounted ? (
              <Input
                className={styles.searchInput}
                label="Find a nation"
                placeholder="Search by name…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                type="search"
                name="team-nation-search"
                autoComplete="off"
                aria-label="Find a nation"
              />
            ) : null}
          </div>

          {filtered.length === 0 ? (
            <div className={styles.empty} role="status">
              <p className={styles.emptyTitle}>No nations found</p>
              <p className={styles.emptyMessage}>
                Try another name or choose a different group.
              </p>
            </div>
          ) : (
            <ul className={styles.nationGrid} aria-label="Nations">
              {filtered.map((team, index) => (
                <li key={team.id}>
                  <NationCard team={team} animationDelay={index * 40} />
                </li>
              ))}
            </ul>
          )}

          <footer className={styles.epilogue}>
            <p className={styles.epilogueLine}>
              Somewhere in this list is a story waiting to unfold.
            </p>
            <p className={styles.epilogueAccent}>
              Which nation will you follow?
            </p>
          </footer>
        </div>
      </section>
    </>
  );
}

function NationCard({
  team,
  animationDelay,
}: {
  team: Team;
  animationDelay: number;
}) {
  const { navigate } = useAppNavigate();
  const router = useRouter();
  const teamHref = `/teams/${team.id}`;

  return (
    <button
      type="button"
      className={styles.nationCard}
      style={{ animationDelay: `${Math.min(animationDelay, 600)}ms` }}
      aria-label={`View ${team.name}`}
      onClick={() => navigate(teamHref)}
      onMouseEnter={() => router.prefetch(teamHref)}
      onFocus={() => router.prefetch(teamHref)}
      onTouchStart={() => router.prefetch(teamHref)}
    >
      <span className={styles.nationGlow} aria-hidden="true" />
      <div className={styles.nationVisual}>
        {team.flag ? (
          <img
            src={team.flag}
            alt=""
            className={styles.flag}
            width={80}
            height={60}
          />
        ) : (
          <span className={styles.flagPlaceholder} aria-hidden="true" />
        )}
      </div>
      <span className={styles.nationName}>{team.name}</span>
      {team.fifaCode ? (
        <span className={styles.nationCode}>{team.fifaCode}</span>
      ) : null}
      <span className={styles.nationCta}>View team</span>
    </button>
  );
}
