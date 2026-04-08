import ToolDetailClient from "@/components/ToolDetailClient";
import { getSapericus } from "@/sanity/lib/queries";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Sapericus | KI-Coaching Kompass",
  description: "Erfahren Sie mehr über Sapericus – Tiefgang und psychologische Reife durch KI-Begleitung.",
};

export default async function SapericusPage() {
  const data = await getSapericus();

  return (
    <ToolDetailClient {...data} />
  );
}
