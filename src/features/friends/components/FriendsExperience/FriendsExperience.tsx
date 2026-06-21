"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@khamudom/lumen-ui-react";
import { FriendRequests } from "../FriendRequests";
import { FriendSearch } from "../FriendSearch";
import { FriendsList } from "../FriendsList";
import { InvitePanel } from "../InvitePanel";
import type { FriendRequestSummary, FriendSummary } from "@/lib/social";
import styles from "./FriendsExperience.module.css";

type Tab = "feed" | "friends" | "requests" | "find";

interface FriendsExperienceProps {
  friends: FriendSummary[];
  incoming: FriendRequestSummary[];
  outgoing: FriendRequestSummary[];
  activityPanel: ReactNode;
}

export function FriendsExperience({
  friends,
  incoming,
  outgoing,
  activityPanel,
}: FriendsExperienceProps) {
  const [tab, setTab] = useState<Tab>("feed");
  const pendingCount = incoming.length;

  const tabs: { key: Tab; label: string; badge?: number }[] = [
    { key: "feed", label: "Feed" },
    { key: "friends", label: "Friends" },
    { key: "requests", label: "Requests", badge: pendingCount || undefined },
    { key: "find", label: "Find" },
  ];

  return (
    <div className={styles.experience}>
      <div className={styles.tabs} role="tablist">
        {tabs.map((item) => (
          <button
            key={item.key}
            type="button"
            role="tab"
            aria-selected={tab === item.key}
            className={`${styles.tab} ${tab === item.key ? styles.tabActive : ""}`}
            onClick={() => setTab(item.key)}
          >
            {item.label}
            {item.badge ? (
              <span className={styles.badge}>{item.badge}</span>
            ) : null}
          </button>
        ))}
      </div>

      <div className={styles.grid}>
        {tab === "feed" ? activityPanel : null}

        {tab === "friends" ? (
          <Card className={`${styles.card} ${styles.gridFull}`}>
            <CardHeader>
              <CardTitle as="h2" className={styles.cardTitle}>
                Your friends
              </CardTitle>
            </CardHeader>
            <CardContent>
              <FriendsList friends={friends} />
            </CardContent>
          </Card>
        ) : null}

        {tab === "requests" ? (
          <Card className={`${styles.card} ${styles.gridFull}`}>
            <CardHeader>
              <CardTitle as="h2" className={styles.cardTitle}>
                Friend requests
              </CardTitle>
            </CardHeader>
            <CardContent>
              <FriendRequests incoming={incoming} outgoing={outgoing} />
            </CardContent>
          </Card>
        ) : null}

        {tab === "find" ? (
          <>
            <Card className={styles.card}>
              <CardHeader>
                <CardTitle as="h2" className={styles.cardTitle}>
                  Search fans
                </CardTitle>
              </CardHeader>
              <CardContent>
                <FriendSearch />
              </CardContent>
            </Card>
            <Card className={styles.card}>
              <CardHeader>
                <CardTitle as="h2" className={styles.cardTitle}>
                  Invite link
                </CardTitle>
              </CardHeader>
              <CardContent>
                <InvitePanel />
              </CardContent>
            </Card>
          </>
        ) : null}
      </div>
    </div>
  );
}
