import { Metadata } from "next";
import BeratungClient from "@/components/BeratungClient";
import { getBeratung } from "@/sanity/lib/queries";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "KI-Coaching Beratung für Unternehmen",
  description:
    "Ich begleite Unternehmen bei der Integration von KI im Coaching- und HR-Umfeld — nicht als Hype-Welle, sondern als fundierte Entscheidung. Bernd Wiese.",
  openGraph: {
    title: "KI-Coaching Beratung für Unternehmen · Bernd Wiese",
    description:
      "Was soll KI in eurem Coaching-Prozess können — und was soll sie lassen? Ich begleite Unternehmen dabei, das herauszufinden.",
    url: "https://ki-coaching-kompass.vercel.app/ki-coaching/beratung",
  },
};

export default async function BeratungPage() {
  const beratung = await getBeratung();
  return <BeratungClient beratung={beratung} />;
}
