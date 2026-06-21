"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
} from "@khamudom/lumen-ui-react";
import { getLiveMatch } from "@/actions/liveMatch";
import { DataSourceBadge } from "@/components/display/DataSourceBadge";
import { LocalKickoff } from "@/components/display/LocalKickoff";
import type { FanJourneyResult } from "@/lib/fanJourney";
import { formatCountdownLabel } from "@/lib/fanJourney";
import { toDataSourceBadge, type ApiDataSource } from "@/lib/dataSourceBadge";
import { getStatusLabel } from "@/lib/worldcup/display";
import type { Match } from "@/types";
import styles from "./FanJourneyCard.module.css";

const LIVE_POLL_INTERVAL_MS = 60000;

function isLiveMatchStatus(status: Match["status"]): boolean {
  return status === "live" || status === "halftime";
}

interface FanJourneyCardProps {
  journey: FanJourneyResult;
  favoriteCountry?: string | null;
  matchesSource?: ApiDataSource;
  dataError?: string;
}

function LastResultBlock({
  lastMatch,
  lastMatchLabel,
}: {
  lastMatch: Match;
  lastMatchLabel: string;
}) {
  return (
    <div className={styles.lastResult}>
      <p className={styles.lastResultLabel}>Last result</p>
      <p
        className={styles.lastResultScore}
        aria-label={`Final score: ${lastMatch.homeTeam.name} ${lastMatch.homeScore}, ${lastMatch.awayTeam.name} ${lastMatch.awayScore}`}
      >
        {lastMatch.homeScore} – {lastMatch.awayScore}
      </p>
      <p className={styles.lastResultMatch}>{lastMatchLabel}</p>
    </div>
  );
}

function CardSourceBadge({
  matchesSource,
  hasMatch,
}: {
  matchesSource: ApiDataSource;
  hasMatch: boolean;
}) {
  return (
    <DataSourceBadge source={toDataSourceBadge(matchesSource, hasMatch)} />
  );
}

export function FanJourneyCard({
  journey,
  favoriteCountry,
  matchesSource = "api",
  dataError,
}: FanJourneyCardProps) {
  const [match, setMatch] = useState(journey.nextMatch);
  const isLive = match ? isLiveMatchStatus(match.status) : false;

  useEffect(() => {
    setMatch(journey.nextMatch);
  }, [journey.nextMatch]);

  const refresh = useCallback(async () => {
    if (!journey.nextMatch) return;
    const latest = await getLiveMatch(journey.nextMatch.id);
    if (latest) setMatch(latest);
  }, [journey.nextMatch]);

  useEffect(() => {
    if (!isLive) return;

    let timer: number | undefined;

    const startPolling = () => {
      if (timer === undefined) {
        timer = window.setInterval(refresh, LIVE_POLL_INTERVAL_MS);
      }
    };

    const stopPolling = () => {
      if (timer !== undefined) {
        window.clearInterval(timer);
        timer = undefined;
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        void refresh();
        startPolling();
      } else {
        stopPolling();
      }
    };

    if (document.visibilityState === "visible") {
      startPolling();
    }
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      stopPolling();
    };
  }, [isLive, refresh]);

  if (!favoriteCountry) {
    return (
      <Card className={styles.card}>
        <CardHeader className={styles.cardHeader}>
          <CardTitle as="h2">Your Fan Journey</CardTitle>
        </CardHeader>
        <CardContent>
          <p className={styles.message}>
            Pick your favorite country to get a personalized countdown to your
            team&apos;s next match.
          </p>
          <Link href="/my-world-cup">
            <Button variant="primary">Set up My World Cup</Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  if (!journey.nextMatch) {
    return (
      <Card className={styles.card}>
        <CardHeader className={styles.cardHeader}>
          <CardTitle as="h2">Your Fan Journey</CardTitle>
          <CardSourceBadge matchesSource={matchesSource} hasMatch={false} />
        </CardHeader>
        <CardContent>
          <p className={styles.team}>{favoriteCountry}</p>
          {journey.lastMatch && journey.lastMatchLabel ? (
            <LastResultBlock
              lastMatch={journey.lastMatch}
              lastMatchLabel={journey.lastMatchLabel}
            />
          ) : null}
          <p className={styles.message}>
            {dataError ?? journey.label}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={styles.card}>
      <CardHeader className={styles.cardHeader}>
        <CardTitle as="h2">Live Data</CardTitle>
        <CardSourceBadge matchesSource={matchesSource} hasMatch />
      </CardHeader>
      <CardContent>
        {isLive && match ? (
          <>
            <p className={styles.liveLabel}>
              <span className={styles.liveDot} aria-hidden="true" />
              {getStatusLabel(match.status)}
            </p>
            <p
              className={styles.countdown}
              aria-live="polite"
              aria-label={`Score: ${match.homeTeam.name} ${match.homeScore}, ${match.awayTeam.name} ${match.awayScore}`}
            >
              {match.homeScore} – {match.awayScore}
            </p>
          </>
        ) : journey.countdown ? (
          <>
            {journey.lastMatch && journey.lastMatchLabel ? (
              <LastResultBlock
                lastMatch={journey.lastMatch}
                lastMatchLabel={journey.lastMatchLabel}
              />
            ) : null}
            {journey.lastMatch ? (
              <p className={styles.nextUpLabel}>Next up</p>
            ) : null}
            <p className={styles.countdown} aria-live="polite">
              {formatCountdownLabel(journey.countdown)}
            </p>
          </>
        ) : null}
        <p className={styles.matchLabel}>{journey.label}</p>
        <p className={styles.meta}>
          <LocalKickoff
            kickoffUtc={match?.kickoffUtc ?? journey.nextMatch.kickoffUtc}
            venueTimeZone={match?.venueTimeZone ?? journey.nextMatch.venueTimeZone}
            fallbackDate={match?.date ?? journey.nextMatch.date}
            fallbackTime={match?.time ?? journey.nextMatch.time}
          />
          {(match?.stadiumName ?? journey.nextMatch.stadiumName)
            ? ` · ${match?.stadiumName ?? journey.nextMatch.stadiumName}`
            : ""}
        </p>
        <Link href={`/matches/${journey.nextMatch.id}`}>
          <Button variant="primary">Open match</Button>
        </Link>
      </CardContent>
    </Card>
  );
}
