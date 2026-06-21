import { redirect } from "next/navigation";
import { redeemInvite } from "@/actions/social";
import { getSessionUser } from "@/lib/auth";

export default async function ConnectPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  const user = await getSessionUser();

  if (!user) {
    redirect(`/login?next=${encodeURIComponent(`/connect/${code}`)}`);
  }

  const result = await redeemInvite(code);

  if (result.error) {
    redirect(`/friends?error=${encodeURIComponent(result.error)}`);
  }

  redirect("/friends?connected=1");
}
