import Image from "next/image";
import Link from "next/link";
import { LocalKickoff } from "@/components/display/LocalKickoff";
import { toIsoDate } from "@/lib/matchDate";
import { getStatusLabel } from "@/lib/worldcup/display";
import type { Match } from "@/types";
import styles from "./ProgrammeSchedule.module.css";

function formatProgrammeDay(isoDate: string): string {
  const [year, month, day] = isoDate.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  return date
    .toLocaleDateString("en-US", {
      weekday: "long",
      day: "numeric",
      month: "long",
    })
    .toUpperCase();
}

function groupMatchesByDate(matches: Match[]): Map<string, Match[]> {
  const groups = new Map<string, Match[]>();

  for (const match of matches) {
    const iso = toIsoDate(match.date);
    const existing = groups.get(iso) ?? [];
    existing.push(match);
    groups.set(iso, existing);
  }

  return new Map(
    [...groups.entries()].sort(([a], [b]) => a.localeCompare(b)),
  );
}

function isUserTeamMatch(match: Match, favoriteCountry?: string | null): boolean {
  if (!favoriteCountry) return false;
  return (
    match.homeTeam.name === favoriteCountry ||
    match.awayTeam.name === favoriteCountry
  );
}

function shouldShowScore(status: Match["status"]): boolean {
  return (
    status === "finished" ||
    status === "live" ||
    status === "halftime"
  );
}

function shouldShowStatusIndicator(status: Match["status"]): boolean {
  return status === "live" || status === "halftime" || status === "finished";
}

function MatchStatusIndicator({ status }: { status: Match["status"] }) {
  if (!shouldShowStatusIndicator(status)) return null;

  const isInPlay = status === "live" || status === "halftime";

  return (
    <span
      className={`${styles.status} ${
        isInPlay ? styles.statusLive : styles.statusFinished
      }`}
    >
      {isInPlay ? <span className={styles.liveDot} aria-hidden="true" /> : null}
      {getStatusLabel(status)}
    </span>
  );
}

interface ProgrammeScheduleProps {
  matches: Match[];
  favoriteCountry?: string | null;
}

export function ProgrammeSchedule({
  matches,
  favoriteCountry,
}: ProgrammeScheduleProps) {
  const grouped = groupMatchesByDate(matches);

  if (grouped.size === 0) return null;

  return (
    <div className={styles.schedule}>
      {[...grouped.entries()].map(([isoDate, dayMatches]) => (
        <section key={isoDate} className={styles.dayGroup}>
          <h3 className={styles.dayDivider}>{formatProgrammeDay(isoDate)}</h3>
          <ul className={styles.matchList}>
            {dayMatches.map((match) => {
              const isYourTeam = isUserTeamMatch(match, favoriteCountry);
              const showScore = shouldShowScore(match.status);
              const isFinished = match.status === "finished";

              return (
                <li key={match.id}>
                  <article
                    className={`${styles.matchRow} ${
                      isYourTeam ? styles.matchRowHighlight : ""
                    }`}
                  >
                    <LocalKickoff
                      className={styles.matchTime}
                      kickoffUtc={match.kickoffUtc}
                      venueTimeZone={match.venueTimeZone}
                      fallbackDate={match.date}
                      fallbackTime={match.time}
                      mode="time"
                    />

                    <div className={styles.matchMain}>
                      <div className={styles.matchTeams}>
                        <div className={styles.team}>
                          {match.homeTeam.flag ? (
                            <Image
                              src={match.homeTeam.flag}
                              alt=""
                              width={28}
                              height={19}
                              className={styles.flag}
                            />
                          ) : (
                            <span className={styles.flagPlaceholder} aria-hidden />
                          )}
                          <span className={styles.teamName}>
                            {match.homeTeam.name}
                          </span>
                          {isYourTeam &&
                          match.homeTeam.name === favoriteCountry ? (
                            <span className={styles.yourTeamTag}>Your Team</span>
                          ) : null}
                        </div>

                        {showScore ? (
                          <span
                            className={styles.score}
                            aria-label={`Score: ${match.homeTeam.name} ${match.homeScore}, ${match.awayTeam.name} ${match.awayScore}`}
                          >
                            {match.homeScore} – {match.awayScore}
                          </span>
                        ) : (
                          <span className={styles.vs}>vs</span>
                        )}

                        <div className={styles.team}>
                          {match.awayTeam.flag ? (
                            <Image
                              src={match.awayTeam.flag}
                              alt=""
                              width={28}
                              height={19}
                              className={styles.flag}
                            />
                          ) : (
                            <span className={styles.flagPlaceholder} aria-hidden />
                          )}
                          <span className={styles.teamName}>
                            {match.awayTeam.name}
                          </span>
                          {isYourTeam &&
                          match.awayTeam.name === favoriteCountry ? (
                            <span className={styles.yourTeamTag}>Your Team</span>
                          ) : null}
                        </div>
                      </div>

                      <MatchStatusIndicator status={match.status} />

                      <p className={styles.venue}>
                        {match.stadiumName}
                        {match.city ? `, ${match.city}` : ""}
                      </p>
                    </div>

                    <Link href={`/matches/${match.id}`} className={styles.preview}>
                      {isFinished ? "Recap" : "Preview"}
                    </Link>
                  </article>
                </li>
              );
            })}
          </ul>
        </section>
      ))}
    </div>
  );
}
