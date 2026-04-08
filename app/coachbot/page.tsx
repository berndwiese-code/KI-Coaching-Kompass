import ToolDetailClient, { ToolDetailProps } from "@/components/ToolDetailClient";
import { getCoachbot } from "@/sanity/lib/queries";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "CoachBot | KI-Coaching Kompass",
  description: "Erfahren Sie mehr über CoachBot.ai – Deine Methodik als skalierbarer KI-Agent.",
};

const fallback: ToolDetailProps = {
  toolName: "CoachBot",
  heroHeadline: "CoachBot.ai – Deine Methodik als skalierbarer KI-Agent",
  heroEinleitung: "CoachBot.ai ist die Infrastruktur, mit der du dein geistiges Eigentum in verantwortungsvolle KI-Agenten verwandelst. Erstelle White-Label-Bots, die genau wie deine Methodik denken und sprechen, um Coaching auf jeder Ebene der Organisation zugänglich zu machen.",
  highlights: [
    { titel: "Deine Stimme", text: "", popupText: "Hier eine Erklärung zu: Deine Stimme" },
    { titel: "Eigene Monetarisierung", text: "", popupText: "Hier eine Erklärung zu: Eigene Monetarisierung" },
    { titel: "Harte Leitplanken", text: "", popupText: "Hier eine Erklärung zu: Harte Leitplanken" }
  ],
  checkTitel: "Der Bernd-Wiese-Check",
  checkTextLead: "Ich schätze CoachBot als digitale Werkbank, die das Skalierungsproblem für Coaching-Boutiquen löst. Du behältst die volle Kontrolle über Tonalität und Prozess, während die Technik unsichtbar im Hintergrund bleibt.",
  ctaButtonText: "Jetzt unverbindliche Demo vereinbaren"
};

export default async function CoachbotPage() {
  const data = await getCoachbot();
  const finalData = data?.toolName ? data : fallback;

  return (
    <ToolDetailClient {...finalData} />
  );
}
