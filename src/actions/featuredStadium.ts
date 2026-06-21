"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { ADMIN_MODE } from "@/config/admin";
import { FEATURED_STADIUM_COOKIE } from "@/lib/featuredStadium";

export async function setFeaturedStadium(stadiumId: string | null) {
  if (!ADMIN_MODE) return;

  const cookieStore = await cookies();

  if (stadiumId) {
    cookieStore.set(FEATURED_STADIUM_COOKIE, stadiumId, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
      sameSite: "lax",
    });
  } else {
    cookieStore.delete(FEATURED_STADIUM_COOKIE);
  }

  revalidatePath("/", "layout");
}
