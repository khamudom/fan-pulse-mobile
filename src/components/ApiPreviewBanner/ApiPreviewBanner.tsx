"use client";

import { useState } from "react";
import {
  Banner,
  BannerDescription,
  BannerTitle,
} from "@khamudom/lumen-ui-react";
import {
  isApiPreviewMode,
  USE_PROTOTYPE_DATA,
} from "@/config/dataSource";

export function ApiPreviewBanner() {
  const [dismissed, setDismissed] = useState(false);

  if (process.env.NODE_ENV !== "development" || !isApiPreviewMode || dismissed) {
    return null;
  }

  const notes = [
    !USE_PROTOTYPE_DATA && "prototype sections hidden",
  ].filter(Boolean);

  return (
    <Banner variant="warning" onDismiss={() => setDismissed(true)}>
      <BannerTitle>API preview mode</BannerTitle>
      {notes.length > 0 && (
        <BannerDescription>{notes.join(" · ")}</BannerDescription>
      )}
      <BannerDescription>
        Badges on each section show where data comes from — see the legend
        below. Toggle preview flags in <code>src/config/dataSource.ts</code>.
      </BannerDescription>
    </Banner>
  );
}
