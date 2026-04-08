import ToolDetailClient from "@/components/ToolDetailClient";

export const metadata = {
  title: "Seraia | KI-Coaching Kompass",
  description: "Erfahren Sie mehr über Seraia.ai – Das dialogische Betriebssystem für lebendige Organisationen.",
};

export default function SeraiaPage() {
  const highlights = [
    {
      titel: "Kollektive Transparenz",
      text: "",
    },
    {
      titel: "Echtes Beziehungs-Coaching",
      text: "",
    },
    {
      titel: "Voll vernetzt",
      text: "",
    },
  ];

  return (
    <ToolDetailClient
      toolName="Seraia"
      heroHeadline="Seraia.ai – Das dialogische Betriebssystem für lebendige Organisationen"
      heroEinleitung="Seraia.ai ist keine bloße App, sondern eine Infrastruktur für das kollektive Denken und Handeln in Teams. Es verbindet sich mit den Nervenbahnen des Unternehmens, um Beziehungsthemen auf Basis des Living Organization Modells zu klären, ohne die Privatsphäre des Einzelnen zu opfern."
      highlights={highlights}
      checks={[]}
      checkTitel="Der Bernd-Wiese-Check"
      checkTextLead="Ich empfehle Seraia, weil es den systemischen Gedanken ernst nimmt. Es macht Dynamiken besprechbar, indem es Informationen aus verschiedenen Quellen wie Kalendern und HR-Systemen zusammenführt."
      ctaButtonText="Jetzt unverbindliche Demo vereinbaren"
    />
  );
}
