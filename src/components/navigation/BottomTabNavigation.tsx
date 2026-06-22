"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuthModal } from "@/components/AuthModal";
import { TAB_ITEMS, type TabId } from "@/config/navigation";
import { useAppStore } from "@/stores/appStore";
import styles from "./BottomTabNavigation.module.css";

const TAB_ICONS: Record<TabId, string> = {
  home: "🏠",
  matches: "⚽",
  teams: "🌍",
  stadiums: "🏟️",
  bracket: "🏆",
  profile: "👤",
};

interface BottomTabNavigationProps {
  signedIn?: boolean;
}

export function BottomTabNavigation({ signedIn = false }: BottomTabNavigationProps) {
  const pathname = usePathname();
  const activeTab = useAppStore((s) => s.activeTab);
  const saveTabScroll = useAppStore((s) => s.saveTabScroll);
  const { openAuthModal } = useAuthModal();

  const handleTabClick = (tabId: TabId, href: string, requiresAuth?: boolean) => {
    const currentTab = TAB_ITEMS.find((t) => t.href === pathname);
    if (currentTab) {
      saveTabScroll(currentTab.id, window.scrollY);
    }
    if (requiresAuth && !signedIn) {
      openAuthModal();
    }
  };

  return (
    <nav className={styles.tabBar} aria-label="Primary navigation">
      {TAB_ITEMS.map((tab) => {
        const isActive = pathname === tab.href || activeTab === tab.id;
        const isLocked = tab.requiresAuth && !signedIn;
        const tabClassName = isActive
          ? `${styles.tab} ${styles.tabActive}`
          : styles.tab;
        const tabContent = (
          <>
            <span className={styles.tabIcon} aria-hidden="true">
              {TAB_ICONS[tab.id]}
            </span>
            <span>{tab.label}</span>
          </>
        );

        if (isLocked) {
          return (
            <button
              key={tab.id}
              type="button"
              className={tabClassName}
              onClick={() => handleTabClick(tab.id, tab.href, tab.requiresAuth)}
              aria-label={`${tab.label} (sign in required)`}
            >
              {tabContent}
            </button>
          );
        }

        return (
          <Link
            key={tab.id}
            href={tab.href}
            scroll={false}
            className={tabClassName}
            aria-current={isActive ? "page" : undefined}
            onClick={() => handleTabClick(tab.id, tab.href)}
          >
            {tabContent}
          </Link>
        );
      })}
    </nav>
  );
}
