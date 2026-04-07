import { defineField, defineType, defineArrayMember } from "sanity";

export const workshop = defineType({
  name: "workshop",
  title: "Workshop-Seite",
  type: "document",
  groups: [
    { name: "nav", title: "Navigation / Header" },
    { name: "hero", title: "Hero" },
    { name: "zielgruppe", title: "Zielgruppe (Für wen)" },
    { name: "mitnahmen", title: "Ergebnis (Mitnahmen)" },
    { name: "didaktik", title: "Didaktik (Agenda)" },
    { name: "enthalten", title: "Leistungsumfang" },
    { name: "forschung", title: "Forschung" },
    { name: "ueber", title: "Über Bernd" },
    { name: "cta", title: "Call-to-Action" },
    { name: "footer", title: "Footer" },
  ],
  fields: [
    // ── NAV / HEADER ──────────────────────────────────────────
    defineField({
      name: "navLinks",
      title: "Navigations-Links",
      type: "array",
      group: "nav",
      of: [
        defineArrayMember({
          type: "object",
          name: "navLinkItem",
          fields: [
            defineField({ name: "label", type: "string", title: "Label" }),
            defineField({ name: "url", type: "string", title: "URL" }),
            defineField({ name: "isExternal", type: "boolean", title: "Ist externer Link?" }),
          ]
        })
      ]
    }),
    defineField({
      name: "navCta",
      title: "Header CTA Button Text",
      type: "string",
      group: "nav",
    }),

    // ── HERO ──────────────────────────────────────────────────────────────
    defineField({
      name: "heroEyebrow",
      title: "Eyebrow (kleiner Text über Titel)",
      type: "string",
      group: "hero",
    }),
    defineField({
      name: "heroTitel",
      title: "Hero-Titel",
      type: "string",
      group: "hero",
      description: "Erlaubt HTML, z.B. <br /> oder <em>",
    }),
    defineField({
      name: "heroUntertitel",
      title: "Hero-Untertitel",
      type: "string",
      group: "hero",
    }),
    defineField({
      name: "heroPill1",
      title: "Fact-Pill 1",
      type: "string",
      group: "hero",
    }),
    defineField({
      name: "heroPill2",
      title: "Fact-Pill 2",
      type: "string",
      group: "hero",
    }),
    defineField({
      name: "heroPill3",
      title: "Fact-Pill 3",
      type: "string",
      group: "hero",
    }),
    defineField({
      name: "heroPill4",
      title: "Fact-Pill 4 (Preis, hervorgehoben)",
      type: "string",
      group: "hero",
    }),
    defineField({
      name: "heroCtaPrimary",
      title: "CTA-Button (primär)",
      type: "string",
      group: "hero",
    }),
    defineField({
      name: "heroCtaSecondary",
      title: "CTA-Button (sekundär)",
      type: "string",
      group: "hero",
    }),

    // ── ZIELGRUPPE ──────────────────────────────────────────
    defineField({
      name: "zielgruppeEyebrow",
      title: "Zielgruppe Eyebrow",
      type: "string",
      group: "zielgruppe",
    }),
    defineField({
      name: "zielgruppeTitel",
      title: "Zielgruppe Titel",
      type: "string",
      group: "zielgruppe",
      description: "Erlaubt HTML, z.B. <br /> oder <em>",
    }),
    defineField({
      name: "zielgruppeLead",
      title: "Zielgruppe Lead",
      type: "text",
      rows: 2,
      group: "zielgruppe",
    }),
    defineField({
      name: "zielgruppeKarten",
      title: "Zielgruppe Karten",
      type: "array",
      group: "zielgruppe",
      of: [
        defineArrayMember({
          type: "object",
          name: "zielgruppeKarte",
          fields: [
            defineField({ name: "icon", type: "string", title: "Icon Emoji" }),
            defineField({ name: "text", type: "string", title: "Text", description: "Erlaubt HTML z.B. <strong>" }),
          ]
        })
      ]
    }),

    // ── MITNAHMEN ──────────────────────────────────────────
    defineField({
      name: "mitnahmenEyebrow",
      title: "Mitnahmen Eyebrow",
      type: "string",
      group: "mitnahmen",
    }),
    defineField({
      name: "mitnahmenTitel",
      title: "Mitnahmen Titel",
      type: "string",
      group: "mitnahmen",
      description: "Erlaubt HTML",
    }),
    defineField({
      name: "mitnahmenLead",
      title: "Mitnahmen Lead",
      type: "text",
      rows: 2,
      group: "mitnahmen",
    }),
    defineField({
      name: "mitnahmenKarten",
      title: "Mitnahmen Karten",
      type: "array",
      group: "mitnahmen",
      of: [
        defineArrayMember({
          type: "object",
          name: "mitnahmenKarte",
          fields: [
            defineField({ name: "nummer", type: "string", title: "Nummer", description: "z.B. 01" }),
            defineField({ name: "text", type: "string", title: "Text", description: "Erlaubt HTML z.B. <strong>" }),
          ]
        })
      ]
    }),

    // ── DIDAKTIK ──────────────────────────────────────────
    defineField({
      name: "didaktikEyebrow",
      title: "Didaktik Eyebrow",
      type: "string",
      group: "didaktik",
    }),
    defineField({
      name: "didaktikTitel",
      title: "Didaktik Titel",
      type: "string",
      group: "didaktik",
      description: "Erlaubt HTML",
    }),
    defineField({
      name: "didaktikText1",
      title: "Didaktik Absatz 1",
      type: "string",
      description: "Erlaubt HTML",
      group: "didaktik",
    }),
    defineField({
      name: "didaktikText2",
      title: "Didaktik Absatz 2",
      type: "string",
      description: "Erlaubt HTML",
      group: "didaktik",
    }),
    defineField({
      name: "agendaTag1Titel",
      title: "Agenda Tag 1 Überschrift",
      type: "string",
      group: "didaktik",
    }),
    defineField({
      name: "agendaTag1",
      title: "Agenda Tag 1 Einträge",
      type: "array",
      group: "didaktik",
      of: [
        defineArrayMember({
          type: "object",
          name: "agendaItem",
          fields: [
            defineField({ name: "zeit", type: "string", title: "Uhrzeit" }),
            defineField({ name: "thema", type: "string", title: "Thema" }),
            defineField({ name: "format", type: "string", title: "Format" }),
          ]
        })
      ]
    }),
    defineField({
      name: "agendaTag2Titel",
      title: "Agenda Tag 2 Überschrift",
      type: "string",
      group: "didaktik",
    }),
    defineField({
      name: "agendaTag2",
      title: "Agenda Tag 2 Einträge",
      type: "array",
      group: "didaktik",
      of: [
        defineArrayMember({
          type: "object",
          name: "agendaItem2",
          fields: [
            defineField({ name: "zeit", type: "string", title: "Uhrzeit" }),
            defineField({ name: "thema", type: "string", title: "Thema" }),
            defineField({ name: "format", type: "string", title: "Format" }),
          ]
        })
      ]
    }),

    // ── LEISTUNGSUMFANG ──────────────────────────────────────────
    defineField({
      name: "enthaltenEyebrow",
      title: "Enthalten Eyebrow",
      type: "string",
      group: "enthalten",
    }),
    defineField({
      name: "enthaltenTitel",
      title: "Enthalten Titel",
      type: "string",
      group: "enthalten",
      description: "Erlaubt HTML",
    }),
    defineField({
      name: "enthaltenListe",
      title: "Leistungsumfang Checkliste",
      type: "array",
      group: "enthalten",
      of: [
        defineArrayMember({
          type: "object",
          name: "enthaltenItem",
          fields: [
            defineField({ name: "titel", type: "string", title: "Fettgedruckter Titel" }),
            defineField({ name: "text", type: "string", title: "Normaler Text" }),
          ]
        })
      ]
    }),

    // ── FORSCHUNG ──────────────────────────────────────────
    defineField({
      name: "forschungEyebrow",
      title: "Forschung Eyebrow",
      type: "string",
      group: "forschung",
    }),
    defineField({
      name: "forschungTitel",
      title: "Forschung Titel",
      type: "string",
      group: "forschung",
      description: "Erlaubt HTML",
    }),
    defineField({
      name: "forschungStats",
      title: "Statistiken",
      type: "array",
      group: "forschung",
      of: [
        defineArrayMember({
          type: "object",
          name: "forschungStatItem",
          fields: [
            defineField({ name: "nummer", type: "string", title: "Zahl" }),
            defineField({ name: "label", type: "string", title: "Beschreibung" }),
          ]
        })
      ]
    }),
    defineField({
      name: "forschungText1",
      title: "Forschung Absatz 1",
      type: "string",
      description: "Erlaubt HTML",
      group: "forschung",
    }),
    defineField({
      name: "forschungText2",
      title: "Forschung Absatz 2",
      type: "string",
      description: "Erlaubt HTML",
      group: "forschung",
    }),
    defineField({
      name: "forschungText3",
      title: "Forschung Absatz 3",
      type: "string",
      description: "Erlaubt HTML",
      group: "forschung",
    }),
    defineField({
      name: "forschungQuelle",
      title: "Quelle",
      type: "string",
      group: "forschung",
    }),

    // ── ÜBER BERND ──────────────────────────────────────────
    defineField({
      name: "ueberEyebrow",
      title: "Über Eyebrow",
      type: "string",
      group: "ueber",
    }),
    defineField({
      name: "ueberName",
      title: "Name",
      type: "string",
      group: "ueber",
    }),
    defineField({
      name: "ueberRole",
      title: "Rolle / Titel",
      type: "string",
      group: "ueber",
      description: "Erlaubt HTML (z.B. <br />)",
    }),
    defineField({
      name: "ueberText1",
      title: "Über Absatz 1",
      type: "string",
      description: "Erlaubt HTML",
      group: "ueber",
    }),
    defineField({
      name: "ueberText2",
      title: "Über Absatz 2",
      type: "string",
      description: "Erlaubt HTML",
      group: "ueber",
    }),
    defineField({
      name: "ueberHinweisTitel",
      title: "Hinweis Titel",
      type: "string",
      group: "ueber",
    }),
    defineField({
      name: "ueberHinweisText",
      title: "Hinweis Text",
      type: "string",
      group: "ueber",
    }),

    // ── CTA ───────────────────────────────────────────────────────────────
    defineField({
      name: "ctaEyebrow",
      title: "CTA Eyebrow",
      type: "string",
      group: "cta",
    }),
    defineField({
      name: "ctaTitel",
      title: "CTA-Abschnitt Titel",
      type: "string",
      group: "cta",
      description: "Erlaubt HTML",
    }),
    defineField({
      name: "ctaPreis",
      title: "CTA Preiswert",
      type: "string",
      group: "cta",
    }),
    defineField({
      name: "ctaPreisLabel",
      title: "Preis Beschreibung",
      type: "string",
      group: "cta",
    }),
    defineField({
      name: "ctaTermin",
      title: "Termin-Kasten Text",
      type: "string",
      group: "cta",
    }),
    defineField({
      name: "ctaButton",
      title: "CTA-Button Text",
      type: "string",
      group: "cta",
    }),
    defineField({
      name: "ctaButtonSecondary",
      title: "Sekundärer Button Text",
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
    defineField({
      name: "ctaBody",
      title: "Hinweis-Text unter Buttons",
      type: "text",
      rows: 2,
      group: "cta",
    }),

    // ── FOOTER ───────────────────────────────────────────────────────────────
    defineField({
      name: "footerCopyright",
      title: "Footer Copyright",
      type: "string",
      group: "footer",
    }),
    defineField({
      name: "footerLinks",
      title: "Footer Links",
      type: "array",
      group: "footer",
      of: [
        defineArrayMember({
          type: "object",
          name: "footerLinkItem",
          fields: [
            defineField({ name: "label", type: "string", title: "Label" }),
            defineField({ name: "url", type: "string", title: "URL" }),
          ]
        })
      ]
    }),
  ],
});
