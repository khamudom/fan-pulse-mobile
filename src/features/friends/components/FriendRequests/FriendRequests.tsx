"use client";

import { useInvalidateAndRefresh } from "@/hooks/useInvalidateAndRefresh";
import { useTransition } from "react";
import { Button } from "@khamudom/lumen-ui-react";
import {
  removeConnection,
  respondToFriendRequest,
} from "@/actions/social";
import type { FriendRequestSummary } from "@/lib/social";
import styles from "./FriendRequests.module.css";

interface FriendRequestsProps {
  incoming: FriendRequestSummary[];
  outgoing: FriendRequestSummary[];
}

function displayName(request: FriendRequestSummary): string {
  return request.displayName ?? request.username ?? "Fan";
}

export function FriendRequests({ incoming, outgoing }: FriendRequestsProps) {
  const invalidateAndRefresh = useInvalidateAndRefresh();
  const [isPending, startTransition] = useTransition();

  function handleRespond(connectionId: string, accept: boolean) {
    startTransition(async () => {
      await respondToFriendRequest(connectionId, accept);
      invalidateAndRefresh();
    });
  }

  function handleCancel(connectionId: string) {
    startTransition(async () => {
      await removeConnection(connectionId);
      invalidateAndRefresh();
    });
  }

  if (incoming.length === 0 && outgoing.length === 0) {
    return <p className={styles.empty}>No pending requests.</p>;
  }

  return (
    <div className={styles.section}>
      {incoming.length > 0 ? (
        <div>
          <h3 className={styles.groupTitle}>Incoming</h3>
          <ul className={styles.list}>
            {incoming.map((request) => (
              <li key={request.id} className={styles.row}>
                <div className={styles.info}>
                  <p className={styles.name}>{displayName(request)}</p>
                  {request.favoriteCountry ? (
                    <p className={styles.meta}>
                      Standing behind {request.favoriteCountry}
                    </p>
                  ) : null}
                </div>
                <div className={styles.actions}>
                  <Button
                    type="button"
                    variant="primary"
                    disabled={isPending}
                    onClick={() => handleRespond(request.id, true)}
                  >
                    Accept
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    disabled={isPending}
                    onClick={() => handleRespond(request.id, false)}
                  >
                    Decline
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {outgoing.length > 0 ? (
        <div>
          <h3 className={styles.groupTitle}>Sent</h3>
          <ul className={styles.list}>
            {outgoing.map((request) => (
              <li key={request.id} className={styles.row}>
                <div className={styles.info}>
                  <p className={styles.name}>{displayName(request)}</p>
                  <p className={styles.meta}>Pending</p>
                </div>
                <div className={styles.actions}>
                  <Button
                    type="button"
                    variant="outline"
                    disabled={isPending}
                    onClick={() => handleCancel(request.id)}
                  >
                    Cancel
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
