"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@khamudom/lumen-ui-react";
import { signOut } from "@/actions/auth";
import styles from "./AuthNav.module.css";

interface AuthNavProps {
  displayName?: string | null;
  signedIn: boolean;
}

export function AuthNav({ displayName, signedIn }: AuthNavProps) {
  const router = useRouter();

  if (!signedIn) {
    return (
      <Link href="/login" className={styles.signIn}>
        Sign in
      </Link>
    );
  }

  return (
    <div className={styles.wrap}>
      <Link href="/profile" className={styles.user}>
        <span className={styles.avatar} aria-hidden="true">
          {(displayName ?? "F").charAt(0).toUpperCase()}
        </span>
        <span className={styles.name}>{displayName ?? "Fan"}</span>
      </Link>
      <Button
        type="button"
        variant="ghost"
        className={styles.signOut}
        onClick={async () => {
          await signOut();
          router.refresh();
        }}
      >
        Sign out
      </Button>
    </div>
  );
}
