export type RouteClass = "tab" | "detail" | "auth" | "hidden";

export type TabId =
  | "home"
  | "matches"
  | "teams"
  | "stadiums"
  | "bracket"
  | "profile";

export interface TabConfig {
  id: TabId;
  href: string;
  label: string;
  requiresAuth?: boolean;
}

export const TAB_ITEMS: TabConfig[] = [
  { id: "home", href: "/", label: "Home" },
  { id: "matches", href: "/matches", label: "Matches" },
  { id: "teams", href: "/teams", label: "Teams" },
  { id: "stadiums", href: "/stadiums", label: "Stadiums" },
  { id: "bracket", href: "/predictor", label: "Bracket" },
  { id: "profile", href: "/profile", label: "Profile", requiresAuth: true },
];

const TAB_HREFS = new Set(TAB_ITEMS.map((t) => t.href));

const DETAIL_ROUTE_PATTERNS: Array<{ pattern: RegExp; title: string }> = [
  { pattern: /^\/matches\/[^/]+$/, title: "Match" },
  { pattern: /^\/teams\/[^/]+$/, title: "Team" },
  { pattern: /^\/friends\/[^/]+$/, title: "Friend" },
  { pattern: /^\/friends$/, title: "Friends" },
  { pattern: /^\/my-world-cup$/, title: "My World Cup" },
  { pattern: /^\/story$/, title: "Story" },
];

const AUTH_ROUTES = new Set(["/login", "/login/reset-password"]);

const HIDDEN_ROUTES = new Set(["/connect"]);

export function getRouteClass(pathname: string): RouteClass {
  if (AUTH_ROUTES.has(pathname) || pathname.startsWith("/connect/")) {
    return "auth";
  }
  if (TAB_HREFS.has(pathname)) {
    return "tab";
  }
  if (DETAIL_ROUTE_PATTERNS.some(({ pattern }) => pattern.test(pathname))) {
    return "detail";
  }
  if (HIDDEN_ROUTES.has(pathname)) {
    return "hidden";
  }
  return "detail";
}

export function getTabIdForPath(pathname: string): TabId | null {
  const tab = TAB_ITEMS.find((t) => t.href === pathname);
  return tab?.id ?? null;
}

export function getDetailTitle(pathname: string): string {
  const match = DETAIL_ROUTE_PATTERNS.find(({ pattern }) => pattern.test(pathname));
  return match?.title ?? "FanPulse";
}

export function shouldShowBottomTabs(pathname: string): boolean {
  const routeClass = getRouteClass(pathname);
  return routeClass === "tab" || routeClass === "detail";
}

export function shouldShowBackButton(pathname: string): boolean {
  return getRouteClass(pathname) === "detail";
}
