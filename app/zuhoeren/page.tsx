import { Metadata } from "next";
import ZuhoerenClient from "@/components/ZuhoerenClient";

export const metadata: Metadata = {
  title: "Zuhören · KI-Coaching-Kompass",
  description:
    "Ein Raum, in dem du dich selbst wieder hörst. Zuhören als professionelle Praxis — und in Kombination mit KI-gestützter Reflexion.",
};

export default function ZuhoerenPage() {
  return <ZuhoerenClient />;
}
