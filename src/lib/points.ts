export const POINT_VALUES = {
  daily_check_in: 10,
  prediction: 25,
  poll_vote: 5,
  challenge: 50,
} as const;

export type PointEventType = keyof typeof POINT_VALUES | string;

/** Level thresholds: level N requires N * 100 points */
export function computeLevel(points: number): number {
  return Math.max(1, Math.floor(points / 100) + 1);
}

export function computeAccuracy(correct: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((correct / total) * 1000) / 10;
}

export function getLevelTitle(level: number, favoriteCountry?: string | null): string {
  if (level >= 20) return `${favoriteCountry ?? "World Cup"} Super Fan`;
  if (level >= 10) return "Dedicated Supporter";
  if (level >= 5) return "Rising Fan";
  return "New Fan";
}

export function generateInviteCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}
