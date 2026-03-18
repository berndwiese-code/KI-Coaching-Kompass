import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { draftMode } from "next/headers";
import { VisualEditing } from "next-sanity";
import { SanityLive } from "@/sanity/lib/live";
import "./globals.css";

export const metadata: Metadata = {
  title: "KI Coaching Kompass",
  description: "Orientierung für Menschen, die KI zur persönlichen Reflexion nutzen.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const isDraftMode = (await draftMode()).isEnabled;

  return (
    <html lang="de">
      <body
        className={`${GeistSans.variable} ${GeistMono.variable} antialiased`}
      >
        {children}
        {/* Keeps all sanityFetch calls in the app live-updated */}
        <SanityLive />
        {/* Visual Editing overlays — only active when Sanity Studio opens the site in Draft Mode */}
        {isDraftMode && <VisualEditing />}
      </body>
    </html>
  );
}
