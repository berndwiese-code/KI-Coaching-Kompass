import { client } from './client'

export type StaffelSchritt = {
  nummer: string;
  icon: string;
  titel: string;
  beschreibung: string;
};

export type Startseite = {
  // Hero
  heroEyebrow?: string;
  heroTitel?: string;
  heroUntertitel?: string;
  ctaText?: string;
  heroNote?: string;
  heroSuccessMsg?: string;
  // Staffelstab
  staffelEyebrow?: string;
  staffelTitel?: string;
  staffelLead?: string;
  staffelSchritte?: StaffelSchritt[];
  staffelPreis?: string;
  staffelPreisLabel?: string;
  staffelCtaText?: string;
  // Tools
  toolsEyebrow?: string;
  toolsTitel?: string;
  toolsFooterText?: string;
  toolsFooterCta?: string;
  // Artikel
  artikelEyebrow?: string;
  artikelTitel?: string;
  // Testimonials
  testimonialsEyebrow?: string;
  testimonialsTitel?: string;
  trustLogos?: string[];
  // Newsletter
  newsletterEyebrow?: string;
  newsletterTitel?: string;
  newsletterLead?: string;
  newsletterCtaText?: string;
  newsletterSuccessMsg?: string;
  // Footer
  footerCopyright?: string;
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
  return client.fetch(`*[_type == "startseite"][0]{
    heroEyebrow, heroTitel, heroUntertitel, ctaText, heroNote, heroSuccessMsg,
    staffelEyebrow, staffelTitel, staffelLead,
    staffelSchritte[]{ nummer, icon, titel, beschreibung },
    staffelPreis, staffelPreisLabel, staffelCtaText,
    toolsEyebrow, toolsTitel, toolsFooterText, toolsFooterCta,
    artikelEyebrow, artikelTitel,
    testimonialsEyebrow, testimonialsTitel, trustLogos,
    newsletterEyebrow, newsletterTitel, newsletterLead, newsletterCtaText, newsletterSuccessMsg,
    footerCopyright
  }`)
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
