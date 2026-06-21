"use client";

import { useActionState, useMemo, useState } from "react";
import { Button } from "@khamudom/lumen-ui-react";
import {
  beginJourneyWithNation,
  type ProfileActionState,
} from "@/actions/profile";
import { DataSourceBadge } from "@/components/display/DataSourceBadge";
import { toDataSourceBadge, type ApiDataSource } from "@/lib/dataSourceBadge";
import type { Team } from "@/types";
import styles from "./BeginYourJourney.module.css";

const initialState: ProfileActionState = {};

interface BeginYourJourneyProps {
  teams: Team[];
  teamsSource?: ApiDataSource;
}

export function BeginYourJourney({
  teams,
  teamsSource = "api",
}: BeginYourJourneyProps) {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<string | null>(null);
  const [state, formAction, pending] = useActionState(
    beginJourneyWithNation,
    initialState,
  );

  const sortedTeams = useMemo(
    () => [...teams].sort((a, b) => a.name.localeCompare(b.name)),
    [teams],
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return sortedTeams;
    return sortedTeams.filter((t) => t.name.toLowerCase().includes(q));
  }, [sortedTeams, search]);

  const selectedTeam = sortedTeams.find((t) => t.name === selected);

  return (
    <section
      className={styles.section}
      id="begin-journey"
      aria-labelledby="journey-title"
    >
      <div className={styles.backdrop} aria-hidden="true" />
      <div className={`container ${styles.inner}`}>
        <header className={styles.header}>
          <p className={styles.eyebrow}>Begin Your Journey</p>
          <h2 id="journey-title" className={styles.title}>
            Choose a nation.
            <br />
            Follow its path.
            <br />
            Experience every moment.
          </h2>
          <p className={styles.question}>Who are you standing behind?</p>
        </header>

        <div className={styles.selector}>
          <div className={styles.selectorHeader}>
            <label htmlFor="nation-search" className={styles.selectorLabel}>
              Find your nation
            </label>
            <DataSourceBadge
              source={toDataSourceBadge(teamsSource, teams.length > 0)}
            />
          </div>
          <form
            className={styles.search}
            role="search"
            suppressHydrationWarning
            onSubmit={(event) => event.preventDefault()}
          >
            <input
              id="nation-search"
              className={styles.searchInput}
              type="search"
              name="nation-query"
              placeholder="Search all 48 nations…"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              aria-label="Find your nation"
              autoComplete="off"
              enterKeyHint="search"
              suppressHydrationWarning
            />
          </form>

          {filtered.length === 0 ? (
            <p className={styles.empty} role="status">
              No nations match &ldquo;{search}&rdquo;. Try another name.
            </p>
          ) : (
            <ul
              className={styles.nationGrid}
              role="listbox"
              aria-label="Nations"
            >
              {filtered.map((team) => {
                const isSelected = selected === team.name;
                return (
                  <li key={team.id} role="presentation">
                    <button
                      type="button"
                      role="option"
                      aria-selected={isSelected}
                      className={`${styles.nation} ${isSelected ? styles.nationSelected : ""}`}
                      onClick={() => setSelected(team.name)}
                    >
                      <NationCardContent team={team} />
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <form action={formAction} className={styles.commit}>
          <input type="hidden" name="country" value={selected ?? ""} />
          {selectedTeam ? (
            <p className={styles.selectionPreview}>
              You&apos;re standing with <strong>{selectedTeam.name}</strong>
            </p>
          ) : (
            <p className={styles.selectionHint}>
              Select a nation above to continue
            </p>
          )}
          {state.error ? <p className={styles.error}>{state.error}</p> : null}
          <Button type="submit" disabled={!selected || pending}>
            {pending
              ? "Starting your journey…"
              : selected
                ? `Stand behind ${selected}`
                : "Choose your nation"}
          </Button>
        </form>
      </div>
    </section>
  );
}

function NationCardContent({ team }: { team: Team }) {
  return (
    <>
      <span className={styles.nationGlow} aria-hidden="true" />
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
      <span className={styles.nationName}>{team.name}</span>
      {team.group ? (
        <span className={styles.group}>Group {team.group}</span>
      ) : null}
    </>
  );
}
