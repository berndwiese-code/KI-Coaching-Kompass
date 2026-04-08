import ToolDetailClient from "@/components/ToolDetailClient";
import { getCoachbot } from "@/sanity/lib/queries";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "CoachBot | KI-Coaching Kompass",
  description: "Erfahren Sie mehr über CoachBot.ai – Deine Methodik als skalierbarer KI-Agent.",
};

export default async function CoachbotPage() {
  const data = await getCoachbot();

  return (
    <ToolDetailClient {...data} />
  );
}
