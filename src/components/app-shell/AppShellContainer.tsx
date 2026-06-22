import { countIncomingRequests } from "@/actions/social";
import { AppShell } from "@/components/app-shell";
import { getAuthContext } from "@/lib/auth";
import type { ResolvedTheme } from "@/lib/theme";

type AppShellContainerProps = {
  resolvedTheme: ResolvedTheme;
  children: React.ReactNode;
};

export async function AppShellContainer({
  resolvedTheme,
  children,
}: AppShellContainerProps) {
  const { user, profile } = await getAuthContext();
  const incomingRequestCount = user ? await countIncomingRequests() : 0;

  return (
    <AppShell
      resolvedTheme={resolvedTheme}
      signedIn={Boolean(user)}
      displayName={profile?.display_name ?? user?.email?.split("@")[0]}
      incomingRequestCount={incomingRequestCount}
    >
      {children}
    </AppShell>
  );
}
