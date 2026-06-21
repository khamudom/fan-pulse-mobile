"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { getSessionUser } from "@/lib/auth";
import { normalizeBracketPayload } from "@/lib/bracket";
import {
  generateInviteCode,
  validateUsername,
  type ConnectionRelationship,
  type FeedItem,
  type FriendRequestSummary,
  type FriendSummary,
  type LeaderboardEntry,
  type UserSearchResult,
} from "@/lib/social";
import { getMatches } from "@/services/worldCupApi";

export type SocialActionState = {
  error?: string;
  success?: string;
};

function displayLabel(
  username: string | null,
  displayName: string | null,
): string {
  return displayName ?? username ?? "Fan";
}

async function getRequestOrigin(): Promise<string> {
  const headerStore = await headers();
  const host =
    headerStore.get("x-forwarded-host") ?? headerStore.get("host");
  if (!host) return "http://localhost:3000";
  const protocol =
    headerStore.get("x-forwarded-proto") ??
    (host.includes("localhost") ? "http" : "https");
  return `${protocol}://${host}`;
}

export async function setUsername(value: string): Promise<SocialActionState> {
  const user = await getSessionUser();
  if (!user) return { error: "Not signed in." };

  const validationError = validateUsername(value);
  if (validationError) return { error: validationError };

  const username = value.trim().toLowerCase();
  const supabase = await createClient();

  const { data: existing } = await supabase
    .from("profiles")
    .select("id")
    .eq("username", username)
    .neq("id", user.id)
    .maybeSingle();

  if (existing) return { error: "Username is already taken." };

  const { error } = await supabase
    .from("profiles")
    .update({ username, updated_at: new Date().toISOString() })
    .eq("id", user.id);

  if (error) return { error: error.message };

  revalidatePath("/", "layout");
  revalidatePath("/friends");
  revalidatePath("/profile");
  return { success: "Username saved." };
}

export async function searchUsers(query: string) {
  const user = await getSessionUser();
  if (!user)
    return { error: "Not signed in.", results: [] as UserSearchResult[] };

  const trimmed = query.trim();
  if (trimmed.length < 2) {
    return {
      error: "Enter at least 2 characters.",
      results: [] as UserSearchResult[],
    };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.rpc("search_profiles", { q: trimmed });

  if (error) return { error: error.message, results: [] as UserSearchResult[] };

  const rows = (data ?? []).filter((row) => row.id !== user.id);

  // Look up any existing connection between the current user and each result so
  // the UI can show the correct action (Add / Accept / Sent / Friends).
  const { data: connections } = await supabase
    .from("connections")
    .select("id, requester_id, addressee_id, status")
    .or(`requester_id.eq.${user.id},addressee_id.eq.${user.id}`);

  const relationByUserId = new Map<
    string,
    { relationship: ConnectionRelationship; connectionId: string | null }
  >();

  for (const connection of connections ?? []) {
    const otherId =
      connection.requester_id === user.id
        ? connection.addressee_id
        : connection.requester_id;

    if (connection.status === "accepted") {
      relationByUserId.set(otherId, {
        relationship: "friends",
        connectionId: connection.id,
      });
    } else if (connection.status === "pending") {
      const isOutgoing = connection.requester_id === user.id;
      relationByUserId.set(otherId, {
        relationship: isOutgoing ? "outgoing_pending" : "incoming_pending",
        connectionId: connection.id,
      });
    }
  }

  const results: UserSearchResult[] = rows.map((row) => {
    const relation = relationByUserId.get(row.id);
    return {
      id: row.id,
      username: row.username,
      displayName: row.display_name,
      favoriteCountry: row.favorite_country,
      relationship: relation?.relationship ?? "none",
      connectionId: relation?.connectionId ?? null,
    };
  });

  return { results };
}

export async function createInviteLink(): Promise<
  { url: string } | { error: string }
> {
  const user = await getSessionUser();
  if (!user) return { error: "Not signed in." };

  const supabase = await createClient();
  const code = generateInviteCode();
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 30);

  const { error } = await supabase.from("connection_invites").insert({
    code,
    owner_id: user.id,
    expires_at: expiresAt.toISOString(),
  });

  if (error) return { error: error.message };

  const origin = await getRequestOrigin();
  return { url: `${origin}/connect/${code}` };
}

export async function redeemInvite(
  code: string,
): Promise<{ success?: boolean; error?: string }> {
  const user = await getSessionUser();
  if (!user) return { error: "Not signed in." };

  const supabase = await createClient();
  const { data, error } = await supabase.rpc("redeem_invite", {
    p_code: code.trim(),
  });

  if (error) return { error: error.message };

  const result = data as { success?: boolean; error?: string };
  if (result.error) return { error: result.error };

  revalidatePath("/friends");
  return { success: true };
}

export async function sendFriendRequest(
  targetUserId: string,
): Promise<SocialActionState> {
  const user = await getSessionUser();
  if (!user) return { error: "Not signed in." };
  if (targetUserId === user.id) return { error: "You cannot add yourself." };

  const supabase = await createClient();

  const { data: reverse } = await supabase
    .from("connections")
    .select("id, status")
    .eq("requester_id", targetUserId)
    .eq("addressee_id", user.id)
    .maybeSingle();

  if (reverse?.status === "pending") {
    const { error } = await supabase
      .from("connections")
      .update({ status: "accepted", updated_at: new Date().toISOString() })
      .eq("id", reverse.id);
    if (error) return { error: error.message };
    revalidatePath("/friends");
    return { success: "You're now connected!" };
  }

  if (reverse?.status === "accepted") {
    return { error: "You're already friends." };
  }

  const { data: existing } = await supabase
    .from("connections")
    .select("id, status")
    .eq("requester_id", user.id)
    .eq("addressee_id", targetUserId)
    .maybeSingle();

  if (existing?.status === "accepted") {
    return { error: "You're already friends." };
  }
  if (existing?.status === "pending") {
    return { error: "Friend request already sent." };
  }

  const { error } = await supabase.from("connections").insert({
    requester_id: user.id,
    addressee_id: targetUserId,
    status: "pending",
  });

  if (error) return { error: error.message };

  revalidatePath("/friends");
  return { success: "Friend request sent." };
}

export async function respondToFriendRequest(
  connectionId: string,
  accept: boolean,
): Promise<SocialActionState> {
  const user = await getSessionUser();
  if (!user) return { error: "Not signed in." };

  const supabase = await createClient();
  const { data: connection } = await supabase
    .from("connections")
    .select("*")
    .eq("id", connectionId)
    .eq("addressee_id", user.id)
    .eq("status", "pending")
    .maybeSingle();

  if (!connection) return { error: "Request not found." };

  const { error } = await supabase
    .from("connections")
    .update({
      status: accept ? "accepted" : "declined",
      updated_at: new Date().toISOString(),
    })
    .eq("id", connectionId);

  if (error) return { error: error.message };

  revalidatePath("/friends");
  return { success: accept ? "Friend request accepted." : "Request declined." };
}

export async function removeConnection(
  connectionId: string,
): Promise<SocialActionState> {
  const user = await getSessionUser();
  if (!user) return { error: "Not signed in." };

  const supabase = await createClient();
  const { error } = await supabase
    .from("connections")
    .delete()
    .eq("id", connectionId)
    .or(`requester_id.eq.${user.id},addressee_id.eq.${user.id}`);

  if (error) return { error: error.message };

  revalidatePath("/friends");
  return { success: "Connection removed." };
}

async function loadProfileMap(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userIds: string[],
) {
  if (userIds.length === 0) return new Map<string, {
    username: string | null;
    display_name: string | null;
    favorite_country: string | null;
  }>();

  const { data } = await supabase
    .from("profiles")
    .select("id, username, display_name, favorite_country")
    .in("id", userIds);

  return new Map(
    (data ?? []).map((p) => [p.id, p]),
  );
}

export async function listFriends(): Promise<FriendSummary[]> {
  const user = await getSessionUser();
  if (!user) return [];

  const supabase = await createClient();
  const { data: connections } = await supabase
    .from("connections")
    .select("*")
    .eq("status", "accepted")
    .or(`requester_id.eq.${user.id},addressee_id.eq.${user.id}`);

  if (!connections?.length) return [];

  const friendIds = connections.map((c) =>
    c.requester_id === user.id ? c.addressee_id : c.requester_id,
  );
  const profileMap = await loadProfileMap(supabase, friendIds);

  return connections.map((c) => {
    const friendId =
      c.requester_id === user.id ? c.addressee_id : c.requester_id;
    const profile = profileMap.get(friendId);
    return {
      id: friendId,
      username: profile?.username ?? null,
      displayName: profile?.display_name ?? null,
      favoriteCountry: profile?.favorite_country ?? null,
      connectionId: c.id,
    };
  });
}

export async function listIncomingRequests(): Promise<FriendRequestSummary[]> {
  const user = await getSessionUser();
  if (!user) return [];

  const supabase = await createClient();
  const { data: connections } = await supabase
    .from("connections")
    .select("*")
    .eq("addressee_id", user.id)
    .eq("status", "pending")
    .order("created_at", { ascending: false });

  if (!connections?.length) return [];

  const requesterIds = connections.map((c) => c.requester_id);
  const profileMap = await loadProfileMap(supabase, requesterIds);

  return connections.map((c) => {
    const profile = profileMap.get(c.requester_id);
    return {
      id: c.id,
      userId: c.requester_id,
      username: profile?.username ?? null,
      displayName: profile?.display_name ?? null,
      favoriteCountry: profile?.favorite_country ?? null,
      createdAt: c.created_at,
    };
  });
}

export async function countIncomingRequests(): Promise<number> {
  const user = await getSessionUser();
  if (!user) return 0;

  const supabase = await createClient();
  const { count } = await supabase
    .from("connections")
    .select("id", { count: "exact", head: true })
    .eq("addressee_id", user.id)
    .eq("status", "pending");

  return count ?? 0;
}

export async function listOutgoingRequests(): Promise<FriendRequestSummary[]> {
  const user = await getSessionUser();
  if (!user) return [];

  const supabase = await createClient();
  const { data: connections } = await supabase
    .from("connections")
    .select("*")
    .eq("requester_id", user.id)
    .eq("status", "pending")
    .order("created_at", { ascending: false });

  if (!connections?.length) return [];

  const addresseeIds = connections.map((c) => c.addressee_id);
  const profileMap = await loadProfileMap(supabase, addresseeIds);

  return connections.map((c) => {
    const profile = profileMap.get(c.addressee_id);
    return {
      id: c.id,
      userId: c.addressee_id,
      username: profile?.username ?? null,
      displayName: profile?.display_name ?? null,
      favoriteCountry: profile?.favorite_country ?? null,
      createdAt: c.created_at,
    };
  });
}

export async function getFriendLeaderboard(): Promise<LeaderboardEntry[]> {
  const user = await getSessionUser();
  if (!user) return [];

  const friends = await listFriends();
  const allIds = [user.id, ...friends.map((f) => f.id)];

  const supabase = await createClient();
  const [profileMap, { data: statsRows }] = await Promise.all([
    loadProfileMap(supabase, allIds),
    supabase.from("user_stats").select("*").in("user_id", allIds),
  ]);

  const statsMap = new Map(
    (statsRows ?? []).map((s) => [s.user_id, s]),
  );

  const entries: LeaderboardEntry[] = allIds.map((userId) => {
    const profile = profileMap.get(userId);
    const stats = statsMap.get(userId);
    return {
      userId,
      username: profile?.username ?? null,
      displayName: profile?.display_name ?? null,
      favoriteCountry: profile?.favorite_country ?? null,
      points: stats?.points ?? 0,
      level: stats?.level ?? 1,
      predictionAccuracy: Number(stats?.prediction_accuracy ?? 0),
      isSelf: userId === user.id,
      rank: 0,
    };
  });

  entries.sort((a, b) => b.points - a.points);
  entries.forEach((entry, index) => {
    entry.rank = index + 1;
  });

  return entries;
}

function formatFeedMessage(
  type: "nation" | "bracket" | "prediction",
  name: string,
  metadata: Record<string, unknown>,
): string {
  switch (type) {
    case "nation":
      return `${name} is standing behind ${metadata.country ?? "their nation"}`;
    case "bracket":
      return `${name} saved their bracket${metadata.championTeamName ? `: ${metadata.championTeamName} champions` : ""}`;
    case "prediction":
      return `${name} predicted ${metadata.homeTeam ?? "Home"} ${metadata.predictedHome ?? "?"}–${metadata.predictedAway ?? "?"} ${metadata.awayTeam ?? "Away"}`;
    default:
      return `${name} updated their picks`;
  }
}

export async function getFriendFeed(limit = 30): Promise<FeedItem[]> {
  const user = await getSessionUser();
  if (!user) return [];

  const friends = await listFriends();
  const feedUserIds = [user.id, ...friends.map((f) => f.id)];

  const supabase = await createClient();
  const { data: events } = await supabase
    .from("activity_events")
    .select("*")
    .in("user_id", feedUserIds)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (!events?.length) return [];

  const profileMap = await loadProfileMap(
    supabase,
    [...new Set(events.map((e) => e.user_id))],
  );

  const matchesResult = await getMatches();
  const matchMap = new Map(
    (matchesResult.data ?? []).map((m) => [m.id, m]),
  );

  return events.map((event) => {
    const profile = profileMap.get(event.user_id);
    const name = displayLabel(
      profile?.username ?? null,
      profile?.display_name ?? null,
    );
    const metadata = (event.metadata ?? {}) as Record<string, unknown>;

    if (event.type === "prediction" && metadata.matchId) {
      const match = matchMap.get(String(metadata.matchId));
      if (match) {
        metadata.homeTeam = match.homeTeam.name;
        metadata.awayTeam = match.awayTeam.name;
      }
    }

    return {
      id: event.id,
      userId: event.user_id,
      username: profile?.username ?? null,
      displayName: profile?.display_name ?? null,
      type: event.type,
      metadata,
      createdAt: event.created_at,
      message: formatFeedMessage(event.type, name, metadata),
    };
  });
}

export type FriendProfileData = {
  id: string;
  username: string | null;
  displayName: string | null;
  favoriteCountry: string | null;
  secondaryCountry: string | null;
  stats: {
    points: number;
    level: number;
    predictionAccuracy: number;
  } | null;
  championTeamName: string | null;
  recentPredictions: {
    matchId: string;
    homeTeam: string;
    awayTeam: string;
    predictedHome: number;
    predictedAway: number;
    actualHome: number | null;
    actualAway: number | null;
    isFinished: boolean;
    isCorrect: boolean | null;
  }[];
  isFriend: boolean;
};

export async function getFriendProfile(
  friendUserId: string,
): Promise<FriendProfileData | null> {
  const user = await getSessionUser();
  if (!user) return null;

  const supabase = await createClient();

  const { data: connection } = await supabase
    .from("connections")
    .select("id")
    .eq("status", "accepted")
    .or(
      `and(requester_id.eq.${user.id},addressee_id.eq.${friendUserId}),and(requester_id.eq.${friendUserId},addressee_id.eq.${user.id})`,
    )
    .maybeSingle();

  const isSelf = friendUserId === user.id;
  if (!isSelf && !connection) return null;

  const [{ data: profile }, { data: stats }, { data: bracket }] =
    await Promise.all([
      supabase.from("profiles").select("*").eq("id", friendUserId).maybeSingle(),
      supabase
        .from("user_stats")
        .select("*")
        .eq("user_id", friendUserId)
        .maybeSingle(),
      supabase
        .from("bracket_predictions")
        .select("payload")
        .eq("user_id", friendUserId)
        .maybeSingle(),
    ]);

  if (!profile) return null;

  const { data: predictions } = await supabase
    .from("predictions")
    .select("*")
    .eq("user_id", friendUserId)
    .order("created_at", { ascending: false })
    .limit(10);

  const matchesResult = await getMatches();
  const matchMap = new Map(
    (matchesResult.data ?? []).map((m) => [m.id, m]),
  );

  const bracketPayload = bracket?.payload
    ? normalizeBracketPayload(bracket.payload)
    : null;

  return {
    id: profile.id,
    username: profile.username,
    displayName: profile.display_name,
    favoriteCountry: profile.favorite_country,
    secondaryCountry: profile.secondary_country,
    stats: stats
      ? {
          points: stats.points,
          level: stats.level,
          predictionAccuracy: Number(stats.prediction_accuracy),
        }
      : null,
    championTeamName: bracketPayload?.championTeamName ?? null,
    recentPredictions: (predictions ?? []).map((p) => {
      const match = matchMap.get(p.match_id);
      const isFinished = match?.status === "finished";
      const isCorrect = isFinished
        ? p.predicted_home === match.homeScore &&
          p.predicted_away === match.awayScore
        : null;

      return {
        matchId: p.match_id,
        homeTeam: match?.homeTeam.name ?? "Home",
        awayTeam: match?.awayTeam.name ?? "Away",
        predictedHome: p.predicted_home,
        predictedAway: p.predicted_away,
        actualHome: isFinished ? match.homeScore : null,
        actualAway: isFinished ? match.awayScore : null,
        isFinished,
        isCorrect,
      };
    }),
    isFriend: Boolean(connection) || isSelf,
  };
}

export async function isFriendWith(userId: string): Promise<boolean> {
  const user = await getSessionUser();
  if (!user || userId === user.id) return userId === user?.id;

  const supabase = await createClient();
  const { data } = await supabase.rpc("are_friends", {
    a: user.id,
    b: userId,
  });

  return Boolean(data);
}
