"use client";

import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Badge,
} from "@khamudom/lumen-ui-react";
import { FanAccoladesBoard } from "@/components/FanAccoladesBoard";
import { EditableUsername } from "@/components/EditableUsername";
import { getLevelTitle } from "@/lib/points";
import type { Profile, UserStats } from "@/types/database";
import styles from "./ProfileDashboard.module.css";

interface ProfileDashboardProps {
  profile: Profile | null;
  stats: UserStats | null;
  predictionCount: number;
}

export function ProfileDashboard({
  profile,
  stats,
  predictionCount,
}: ProfileDashboardProps) {
  const levelTitle = getLevelTitle(stats?.level ?? 1, profile?.favorite_country);

  return (
    <>
      <div className={styles.grid}>
        <Card>
          <CardHeader>
            <CardTitle as="h2">Fan Reputation</CardTitle>
          </CardHeader>
          <CardContent className={styles.stats}>
            <div>
              <span className={styles.label}>Level</span>
              <strong>
                {stats?.level ?? 1} · {levelTitle}
              </strong>
            </div>
            <div>
              <span className={styles.label}>Points</span>
              <strong>{stats?.points ?? 0}</strong>
            </div>
            <div>
              <span className={styles.label}>Prediction accuracy</span>
              <strong>{Number(stats?.prediction_accuracy ?? 0)}%</strong>
            </div>
            <div>
              <span className={styles.label}>Predictions made</span>
              <strong>{predictionCount}</strong>
            </div>
            {profile?.favorite_country ? (
              <div>
                <span className={styles.label}>My team</span>
                <Badge variant="default" appearance="tint">{profile.favorite_country}</Badge>
              </div>
            ) : null}
            <div>
              <span className={styles.label}>Find me</span>
              <EditableUsername username={profile?.username ?? null} />
            </div>
          </CardContent>
        </Card>

      </div>

      <div className={styles.accolades}>
        <FanAccoladesBoard stats={stats} variant="full" />
      </div>

      <div className={styles.links}>
        <Link href="/friends">Friends</Link>
        <Link href="/my-world-cup">Edit My World Cup</Link>
        <Link href="/#briefing">Read briefing</Link>
      </div>
    </>
  );
}
