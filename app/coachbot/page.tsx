import ToolDetailClient from "@/components/ToolDetailClient";

export const metadata = {
  title: "CoachBot | KI-Coaching Kompass",
  description: "Erfahren Sie mehr über CoachBot.ai – Deine Methodik als skalierbarer KI-Agent.",
};

export default function CoachbotPage() {
  const highlights = [
    {
      titel: "Deine Stimme",
      text: "",
    },
    {
      titel: "Eigene Monetarisierung",
      text: "",
    },
    {
      titel: "Harte Leitplanken",
      text: "",
    },
  ];

  return (
    <ToolDetailClient
      toolName="CoachBot"
      heroHeadline="CoachBot.ai – Deine Methodik als skalierbarer KI-Agent"
      heroEinleitung="CoachBot.ai ist die Infrastruktur, mit der du dein geistiges Eigentum in verantwortungsvolle KI-Agenten verwandelst. Erstelle White-Label-Bots, die genau wie deine Methodik denken und sprechen, um Coaching auf jeder Ebene der Organisation zugänglich zu machen."
      highlights={highlights}
      checks={[]}
      checkTitel="Der Bernd-Wiese-Check"
      checkTextLead="Ich schätze CoachBot als digitale Werkbank, die das Skalierungsproblem für Coaching-Boutiquen löst. Du behältst die volle Kontrolle über Tonalität und Prozess, während die Technik unsichtbar im Hintergrund bleibt."
      ctaButtonText="Jetzt unverbindliche Demo vereinbaren"
    />
  );
}
