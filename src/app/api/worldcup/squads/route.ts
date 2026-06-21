import { NextResponse, type NextRequest } from "next/server";
import { worldCupSquadsApiResponse } from "@/data/api/worldcup/squads";

function matchesQuery(value: string | undefined, query: string): boolean {
  return value?.toLowerCase().includes(query) ?? false;
}

function normalizePosition(value: string | undefined): string | undefined {
  if (!value) return undefined;
  if (value.startsWith("goal")) return "goalkeeper";
  if (value.startsWith("def")) return "defender";
  if (value.startsWith("mid")) return "midfielder";
  if (value.startsWith("for")) return "forward";
  return value;
}

export function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const group = searchParams.get("group")?.trim().toUpperCase();
  const team = searchParams.get("team")?.trim().toLowerCase();
  const position = normalizePosition(
    searchParams.get("position")?.trim().toLowerCase(),
  );
  const query = searchParams.get("q")?.trim().toLowerCase();

  let squads = worldCupSquadsApiResponse.squads;

  if (group) {
    squads = squads.filter((squad) => squad.group.toUpperCase() === group);
  }

  if (team) {
    squads = squads.filter(
      (squad) =>
        squad.id === team ||
        squad.team_name_en.toLowerCase() === team ||
        squad.team_name_en.toLowerCase().includes(team),
    );
  }

  if (position || query) {
    squads = squads
      .map((squad) => ({
        ...squad,
        players: squad.players.filter((player) => {
          const matchesPosition =
            !position || player.position.toLowerCase() === position;
          const matchesSearch =
            !query ||
            matchesQuery(player.name_en, query) ||
            matchesQuery(player.club_en, query) ||
            matchesQuery(player.team_name_en, query) ||
            matchesQuery(squad.coach_en, query) ||
            matchesQuery(squad.captain_en, query);

          return matchesPosition && matchesSearch;
        }),
      }))
      .filter((squad) => squad.players.length > 0);
  }

  const players = squads.flatMap((squad) => squad.players);

  return NextResponse.json({
    ...worldCupSquadsApiResponse,
    squads,
    players,
    count: {
      squads: squads.length,
      players: players.length,
    },
  });
}

