import { Metadata } from "next";
import ZuhoerenClient from "@/components/ZuhoerenClient";
import { getZuhoeren } from "@/sanity/lib/queries";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Gehört werden — Tiefes Zuhören mit Bernd Wiese",
  description:
    "Manchmal braucht es jemanden, der einfach zuhört. Kein Programm, kein Tool — nur ein Gespräch, in dem du dich selbst hören kannst.",
  openGraph: {
    title: "Gehört werden — Tiefes Zuhören · Bernd Wiese",
    description:
      "Manchmal braucht es jemanden, der einfach zuhört. Ich biete Einzelgespräche mit echter Präsenz — in Staufen und online.",
    url: "https://ki-coaching-kompass.vercel.app/zuhoeren",
  },
};

export default async function ZuhoerenPage() {
  const zuhoeren = await getZuhoeren();
  return <ZuhoerenClient zuhoeren={zuhoeren} />;
}
