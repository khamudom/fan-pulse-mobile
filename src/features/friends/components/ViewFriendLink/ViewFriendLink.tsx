import Link from "next/link";
import styles from "./ViewFriendLink.module.css";

interface ViewFriendLinkProps {
  userId: string;
  name: string;
  variant?: "icon" | "button";
  label?: string;
}

function ChevronIcon() {
  return (
    <svg
      className={styles.chevron}
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}

export function ViewFriendLink({
  userId,
  name,
  variant = "icon",
  label: labelOverride,
}: ViewFriendLinkProps) {
  const href = `/friends/${userId}`;
  const label = labelOverride ?? `View ${name}'s profile`;

  if (variant === "button") {
    return (
      <Link href={href} className={styles.buttonLink}>
        View profile
      </Link>
    );
  }

  return (
    <Link href={href} className={styles.iconLink} aria-label={label} title={label}>
      <ChevronIcon />
    </Link>
  );
}
