import KICoachingClient from "@/components/KICoachingClient";

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

export default function KICoachingPage() {
  return <KICoachingClient />;
}
