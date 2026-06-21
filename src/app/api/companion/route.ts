import { NextResponse } from "next/server";
import { getAuthContext } from "@/lib/auth";
import { streamCompanionReply } from "@/lib/ai/companion";
import { getMatches } from "@/services/worldCupApi";

export async function POST(request: Request) {
  const { user, profile } = await getAuthContext();
  if (!user) {
    return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  }

  let body: { message?: string; matchId?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const message = body.message?.trim();
  if (!message) {
    return NextResponse.json({ error: "Message is required." }, { status: 400 });
  }

  const { data: matches } = await getMatches();
  const focusMatch = body.matchId
    ? (matches.find((m) => m.id === body.matchId) ?? null)
    : null;
  const stream = await streamCompanionReply({
    message,
    profile,
    matches,
    userName: profile?.display_name ?? undefined,
    focusMatch,
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-cache",
    },
  });
}
