import { client } from './client'

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
  return client.fetch(`*[_type == "startseite"][0]{ heroTitel, heroUntertitel, ctaText }`)
}

export async function getTools(): Promise<Tool[]> {
  return client.fetch(`*[_type == "tools"] | order(_createdAt asc){ _id, name, beschreibung, badge, tags, featured }`)
}

export async function getArtikel(): Promise<Artikel[]> {
  return client.fetch(`*[_type == "artikel"] | order(datum desc){ _id, titel, kategorie, excerpt, datum, autor }`)
}

export async function getTestimonials(): Promise<Testimonial[]> {
  return client.fetch(`*[_type == "testimonials"] | order(_createdAt asc){ _id, zitat, name, rolle }`)
}
