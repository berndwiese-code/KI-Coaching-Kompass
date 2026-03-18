import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { draftMode } from "next/headers";
import { VisualEditing } from "next-sanity";
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
  return (
    <html lang="de">
      <body
        className={`${GeistSans.variable} ${GeistMono.variable} antialiased`}
      >
        {children}
        {(await draftMode()).isEnabled && <VisualEditing />}
      </body>
    </html>
  );
}
