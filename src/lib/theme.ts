export const THEME_COOKIE_NAME = "fanpulse-theme";

export type ThemePreference = "light" | "dark" | "system";
export type ResolvedTheme = "light" | "dark";

const PREFERENCES: ThemePreference[] = ["light", "dark", "system"];

export function parseThemePreference(
  value: string | undefined
): ThemePreference | null {
  if (value && PREFERENCES.includes(value as ThemePreference)) {
    return value as ThemePreference;
  }
  return null;
}

/** Uses the Sec-CH-Prefers-Color-Scheme client hint when the browser sends it. */
export function prefersDarkFromHeaders(headers: Headers): boolean {
  const hint = headers.get("sec-ch-prefers-color-scheme");
  if (hint === "dark") return true;
  if (hint === "light") return false;
  return false;
}

export function resolveTheme(
  preference: ThemePreference,
  prefersDark: boolean
): ResolvedTheme {
  if (preference === "dark") return "dark";
  if (preference === "light") return "light";
  return prefersDark ? "dark" : "light";
}
