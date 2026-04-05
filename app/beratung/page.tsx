import { Metadata } from "next";
import BeratungClient from "@/components/BeratungClient";

export const metadata: Metadata = {
  title: "Beratung · KI-Coaching-Kompass",
  description:
    "Beratung für Unternehmen bei der Einführung von KI-Coaching-Software und für Coaches bei der sinnvollen Nutzung von KI-Tools in der eigenen Praxis.",
};

export default function BeratungPage() {
  return <BeratungClient />;
}
