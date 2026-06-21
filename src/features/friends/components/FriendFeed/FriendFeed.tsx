import Link from "next/link";
import { ViewFriendLink } from "../ViewFriendLink";
import type { FeedItem } from "@/lib/social";
import styles from "./FriendFeed.module.css";

const TYPE_ICONS: Record<FeedItem["type"], string> = {
  nation: "🏳",
  bracket: "🏆",
  prediction: "⚽",
};

interface FriendFeedProps {
  items: FeedItem[];
}

function displayName(item: FeedItem): string {
  return item.displayName ?? item.username ?? "Fan";
}

function formatRelativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export function FriendFeed({ items }: FriendFeedProps) {
  if (items.length === 0) {
    return (
      <p className={styles.empty}>
        No activity yet. Make predictions or save your bracket to get started.
      </p>
    );
  }

  return (
    <ul className={styles.list}>
      {items.map((item) => (
        <li key={item.id} className={styles.item}>
          <span className={styles.icon} aria-hidden="true">
            {TYPE_ICONS[item.type]}
          </span>
          <div className={styles.body}>
            <p className={styles.message}>
              <Link href={`/friends/${item.userId}`} className={styles.link}>
                {item.message}
              </Link>
            </p>
            <p className={styles.time}>{formatRelativeTime(item.createdAt)}</p>
          </div>
          <ViewFriendLink userId={item.userId} name={displayName(item)} />
        </li>
      ))}
    </ul>
  );
}
