"use client";

import Link from "next/link";
import Image from "next/image";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@khamudom/lumen-ui-react";
import type { Match } from "@/types";
import { getStatusLabel, getStatusBadgeStyle } from "@/lib/worldcup/display";
import {
  LocalKickoff,
} from "@/components/display/LocalKickoff";
import styles from "./MatchCard.module.css";

interface MatchCardProps {
  match: Match;
  featured?: boolean;
  onPrefetch?: () => void;
}

function TeamFlag({ name, flag }: { name: string; flag?: string }) {
  return (
    <div className={styles.teamFlag}>
      {flag ? (
        <Image
          src={flag}
          alt={`${name} flag`}
          className={styles.flag}
          width={140}
          height={94}
        />
      ) : (
        <span className={styles.flagPlaceholder} aria-hidden="true" />
      )}
    </div>
  );
}

function TeamInfo({ name, score }: { name: string; score?: number }) {
  return (
    <div className={styles.teamInfo}>
      <span className={styles.teamName}>{name}</span>
      {score !== undefined && (
        <span className={styles.score} aria-label={`Score ${score}`}>
          {score}
        </span>
      )}
      {score !== undefined && <span className="sr-only">Score {score}</span>}
    </div>
  );
}

export function MatchCard({ match, featured = false, onPrefetch }: MatchCardProps) {
  const showScore =
    match.status === "live" ||
    match.status === "finished" ||
    match.status === "halftime";

  return (
    <div
      onMouseEnter={onPrefetch}
      onFocus={onPrefetch}
      onTouchStart={onPrefetch}
    >
      <Card className={featured ? styles.featured : undefined}>
      <CardHeader className={styles.header}>
        <div className={styles.meta}>
          {match.group && (
            <Badge variant="default" appearance="outline">
              Group {match.group}
            </Badge>
          )}
          <Badge {...getStatusBadgeStyle(match.status)}>
            {match.status === "live" && (
              <span className={styles.liveDot} aria-hidden="true" />
            )}
            {getStatusLabel(match.status)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className={styles.matchup}>
          <div className={styles.flagsRow}>
            <TeamFlag name={match.homeTeam.name} flag={match.homeTeam.flag} />
            <span className={styles.vs}>vs</span>
            <TeamFlag name={match.awayTeam.name} flag={match.awayTeam.flag} />
          </div>
          <div className={styles.teamsRow}>
            <TeamInfo
              name={match.homeTeam.name}
              score={showScore ? match.homeScore : undefined}
            />
            <TeamInfo
              name={match.awayTeam.name}
              score={showScore ? match.awayScore : undefined}
            />
          </div>
        </div>
        <div className={styles.details}>
          <LocalKickoff
            kickoffUtc={match.kickoffUtc}
            venueTimeZone={match.venueTimeZone}
            fallbackDate={match.date}
            fallbackTime={match.time}
          />
          {match.stadiumName && (
            <span>
              {match.stadiumName}
              {match.city ? `, ${match.city}` : ""}
            </span>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Link href={`/matches/${match.id}`} scroll={false} className={styles.link}>
          <Button variant="primary">View Match</Button>
        </Link>
      </CardFooter>
      </Card>
    </div>
  );
}
