const USERNAME_PATTERN = /^[a-zA-Z0-9_]{3,20}$/;

export function validateUsername(value: string): string | null {
  const trimmed = value.trim();
  if (!trimmed) return "Username is required.";
  if (trimmed.length < 3) return "Username must be at least 3 characters.";
  if (trimmed.length > 20) return "Username must be 20 characters or fewer.";
  if (!USERNAME_PATTERN.test(trimmed)) {
    return "Username can only contain letters, numbers, and underscores.";
  }
  return null;
}

export function generateInviteCode(): string {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let code = "";
  for (let i = 0; i < 10; i += 1) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

export type FriendSummary = {
  id: string;
  username: string | null;
  displayName: string | null;
  favoriteCountry: string | null;
  connectionId: string;
};

export type ConnectionRelationship =
  | "none"
  | "friends"
  | "outgoing_pending"
  | "incoming_pending";

export type UserSearchResult = {
  id: string;
  username: string | null;
  displayName: string | null;
  favoriteCountry: string | null;
  relationship: ConnectionRelationship;
  /** Set when there is a pending request, so it can be accepted or cancelled. */
  connectionId: string | null;
};

export type FriendRequestSummary = {
  id: string;
  userId: string;
  username: string | null;
  displayName: string | null;
  favoriteCountry: string | null;
  createdAt: string;
};

export type LeaderboardEntry = {
  userId: string;
  username: string | null;
  displayName: string | null;
  favoriteCountry: string | null;
  points: number;
  level: number;
  predictionAccuracy: number;
  isSelf: boolean;
  rank: number;
};

export type FeedItem = {
  id: string;
  userId: string;
  username: string | null;
  displayName: string | null;
  type: "nation" | "bracket" | "prediction";
  metadata: Record<string, unknown>;
  createdAt: string;
  message: string;
};
