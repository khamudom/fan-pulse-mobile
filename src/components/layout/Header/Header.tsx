"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Button } from "@khamudom/lumen-ui-react";
import { UserMenu } from "@/components/UserMenu";
import type { ResolvedTheme } from "@/lib/theme";
import styles from "./Header.module.css";

const navItems = [
  { href: "/", label: "Today" },
  { href: "/my-world-cup", label: "My World Cup", requiresAuth: true },
  { href: "/friends", label: "Friends", requiresAuth: true },
  { href: "/challenges", label: "Challenges", requiresAuth: true },
  { href: "/matches", label: "Matches" },
  { href: "/predictor", label: "Predictor" },
  { href: "/teams", label: "Teams" },
  { href: "/stadiums", label: "Stadiums" },
];

interface HeaderProps {
  signedIn?: boolean;
  displayName?: string | null;
  resolvedTheme: ResolvedTheme;
  incomingRequestCount?: number;
}

function MenuIcon() {
  return (
    <svg
      className={styles.menuToggleIcon}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      className={styles.menuToggleIcon}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}

export function Header({
  signedIn = false,
  displayName,
  resolvedTheme,
  incomingRequestCount = 0,
}: HeaderProps) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const visibleNavItems = navItems.filter(
    (item) => !item.requiresAuth || signedIn,
  );

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <div className={styles.brand}>
          <Link
            href="/"
            className={styles.logo}
            aria-label="World Cup FanPulse home"
          >
            <span className={styles.logoMark} aria-hidden="true">
              ⚽
            </span>
            <span className={styles.logoText}>
              Fan<span className={styles.logoAccent}>Pulse</span>
            </span>
          </Link>

          <div className={styles.menuToggleWrap}>
            <Button
              type="button"
              variant="ghost"
              className={styles.menuToggle}
              aria-expanded={menuOpen}
              aria-controls="main-nav"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <CloseIcon /> : <MenuIcon />}
            </Button>
          </div>
        </div>

        <nav
          id="main-nav"
          className={`${styles.nav} ${menuOpen ? styles.navOpen : ""}`}
          aria-label="Main navigation"
        >
          <ul className={styles.navList}>
            {visibleNavItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={
                    pathname === item.href
                      ? styles.navLinkActive
                      : styles.navLink
                  }
                  onClick={() => setMenuOpen(false)}
                  aria-current={pathname === item.href ? "page" : undefined}
                >
                  {item.label}
                  {item.href === "/friends" && incomingRequestCount > 0 ? (
                    <span
                      className={styles.navBadge}
                      aria-label={`${incomingRequestCount} pending friend ${
                        incomingRequestCount === 1 ? "request" : "requests"
                      }`}
                    >
                      {incomingRequestCount}
                    </span>
                  ) : null}
                </Link>
              </li>
            ))}
          </ul>
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
