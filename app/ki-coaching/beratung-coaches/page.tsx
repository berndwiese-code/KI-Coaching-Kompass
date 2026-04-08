import { Metadata } from "next";
import BeratungCoachesClient from "@/components/BeratungCoachesClient";
import { getBeratung } from "@/sanity/lib/queries";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "KI-Coaching Beratung für Coaches",
  description:
    "Ich begleite Coaches dabei, KI-Tools sinnvoll und sicher in ihre Praxis zu integrieren. Bernd Wiese.",
  openGraph: {
    title: "KI-Coaching Beratung für Coaches · Bernd Wiese",
    description:
      "Die Praxis zukunftssicher aufstellen. Orientierung im KI-Tool-Dschungel für Coaches.",
    url: "https://ki-coaching-kompass.vercel.app/ki-coaching/beratung-coaches",
  },
};

export default async function BeratungCoachesPage() {
  const beratung = await getBeratung();
  return <BeratungCoachesClient beratung={beratung} />;
}
