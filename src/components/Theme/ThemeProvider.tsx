"use client";

import { ThemeProvider as LumenThemeProvider } from "@khamudom/lumen-ui-react";
import type { ThemePreference } from "@/lib/theme";

type ThemeProviderProps = {
  children: React.ReactNode;
  preference: ThemePreference;
};

export function ThemeProvider({ children, preference }: ThemeProviderProps) {
  return (
    <LumenThemeProvider
      theme={preference}
      storageKey={false}
      enableGlobalTheme={false}
    >
      {children}
    </LumenThemeProvider>
  );
}
