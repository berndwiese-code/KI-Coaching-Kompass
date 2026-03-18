import { defineField, defineType } from "sanity";

export const startseite = defineType({
  name: "startseite",
  title: "Startseite",
  type: "document",
  groups: [
    { name: "hero", title: "Hero" },
    { name: "staffel", title: "Staffelstab-Modell" },
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

    // ── STAFFELSTAB ───────────────────────────────────────────────────────
    defineField({
      name: "staffelEyebrow",
      title: "Staffel Eyebrow",
      type: "string",
      group: "staffel",
    }),
    defineField({
      name: "staffelTitel",
      title: "Staffel Titel",
      type: "string",
      group: "staffel",
    }),
    defineField({
      name: "staffelLead",
      title: "Staffel Einleitungstext",
      type: "text",
      rows: 3,
      group: "staffel",
    }),
    defineField({
      name: "staffelSchritte",
      title: "Schritte (4 Phasen)",
      type: "array",
      group: "staffel",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "nummer", title: "Nummer", type: "string", description: 'z.B. "01"' }),
            defineField({ name: "icon", title: "Icon", type: "string", description: 'z.B. "◎"' }),
            defineField({ name: "titel", title: "Titel", type: "string" }),
            defineField({ name: "beschreibung", title: "Beschreibung", type: "text", rows: 3 }),
          ],
          preview: {
            select: { title: "nummer", subtitle: "titel" },
          },
        },
      ],
    }),
    defineField({
      name: "staffelPreis",
      title: "Preis",
      type: "string",
      group: "staffel",
      description: 'z.B. "490 €"',
    }),
    defineField({
      name: "staffelPreisLabel",
      title: "Preis-Label",
      type: "string",
      group: "staffel",
      description: 'z.B. "Einstiegsangebot · inkl. MwSt."',
    }),
    defineField({
      name: "staffelCtaText",
      title: "Staffel CTA-Text",
      type: "string",
      group: "staffel",
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
