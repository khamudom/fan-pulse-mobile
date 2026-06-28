"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { Button } from "@khamudom/lumen-ui-react";
import {
  buildBracketMatchMap,
  buildBracketState,
  getBracketProgress,
  getKnockoutPickScore,
  getNextPickableMatchId,
} from "@/lib/bracket";
import {
  BRACKET_VIEW_TABS,
  getDefaultBracketTab,
  getFeederPairs,
  resolveFeederGroups,
  type BracketFeederGroup,
  type BracketTabId,
} from "@/lib/bracketFeeders";
import { getActiveKnockoutRound } from "@/lib/tournamentPhase";
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
  knockoutPhase?: boolean;
}

function participantLabel(participant: BracketParticipant): string {
  if (participant.team?.fifaCode) return participant.team.fifaCode;
  if (participant.team?.name) {
    return participant.team.name.slice(0, 3).toUpperCase();
  }
  return participant.label.replace(/^Winner /i, "").slice(0, 4);
}

function formatMatchSchedule(match: BracketMatchState): string | null {
  if (match.kickoffUtc) {
    const kickoff = new Date(match.kickoffUtc);
    if (!Number.isNaN(kickoff.getTime())) {
      const day = kickoff.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
      });
      const time = kickoff.toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });
      return `${day}, ${time}`;
    }
  }

  if (match.date && match.time) return `${match.date}, ${match.time}`;
  if (match.date) return match.date;
  return null;
}

function BracketConnector() {
  return (
    <div className={styles.connector} aria-hidden="true">
      <svg
        className={styles.connectorSvg}
        viewBox="0 0 20 100"
        preserveAspectRatio="none"
      >
        <path
          d="M0 25 H10 V50 H20 M0 75 H10 V50"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </div>
  );
}

function FinalConnector() {
  return (
    <div className={styles.finalConnector} aria-hidden="true">
      <svg
        className={styles.connectorSvg}
        viewBox="0 0 20 100"
        preserveAspectRatio="none"
      >
        <path
          d="M0 20 H10 V50 H20 M0 80 H10 V50"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </div>
  );
}

function CompactTeamRow({
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
          width={18}
          height={12}
          className={styles.compactFlag}
        />
      ) : (
        <span
          className={`${styles.compactFlagPlaceholder} ${participant.isPlaceholder ? styles.compactFlagDotted : ""}`}
          aria-hidden="true"
        />
      )}
      <span
        className={`${styles.compactTeamName} ${participant.isWinner ? styles.compactTeamWinner : ""} ${participant.isPlaceholder ? styles.compactTeamPlaceholder : ""}`}
      >
        {participantLabel(participant)}
      </span>
      {score !== undefined && (
        <span className={styles.compactScore}>{score}</span>
      )}
    </>
  );

  if (selectable && participant.team && onSelect) {
    return (
      <button
        type="button"
        className={`${styles.compactTeamRow} ${styles.compactTeamSelectable} ${selected ? styles.compactTeamSelected : ""} ${dimmed ? styles.compactTeamDimmed : ""}`}
        onClick={onSelect}
        aria-pressed={selected}
      >
        {content}
      </button>
    );
  }

  return (
    <div
      className={`${styles.compactTeamRow} ${participant.isWinner ? styles.compactTeamWinnerRow : ""} ${dimmed ? styles.compactTeamDimmed : ""}`}
    >
      {content}
    </div>
  );
}

function CompactMatchCard({
  match,
  mode,
  picks,
  highlighted,
  onPickWinner,
  variant = "default",
}: {
  match: BracketMatchState;
  mode: BracketMode;
  picks: BracketWinnerPicks;
  highlighted?: boolean;
  onPickWinner?: (matchId: string, team: Team) => void;
  variant?: "default" | "final" | "third";
}) {
  const showScores =
    mode === "live" &&
    (match.status === "finished" ||
      match.status === "live" ||
      match.status === "halftime");

  const pickedTeamId = picks[match.id];
  const hasPick = Boolean(pickedTeamId);
  const schedule = formatMatchSchedule(match);

  return (
    <article
      className={`${styles.compactCard} ${variant === "final" ? styles.compactCardFinal : ""} ${variant === "third" ? styles.compactCardThird : ""} ${match.canPick ? styles.compactCardPickable : ""} ${highlighted ? styles.compactCardHighlighted : ""} ${hasPick ? styles.compactCardPicked : ""}`}
      aria-label={`${match.label} ${match.round}`}
    >
      <div className={styles.compactTeams}>
        <CompactTeamRow
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
        <CompactTeamRow
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
      {schedule && <footer className={styles.compactSchedule}>{schedule}</footer>}
    </article>
  );
}

function FeederGroupRow({
  group,
  mode,
  picks,
  nextPickId,
  onPickWinner,
}: {
  group: BracketFeederGroup;
  mode: BracketMode;
  picks: BracketWinnerPicks;
  nextPickId?: string;
  onPickWinner?: (matchId: string, team: Team) => void;
}) {
  return (
    <div className={styles.feederRow}>
      <div className={styles.feederSources}>
        <CompactMatchCard
          match={group.sourceA}
          mode={mode}
          picks={picks}
          highlighted={group.sourceA.id === nextPickId}
          onPickWinner={onPickWinner}
        />
        <CompactMatchCard
          match={group.sourceB}
          mode={mode}
          picks={picks}
          highlighted={group.sourceB.id === nextPickId}
          onPickWinner={onPickWinner}
        />
      </div>
      <BracketConnector />
      <div className={styles.feederDestination}>
        <CompactMatchCard
          match={group.destination}
          mode={mode}
          picks={picks}
          highlighted={group.destination.id === nextPickId}
          onPickWinner={onPickWinner}
        />
      </div>
    </div>
  );
}

function ProgressionPanel({
  groups,
  mode,
  picks,
  nextPickId,
  onPickWinner,
}: {
  groups: BracketFeederGroup[];
  mode: BracketMode;
  picks: BracketWinnerPicks;
  nextPickId?: string;
  onPickWinner?: (matchId: string, team: Team) => void;
}) {
  return (
    <div className={styles.progressionPanel}>
      {groups.map((group) => (
        <FeederGroupRow
          key={group.destination.id}
          group={group}
          mode={mode}
          picks={picks}
          nextPickId={nextPickId}
          onPickWinner={onPickWinner}
        />
      ))}
    </div>
  );
}

function FinalPanel({
  matchMap,
  mode,
  picks,
  nextPickId,
  onPickWinner,
}: {
  matchMap: Map<string, BracketMatchState>;
  mode: BracketMode;
  picks: BracketWinnerPicks;
  nextPickId?: string;
  onPickWinner?: (matchId: string, team: Team) => void;
}) {
  const semiOne = matchMap.get("M101");
  const semiTwo = matchMap.get("M102");
  const thirdPlace = matchMap.get("M103");
  const finalMatch = matchMap.get("M104");

  if (!semiOne || !semiTwo || !thirdPlace || !finalMatch) return null;

  return (
    <div className={styles.finalPanel}>
      <div className={styles.finalGrid}>
        <div className={styles.finalSemis}>
          <CompactMatchCard
            match={semiOne}
            mode={mode}
            picks={picks}
            highlighted={semiOne.id === nextPickId}
            onPickWinner={onPickWinner}
          />
          <div className={styles.thirdPlaceBlock}>
            <span className={styles.thirdPlaceLabel}>3rd Place</span>
            <CompactMatchCard
              match={thirdPlace}
              mode={mode}
              picks={picks}
              highlighted={thirdPlace.id === nextPickId}
              onPickWinner={onPickWinner}
              variant="third"
            />
          </div>
          <CompactMatchCard
            match={semiTwo}
            mode={mode}
            picks={picks}
            highlighted={semiTwo.id === nextPickId}
            onPickWinner={onPickWinner}
          />
        </div>
        <FinalConnector />
        <div className={styles.finalMatchBlock}>
          <span className={styles.finalLabel}>Final</span>
          <CompactMatchCard
            match={finalMatch}
            mode={mode}
            picks={picks}
            highlighted={finalMatch.id === nextPickId}
            onPickWinner={onPickWinner}
            variant="final"
          />
        </div>
      </div>
    </div>
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
  knockoutPhase = false,
}: WorldCupBracketProps) {
  const activeRound = useMemo(
    () => getActiveKnockoutRound(matches),
    [matches],
  );
  const [activeTab, setActiveTab] = useState<BracketTabId>(() =>
    getDefaultBracketTab(activeRound),
  );

  const bracket = buildBracketState({
    mode,
    matches,
    groups,
    teams,
    picks,
    groupRankings,
    thirdPlaceQualifiers,
  });
  const matchMap = useMemo(
    () =>
      buildBracketMatchMap({
        mode,
        matches,
        groups,
        teams,
        picks,
        groupRankings,
        thirdPlaceQualifiers,
        includeThirdPlace: activeTab === "final",
      }),
    [
      mode,
      matches,
      groups,
      teams,
      picks,
      groupRankings,
      thirdPlaceQualifiers,
      activeTab,
    ],
  );

  const progress = getBracketProgress(picks);
  const pickScore = useMemo(
    () => getKnockoutPickScore(picks, matches),
    [picks, matches],
  );
  const nextPickId =
    mode === "picks" && !knockoutPhase
      ? getNextPickableMatchId(
          matches,
          groups,
          teams,
          picks,
          groupRankings,
          thirdPlaceQualifiers,
        )
      : undefined;

  const r32ToR16Groups = useMemo(
    () =>
      resolveFeederGroups(getFeederPairs("r32", "r16"), matchMap),
    [matchMap],
  );
  const r16ToQfGroups = useMemo(
    () =>
      resolveFeederGroups(getFeederPairs("r16", "qf"), matchMap),
    [matchMap],
  );

  return (
    <div className={styles.wrapper}>
      {knockoutPhase && (
        <div className={styles.liveGuide}>
          <p className={styles.progress}>
            {mode === "live"
              ? "Following live knockout results"
              : "Reviewing your saved knockout picks"}
          </p>
          {pickScore.decided > 0 && (
            <p className={styles.instructions}>
              {pickScore.correct} of {pickScore.decided} decided knockout picks
              correct so far
            </p>
          )}
        </div>
      )}

      {mode === "picks" && !knockoutPhase && (
        <div className={styles.picksGuide}>
          <p className={styles.progress}>
            {progress.picked} of {progress.total} knockout picks made
          </p>
          <p className={styles.instructions}>
            Tap a team to advance them through each round until you crown a
            champion.
          </p>
        </div>
      )}

      <div className={styles.tabs} role="tablist" aria-label="Knockout rounds">
        {BRACKET_VIEW_TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={activeTab === tab.id}
            className={`${styles.tab} ${activeTab === tab.id ? styles.tabActive : ""}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className={styles.panelScroll} role="region" aria-label="Knockout bracket">
        {activeTab === "r32_r16" && (
          <ProgressionPanel
            groups={r32ToR16Groups}
            mode={mode}
            picks={picks}
            nextPickId={nextPickId}
            onPickWinner={onPickWinner}
          />
        )}
        {activeTab === "r16_qf" && (
          <ProgressionPanel
            groups={r16ToQfGroups}
            mode={mode}
            picks={picks}
            nextPickId={nextPickId}
            onPickWinner={onPickWinner}
          />
        )}
        {activeTab === "final" && (
          <FinalPanel
            matchMap={matchMap}
            mode={mode}
            picks={picks}
            nextPickId={nextPickId}
            onPickWinner={onPickWinner}
          />
        )}
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
        aria-selected={mode === "live"}
        variant={mode === "live" ? "primary" : "outline"}
        onClick={() => onChange("live")}
      >
        Live Bracket
      </Button>
      <Button
        type="button"
        role="tab"
        aria-selected={mode === "picks"}
        variant={mode === "picks" ? "primary" : "outline"}
        onClick={() => onChange("picks")}
      >
        My Picks
      </Button>
    </div>
  );
}
