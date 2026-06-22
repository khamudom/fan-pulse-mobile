import { NextResponse } from "next/server";
import { getStadiums } from "@/services/worldCupApi";

export async function GET() {
  const result = await getStadiums();
  return NextResponse.json(result);
}
