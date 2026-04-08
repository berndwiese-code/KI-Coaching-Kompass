import ToolDetailClient, { ToolDetailProps } from "@/components/ToolDetailClient";
import { getSeraia } from "@/sanity/lib/queries";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Seraia | KI-Coaching Kompass",
  description: "Erfahren Sie mehr über Seraia.ai – Das dialogische Betriebssystem für lebendige Organisationen.",
};

const fallback: ToolDetailProps = {
  toolName: "Seraia",
  heroHeadline: "Seraia.ai – Das dialogische Betriebssystem für lebendige Organisationen",
  heroEinleitung: "Seraia.ai ist keine bloße App, sondern eine Infrastruktur für das kollektive Denken und Handeln in Teams. Es verbindet sich mit den Nervenbahnen des Unternehmens, um Beziehungsthemen auf Basis des Living Organization Modells zu klären, ohne die Privatsphäre des Einzelnen zu opfern.",
  highlights: [
    { titel: "Kollektive Transparenz", text: "", popupText: "Hier kannst du mehr Details zu Kollektive Transparenz eintragen. Dieser Text erscheint im Popup." },
    { titel: "Echtes Beziehungs-Coaching", text: "", popupText: "Hier kannst du erläutern, wie Beziehungen effektiv orchestriert werden." },
    { titel: "Voll vernetzt", text: "", popupText: "Hier beschreibst du, wie sich das System in HR und Kalender einklinkt." }
  ],
  checkTitel: "Der Bernd-Wiese-Check",
  checkTextLead: "Ich empfehle Seraia, weil es den systemischen Gedanken ernst nimmt. Es macht Dynamiken besprechbar, indem es Informationen aus verschiedenen Quellen wie Kalendern und HR-Systemen zusammenführt.",
  ctaButtonText: "Jetzt unverbindliche Demo vereinbaren"
};

export default async function SeraiaPage() {
  const data = await getSeraia();
  const finalData = data?.toolName ? data : fallback;

  return (
    <ToolDetailClient {...finalData} />
  );
}
