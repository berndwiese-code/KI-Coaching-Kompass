import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { SanityLive } from "@/sanity/lib/live";
import "./globals.css";

export const metadata: Metadata = {
  title: "KI Coaching Kompass",
  description: "Orientierung für Menschen, die KI zur persönlichen Reflexion nutzen.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de">
      <body
        className={`${GeistSans.variable} ${GeistMono.variable} antialiased`}
      >
        {children}
        {/* Keeps all sanityFetch calls live-updated via Sanity Content Lake */}
        <SanityLive />
      </body>
    </html>
  );
}
