import HomeClient from "@/components/HomeClient";
import {
  getStartseite,
  getTools,
  getArtikel,
  getTestimonials,
} from "@/sanity/lib/queries";

export const dynamic = "force-dynamic"; // always fetch from Sanity at request time

export default async function Page() {
  const [startseite, tools, artikel, testimonials] = await Promise.all([
    getStartseite(),
    getTools(),
    getArtikel(),
    getTestimonials(),
  ]);

  return (
    <HomeClient
      startseite={startseite}
      tools={tools}
      artikel={artikel}
      testimonials={testimonials}
    />
  );
}
