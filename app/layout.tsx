import type { Metadata } from "next";
import { League_Spartan } from "next/font/google";

import { QueryProvider } from "@/components/providers/query-provider";

import "./globals.css";

// This font setup gives the whole app the same strong geometric voice
// that Checkit uses, while keeping the font self-hosted through Next.js.
const leagueSpartan = League_Spartan({
  display: "swap",
  subsets: ["latin"],
  variable: "--font-league-spartan",
});

// This metadata establishes the product identity early so every future route
// inherits a consistent app name and baseline description.
export const metadata: Metadata = {
  title: {
    default: "TradeLens",
    template: "%s | TradeLens",
  },
  description:
    "A performance-focused product intelligence explorer inspired by modern commerce discovery workflows.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${leagueSpartan.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        {/* This mounts the shared TanStack Query cache at the app shell so later
            enhancement hooks can reuse one client-side cache across routes. */}
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
