"use client";

import { usePathname } from "next/navigation";
import { useLayoutEffect } from "react";
import { getRouteClass, getTabIdForPath } from "@/config/navigation";
import { useAppStore } from "@/stores/appStore";

export function ScrollToTop() {
  const pathname = usePathname();
  const getTabScroll = useAppStore((s) => s.getTabScroll);

  useLayoutEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.has("section")) return;
    if (window.location.hash) return;

    const routeClass = getRouteClass(pathname);
    if (routeClass === "tab") {
      const tabId = getTabIdForPath(pathname);
      if (tabId) {
        const saved = getTabScroll(tabId);
        window.scrollTo({ top: saved, left: 0, behavior: "auto" });
        return;
      }
    }

    if (routeClass === "detail") {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    }
  }, [pathname, getTabScroll]);

  return null;
}
