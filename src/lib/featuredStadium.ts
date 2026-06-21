import { FEATURED_STADIUM_ID } from "@/config/admin";
import type { Stadium } from "@/types";

export const FEATURED_STADIUM_COOKIE = "featured-stadium-id";

export function resolveFeaturedStadium(
  stadiums: Stadium[],
  preferredId?: string | null,
): Stadium | undefined {
  if (!stadiums.length) return undefined;

  const id = preferredId || FEATURED_STADIUM_ID;
  if (id) {
    const match = stadiums.find((s) => s.id === id);
    if (match) return match;
  }

  return (
    stadiums.find((s) => s.capacity && s.capacity >= 80_000) ?? stadiums[0]
  );
}

export async function getFeaturedStadiumIdFromCookies(): Promise<
  string | undefined
> {
  const { cookies } = await import("next/headers");
  const cookieStore = await cookies();
  return cookieStore.get(FEATURED_STADIUM_COOKIE)?.value;
}
