"use client";

import dynamic from "next/dynamic";

const ApiPreviewBanner = dynamic(
  () =>
    import("@/components/ApiPreviewBanner").then((mod) => mod.ApiPreviewBanner),
  { ssr: false },
);

export function DeferredApiPreviewBanner() {
  return <ApiPreviewBanner />;
}
