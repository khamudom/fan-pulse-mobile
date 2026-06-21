import { type NextRequest } from "next/server";
import { completeAuthRedirect } from "@/lib/supabase/route-handler";

export async function GET(request: NextRequest) {
  return completeAuthRedirect(request, "/login/reset-password");
}
