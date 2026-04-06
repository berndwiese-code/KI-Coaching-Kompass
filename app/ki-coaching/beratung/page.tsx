import { Metadata } from "next";
import BeratungClient from "@/components/BeratungClient";
import { getBeratung } from "@/sanity/lib/queries";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Beratung · KI-Coaching-Kompass",
  description:
    "Beratung für Unternehmen bei der Einführung von KI-Coaching-Software und für Coaches bei der sinnvollen Nutzung von KI-Tools in der eigenen Praxis.",
};

export default async function BeratungPage() {
  const beratung = await getBeratung();
  return <BeratungClient beratung={beratung} />;
}
