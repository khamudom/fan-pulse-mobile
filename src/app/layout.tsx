import type { Metadata, Viewport } from "next";
import { Suspense } from "react";
import { Archivo, Barlow_Condensed, Fraunces } from "next/font/google";
import { DeferredApiPreviewBanner } from "@/components/ApiPreviewBanner/DeferredApiPreviewBanner";
import { AppShellContainer } from "@/components/app-shell/AppShellContainer";
import { AuthModalProvider } from "@/components/AuthModal";
import { CheckInCelebrationContainer } from "@/components/CheckInCelebration";
import { ScrollToTop } from "@/components/layout/ScrollToTop";
import { InstallPrompt } from "@/components/navigation/InstallPrompt";
import { ThemeProvider } from "@/components/Theme";
import { getThemeState } from "@/lib/theme-request";
import { QueryProvider } from "@/queries/QueryProvider";
import "@khamudom/lumen-ui-react/styles.css";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
});

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
});

const barlowCondensed = Barlow_Condensed({
  variable: "--font-barlow-condensed",
  subsets: ["latin"],
  weight: ["600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "World Cup FanPulse",
    template: "%s | World Cup FanPulse",
  },
  description:
    "Your companion experience for the FIFA World Cup 2026 — matches, predictions, insights, and fan engagement.",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "FanPulse",
  },
  icons: {
    icon: [{ url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" }],
    apple: [{ url: "/icons/apple-touch-icon.png", sizes: "180x180" }],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#081310",
};

/** worldcup26.ir is hosted in/near the Middle East; run server fetches closer to it. */
export const preferredRegion = ["dub1", "bom1", "sin1", "cdg1", "iad1"];

/** /get/games can take 12s+ from US regions; allow headroom on Vercel. */
export const maxDuration = 60;

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { preference, resolvedTheme } = await getThemeState();
  const htmlClass = [
    fraunces.variable,
    archivo.variable,
    barlowCondensed.variable,
    resolvedTheme === "dark" ? "lumen-dark" : null,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <html
      lang="en"
      className={htmlClass}
      data-lumen-theme={resolvedTheme}
      data-scroll-behavior="smooth"
    >
      <body suppressHydrationWarning>
        <QueryProvider>
          <ThemeProvider preference={preference}>
            <AuthModalProvider>
              <Suspense fallback={null}>
                <ScrollToTop />
              </Suspense>
              <DeferredApiPreviewBanner />
              <Suspense fallback={null}>
                <CheckInCelebrationContainer />
              </Suspense>
              <AppShellContainer resolvedTheme={resolvedTheme}>
                {children}
              </AppShellContainer>
              <InstallPrompt />
            </AuthModalProvider>
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
