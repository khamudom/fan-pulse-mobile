import { NextResponse } from "next/server";
import { getMatches } from "@/services/worldCupApi";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const fresh = searchParams.get("fresh") === "1";
  const mode = fresh ? "fresh" : "cached";

  const result = await getMatches(mode);
  return NextResponse.json(result);
}
