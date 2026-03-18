import { sanityFetch } from "./live";

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

export async function getStartseite(): Promise<Startseite | null> {
  const { data } = await sanityFetch({
    query: `*[_type == "startseite"][0]{ heroTitel, heroUntertitel, ctaText }`,
  });
  return (data as Startseite | null) ?? null;
}

export async function getTools(): Promise<Tool[]> {
  const { data } = await sanityFetch({
    query: `*[_type == "tools"] | order(_createdAt asc){ _id, name, beschreibung, badge, tags, featured }`,
  });
  return (data as Tool[]) ?? [];
}

export async function getArtikel(): Promise<Artikel[]> {
  const { data } = await sanityFetch({
    query: `*[_type == "artikel"] | order(datum desc){ _id, titel, kategorie, excerpt, datum, autor }`,
  });
  return (data as Artikel[]) ?? [];
}

export async function getTestimonials(): Promise<Testimonial[]> {
  const { data } = await sanityFetch({
    query: `*[_type == "testimonials"] | order(_createdAt asc){ _id, zitat, name, rolle }`,
  });
  return (data as Testimonial[]) ?? [];
}
