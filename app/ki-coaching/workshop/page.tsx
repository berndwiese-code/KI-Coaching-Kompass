import WorkshopClient from "@/components/WorkshopClient";
import { getWorkshop } from "@/sanity/lib/queries";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "KI-Coaching Workshop für Coaches",
  description:
    "KI im Coaching — nicht als Konkurrenz, sondern als Werkzeug. Workshop für Coaches, die KI bewusst und sinnvoll einsetzen wollen. Mit Bernd Wiese.",
  openGraph: {
    title: "KI-Coaching Workshop für Coaches · Bernd Wiese",
    description:
      "Spoiler: KI muss sein. Aber nicht so, wie du denkst. Workshop für Coaches — Zeit, Klarheit und neue Möglichkeiten.",
    url: "https://ki-coaching-kompass.vercel.app/ki-coaching/workshop",
  },
};

export default async function WorkshopPage() {
  const workshop = await getWorkshop();
  return <WorkshopClient workshop={workshop} />;
}
