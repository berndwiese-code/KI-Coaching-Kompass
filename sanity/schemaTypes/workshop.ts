import { defineField, defineType } from "sanity";

export const workshop = defineType({
  name: "workshop",
  title: "Workshop-Seite",
  type: "document",
  groups: [
    { name: "hero", title: "Hero" },
    { name: "cta", title: "Call-to-Action" },
  ],
  fields: [
    // ── HERO ──────────────────────────────────────────────────────────────
    defineField({
      name: "heroEyebrow",
      title: "Eyebrow (kleiner Text über Titel)",
      type: "string",
      group: "hero",
      description: 'z.B. "Zweitägiger Online-Workshop"',
    }),
    defineField({
      name: "heroTitel",
      title: "Hero-Titel",
      type: "string",
      group: "hero",
      description: 'z.B. "KI-Coaching im Unternehmen"',
    }),
    defineField({
      name: "heroUntertitel",
      title: "Hero-Untertitel",
      type: "string",
      group: "hero",
      description: 'z.B. "verstehen — bewerten — einführen"',
    }),
    defineField({
      name: "heroPill1",
      title: "Fact-Pill 1",
      type: "string",
      group: "hero",
      description: 'z.B. "2 Nachmittage à 4 Stunden"',
    }),
    defineField({
      name: "heroPill2",
      title: "Fact-Pill 2",
      type: "string",
      group: "hero",
      description: 'z.B. "Online via Zoom"',
    }),
    defineField({
      name: "heroPill3",
      title: "Fact-Pill 3",
      type: "string",
      group: "hero",
      description: 'z.B. "Max. 12 Teilnehmer"',
    }),
    defineField({
      name: "heroPill4",
      title: "Fact-Pill 4 (Preis, hervorgehoben)",
      type: "string",
      group: "hero",
      description: 'z.B. "399 EUR pro Person"',
    }),
    defineField({
      name: "heroCtaPrimary",
      title: "CTA-Button (primär)",
      type: "string",
      group: "hero",
      description: 'z.B. "Jetzt anmelden"',
    }),
    defineField({
      name: "heroCtaSecondary",
      title: "CTA-Button (sekundär)",
      type: "string",
      group: "hero",
      description: 'z.B. "Mehr erfahren"',
    }),

    // ── CTA ───────────────────────────────────────────────────────────────
    defineField({
      name: "ctaTitel",
      title: "CTA-Abschnitt Titel",
      type: "string",
      group: "cta",
    }),
    defineField({
      name: "ctaBody",
      title: "CTA-Abschnitt Text",
      type: "text",
      rows: 3,
      group: "cta",
    }),
    defineField({
      name: "ctaButton",
      title: "CTA-Button Text",
      type: "string",
      group: "cta",
    }),
    defineField({
      name: "ctaEmail",
      title: "Kontakt-E-Mail",
      type: "string",
      group: "cta",
      description: "E-Mail-Adresse für den Anmelde-Button",
    }),
  ],
});
