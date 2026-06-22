"use client";

import Link from "next/link";
import { useLayoutEffect, useRef } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@khamudom/lumen-ui-react";
import { LocalKickoff } from "@/components/display/LocalKickoff";
import { sortMatchesByKickoff } from "@/lib/matchDate";
import type { Match, Stadium } from "@/types";
import styles from "./StadiumCard.module.css";

const DESKTOP_MEDIA_QUERY = "(min-width: 768px)";

interface StadiumCardProps {
  stadium: Stadium;
  matches?: Match[];
}

function MatchesChevron() {
  return (
    <svg
      className={styles.matchesIcon}
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function StadiumMatchesAccordion({ matches }: { matches: Match[] }) {
  const detailsRef = useRef<HTMLDetailsElement>(null);

  useLayoutEffect(() => {
    if (detailsRef.current) {
      detailsRef.current.open = window.matchMedia(DESKTOP_MEDIA_QUERY).matches;
    }
  }, []);

  return (
    <details ref={detailsRef} className={styles.matchesDetails}>
      <summary className={styles.matchesTrigger}>
        <span className={styles.matchesTriggerLabel}>
          Matches
          <span className={styles.matchesCount}>{matches.length}</span>
        </span>
        <MatchesChevron />
      </summary>
      <div className={styles.matchesContent}>
        <ul className={styles.matchList}>
          {matches.map((match) => (
            <li key={match.id}>
              <Link href={`/matches/${match.id}`} className={styles.matchLink}>
                <LocalKickoff
                  className={styles.matchDate}
                  kickoffUtc={match.kickoffUtc}
                  venueTimeZone={match.venueTimeZone}
                  fallbackDate={match.date}
                  fallbackTime={match.time}
                  showVenueTime={false}
                />
                <span className={styles.matchTeams}>
                  {match.homeTeam.name}
                  <span className={styles.vs}>vs</span>
                  {match.awayTeam.name}
                </span>
                {match.group && (
                  <span className={styles.matchGroup}>Group {match.group}</span>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </details>
  );
}

export function StadiumCard({
  stadium,
  matches = [],
}: StadiumCardProps) {
  const sortedMatches = sortMatchesByKickoff(matches);
  const matchCount = sortedMatches.length || stadium.matchCount;

  return (
    <Card>
      <CardHeader>
        <CardTitle as="h3">{stadium.name}</CardTitle>
        {stadium.fifaName && stadium.fifaName !== stadium.name && (
          <p className={styles.fifaName}>{stadium.fifaName}</p>
        )}
      </CardHeader>
      <CardContent>
        <dl className={styles.details}>
          <div>
            <dt>City</dt>
            <dd>
              {stadium.city}, {stadium.country}
            </dd>
          </div>
          {stadium.capacity && (
            <div>
              <dt>Capacity</dt>
              <dd>{stadium.capacity.toLocaleString()}</dd>
            </div>
          )}
          {matchCount !== undefined && matchCount > 0 && sortedMatches.length === 0 && (
            <div>
              <dt>Matches</dt>
              <dd>{matchCount}</dd>
            </div>
          )}
          {stadium.region && (
            <div>
              <dt>Region</dt>
              <dd>{stadium.region}</dd>
            </div>
          )}
        </dl>

        {sortedMatches.length > 0 && (
          <StadiumMatchesAccordion matches={sortedMatches} />
        )}
      </CardContent>
    </Card>
  );
}
