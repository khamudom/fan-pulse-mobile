"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Button } from "@khamudom/lumen-ui-react";
import { ViewFriendLink } from "../ViewFriendLink";
import { removeConnection } from "@/actions/social";
import type { FriendSummary } from "@/lib/social";
import styles from "./FriendsList.module.css";

interface FriendsListProps {
  friends: FriendSummary[];
}

function displayName(friend: FriendSummary): string {
  return friend.displayName ?? friend.username ?? "Fan";
}

export function FriendsList({ friends }: FriendsListProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  if (friends.length === 0) {
    return (
      <p className={styles.empty}>
        No friends yet. Search for fans or share your invite link.
      </p>
    );
  }

  function handleRemove(connectionId: string) {
    startTransition(async () => {
      await removeConnection(connectionId);
      router.refresh();
    });
  }

  return (
    <ul className={styles.list}>
      {friends.map((friend) => (
        <li key={friend.id} className={styles.row}>
          <div className={styles.info}>
            <Link href={`/friends/${friend.id}`} className={styles.link}>
              <p className={styles.name}>{displayName(friend)}</p>
            </Link>
            {friend.favoriteCountry ? (
              <p className={styles.meta}>
                Standing behind {friend.favoriteCountry}
              </p>
            ) : null}
            {friend.username ? (
              <p className={styles.meta}>@{friend.username}</p>
            ) : null}
          </div>
          <div className={styles.actions}>
            <ViewFriendLink
              userId={friend.id}
              name={displayName(friend)}
              variant="button"
            />
            <Button
              type="button"
              variant="outline"
              disabled={isPending}
              onClick={() => handleRemove(friend.connectionId)}
            >
              Remove
            </Button>
          </div>
        </li>
      ))}
    </ul>
  );
}
