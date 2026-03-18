import { draftMode } from "next/headers";
import { client } from "./client";

export type Startseite = {
  heroTitel: string;
  heroUntertitel: string;
  ctaText: string;
};

export type Tool = {
  _id: string;
  name: string;
  beschreibung: string;
  badge?: string;
  tags?: string[];
  featured: boolean;
};

export type Artikel = {
  _id: string;
  titel: string;
  kategorie?: string;
  excerpt?: string;
  datum?: string;
  autor?: string;
};

export type Testimonial = {
  _id: string;
  zitat: string;
  name: string;
  rolle?: string;
};

async function getClient() {
  const { isEnabled } = await draftMode();
  return isEnabled
    ? client.withConfig({
        token: process.env.SANITY_API_READ_TOKEN,
        useCdn: false,
        perspective: "previewDrafts",
        stega: { enabled: true },
      })
    : client;
}

export async function getStartseite(): Promise<Startseite | null> {
  const c = await getClient();
  return c.fetch(`*[_type == "startseite"][0]{ heroTitel, heroUntertitel, ctaText }`);
}

export async function getTools(): Promise<Tool[]> {
  const c = await getClient();
  return c.fetch(`*[_type == "tools"] | order(_createdAt asc){ _id, name, beschreibung, badge, tags, featured }`);
}

export async function getArtikel(): Promise<Artikel[]> {
  const c = await getClient();
  return c.fetch(`*[_type == "artikel"] | order(datum desc){ _id, titel, kategorie, excerpt, datum, autor }`);
}

export async function getTestimonials(): Promise<Testimonial[]> {
  const c = await getClient();
  return c.fetch(`*[_type == "testimonials"] | order(_createdAt asc){ _id, zitat, name, rolle }`);
}
