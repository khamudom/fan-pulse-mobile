"use client";

import { useState } from "react";
import { DataSourceBadge } from "@/components/display/DataSourceBadge";
import { EmptyState } from "@/components/feedback/EmptyState";
import { MatchCard } from "@/features/matches/components/MatchCard/MatchCard";
import { usePrefetchRoutes } from "@/hooks/usePrefetchRoutes";
import type {
  WorldCupSquad,
  WorldCupSquadPlayer,
  WorldCupSquadPosition,
} from "@/data/api/worldcup/squads";
import { toDataSourceBadge, type ApiDataSource } from "@/lib/dataSourceBadge";
import type { Match, Team } from "@/types";
import styles from "./TeamDetailView.module.css";

type TeamDetailTab = "matches" | "squad";

const POSITION_ORDER: WorldCupSquadPosition[] = [
  "Goalkeeper",
  "Defender",
  "Midfielder",
  "Forward",
];

const POSITION_LABELS: Record<WorldCupSquadPosition, string> = {
  Goalkeeper: "Goalkeepers",
  Defender: "Defenders",
  Midfielder: "Midfielders",
  Forward: "Forwards",
};

interface TeamDetailViewProps {
  team: Team;
  matches: Match[];
  squad: WorldCupSquad | null;
  matchesSource: ApiDataSource;
  matchesError?: string;
}

function SquadPanel({ squad }: { squad: WorldCupSquad }) {
  const byPosition = POSITION_ORDER.map((position) => ({
    position,
    players: squad.players.filter((player) => player.position === position),
  })).filter((group) => group.players.length > 0);

  return (
    <>
      {squad.status_en ? (
        <p className={styles.squadStatus}>{squad.status_en}</p>
      ) : null}
      <div className={styles.squadGroups}>
        {byPosition.map(({ position, players }) => (
          <section key={position} className={styles.squadGroup}>
            <h3 className={styles.squadGroupTitle}>
              {POSITION_LABELS[position]}
              <span className={styles.squadCount}>{players.length}</span>
            </h3>
            <ul className={styles.playerList}>
              {players.map((player) => (
                <PlayerRow key={player.id} player={player} />
              ))}
            </ul>
          </section>
        ))}
      </div>
    </>
  );
}

function PlayerRow({ player }: { player: WorldCupSquadPlayer }) {
  return (
    <li className={styles.player}>
      <span className={styles.playerName}>
        {player.name_en}
        {player.is_captain ? (
          <span className={styles.captainBadge} title="Captain">
            C
          </span>
        ) : null}
      </span>
      {player.club_en ? (
        <span className={styles.playerClub}>{player.club_en}</span>
      ) : null}
    </li>
  );
}

export function TeamDetailView({
  team,
  matches,
  squad,
  matchesSource,
  matchesError,
}: TeamDetailViewProps) {
  const [tab, setTab] = useState<TeamDetailTab>("matches");
  const { prefetchMatchDetail } = usePrefetchRoutes();

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        {team.flag ? (
          <img src={team.flag} alt="" className={styles.flag} />
        ) : (
          <span className={styles.flagPlaceholder} aria-hidden="true" />
        )}
        <div className={styles.headerText}>
          <h1 className={styles.title}>{team.name}</h1>
          <p className={styles.meta}>
            {team.group ? (
              <span className={styles.metaItem}>Group {team.group}</span>
            ) : null}
            {team.fifaCode ? (
              <span
                className={`${styles.metaItem} ${team.group ? styles.metaDivider : ""}`}
              >
                {team.fifaCode}
              </span>
            ) : null}
            {squad ? (
              <span
                className={`${styles.metaItem} ${team.group || team.fifaCode ? styles.metaDivider : ""}`}
              >
                Coach {squad.coach_en}
              </span>
            ) : null}
          </p>
        </div>
      </header>

      <div className={styles.tabs} role="tablist" aria-label="Team views">
        <button
          type="button"
          role="tab"
          id="team-tab-matches"
          aria-selected={tab === "matches"}
          aria-controls="team-panel-matches"
          className={`${styles.tab} ${tab === "matches" ? styles.tabActive : ""}`}
          onClick={() => setTab("matches")}
        >
          Matches
        </button>
        <button
          type="button"
          role="tab"
          id="team-tab-squad"
          aria-selected={tab === "squad"}
          aria-controls="team-panel-squad"
          className={`${styles.tab} ${tab === "squad" ? styles.tabActive : ""}`}
          onClick={() => setTab("squad")}
        >
          Squad
        </button>
      </div>

      <div className={styles.panel}>
        {tab === "matches" ? (
          <section
            role="tabpanel"
            id="team-panel-matches"
            aria-labelledby="team-tab-matches"
          >
            <div className={styles.panelHeader}>
              <div>
                <h2 className={styles.panelTitle}>Fixtures</h2>
                <p className={styles.panelSubtitle}>
                  Every match {team.name} plays at the tournament.
                </p>
              </div>
              <DataSourceBadge
                source={toDataSourceBadge(matchesSource, matches.length > 0)}
              />
            </div>

            {matches.length === 0 ? (
              <EmptyState
                title="No matches scheduled"
                message={
                  matchesError ??
                  "The World Cup API returned no fixtures for this team."
                }
              />
            ) : (
              <ul className={styles.matchList} aria-label={`${team.name} matches`}>
                {matches.map((match) => (
                  <li key={match.id}>
                    <MatchCard
                      match={match}
                      onPrefetch={() => prefetchMatchDetail(match.id)}
                    />
                  </li>
                ))}
              </ul>
            )}
          </section>
        ) : (
          <section
            role="tabpanel"
            id="team-panel-squad"
            aria-labelledby="team-tab-squad"
          >
            <div className={styles.panelHeader}>
              <div>
                <h2 className={styles.panelTitle}>Squad</h2>
                <p className={styles.panelSubtitle}>
                  {squad
                    ? `Led by ${squad.coach_en}, captained by ${squad.captain_en}.`
                    : "Tournament roster for this nation."}
                </p>
              </div>
              <DataSourceBadge
                source={squad ? "local" : "unavailable"}
                label={squad ? "Curated roster" : undefined}
              />
            </div>

            {squad ? (
              <SquadPanel squad={squad} />
            ) : (
              <EmptyState
                title="Squad unavailable"
                message="No roster data is available for this team yet."
              />
            )}
          </section>
        )}
      </div>
    </div>
  );
}
