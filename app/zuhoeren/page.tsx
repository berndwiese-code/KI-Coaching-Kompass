import { Metadata } from "next";
import ZuhoerenClient from "@/components/ZuhoerenClient";
import { getZuhoeren } from "@/sanity/lib/queries";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Zuhören · KI-Coaching-Kompass",
  description:
    "Ein Raum, in dem du dich selbst wieder hörst. Zuhören als professionelle Praxis — und in Kombination mit KI-gestützter Reflexion.",
};

export default async function ZuhoerenPage() {
  const zuhoeren = await getZuhoeren();
  return <ZuhoerenClient zuhoeren={zuhoeren} />;
}
