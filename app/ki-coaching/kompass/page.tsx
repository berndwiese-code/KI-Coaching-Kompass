import KompassClient from "@/components/KompassClient";

export const metadata = {
  title: "KI-Tools für Coaching — Der Kompass",
  description:
    "40+ KI-Tools für den Coaching-Bereich — bewertet ohne Affiliate-Brille. Studien, Artikel und kuratiertes Wissen für Coaches und Unternehmen.",
  openGraph: {
    title: "Der KI-Coaching Kompass — Tools ohne Affiliate-Brille",
    description:
      "Ich habe aufgehört zu zählen, wie viele KI-Tools sich als Coaching-Revolution vermarkten. Deshalb habe ich angefangen zu sortieren.",
    url: "https://ki-coaching-kompass.vercel.app/ki-coaching/kompass",
  },
};

export default function KompassPage() {
  return <KompassClient />;
}
