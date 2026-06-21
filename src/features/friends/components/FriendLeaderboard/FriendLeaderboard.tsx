import Link from "next/link";
import { ViewFriendLink } from "../ViewFriendLink";
import type { LeaderboardEntry } from "@/lib/social";
import styles from "./FriendLeaderboard.module.css";

interface FriendLeaderboardProps {
  entries: LeaderboardEntry[];
}

function displayName(entry: LeaderboardEntry): string {
  return entry.displayName ?? entry.username ?? "Fan";
}

export function FriendLeaderboard({ entries }: FriendLeaderboardProps) {
  return (
    <ol className={styles.list}>
      {entries.map((entry) => (
        <li
          key={entry.userId}
          className={`${styles.row} ${entry.isSelf ? styles.rowSelf : ""}`}
        >
          <span className={styles.rank}>{entry.rank}</span>
          <div className={styles.info}>
            <Link href={`/friends/${entry.userId}`} className={styles.link}>
              <span className={styles.name}>
                {displayName(entry)}
                {entry.isSelf ? " (you)" : ""}
              </span>
            </Link>
            {entry.favoriteCountry ? (
              <p className={styles.meta}>Standing behind {entry.favoriteCountry}</p>
            ) : null}
          </div>
          <div className={styles.stats}>
            <p className={styles.points}>{entry.points} pts</p>
            <p className={styles.accuracy}>
              Lv {entry.level} · {entry.predictionAccuracy}% prediction accuracy
            </p>
          </div>
          <ViewFriendLink
            userId={entry.userId}
            name={displayName(entry)}
            label={entry.isSelf ? "View your profile" : undefined}
          />
        </li>
      ))}
    </ol>
  );
}
