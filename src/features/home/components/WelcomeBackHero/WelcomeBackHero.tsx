"use client";

import type { ReactNode } from "react";
import { useNow } from "@/lib/useClientOnly";
import { getCountdownParts, type CountdownParts } from "@/lib/countdown";
import type { FanJourneyResult } from "@/lib/fanJourney";
import { getLevelTitle } from "@/lib/points";
import type { Match } from "@/types";
import type { Profile, UserStats } from "@/types/database";
import { LocalKickoff } from "@/components/display/LocalKickoff";
import styles from "./WelcomeBackHero.module.css";

function getTimeGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

function formatWatchdayDate(date = new Date()): string {
  return date
    .toLocaleDateString("en-US", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    })
    .toUpperCase();
}

function isFavoriteTeamMatch(
  match: Match,
  favoriteCountry: string | null | undefined,
): boolean {
  if (!favoriteCountry) return false;
  return (
    match.homeTeam.name === favoriteCountry ||
    match.awayTeam.name === favoriteCountry
  );
}

function getFavoriteMatchLabel(match: Match, favoriteCountry: string): string {
  const opponent =
    match.homeTeam.name === favoriteCountry
      ? match.awayTeam.name
      : match.homeTeam.name;
  return `${favoriteCountry} vs ${opponent}`;
}

function formatKickoffMeta(
  match: NonNullable<FanJourneyResult["nextMatch"]>,
): ReactNode {
  const parts: string[] = [];
  if (match.stadiumName) {
    parts.push(match.stadiumName);
    if (match.city) parts[parts.length - 1] += `, ${match.city}`;
  }

  return (
    <>
      {parts.length > 0 ? `${parts.join(" · ")} · ` : null}
      <LocalKickoff
        kickoffUtc={match.kickoffUtc}
        venueTimeZone={match.venueTimeZone}
        fallbackDate={match.date}
        fallbackTime={match.time}
      />
    </>
  );
}

interface WelcomeBackHeroProps {
  profile: Profile;
  stats: UserStats | null;
  journey: FanJourneyResult;
}

export function WelcomeBackHero({
  profile,
  stats,
  journey,
}: WelcomeBackHeroProps) {
  const displayName = profile.display_name ?? "Fan";
  const favoriteCountry = profile.favorite_country;
  const heroMatch =
    favoriteCountry &&
    journey.nextMatch &&
    isFavoriteTeamMatch(journey.nextMatch, favoriteCountry)
      ? journey.nextMatch
      : null;
  const heroLabel =
    heroMatch && favoriteCountry
      ? getFavoriteMatchLabel(heroMatch, favoriteCountry)
      : null;
  const levelTitle = getLevelTitle(stats?.level ?? 1, favoriteCountry);
  const accuracy = Number(stats?.prediction_accuracy ?? 0);
  const predictionRecord =
    stats && accuracy > 0 ? `${Math.round(accuracy)}% accuracy` : "0 for 0";

  const { now, isReady: isHydrated } = useNow();
  const emptyCountdown: CountdownParts = {
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    totalMs: 0,
  };
  const kickoffTarget = heroMatch?.kickoffUtc
    ? new Date(heroMatch.kickoffUtc)
    : journey.kickoff && heroMatch
      ? journey.kickoff
      : null;
  const countdown =
    kickoffTarget && isHydrated
      ? getCountdownParts(kickoffTarget, now)
      : kickoffTarget
        ? emptyCountdown
        : null;

  return (
    <section className={styles.hero} aria-labelledby="welcome-hero-title">
      <div className={styles.glow} aria-hidden="true" />
      <div className={styles.inner}>
        <div className={styles.main}>
          <p className={styles.programmeLabel}>{formatWatchdayDate()}</p>
          <h1 id="welcome-hero-title" className={styles.title}>
            {getTimeGreeting()}, {displayName}.{" "}
            <em className={styles.titleAccent}>Your story continues.</em>
          </h1>

          <dl className={styles.meta}>
            {favoriteCountry ? (
              <div className={styles.metaItem}>
                <dt>Following</dt>
                <dd>{favoriteCountry}</dd>
              </div>
            ) : null}
            {stats ? (
              <div className={styles.metaItem}>
                <dt>Fan Level</dt>
                <dd>
                  {stats.level} — {levelTitle}
                </dd>
              </div>
            ) : null}
            <div className={styles.metaItem}>
              <dt>Prediction Record</dt>
              <dd>{predictionRecord}</dd>
            </div>
          </dl>
        </div>

        {heroMatch && heroLabel && countdown ? (
          <aside
            className={styles.scoreboard}
            aria-label={`Countdown to ${heroLabel}`}
          >
            <p className={styles.scoreboardEyebrow}>Kicks off in</p>
            <p className={styles.scoreboardMatch}>{heroLabel}</p>
            <div
              className={styles.scoreboardCountdown}
              role="timer"
              aria-live="polite"
            >
              <div className={styles.scoreboardUnit}>
                <span className={styles.scoreboardValue}>{countdown.days}</span>
                <span className={styles.scoreboardUnitLabel}>Days</span>
              </div>
              <div className={styles.scoreboardUnit}>
                <span className={styles.scoreboardValue}>
                  {countdown.hours}
                </span>
                <span className={styles.scoreboardUnitLabel}>Hrs</span>
              </div>
              <div className={styles.scoreboardUnit}>
                <span className={styles.scoreboardValue}>
                  {countdown.minutes}
                </span>
                <span className={styles.scoreboardUnitLabel}>Min</span>
              </div>
            </div>
            <p className={styles.scoreboardMeta}>
              <span className={styles.liveDot} aria-hidden="true" />
              {formatKickoffMeta(heroMatch)}
            </p>
          </aside>
        ) : null}
      </div>
    </section>
  );
}
