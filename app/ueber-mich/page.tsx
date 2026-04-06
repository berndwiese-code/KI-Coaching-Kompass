import UeberMichClient from "@/components/UeberMichClient";

export const metadata = {
  title: "Über Bernd Wiese — Zuhörcoach & KI-Berater",
  description:
    "Ich liebe echte Präsenz. Und ich finde es faszinierend, was gerade mit KI entsteht. Ich arbeite in der Spannung zwischen Zuhören und Technologie. Staufen.",
  openGraph: {
    title: "Bernd Wiese — Zuhörcoach & KI-Berater, Staufen",
    description:
      "Ich arbeite in der Spannung zwischen einem Zuhören, das nichts will, und einer Technologie, die unglaublich viel kann — aber nichts fühlt.",
    url: "https://ki-coaching-kompass.vercel.app/ueber-mich",
  },
};

export default function UeberMichPage() {
  return <UeberMichClient />;
}
