"use client";

import type { CSSProperties } from "react";
import Image from "next/image";
import { Button } from "@khamudom/lumen-ui-react";
import {
  buildBracketState,
  getBracketProgress,
  getNextPickableMatchId,
} from "@/lib/bracket";
import { LocalKickoff } from "@/components/display/LocalKickoff";
import type {
  BracketMatchState,
  BracketParticipant,
  BracketWinnerPicks,
  GroupRankings,
} from "@/types/bracket";
import type { Group, Match, Team } from "@/types";
import styles from "./WorldCupBracket.module.css";

export type BracketMode = "live" | "picks";

interface WorldCupBracketProps {
  mode: BracketMode;
  matches: Match[];
  groups: Group[];
  teams: Team[];
  picks?: BracketWinnerPicks;
  groupRankings?: GroupRankings;
  thirdPlaceQualifiers?: string[];
  onPickWinner?: (matchId: string, team: Team) => void;
}

function ParticipantRow({
  participant,
  score,
  selectable,
  selected,
  dimmed,
  onSelect,
}: {
  participant: BracketParticipant;
  score?: number;
  selectable?: boolean;
  selected?: boolean;
  dimmed?: boolean;
  onSelect?: () => void;
}) {
  const content = (
    <>
      {participant.team?.flag ? (
        <Image
          src={participant.team.flag}
          alt=""
          width={20}
          height={14}
          className={styles.flag}
        />
      ) : (
        <span className={styles.flagPlaceholder} aria-hidden="true" />
      )}
      <span className={styles.participantName}>{participant.label}</span>
      {selected && (
        <span className={styles.advanceMark} aria-hidden="true">
          ▶
        </span>
      )}
      {score !== undefined && <span className={styles.score}>{score}</span>}
    </>
  );

  if (selectable && participant.team && onSelect) {
    return (
      <button
        type="button"
        className={`${styles.participant} ${styles.participantSelectable} ${selected ? styles.participantSelected : ""} ${dimmed ? styles.participantDimmed : ""}`}
        onClick={onSelect}
        aria-pressed={selected}
        aria-label={`Pick ${participant.label} to advance`}
      >
        {content}
      </button>
    );
  }

  return (
    <div
      className={`${styles.participant} ${participant.isWinner ? styles.participantWinner : ""} ${participant.isPlaceholder ? styles.participantPlaceholder : ""} ${dimmed ? styles.participantDimmed : ""}`}
    >
      {content}
    </div>
  );
}

function BracketMatchCard({
  match,
  mode,
  picks,
  highlighted,
  onPickWinner,
}: {
  match: BracketMatchState;
  mode: BracketMode;
  picks: BracketWinnerPicks;
  highlighted?: boolean;
  onPickWinner?: (matchId: string, team: Team) => void;
}) {
  const showScores =
    mode === "live" &&
    (match.status === "finished" ||
      match.status === "live" ||
      match.status === "halftime");

  const pickedTeamId = picks[match.id];
  const hasPick = Boolean(pickedTeamId);

  return (
    <article
      className={`${styles.matchCard} ${match.canPick ? styles.matchCardPickable : ""} ${highlighted ? styles.matchCardHighlighted : ""} ${hasPick ? styles.matchCardPicked : ""}`}
      aria-label={`${match.label} ${match.round}`}
    >
      <header className={styles.matchHeader}>
        <span className={styles.matchId}>{match.label}</span>
        {match.canPick && !hasPick && (
          <span className={styles.pickHint}>Tap to advance</span>
        )}
        {match.date && (
          <span className={styles.matchDate}>
            <LocalKickoff
              kickoffUtc={match.kickoffUtc}
              venueTimeZone={match.venueTimeZone}
              fallbackDate={match.date}
              fallbackTime={match.time}
            />
          </span>
        )}
      </header>
      <div className={styles.matchBody}>
        <ParticipantRow
          participant={match.home}
          score={showScores ? match.homeScore : undefined}
          selectable={match.canPick && Boolean(onPickWinner)}
          selected={pickedTeamId === match.home.team?.id}
          dimmed={hasPick && pickedTeamId !== match.home.team?.id}
          onSelect={
            match.home.team && onPickWinner
              ? () => onPickWinner(match.id, match.home.team!)
              : undefined
          }
        />
        <ParticipantRow
          participant={match.away}
          score={showScores ? match.awayScore : undefined}
          selectable={match.canPick && Boolean(onPickWinner)}
          selected={pickedTeamId === match.away.team?.id}
          dimmed={hasPick && pickedTeamId !== match.away.team?.id}
          onSelect={
            match.away.team && onPickWinner
              ? () => onPickWinner(match.id, match.away.team!)
              : undefined
          }
        />
      </div>
    </article>
  );
}

export function WorldCupBracket({
  mode,
  matches,
  groups,
  teams,
  picks = {},
  groupRankings = {},
  thirdPlaceQualifiers = [],
  onPickWinner,
}: WorldCupBracketProps) {
  const bracket = buildBracketState({
    mode,
    matches,
    groups,
    teams,
    picks,
    groupRankings,
    thirdPlaceQualifiers,
  });

  const progress = getBracketProgress(picks);
  const nextPickId =
    mode === "picks"
      ? getNextPickableMatchId(
          matches,
          groups,
          teams,
          picks,
          groupRankings,
          thirdPlaceQualifiers,
        )
      : undefined;

  return (
    <div className={styles.wrapper}>
      {mode === "picks" && (
        <div className={styles.picksGuide}>
          <p className={styles.progress}>
            {progress.picked} of {progress.total} knockout picks made
          </p>
          <p className={styles.instructions}>
            Click a team to advance them — just like a March Madness bracket.
            Your picks flow forward round by round until you crown a champion.
          </p>
        </div>
      )}

      <div
        className={styles.bracketScroll}
        role="region"
        aria-label="Knockout bracket"
      >
        <div className={styles.bracketGrid}>
          {bracket.rounds.map((round) => (
            <section
              key={round.key}
              className={styles.roundColumn}
              aria-label={round.label}
            >
              <h3 className={styles.roundTitle}>{round.label}</h3>
              <div
                className={styles.roundMatches}
                data-round={round.key}
                style={
                  { "--match-count": round.matches.length } as CSSProperties
                }
              >
                {round.matches.map((match) => (
                  <BracketMatchCard
                    key={match.id}
                    match={match}
                    mode={mode}
                    picks={picks}
                    highlighted={match.id === nextPickId}
                    onPickWinner={onPickWinner}
                  />
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>

      {bracket.champion && (
        <div className={styles.championBanner}>
          <span className={styles.championLabel}>
            {mode === "live" ? "Current champion" : "Your champion"}
          </span>
          <strong>{bracket.champion.label}</strong>
        </div>
      )}
    </div>
  );
}

interface BracketModeToggleProps {
  mode: BracketMode;
  onChange: (mode: BracketMode) => void;
}

export function BracketModeToggle({ mode, onChange }: BracketModeToggleProps) {
  return (
    <div className={styles.modeToggle} role="tablist" aria-label="Bracket view">
      <Button
        type="button"
        role="tab"
        aria-selected={mode === "picks"}
        variant={mode === "picks" ? "primary" : "outline"}
        onClick={() => onChange("picks")}
      >
        My Picks
      </Button>
      <Button
        type="button"
        role="tab"
        aria-selected={mode === "live"}
        variant={mode === "live" ? "primary" : "outline"}
        onClick={() => onChange("live")}
      >
        Live Bracket
      </Button>
    </div>
  );
}
