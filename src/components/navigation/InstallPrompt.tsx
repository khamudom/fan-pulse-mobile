"use client";

import { Button } from "@khamudom/lumen-ui-react";
import { useAppStore } from "@/stores/appStore";
import styles from "./InstallPrompt.module.css";

function isIos(): boolean {
  if (typeof navigator === "undefined") return false;
  return /iphone|ipad|ipod/i.test(navigator.userAgent);
}

function isStandalone(): boolean {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    ("standalone" in navigator && (navigator as Navigator & { standalone?: boolean }).standalone === true)
  );
}

export function InstallPrompt() {
  const installPrompt = useAppStore((s) => s.installPrompt);
  const dismissInstallPrompt = useAppStore((s) => s.dismissInstallPrompt);
  const setInstallDeferredEvent = useAppStore((s) => s.setInstallDeferredEvent);

  if (isStandalone() || installPrompt.dismissed) {
    return null;
  }

  const showIosHint = isIos() && !installPrompt.deferredEvent;

  const handleInstall = async () => {
    const event = installPrompt.deferredEvent;
    if (!event) return;
    await event.prompt();
    await event.userChoice;
    setInstallDeferredEvent(null);
    dismissInstallPrompt();
  };

  if (!installPrompt.deferredEvent && !showIosHint) {
    return null;
  }

  return (
    <div className={styles.banner} role="region" aria-label="Install app">
      <p className={styles.text}>
        {showIosHint && !installPrompt.deferredEvent
          ? "Install FanPulse: tap Share, then Add to Home Screen."
          : "Install FanPulse for a faster, app-like experience."}
      </p>
      <div className={styles.actions}>
        {installPrompt.deferredEvent ? (
          <Button type="button" variant="primary" onClick={() => void handleInstall()}>
            Install
          </Button>
        ) : null}
        <Button type="button" variant="ghost" onClick={dismissInstallPrompt}>
          Dismiss
        </Button>
      </div>
    </div>
  );
}
