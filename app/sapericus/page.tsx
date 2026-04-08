import ToolDetailClient, { ToolDetailProps } from "@/components/ToolDetailClient";
import { getSapericus } from "@/sanity/lib/queries";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Sapericus | KI-Coaching Kompass",
  description: "Erfahren Sie mehr über Sapericus – Tiefgang und psychologische Reife durch KI-Begleitung.",
};

const fallback: ToolDetailProps = {
  toolName: "Sapericus",
  heroHeadline: "Sapericus – Tiefgang und psychologische Reife durch KI-Begleitung",
  heroEinleitung: "Sapericus ist eine wissenschaftlich fundierte KI-Coaching-Lösung, die an den tieferliegenden Mustern unseres Handelns ansetzt. Sie basiert auf Modellen der Stufenentwicklung, um unbewusste Loyalitäten zu transformieren und wertebasiertes, souveränes Handeln zu ermöglichen.",
  highlights: [
    { titel: "Vertikale Entwicklung", text: "", popupText: "Eigener Text zur vertikalen Entwicklung – ein tieferer Einblick." },
    { titel: "Wissenschaftliches Fundament", text: "", popupText: "Führe hier die genutzten Modelle und Studien genauer aus." },
    { titel: "Maximale Sicherheit", text: "", popupText: "Erkläre hier, wie der Safe Space gewahrt bleibt." }
  ],
  checkTitel: "Der Bernd-Wiese-Check",
  checkTextLead: "Sapericus ergänzt den Raum für Klarheit digital auf beeindruckende Weise. Die KI reagiert empathisch und fokussiert – fast so, als hätte sie eine Seele.",
  ctaButtonText: "Jetzt unverbindliche Demo vereinbaren"
};

export default async function SapericusPage() {
  const data = await getSapericus();
  const finalData = data?.toolName ? data : fallback;

  return (
    <ToolDetailClient {...finalData} />
  );
}
