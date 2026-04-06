import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { draftMode } from "next/headers";
import { VisualEditing } from "next-sanity";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://ki-coaching-kompass.vercel.app"),
  title: {
    default: "KI-Coaching Kompass · Bernd Wiese",
    template: "%s | KI-Coaching Kompass",
  },
  description:
    "Ich begleite Unternehmen, Coaches und Menschen beim bewussten Umgang mit KI — mit Methode, Präsenz und ohne Hype. Bernd Wiese, Staufen.",
  openGraph: {
    siteName: "KI-Coaching Kompass",
    locale: "de_DE",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
  },
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
