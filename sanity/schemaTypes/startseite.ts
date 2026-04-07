import { defineField, defineType } from "sanity";

export const startseite = defineType({
  name: "startseite",
  title: "Startseite",
  type: "document",
  groups: [
    { name: "hero", title: "Hero" },
    { name: "wege", title: "Die drei Wege" },
    { name: "tools", title: "Tools" },
    { name: "artikel", title: "Artikel" },
    { name: "testimonials", title: "Testimonials" },
    { name: "newsletter", title: "Newsletter / Footer CTA" },
    { name: "footer", title: "Footer" },
  ],
  fields: [
    // ── HERO ──────────────────────────────────────────────────────────────
    defineField({
      name: "heroEyebrow",
      title: "Hero Eyebrow",
      type: "string",
      group: "hero",
      description: 'Kleiner Text über dem Titel, z.B. "KI-Coaching Orientierungsplattform"',
    }),
    defineField({
      name: "heroTitel",
      title: "Hero-Titel",
      type: "string",
      group: "hero",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "heroUntertitel",
      title: "Hero-Untertitel",
      type: "text",
      rows: 3,
      group: "hero",
    }),
    defineField({
      name: "ctaText",
      title: "CTA-Text (Formular-Button)",
      type: "string",
      group: "hero",
    }),
    defineField({
      name: "heroNote",
      title: "Hinweistext unter Formular",
      type: "string",
      group: "hero",
      description: 'z.B. "Kein Spam. Kein Algorithmus. Nur echte Impulse."',
    }),
    defineField({
      name: "heroSuccessMsg",
      title: "Erfolgsmeldung nach Eintragung",
      type: "string",
      group: "hero",
    }),

    // ── DIE DREI WEGE ─────────────────────────────────────────────────────
    defineField({
      name: "wegeEyebrow",
      title: "Wege Eyebrow",
      type: "string",
      group: "wege",
    }),
    defineField({
      name: "wegeTitel",
      title: "Wege Titel",
      type: "string",
      group: "wege",
    }),
    defineField({
      name: "wegeLead",
      title: "Wege Einleitungstext",
      type: "text",
      rows: 3,
      group: "wege",
    }),
    defineField({
      name: "wegeListe",
      title: "Die 3 Wege (Karten)",
      type: "array",
      group: "wege",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "nummer", title: "Nummer", type: "string", description: 'z.B. "01"' }),
            defineField({ name: "eyebrow", title: "Eyebrow", type: "string", description: 'z.B. "Für Unternehmen"' }),
            defineField({ name: "titel", title: "Titel", type: "text", rows: 2 }),
            defineField({ name: "text", title: "Text", type: "text", rows: 4 }),
            defineField({ name: "linkText", title: "Link-Text", type: "string", description: 'z.B. "Beratung entdecken →"' }),
            defineField({ name: "linkUrl", title: "Link-URL", type: "string", description: 'z.B. "/ki-coaching/beratung"' }),
          ],
          preview: {
            select: { title: "eyebrow", subtitle: "titel" },
          },
        },
      ],
    }),

    // ── TOOLS ─────────────────────────────────────────────────────────────
    defineField({
      name: "toolsEyebrow",
      title: "Tools Eyebrow",
      type: "string",
      group: "tools",
    }),
    defineField({
      name: "toolsTitel",
      title: "Tools Titel",
      type: "string",
      group: "tools",
    }),
    defineField({
      name: "toolsFooterText",
      title: "Tools Footer Text",
      type: "string",
      group: "tools",
      description: 'z.B. "12 Tools im Vergleich — gefiltert nach deinem Kontext."',
    }),
    defineField({
      name: "toolsFooterCta",
      title: "Tools Footer CTA",
      type: "string",
      group: "tools",
    }),

    // ── ARTIKEL ───────────────────────────────────────────────────────────
    defineField({
      name: "artikelEyebrow",
      title: "Artikel Eyebrow",
      type: "string",
      group: "artikel",
    }),
    defineField({
      name: "artikelTitel",
      title: "Artikel Titel",
      type: "string",
      group: "artikel",
    }),

    // ── TESTIMONIALS ──────────────────────────────────────────────────────
    defineField({
      name: "testimonialsEyebrow",
      title: "Testimonials Eyebrow",
      type: "string",
      group: "testimonials",
    }),
    defineField({
      name: "testimonialsTitel",
      title: "Testimonials Titel",
      type: "string",
      group: "testimonials",
    }),
    defineField({
      name: "trustLogos",
      title: "Trust-Logos / Referenzen",
      type: "array",
      group: "testimonials",
      of: [{ type: "string" }],
    }),

    // ── NEWSLETTER / FOOTER CTA ───────────────────────────────────────────
    defineField({
      name: "newsletterEyebrow",
      title: "Newsletter Eyebrow",
      type: "string",
      group: "newsletter",
    }),
    defineField({
      name: "newsletterTitel",
      title: "Newsletter Titel",
      type: "string",
      group: "newsletter",
    }),
    defineField({
      name: "newsletterLead",
      title: "Newsletter Einleitungstext",
      type: "text",
      rows: 3,
      group: "newsletter",
    }),
    defineField({
      name: "newsletterCtaText",
      title: "Newsletter CTA-Text",
      type: "string",
      group: "newsletter",
    }),
    defineField({
      name: "newsletterSuccessMsg",
      title: "Newsletter Erfolgsmeldung",
      type: "string",
      group: "newsletter",
    }),

    // ── FOOTER ────────────────────────────────────────────────────────────
    defineField({
      name: "footerCopyright",
      title: "Footer Copyright-Text",
      type: "string",
      group: "footer",
    }),
  ],
});
