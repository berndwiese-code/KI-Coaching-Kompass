import { Metadata } from "next";
import KontaktClient from "@/components/KontaktClient";

export const metadata: Metadata = {
  title: "Kontakt",
  description:
    "Treten Sie in Kontakt mit Bernd Wiese — KI-Coaching, Beratung und Workshops.",
  openGraph: {
    title: "Kontakt · KI-Coaching Kompass",
    description: "Treten Sie in Kontakt mit Bernd Wiese.",
    url: "https://ki-coaching-kompass.vercel.app/kontakt",
  },
};

export default function KontaktPage() {
  return <KontaktClient />;
}
