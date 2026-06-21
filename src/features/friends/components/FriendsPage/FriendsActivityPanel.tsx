"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@khamudom/lumen-ui-react";
import { FriendFeed } from "../FriendFeed";
import { FriendLeaderboard } from "../FriendLeaderboard";
import type { FeedItem, LeaderboardEntry } from "@/lib/social";
import experienceStyles from "../FriendsExperience/FriendsExperience.module.css";

type FriendsActivityPanelProps = {
  feed: FeedItem[];
  leaderboard: LeaderboardEntry[];
};

export function FriendsActivityPanel({
  feed,
  leaderboard,
}: FriendsActivityPanelProps) {
  return (
    <>
      <Card className={`${experienceStyles.card} ${experienceStyles.gridFull}`}>
        <CardHeader>
          <CardTitle as="h2" className={experienceStyles.cardTitle}>
            Standings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <FriendLeaderboard entries={leaderboard} />
        </CardContent>
      </Card>
      <Card className={`${experienceStyles.card} ${experienceStyles.gridFull}`}>
        <CardHeader>
          <CardTitle as="h2" className={experienceStyles.cardTitle}>
            Friends activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <FriendFeed items={feed} />
        </CardContent>
      </Card>
    </>
  );
}
