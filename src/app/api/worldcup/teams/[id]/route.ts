import { NextResponse } from "next/server";
import { getTeamById } from "@/services/worldCupApi";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const result = await getTeamById(id);
  return NextResponse.json(result);
}
