import ToolDetailClient from "@/components/ToolDetailClient";
import { getSeraia } from "@/sanity/lib/queries";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Seraia | KI-Coaching Kompass",
  description: "Erfahren Sie mehr über Seraia.ai – Das dialogische Betriebssystem für lebendige Organisationen.",
};

export default async function SeraiaPage() {
  const data = await getSeraia();

  return (
    <ToolDetailClient {...data} />
  );
}
