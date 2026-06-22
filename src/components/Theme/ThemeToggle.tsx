"use client";

import { useInvalidateAndRefresh } from "@/hooks/useInvalidateAndRefresh";
import { useTransition } from "react";
import { Button } from "@khamudom/lumen-ui-react";
import { setThemePreference } from "@/actions/theme";
import type { ResolvedTheme } from "@/lib/theme";
import styles from "./ThemeToggle.module.css";

type ThemeToggleProps = {
  resolvedTheme: ResolvedTheme;
};

export function ThemeToggle({ resolvedTheme }: ThemeToggleProps) {
  const invalidateAndRefresh = useInvalidateAndRefresh();
  const [isPending, startTransition] = useTransition();
  const isDark = resolvedTheme === "dark";

  function handleToggle() {
    const next: ResolvedTheme = isDark ? "light" : "dark";
    startTransition(async () => {
      await setThemePreference(next);
      invalidateAndRefresh();
    });
  }

  return (
    <Button
      type="button"
      variant="ghost"
      className={styles.toggle}
      onClick={handleToggle}
      loading={isPending}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Light mode" : "Dark mode"}
    >
      <span className={styles.icon} aria-hidden="true">
        {isDark ? "☀" : "☾"}
      </span>
      <span className={styles.label}>{isDark ? "Light" : "Dark"}</span>
    </Button>
  );
}
