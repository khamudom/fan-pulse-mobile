"use client";

import Link from "next/link";
import { useInvalidateAndRefresh } from "@/hooks/useInvalidateAndRefresh";
import { useEffect, useRef, useState } from "react";
import { Button } from "@khamudom/lumen-ui-react";
import { signOut } from "@/actions/auth";
import { useAuthModal } from "@/components/AuthModal";
import type { ResolvedTheme } from "@/lib/theme";
import styles from "./UserMenu.module.css";

interface UserMenuProps {
  signedIn: boolean;
  displayName?: string | null;
  resolvedTheme: ResolvedTheme;
}

export function UserMenu({ signedIn, displayName }: UserMenuProps) {
  const invalidateAndRefresh = useInvalidateAndRefresh();
  const { openAuthModal } = useAuthModal();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const initial = (displayName ?? "F").charAt(0).toUpperCase();

  useEffect(() => {
    if (!open) return;

    function handlePointer(event: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    function handleKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", handlePointer);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handlePointer);
      document.removeEventListener("keydown", handleKey);
    };
  }, [open]);

  async function handleSignOut() {
    setOpen(false);
    await signOut();
    invalidateAndRefresh([["matches"], ["teams"], ["groups"]]);
  }

  return (
    <div className={styles.root} ref={rootRef}>
      <Button
        ref={triggerRef}
        type="button"
        variant="outline"
        className={styles.trigger}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Account menu"
        onClick={() => setOpen((value) => !value)}
      >
        {signedIn ? (
          <span className={styles.avatar} aria-hidden="true">
            {initial}
          </span>
        ) : (
          <span className={`${styles.avatar} ${styles.avatarGuest}`}>
            <svg
              viewBox="0 0 24 24"
              width="18"
              height="18"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10Zm0 2c-4.42 0-8 2.69-8 6v2h16v-2c0-3.31-3.58-6-8-6Z" />
            </svg>
          </span>
        )}
      </Button>

      {open ? (
        <div className={styles.menu} role="menu">
          {signedIn ? (
            <div className={styles.account}>
              <span className={styles.avatarLarge} aria-hidden="true">
                {initial}
              </span>
              <span className={styles.name}>{displayName ?? "Fan"}</span>
            </div>
          ) : null}

          {signedIn ? (
            <Link
              href="/profile"
              className={styles.item}
              role="menuitem"
              onClick={() => setOpen(false)}
            >
              <span className={styles.itemIcon} aria-hidden="true">
                ⚙
              </span>
              Settings
            </Link>
          ) : null}

          {/* Theme switcher hidden for now.
          <button type="button" className={styles.item} role="menuitem">
            <span className={styles.itemIcon} aria-hidden="true" />
            Theme mode
          </button>
          */}

          {signedIn ? (
            <div className={styles.divider} role="separator" />
          ) : null}

          {signedIn ? (
            <button
              type="button"
              className={styles.item}
              role="menuitem"
              onClick={handleSignOut}
            >
              <span className={styles.itemIcon} aria-hidden="true">
                ⏻
              </span>
              Sign out
            </button>
          ) : (
            <button
              type="button"
              className={styles.item}
              role="menuitem"
              onClick={() => {
                setOpen(false);
                openAuthModal({ returnFocusRef: triggerRef });
              }}
            >
              <span className={styles.itemIcon} aria-hidden="true">
                →
              </span>
              Sign in
            </button>
          )}
        </div>
      ) : null}
    </div>
  );
}
