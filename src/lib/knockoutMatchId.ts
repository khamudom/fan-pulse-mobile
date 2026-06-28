/** API returns numeric ids like "73"; bracket defs use "M73". */
export function normalizeKnockoutMatchId(id: string): string {
  return id.replace(/^M/i, "").toUpperCase();
}

export function buildKnockoutMatchMap<T extends { id: string }>(
  matches: T[],
): Map<string, T> {
  return new Map(
    matches.map((match) => [normalizeKnockoutMatchId(match.id), match]),
  );
}
