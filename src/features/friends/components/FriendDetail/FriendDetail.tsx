import Link from "next/link";
import type { FriendProfileData } from "@/actions/social";
import styles from "./FriendDetail.module.css";

interface FriendDetailProps {
  profile: FriendProfileData;
}

function displayName(profile: FriendProfileData): string {
  return profile.displayName ?? profile.username ?? "Fan";
}

export function FriendDetail({ profile }: FriendDetailProps) {
  return (
    <div className={styles.detail}>
      <Link href="/friends" className={styles.back}>
        ← Back to Friends
      </Link>

      <div className={styles.hero}>
        <h1 className={styles.name}>{displayName(profile)}</h1>
        {profile.username ? (
          <p className={styles.username}>@{profile.username}</p>
        ) : null}
        {profile.favoriteCountry ? (
          <span className={styles.nation}>
            Standing behind {profile.favoriteCountry}
          </span>
        ) : null}
        {profile.secondaryCountry ? (
          <span className={styles.nation}>
            Also following {profile.secondaryCountry}
          </span>
        ) : null}
      </div>

      {profile.stats ? (
        <div className={styles.statsGrid}>
          <div className={styles.stat}>
            <span className={styles.statLabel}>Points</span>
            <span className={styles.statValue}>{profile.stats.points}</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statLabel}>Level</span>
            <span className={styles.statValue}>{profile.stats.level}</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statLabel}>Prediction accuracy</span>
            <span className={styles.statValue}>
              {profile.stats.predictionAccuracy}%
            </span>
          </div>
        </div>
      ) : null}

      {profile.championTeamName ? (
        <section>
          <h2 className={styles.sectionTitle}>Predictor pick</h2>
          <p className={styles.nation}>
            🏆 {profile.championTeamName} to win the World Cup
          </p>
        </section>
      ) : null}

      <section>
        <h2 className={styles.sectionTitle}>Recent match predictions</h2>
        {profile.recentPredictions.length === 0 ? (
          <p className={styles.empty}>No match predictions yet.</p>
        ) : (
          <ul className={styles.predictions}>
            {profile.recentPredictions.map((prediction) => (
              <li key={prediction.matchId} className={styles.predictionRow}>
                <span className={styles.match}>
                  {prediction.homeTeam} vs {prediction.awayTeam}
                </span>
                <div className={styles.scores}>
                  {prediction.isFinished ? (
                    <>
                      <span className={styles.finalScore}>
                        {prediction.actualHome}–{prediction.actualAway}
                      </span>
                      <span className={styles.predictedScore}>
                        Predicted {prediction.predictedHome}–
                        {prediction.predictedAway}
                      </span>
                    </>
                  ) : (
                    <span className={styles.finalScore}>
                      {prediction.predictedHome}–{prediction.predictedAway}
                    </span>
                  )}
                </div>
                {prediction.isFinished ? (
                  <span
                    className={`${styles.badge} ${
                      prediction.isCorrect
                        ? styles.badgeCorrect
                        : styles.badgeWrong
                    }`}
                  >
                    {prediction.isCorrect ? "Correct" : "Miss"}
                  </span>
                ) : (
                  <span className={`${styles.badge} ${styles.badgePending}`}>
                    Pending
                  </span>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
