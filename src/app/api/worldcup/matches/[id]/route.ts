import { NextResponse } from "next/server";
import { getMatchById } from "@/services/worldCupApi";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const { searchParams } = new URL(request.url);
  const fresh = searchParams.get("fresh") === "1";
  const mode = fresh ? "fresh" : "cached";

  const result = await getMatchById(id, mode);
  return NextResponse.json(result);
}
