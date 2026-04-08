import ToolDetailClient from "@/components/ToolDetailClient";

export const metadata = {
  title: "Sapericus | KI-Coaching Kompass",
  description: "Erfahren Sie mehr über Sapericus – Tiefgang und psychologische Reife durch KI-Begleitung.",
};

export default function SapericusPage() {
  const highlights = [
    {
      titel: "Vertikale Entwicklung",
      text: "",
    },
    {
      titel: "Wissenschaftliches Fundament",
      text: "",
    },
    {
      titel: "Maximale Sicherheit",
      text: "",
    },
  ];

  return (
    <ToolDetailClient
      toolName="Sapericus"
      heroHeadline="Sapericus – Tiefgang und psychologische Reife durch KI-Begleitung"
      heroEinleitung="Sapericus ist eine wissenschaftlich fundierte KI-Coaching-Lösung, die an den tieferliegenden Mustern unseres Handelns ansetzt. Sie basiert auf Modellen der Stufenentwicklung, um unbewusste Loyalitäten zu transformieren und wertebasiertes, souveränes Handeln zu ermöglichen."
      highlights={highlights}
      checks={[]}
      checkTitel="Der Bernd-Wiese-Check"
      checkTextLead="Sapericus ergänzt den Raum für Klarheit digital auf beeindruckende Weise. Die KI reagiert empathisch und fokussiert – fast so, als hätte sie eine Seele."
      ctaButtonText="Jetzt unverbindliche Demo vereinbaren"
    />
  );
}
