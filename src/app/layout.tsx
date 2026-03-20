import type { Metadata } from "next";
import "./globals.css";
import Navigation from "@/components/Navigation";
import { Toaster } from "@/components/ui/sonner";

import Providers from "./providers";
import SessionProviders from "./SessionProviders";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import ConsoleFilter from "@/components/ConsoleFilter";

export const metadata: Metadata = {
  title: "DA Tracker",
  description:
    "Join the movement for government transparency and accountability. Recognizing exceptional government leaders and holding accountable those who discharge their duties wastefully, inefficiently, or recklessly.",
  keywords:
    "government, transparency, accountability, reform, California, public service",
  authors: [{ name: "DATracker" }],
  openGraph: {
    title: "DA Tracker",
    description:
      "Join the movement for government transparency and accountability.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      {/* Avoid next/font/google build-time fetch (e.g., blocked/airgapped builds). */}
      <body className="font-inter">
        <ConsoleFilter />
        <GoogleAnalytics />
        <SessionProviders>
          <Navigation />
          <Providers>{children}</Providers>
        </SessionProviders>
        <Toaster closeButton />
      </body>
    </html>
  );
}
