import { countIncomingRequests } from "@/actions/social";
import { getAuthContext } from "@/lib/auth";
import type { ResolvedTheme } from "@/lib/theme";
import { Header } from "./Header";

type HeaderContainerProps = {
  resolvedTheme: ResolvedTheme;
};

export async function HeaderContainer({ resolvedTheme }: HeaderContainerProps) {
  const { user, profile } = await getAuthContext();

  const incomingRequestCount = user ? await countIncomingRequests() : 0;

  return (
    <Header
      signedIn={Boolean(user)}
      displayName={profile?.display_name ?? user?.email?.split("@")[0]}
      resolvedTheme={resolvedTheme}
      incomingRequestCount={incomingRequestCount}
    />
  );
}
