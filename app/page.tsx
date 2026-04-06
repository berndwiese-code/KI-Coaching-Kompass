import type { Metadata } from "next";
import HomeClient from "@/components/HomeClient";
import {
  getStartseite,
  getTools,
  getArtikel,
  getTestimonials,
} from "@/sanity/lib/queries";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "KI-Coaching Kompass · Bernd Wiese",
  description:
    "Ich begleite Unternehmen, Coaches und Menschen beim bewussten Umgang mit KI — mit Methode, Präsenz und ohne Hype. Bernd Wiese, Staufen.",
  openGraph: {
    title: "KI-Coaching Kompass · Bernd Wiese",
    description:
      "Ich begleite Unternehmen, Coaches und Menschen beim bewussten Umgang mit KI — mit Methode, Präsenz und ohne Hype.",
    url: "https://ki-coaching-kompass.vercel.app",
    type: "website",
  },
};

export default async function Page() {
  const [startseite, tools, artikel, testimonials] = await Promise.all([
    getStartseite(),
    getTools(),
    getArtikel(),
    getTestimonials(),
  ]);

  return (
    <HomeClient
      startseite={startseite}
      tools={tools}
      artikel={artikel}
      testimonials={testimonials}
    />
  );
}
