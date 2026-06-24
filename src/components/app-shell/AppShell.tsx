"use client";

import { usePathname } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { BottomTabNavigation, PersistentHeader } from "@/components/navigation";
import {
  getTabIdForPath,
  shouldShowBottomTabs,
} from "@/config/navigation";
import { useAppStore } from "@/stores/appStore";
import { PrefetchBootstrap } from "./PrefetchBootstrap";
import { AnimatedScreenContainer } from "@/components/app-shell/AnimatedScreenContainer";
import styles from "./AppShell.module.css";

interface AppShellProps {
  children: ReactNode;
  resolvedTheme: "light" | "dark";
  signedIn?: boolean;
  displayName?: string | null;
  incomingRequestCount?: number;
}

export function AppShell({
  children,
  resolvedTheme,
  signedIn = false,
  displayName,
  incomingRequestCount = 0,
}: AppShellProps) {
  const pathname = usePathname();
  const setActiveTab = useAppStore((s) => s.setActiveTab);
  const setReducedMotion = useAppStore((s) => s.setReducedMotion);
  const showTabs = shouldShowBottomTabs(pathname);

  useEffect(() => {
    const tabId = getTabIdForPath(pathname);
    if (tabId) {
      setActiveTab(tabId);
    }
  }, [pathname, setActiveTab]);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, [setReducedMotion]);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      useAppStore.getState().setInstallDeferredEvent(e as BeforeInstallPromptEvent);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  return (
    <div className={styles.shell}>
      <PrefetchBootstrap />
      <div className={styles.frame}>
        <div className={styles.contentColumn}>
          <PersistentHeader
            signedIn={signedIn}
            displayName={displayName}
            resolvedTheme={resolvedTheme}
            incomingRequestCount={incomingRequestCount}
          />
          <main
            id="main-content"
            className={`${styles.main} ${showTabs ? "" : styles.mainNoTabs}`}
          >
            <AnimatedScreenContainer>{children}</AnimatedScreenContainer>
          </main>
          {showTabs ? <BottomTabNavigation signedIn={signedIn} /> : null}
        </div>
      </div>
    </div>
  );
}
