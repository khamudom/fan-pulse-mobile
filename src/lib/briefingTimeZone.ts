import { cookies } from "next/headers";

export const BRIEFING_TIMEZONE_COOKIE = "fp-briefing-tz";

export function isValidIanaTimeZone(timeZone: string): boolean {
  try {
    Intl.DateTimeFormat(undefined, { timeZone });
    return !!timeZone;
  } catch {
    return false;
  }
}

export async function getBriefingTimeZone(): Promise<string | null> {
  const cookieStore = await cookies();
  const timeZone = cookieStore.get(BRIEFING_TIMEZONE_COOKIE)?.value;
  if (!timeZone || !isValidIanaTimeZone(timeZone)) {
    return null;
  }
  return timeZone;
}

export async function setBriefingTimeZoneCookie(timeZone: string): Promise<boolean> {
  if (!isValidIanaTimeZone(timeZone)) {
    return false;
  }

  const cookieStore = await cookies();
  const current = cookieStore.get(BRIEFING_TIMEZONE_COOKIE)?.value;
  if (current === timeZone) {
    return false;
  }

  cookieStore.set(BRIEFING_TIMEZONE_COOKIE, timeZone, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
  });

  return true;
}
