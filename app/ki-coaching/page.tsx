import KICoachingClient from "@/components/KICoachingClient";
import { getKICoaching } from "@/sanity/lib/queries";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "KI-Coaching: Was es ist, was es kann",
  description:
    "KI-Coaching — was es ist, was es kann und was nicht. Beratung für Unternehmen, Einführungs-Workshop für Coaches.",
  openGraph: {
    title: "KI-Coaching: Was es ist, was es kann",
    description:
      "Drei Wege: Beratung für Unternehmen, Workshop für Coaches, Begleitung für Menschen. Bernd Wiese, KI-Coaching Kompass.",
    url: "https://ki-coaching-kompass.vercel.app/ki-coaching",
  },
};

export default async function KICoachingPage() {
  const content = await getKICoaching();
  return <KICoachingClient data={content} />;
}
