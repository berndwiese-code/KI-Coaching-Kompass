import type { Metadata } from "next";
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
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de">
      <body>
        {children}
        {(await draftMode()).isEnabled && <VisualEditing />}
      </body>
    </html>
  );
}
