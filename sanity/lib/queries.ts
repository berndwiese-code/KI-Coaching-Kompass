import { client } from './client'

export type StaffelSchritt = {
  nummer: string;
  icon: string;
  titel: string;
  beschreibung: string;
};

export type Weg = {
  nummer: string;
  eyebrow: string;
  titel: string;
  text: string;
  linkText: string;
  linkUrl: string;
};

export type Startseite = {
  // Hero
  heroEyebrow?: string;
  heroTitel?: string;
  heroUntertitel?: string;
  ctaText?: string;
  heroNote?: string;
  heroSuccessMsg?: string;
  // Die drei Wege
  wegeEyebrow?: string;
  wegeTitel?: string;
  wegeLead?: string;
  wegeListe?: Weg[];
  // Tools
  toolsEyebrow?: string;
  toolsTitel?: string;
  toolsFooterText?: string;
  toolsFooterCta?: string;
  kompassZitat?: string;
  kompassStats?: { nummer: string; label: string }[];
  // Artikel
  artikelEyebrow?: string;
  artikelTitel?: string;
  // Testimonials
  testimonialsEyebrow?: string;
  testimonialsTitel?: string;
  trustLogos?: string[];
  // Über Mini
  ueberEyebrow?: string;
  ueberTitel?: string;
  ueberText1?: string;
  ueberText2?: string;
  ueberCtaText?: string;
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
    wegeEyebrow, wegeTitel, wegeLead,
    wegeListe[]{ nummer, eyebrow, titel, text, linkText, linkUrl },
    toolsEyebrow, toolsTitel, toolsFooterText, toolsFooterCta, kompassZitat, kompassStats[]{nummer, label},
    artikelEyebrow, artikelTitel,
    testimonialsEyebrow, testimonialsTitel, trustLogos,
    ueberEyebrow, ueberTitel, ueberText1, ueberText2, ueberCtaText,
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

// ── WORKSHOP ──────────────────────────────────────────────────────────────────

export type Workshop = {
  navLinks?: { label: string; url: string; isExternal?: boolean }[];
  navCta?: string;

  heroEyebrow?: string;
  heroTitel?: string;
  heroUntertitel?: string;
  heroPill1?: string;
  heroPill2?: string;
  heroPill3?: string;
  heroPill4?: string;
  heroCtaPrimary?: string;
  heroCtaSecondary?: string;
  
  zielgruppeEyebrow?: string;
  zielgruppeTitel?: string;
  zielgruppeLead?: string;
  zielgruppeKarten?: { icon: string; text: string }[];

  mitnahmenEyebrow?: string;
  mitnahmenTitel?: string;
  mitnahmenLead?: string;
  mitnahmenKarten?: { nummer: string; text: string }[];

  didaktikEyebrow?: string;
  didaktikTitel?: string;
  didaktikText1?: string;
  didaktikText2?: string;
  agendaTag1Titel?: string;
  agendaTag1?: { zeit: string; thema: string; format: string }[];
  agendaTag2Titel?: string;
  agendaTag2?: { zeit: string; thema: string; format: string }[];

  enthaltenEyebrow?: string;
  enthaltenTitel?: string;
  enthaltenListe?: { titel: string; text: string }[];

  forschungEyebrow?: string;
  forschungTitel?: string;
  forschungStats?: { nummer: string; label: string }[];
  forschungText1?: string;
  forschungText2?: string;
  forschungText3?: string;
  forschungQuelle?: string;

  ueberEyebrow?: string;
  ueberName?: string;
  ueberRole?: string;
  ueberText1?: string;
  ueberText2?: string;
  ueberHinweisTitel?: string;
  ueberHinweisText?: string;

  ctaEyebrow?: string;
  ctaTitel?: string;
  ctaPreis?: string;
  ctaPreisLabel?: string;
  ctaTermin?: string;
  ctaButton?: string;
  ctaButtonSecondary?: string;
  ctaEmail?: string;
  ctaBody?: string;

  footerCopyright?: string;
  footerLinks?: { label: string; url: string }[];
};

export async function getWorkshop(): Promise<Workshop | null> {
  return client.fetch(`*[_type == "workshop"][0]{
    navLinks[]{ label, url, isExternal }, navCta,
    heroEyebrow, heroTitel, heroUntertitel, heroPill1, heroPill2, heroPill3, heroPill4, heroCtaPrimary, heroCtaSecondary,
    zielgruppeEyebrow, zielgruppeTitel, zielgruppeLead, zielgruppeKarten[]{ icon, text },
    mitnahmenEyebrow, mitnahmenTitel, mitnahmenLead, mitnahmenKarten[]{ nummer, text },
    didaktikEyebrow, didaktikTitel, didaktikText1, didaktikText2, 
    agendaTag1Titel, agendaTag1[]{ zeit, thema, format },
    agendaTag2Titel, agendaTag2[]{ zeit, thema, format },
    enthaltenEyebrow, enthaltenTitel, enthaltenListe[]{ titel, text },
    forschungEyebrow, forschungTitel, forschungStats[]{ nummer, label }, forschungText1, forschungText2, forschungText3, forschungQuelle,
    ueberEyebrow, ueberName, ueberRole, ueberText1, ueberText2, ueberHinweisTitel, ueberHinweisText,
    ctaEyebrow, ctaTitel, ctaPreis, ctaPreisLabel, ctaTermin, ctaButton, ctaButtonSecondary, ctaEmail, ctaBody,
    footerCopyright, footerLinks[]{ label, url }
  }`)
}

// ── BERATUNG ──────────────────────────────────────────────────────────────────

export type Beratung = {
  heroEyebrow?: string;
  heroTitel?: string;
  heroLead?: string;

  unternehmenChallenge?: string;
  unternehmenFacts?: { num: string; label: string }[];
  unternehmenLeistungenLabel?: string;
  unternehmenLeistungenTitel?: string;
  unternehmenLeistungenBody?: string;
  unternehmenLeistungenListe?: { icon: string; title: string; body: string }[];
  unternehmenProzessLabel?: string;
  unternehmenProzessTitel?: string;
  unternehmenProzessListe?: { number: string; title: string; body: string }[];
  unternehmenToolsLabel?: string;
  unternehmenToolsTitel?: string;
  unternehmenToolsBody?: string;
  unternehmenToolsListe?: { title: string; tools: string }[];
  unternehmenCtaTitel?: string;
  unternehmenCtaBody?: string;
  unternehmenCtaButton?: string;

  coachesChallenge?: string;
  coachesFacts?: { num: string; label: string }[];
  coachesLeistungenLabel?: string;
  coachesLeistungenTitel?: string;
  coachesLeistungenBody?: string;
  coachesLeistungenListe?: { icon: string; title: string; body: string }[];
  coachesProzessLabel?: string;
  coachesProzessTitel?: string;
  coachesProzessListe?: { number: string; title: string; body: string }[];
  coachesToolsLabel?: string;
  coachesToolsTitel?: string;
  coachesToolsBody?: string;
  coachesToolsListe?: { title: string; tools: string }[];
  coachesCtaTitel?: string;
  coachesCtaBody?: string;
  coachesCtaButton?: string;

  kontaktEmail?: string;
};

export async function getBeratung(): Promise<Beratung | null> {
  return client.fetch(`*[_type == "beratung"][0]{
    heroEyebrow, heroTitel, heroLead,
    
    unternehmenChallenge, unternehmenFacts[]{ num, label },
    unternehmenLeistungenLabel, unternehmenLeistungenTitel, unternehmenLeistungenBody, unternehmenLeistungenListe[]{ icon, title, body },
    unternehmenProzessLabel, unternehmenProzessTitel, unternehmenProzessListe[]{ number, title, body },
    unternehmenToolsLabel, unternehmenToolsTitel, unternehmenToolsBody, unternehmenToolsListe[]{ title, tools },
    unternehmenCtaTitel, unternehmenCtaBody, unternehmenCtaButton,

    coachesChallenge, coachesFacts[]{ num, label },
    coachesLeistungenLabel, coachesLeistungenTitel, coachesLeistungenBody, coachesLeistungenListe[]{ icon, title, body },
    coachesProzessLabel, coachesProzessTitel, coachesProzessListe[]{ number, title, body },
    coachesToolsLabel, coachesToolsTitel, coachesToolsBody, coachesToolsListe[]{ title, tools },
    coachesCtaTitel, coachesCtaBody, coachesCtaButton,

    kontaktEmail
  }`)
}

// ── ZUHÖREN ───────────────────────────────────────────────────────────────────

export type Zuhoeren = {
  heroTitel?: string;
  heroSubtitel?: string;
  heroCta?: string;
  zitatKlarheit?: string;
  zitatGespraech?: string;
  // Staffelstab
  staffelEyebrow?: string;
  staffelTitel?: string;
  staffelLead?: string;
  staffelSchritte?: StaffelSchritt[];
  staffelPreis?: string;
  staffelPreisLabel?: string;
  staffelCtaText?: string;
  // CTA
  ctaEyebrow?: string;
  ctaTitel?: string;
  ctaBody?: string;
  ctaButton?: string;
  ctaNote?: string;
  kontaktEmail?: string;
};

export async function getZuhoeren(): Promise<Zuhoeren | null> {
  return client.fetch(`*[_type == "zuhoeren"][0]{
    heroTitel, heroSubtitel, heroCta,
    zitatKlarheit, zitatGespraech,
    staffelEyebrow, staffelTitel, staffelLead,
    staffelSchritte[]{ nummer, icon, titel, beschreibung },
    staffelPreis, staffelPreisLabel, staffelCtaText,
    ctaEyebrow, ctaTitel, ctaBody, ctaButton, ctaNote,
    kontaktEmail
  }`)
}
