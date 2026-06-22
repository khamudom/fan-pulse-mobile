import { NextResponse } from "next/server";
import { getGroups } from "@/services/worldCupApi";

export async function GET() {
  const result = await getGroups();
  return NextResponse.json(result);
}
