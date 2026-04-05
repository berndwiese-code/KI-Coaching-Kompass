import WorkshopClient from "@/components/WorkshopClient";
import { getWorkshop } from "@/sanity/lib/queries";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "KI-Coaching im Unternehmen – Workshop | KI-Coaching Kompass",
  description:
    "Zweitägiger Online-Workshop für HR, Führungskräfte und Betriebsräte: KI-Coaching verstehen, bewerten und einführen. Mit Bernd Wiese, ki-coaching-kompass.de.",
};

export default async function WorkshopPage() {
  const workshop = await getWorkshop();
  return <WorkshopClient workshop={workshop} />;
}
