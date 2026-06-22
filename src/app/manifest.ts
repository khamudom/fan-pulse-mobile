import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "World Cup FanPulse",
    short_name: "FanPulse",
    description:
      "Your companion experience for the FIFA World Cup 2026 — matches, predictions, and fan engagement.",
    start_url: "/",
    display: "standalone",
    background_color: "#081310",
    theme_color: "#081310",
    orientation: "portrait-primary",
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
