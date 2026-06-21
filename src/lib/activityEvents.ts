import { createClient } from "@/lib/supabase/server";
import type { Json } from "@/types/database";

export type ActivityEventType = "nation" | "bracket" | "prediction";

export async function emitActivityEvent(
  userId: string,
  type: ActivityEventType,
  metadata: Json = {},
) {
  const supabase = await createClient();
  await supabase.from("activity_events").insert({
    user_id: userId,
    type,
    metadata,
  });
}
