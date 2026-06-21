"use server";

import { cookies } from "next/headers";
import {
  parseThemePreference,
  THEME_COOKIE_NAME,
  type ResolvedTheme,
} from "@/lib/theme";

const ONE_YEAR_SECONDS = 60 * 60 * 24 * 365;

export async function setThemePreference(theme: ResolvedTheme) {
  if (!parseThemePreference(theme)) {
    throw new Error("Invalid theme");
  }

  const cookieStore = await cookies();
  cookieStore.set(THEME_COOKIE_NAME, theme, {
    path: "/",
    maxAge: ONE_YEAR_SECONDS,
    sameSite: "lax",
  });
}
