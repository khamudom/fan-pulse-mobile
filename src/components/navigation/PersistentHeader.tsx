"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@khamudom/lumen-ui-react";
import { UserMenu } from "@/components/UserMenu";
import {
  getDetailTitle,
  getRouteClass,
  getTabIdForPath,
  shouldShowBackButton,
  TAB_ITEMS,
} from "@/config/navigation";
import { useAppNavigate } from "@/hooks/useAppNavigate";
import type { ResolvedTheme } from "@/lib/theme";
import styles from "./PersistentHeader.module.css";

interface PersistentHeaderProps {
  signedIn?: boolean;
  displayName?: string | null;
  resolvedTheme: ResolvedTheme;
  incomingRequestCount?: number;
}

function BackIcon() {
  return (
    <svg
      className={styles.backIcon}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d="M15 18l-6-6 6-6" />
    </svg>
  );
}

export function PersistentHeader({
  signedIn = false,
  displayName,
  resolvedTheme,
  incomingRequestCount = 0,
}: PersistentHeaderProps) {
  const pathname = usePathname();
  const { goBack } = useAppNavigate();
  const routeClass = getRouteClass(pathname);
  const showBack = shouldShowBackButton(pathname);
  const activeTabId = getTabIdForPath(pathname);

  const title =
    routeClass === "detail"
      ? getDetailTitle(pathname)
      : TAB_ITEMS.find((t) => t.id === activeTabId)?.label ?? "FanPulse";

  const visibleTabs = TAB_ITEMS.filter((t) => !t.requiresAuth || signedIn);

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <div className={styles.left}>
          {showBack ? (
            <Button
              type="button"
              variant="ghost"
              className={styles.backButton}
              aria-label="Go back"
              onClick={goBack}
            >
              <BackIcon />
            </Button>
          ) : (
            <Link href="/" className={styles.logo} aria-label="World Cup FanPulse home">
              <span className={styles.logoMark} aria-hidden="true">
                ⚽
              </span>
              <span>
                Fan<span className={styles.logoAccent}>Pulse</span>
              </span>
            </Link>
          )}
          <h1 className={styles.title}>{title}</h1>
        </div>

        <nav className={styles.desktopNav} aria-label="Desktop navigation">
          {visibleTabs.map((tab) => (
            <Link
              key={tab.id}
              href={tab.href}
              scroll={false}
              className={
                pathname === tab.href
                  ? styles.desktopNavLinkActive
                  : styles.desktopNavLink
              }
              aria-current={pathname === tab.href ? "page" : undefined}
            >
              {tab.label}
              {tab.id === "profile" && incomingRequestCount > 0 ? (
                <span aria-label={`${incomingRequestCount} pending requests`}>
                  {" "}({incomingRequestCount})
                </span>
              ) : null}
            </Link>
          ))}
        </nav>

        <div className={styles.right}>
          <UserMenu
            signedIn={signedIn}
            displayName={displayName}
            resolvedTheme={resolvedTheme}
          />
        </div>
      </div>
    </header>
  );
}
