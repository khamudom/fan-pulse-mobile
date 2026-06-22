import withSerwistInit from "@serwist/next";
import type { NextConfig } from "next";
import path from "path";
import { fileURLToPath } from "url";

const projectRoot = path.dirname(fileURLToPath(import.meta.url));

const withSerwist = withSerwistInit({
  swSrc: "src/sw.ts",
  swDest: "public/sw.js",
  disable: process.env.NODE_ENV === "development",
});

const nextConfig: NextConfig = {
  devIndicators: false,
  transpilePackages: ["@khamudom/lumen-ui-react"],
  experimental: {
    optimizePackageImports: ["@khamudom/lumen-ui-react"],
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "flagcdn.com",
        pathname: "/**",
      },
    ],
  },
  turbopack: {
    root: projectRoot,
  },
};

export default withSerwist(nextConfig);
