import { NextResponse } from "next/server";
import { getTeams } from "@/services/worldCupApi";

export async function GET() {
  const result = await getTeams();
  return NextResponse.json(result);
}
