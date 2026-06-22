"use client";

import { useState, useTransition } from "react";
import { useInvalidateAndRefresh } from "@/hooks/useInvalidateAndRefresh";
import { Button, Input } from "@khamudom/lumen-ui-react";
import {
  respondToFriendRequest,
  searchUsers,
  sendFriendRequest,
} from "@/actions/social";
import type { ConnectionRelationship, UserSearchResult } from "@/lib/social";
import styles from "./FriendSearch.module.css";

function displayName(user: UserSearchResult): string {
  return user.displayName ?? user.username ?? "Fan";
}

export function FriendSearch() {
  const invalidateAndRefresh = useInvalidateAndRefresh();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<UserSearchResult[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [pendingUserId, setPendingUserId] = useState<string | null>(null);
  const [isSearching, startSearch] = useTransition();
  const [, startSend] = useTransition();

  function handleSearch(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    setSuccess(null);
    startSearch(async () => {
      const response = await searchUsers(query);
      if (response.error) {
        setError(response.error);
        setResults([]);
        return;
      }
      setResults(response.results);
    });
  }

  function updateRelationship(
    userId: string,
    relationship: ConnectionRelationship,
  ) {
    setResults((current) =>
      current.map((user) =>
        user.id === userId ? { ...user, relationship } : user,
      ),
    );
  }

  function handleAdd(userId: string) {
    setError(null);
    setSuccess(null);
    setPendingUserId(userId);
    startSend(async () => {
      const result = await sendFriendRequest(userId);
      setPendingUserId(null);
      if (result.error) {
        setError(result.error);
        return;
      }
      // sendFriendRequest auto-accepts when a reverse request already exists.
      const becameFriends = /connected/i.test(result.success ?? "");
      updateRelationship(userId, becameFriends ? "friends" : "outgoing_pending");
      setSuccess(result.success ?? "Request sent.");
      invalidateAndRefresh();
    });
  }

  function handleAccept(userId: string, connectionId: string) {
    setError(null);
    setSuccess(null);
    setPendingUserId(userId);
    startSend(async () => {
      const result = await respondToFriendRequest(connectionId, true);
      setPendingUserId(null);
      if (result.error) {
        setError(result.error);
        return;
      }
      updateRelationship(userId, "friends");
      setSuccess(result.success ?? "You're now connected!");
      invalidateAndRefresh();
    });
  }

  function renderAction(user: UserSearchResult) {
    const isBusy = pendingUserId === user.id;

    switch (user.relationship) {
      case "friends":
        return (
          <Button type="button" variant="ghost" disabled>
            Friends
          </Button>
        );
      case "outgoing_pending":
        return (
          <Button type="button" variant="ghost" disabled>
            Request sent
          </Button>
        );
      case "incoming_pending":
        return (
          <Button
            type="button"
            variant="primary"
            loading={isBusy}
            onClick={() =>
              user.connectionId &&
              handleAccept(user.id, user.connectionId)
            }
          >
            Accept request
          </Button>
        );
      default:
        return (
          <Button
            type="button"
            variant="outline"
            loading={isBusy}
            onClick={() => handleAdd(user.id)}
          >
            Add friend
          </Button>
        );
    }
  }

  return (
    <div className={styles.search}>
      <form onSubmit={handleSearch} className={styles.row}>
        <Input
          className={styles.input}
          label="Search by username or display name"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="e.g. Baloo710 or footiefan42"
        />
        <Button
          type="submit"
          variant="primary"
          loading={isSearching}
          className={styles.button}
        >
          Search
        </Button>
      </form>

      {error ? <p className={styles.error}>{error}</p> : null}
      {success ? <p className={styles.success}>{success}</p> : null}

      {results.length > 0 ? (
        <ul className={styles.results}>
          {results.map((user) => (
            <li key={user.id} className={styles.resultRow}>
              <div className={styles.info}>
                <p className={styles.name}>{displayName(user)}</p>
                {user.username ? (
                  <p className={styles.meta}>@{user.username}</p>
                ) : null}
                {user.favoriteCountry ? (
                  <p className={styles.meta}>
                    Standing behind {user.favoriteCountry}
                  </p>
                ) : null}
              </div>
              {renderAction(user)}
            </li>
          ))}
        </ul>
      ) : query.length >= 2 && !isSearching && results.length === 0 && !error ? (
        <p className={styles.empty}>No fans found. Try a different username.</p>
      ) : null}
    </div>
  );
}
