"use client";

import Link from "next/link";
import { Badge, Button } from "@khamudom/lumen-ui-react";
import { DataSourceBadge } from "@/components/display/DataSourceBadge";
import { LocalKickoff } from "@/components/display/LocalKickoff";
import { toDataSourceBadge, type ApiDataSource } from "@/lib/dataSourceBadge";
import type { MyWorldCupData } from "@/lib/myWorldCup";
import type {
  WorldCupSquad,
  WorldCupSquadPlayer,
  WorldCupSquadPosition,
} from "@/data/api/worldcup/squads";
import type { Match, Team } from "@/types";
import type { Profile } from "@/types/database";
import { NationCountdown } from "./NationCountdown";
import styles from "./MyWorldCupExperience.module.css";

interface MyWorldCupExperienceProps {
  profile: Profile;
  data: MyWorldCupData;
  teamsSource?: ApiDataSource;
  matchesSource?: ApiDataSource;
}

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

function Flag({ team, className }: { team: Team; className?: string }) {
  if (!team.flag) {
    return (
      <span
        className={`${styles.flagPlaceholder} ${className ?? ""}`}
        aria-hidden="true"
      />
    );
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={team.flag}
      alt={`${team.name} flag`}
      className={`${styles.flag} ${className ?? ""}`}
      width={96}
      height={64}
      loading="lazy"
    />
  );
}

export function MyWorldCupExperience({
  profile,
  data,
  teamsSource = "api",
  matchesSource = "api",
}: MyWorldCupExperienceProps) {
  const {
    favoriteTeam,
    secondaryTeam,
    squad,
    secondarySquad,
    rivals,
    secondaryRivals,
    fixtures,
    secondaryFixtures,
    journey,
  } = data;
  const nationName =
    favoriteTeam?.name ?? profile.favorite_country ?? "your nation";
  const displayName = profile.display_name ?? "Fan";

  return (
    <div className={styles.experience}>
      <HeroChapter
        nationName={nationName}
        displayName={displayName}
        favoriteTeam={favoriteTeam}
        journey={journey}
      />

      <NextChapter
        nationName={nationName}
        journey={journey}
        favoriteTeam={favoriteTeam}
        matchesSource={matchesSource}
      />

      {fixtures.length > 0 ? (
        <RoadChapter
          nationName={nationName}
          fixtures={fixtures}
          favoriteTeam={favoriteTeam}
          matchesSource={matchesSource}
        />
      ) : null}

      {squad ? <SquadChapter nationName={nationName} squad={squad} /> : null}

      {rivals.length > 0 && favoriteTeam?.group ? (
        <RivalsChapter
          group={favoriteTeam.group}
          rivals={rivals}
          teamsSource={teamsSource}
        />
      ) : null}

      {secondaryTeam ? (
        <SecondStoryChapter
          secondaryTeam={secondaryTeam}
          secondarySquad={secondarySquad}
          secondaryFixtures={secondaryFixtures}
          secondaryRivals={secondaryRivals}
          teamsSource={teamsSource}
          matchesSource={matchesSource}
        />
      ) : null}

      <ClosingChapter nationName={nationName} />
    </div>
  );
}

function HeroChapter({
  nationName,
  displayName,
  favoriteTeam,
  journey,
}: {
  nationName: string;
  displayName: string;
  favoriteTeam: Team | null;
  journey: MyWorldCupData["journey"];
}) {
  return (
    <section className={styles.hero} aria-labelledby="mwc-hero-title">
      {favoriteTeam?.flag ? (
        <div
          className={styles.heroBackdrop}
          style={{ backgroundImage: `url(${favoriteTeam.flag})` }}
          aria-hidden="true"
        />
      ) : null}
      <div className={styles.heroOverlay} aria-hidden="true" />
      <div className={`container ${styles.heroInner}`}>
        <p className={styles.eyebrow}>{displayName}&apos;s World Cup Story</p>
        <div className={styles.heroIdentity}>
          {favoriteTeam ? (
            <Flag team={favoriteTeam} className={styles.heroFlag} />
          ) : null}
          <h1 id="mwc-hero-title" className={styles.heroTitle}>
            You&apos;re standing
            <br />
            with {nationName}.
          </h1>
        </div>
        <p className={styles.heroLead}>
          From the first whistle to the Final, every match {nationName} plays is
          now your story. This is everything about the nation you&apos;re
          standing behind.
        </p>
        {favoriteTeam?.group ? (
          <p className={styles.heroMeta}>
            <Badge variant="default" appearance="tint">Group {favoriteTeam.group}</Badge>
            <span>The road to the Final begins here.</span>
          </p>
        ) : null}

        {journey.nextMatch && journey.kickoff ? (
          <div className={styles.heroCountdown}>
            <span className={styles.heroCountdownLabel}>
              {journey.label} kicks off in
            </span>
            <NationCountdown kickoffMs={journey.kickoff.getTime()} />
          </div>
        ) : null}

        <div className={styles.heroActions}>
          <Link href="/my-world-cup?edit=1">
            <Button variant="outline">Edit my choices</Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

function NextChapter({
  nationName,
  journey,
  favoriteTeam,
  matchesSource,
}: {
  nationName: string;
  journey: MyWorldCupData["journey"];
  favoriteTeam: Team | null;
  matchesSource: ApiDataSource;
}) {
  return (
    <section className={`section ${styles.chapter}`}>
      <div className="container">
        <ChapterHeader
          eyebrow="The Next Chapter"
          title="Your next 90 minutes"
          subtitle={`The moment ${nationName} fans are counting down to.`}
          action={
            <DataSourceBadge
              source={toDataSourceBadge(matchesSource, !!journey.nextMatch)}
            />
          }
        />
        {journey.nextMatch && journey.opponent ? (
          <div className={styles.nextMatch}>
            <div className={styles.nextMatchTeams}>
              {favoriteTeam ? <Flag team={favoriteTeam} /> : null}
              <span className={styles.nextMatchVs}>vs</span>
              <span className={styles.nextMatchOpponent}>
                {journey.opponent}
              </span>
            </div>
            <div className={styles.nextMatchInfo}>
              <p className={styles.nextMatchTitle}>{journey.label}</p>
              <p className={styles.nextMatchMeta}>
                <LocalKickoff
                  kickoffUtc={journey.nextMatch.kickoffUtc}
                  venueTimeZone={journey.nextMatch.venueTimeZone}
                  fallbackDate={journey.nextMatch.date}
                  fallbackTime={journey.nextMatch.time}
                />
                {journey.nextMatch.stadiumName
                  ? ` · ${journey.nextMatch.stadiumName}`
                  : ""}
                {journey.nextMatch.city ? `, ${journey.nextMatch.city}` : ""}
              </p>
              <Link href={`/matches/${journey.nextMatch.id}`}>
                <Button variant="primary">View match</Button>
              </Link>
            </div>
          </div>
        ) : (
          <p className={styles.chapterEmpty}>{journey.label}</p>
        )}
      </div>
    </section>
  );
}

function RoadChapter({
  nationName,
  fixtures,
  favoriteTeam,
  matchesSource,
}: {
  nationName: string;
  fixtures: Match[];
  favoriteTeam: Team | null;
  matchesSource: ApiDataSource;
}) {
  const favoriteName = favoriteTeam?.name ?? nationName;
  return (
    <section className={`section sectionAlt ${styles.chapter}`}>
      <div className="container">
        <ChapterHeader
          eyebrow="The Road Ahead"
          title={`${nationName}'s path`}
          subtitle="Every fixture on the journey — the chapters still to be written."
          action={
            <DataSourceBadge
              source={toDataSourceBadge(matchesSource, fixtures.length > 0)}
            />
          }
        />
        <FixtureTimeline fixtures={fixtures} teamName={favoriteName} />
      </div>
    </section>
  );
}

function FixtureTimeline({
  fixtures,
  teamName,
}: {
  fixtures: Match[];
  teamName: string;
}) {
  const target = teamName.toLowerCase();
  return (
    <ol className={styles.timeline}>
      {fixtures.map((match) => {
        const isHome = match.homeTeam.name.toLowerCase() === target;
        const opponent = isHome ? match.awayTeam : match.homeTeam;
        const finished = match.status === "finished";
        const won =
          finished &&
          ((isHome && match.homeScore > match.awayScore) ||
            (!isHome && match.awayScore > match.homeScore));
        return (
          <li key={match.id} className={styles.timelineItem}>
            <span className={styles.timelineDot} aria-hidden="true" />
            <div className={styles.timelineCard}>
              <div className={styles.timelineTop}>
                {match.group ? (
                  <Badge variant="default" appearance="outline">Group {match.group}</Badge>
                ) : null}
                <span className={styles.timelineDate}>
                  <LocalKickoff
                    kickoffUtc={match.kickoffUtc}
                    venueTimeZone={match.venueTimeZone}
                    fallbackDate={match.date}
                    fallbackTime={match.time}
                  />
                </span>
              </div>
              <div className={styles.timelineMatchup}>
                <span className={styles.timelineOpponentLabel}>
                  {isHome ? "vs" : "away to"}
                </span>
                <span className={styles.timelineOpponent}>{opponent.name}</span>
                {finished ? (
                  <span
                    className={`${styles.timelineScore} ${won ? styles.scoreWin : ""}`}
                  >
                    {isHome
                      ? `${match.homeScore}–${match.awayScore}`
                      : `${match.awayScore}–${match.homeScore}`}
                  </span>
                ) : null}
              </div>
              {match.stadiumName ? (
                <span className={styles.timelineVenue}>
                  {match.stadiumName}
                  {match.city ? `, ${match.city}` : ""}
                </span>
              ) : null}
              <div className={styles.timelineFooter}>
                <Link
                  href={`/matches/${match.id}`}
                  className={styles.timelinePreview}
                >
                  Preview
                </Link>
              </div>
            </div>
          </li>
        );
      })}
    </ol>
  );
}

function SquadChapter({
  nationName,
  squad,
}: {
  nationName: string;
  squad: WorldCupSquad;
}) {
  return (
    <section className={`section ${styles.chapter}`}>
      <div className="container">
        <ChapterHeader
          eyebrow="Your Heroes"
          title={`Meet the ${nationName} squad`}
          subtitle={`Led by ${squad.coach_en}, captained by ${squad.captain_en} — the names you'll be chanting.`}
        />
        <SquadGroups squad={squad} />
      </div>
    </section>
  );
}

function SquadGroups({ squad }: { squad: WorldCupSquad }) {
  const byPosition = POSITION_ORDER.map((position) => ({
    position,
    players: squad.players.filter((p) => p.position === position),
  })).filter((group) => group.players.length > 0);

  return (
    <>
      {squad.status_en ? (
        <p className={styles.squadStatus}>{squad.status_en}</p>
      ) : null}
      <div className={styles.squadGroups}>
        {byPosition.map(({ position, players }) => (
          <div key={position} className={styles.squadGroup}>
            <h3 className={styles.squadGroupTitle}>
              {POSITION_LABELS[position]}
              <span className={styles.squadCount}>{players.length}</span>
            </h3>
            <ul className={styles.playerList}>
              {players.map((player) => (
                <PlayerRow key={player.id} player={player} />
              ))}
            </ul>
          </div>
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

function RivalsChapter({
  group,
  rivals,
  teamsSource,
}: {
  group: string;
  rivals: Team[];
  teamsSource: ApiDataSource;
}) {
  return (
    <section className={`section sectionAlt ${styles.chapter}`}>
      <div className="container">
        <ChapterHeader
          eyebrow="The Challengers"
          title={`The nations standing in your way`}
          subtitle={`Group ${group} — beat them, and the knockout dream is alive.`}
          action={
            <DataSourceBadge
              source={toDataSourceBadge(teamsSource, rivals.length > 0)}
            />
          }
        />
        <div className={styles.rivalGrid}>
          {rivals.map((team) => (
            <div key={team.id} className={styles.rivalCard}>
              <Flag team={team} className={styles.rivalFlag} />
              <span className={styles.rivalName}>{team.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function SecondStoryChapter({
  secondaryTeam,
  secondarySquad,
  secondaryFixtures,
  secondaryRivals,
  teamsSource,
  matchesSource,
}: {
  secondaryTeam: Team;
  secondarySquad: WorldCupSquad | null;
  secondaryFixtures: Match[];
  secondaryRivals: Team[];
  teamsSource: ApiDataSource;
  matchesSource: ApiDataSource;
}) {
  return (
    <section className={`section ${styles.chapter}`}>
      <div className="container">
        <ChapterHeader
          eyebrow="A Second Story"
          title={`You're also watching ${secondaryTeam.name}`}
          subtitle="A second nation to cheer for when your favorite isn't on the pitch."
        />
        <div className={styles.secondStory}>
          <Flag team={secondaryTeam} className={styles.secondFlag} />
          <div>
            <p className={styles.secondName}>{secondaryTeam.name}</p>
            {secondaryTeam.group ? (
              <Badge variant="default" appearance="outline">Group {secondaryTeam.group}</Badge>
            ) : null}
          </div>
        </div>

        {secondaryFixtures.length > 0 ? (
          <div className={styles.secondBlock}>
            <h3 className={styles.secondBlockTitle}>
              {secondaryTeam.name}&apos;s path
              <DataSourceBadge
                source={toDataSourceBadge(matchesSource, true)}
              />
            </h3>
            <FixtureTimeline
              fixtures={secondaryFixtures}
              teamName={secondaryTeam.name}
            />
          </div>
        ) : null}

        {secondaryRivals.length > 0 && secondaryTeam.group ? (
          <div className={styles.secondBlock}>
            <h3 className={styles.secondBlockTitle}>
              Group {secondaryTeam.group} rivals
              <DataSourceBadge
                source={toDataSourceBadge(teamsSource, true)}
              />
            </h3>
            <div className={styles.rivalGrid}>
              {secondaryRivals.map((team) => (
                <div key={team.id} className={styles.rivalCard}>
                  <Flag team={team} className={styles.rivalFlag} />
                  <span className={styles.rivalName}>{team.name}</span>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {secondarySquad ? (
          <div className={styles.secondBlock}>
            <h3 className={styles.secondBlockTitle}>
              {secondaryTeam.name}&apos;s squad
            </h3>
            <SquadGroups squad={secondarySquad} />
          </div>
        ) : null}
      </div>
    </section>
  );
}

function ClosingChapter({ nationName }: { nationName: string }) {
  return (
    <section className={styles.closing}>
      <div className={`container ${styles.closingInner}`}>
        <h2 className={styles.closingTitle}>This is your World Cup.</h2>
        <p className={styles.closingLead}>
          {nationName} carries your hopes now. Make your predictions, take on
          the daily challenges, and live every moment of the journey.
        </p>
        <div className={styles.closingActions}>
          <Link href="/predictor">
            <Button variant="outline">Make a prediction</Button>
          </Link>
          <Link href="/challenges">
            <Button variant="outline">Daily challenges</Button>
          </Link>
          <Link href="/#briefing">
            <Button variant="outline">Read your briefing</Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

function ChapterHeader({
  eyebrow,
  title,
  subtitle,
  action,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
  action?: React.ReactNode;
}) {
  return (
    <header className={styles.chapterHeader}>
      <div>
        <p className={styles.chapterEyebrow}>{eyebrow}</p>
        <h2 className={styles.chapterTitle}>{title}</h2>
        <p className={styles.chapterSubtitle}>{subtitle}</p>
      </div>
      {action ? <div className={styles.chapterAction}>{action}</div> : null}
    </header>
  );
}
