"use server";

import { getMatchById } from "@/services/worldCupApi";
import type { Match } from "@/types";

/**
 * Fetches the latest state of a single match, bypassing the ISR cache so
 * in-progress scores and status are current. Used for client-side polling
 * and the manual "Get latest" button on the match detail page.
 */
export async function getLiveMatch(id: string): Promise<Match | null> {
  const { data } = await getMatchById(id, "fresh");
  return data;
}
