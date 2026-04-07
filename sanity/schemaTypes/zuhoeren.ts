import { defineField, defineType } from "sanity";

export const zuhoeren = defineType({
  name: "zuhoeren",
  title: "Zuhören-Seite",
  type: "document",
  groups: [
    { name: "hero", title: "Hero" },
    { name: "content", title: "Seiten-Inhalte" },
    { name: "ki", title: "Zuhören + KI" },
    { name: "cta", title: "Einladung / CTA" },
  ],
  fields: [
    // ── HERO ──────────────────────────────────────────────────────────────
    defineField({
      name: "heroTitel",
      title: "Hero-Titel",
      type: "text",
      rows: 4,
      group: "hero",
      description: 'z.B. "Die meisten Menschen<br />werden gehört.<br />Aber nur selten<br /><em>wirklich.</em>" (HTML erlaubt)',
    }),
    defineField({
      name: "heroSubtitel",
      title: "Hero-Untertitel",
      type: "text",
      rows: 2,
      group: "hero",
    }),
    defineField({
      name: "heroCta",
      title: "Hero CTA-Button",
      type: "string",
      group: "hero",
    }),

    // ── ANDERS ─────────────────────────────────────────────────────────
    defineField({
      name: "andersLabel",
      title: "Anders Label",
      type: "string",
      group: "content",
    }),
    defineField({
      name: "andersProse1",
      title: "Anders Textblock 1",
      type: "text",
      group: "content",
      description: "HTML erlaubt (z.B. <p>...</p><p><em>...</em></p>)",
    }),
    defineField({
      name: "zitatKlarheit",
      title: "Stehendes Zitat (Klarheit)",
      type: "text",
      rows: 2,
      group: "content",
    }),
    defineField({
      name: "andersProse2",
      title: "Anders Textblock 2",
      type: "text",
      group: "content",
      description: "HTML erlaubt",
    }),

    // ── WARUM ──────────────────────────────────────────────────────────
    defineField({
      name: "warumLabel",
      title: "Warum Label",
      type: "string",
      group: "content",
    }),
    defineField({
      name: "warumProse",
      title: "Warum Text",
      type: "text",
      group: "content",
      description: "HTML erlaubt",
    }),

    // ── FÜR WEN ────────────────────────────────────────────────────────
    defineField({
      name: "fuerWenLabel",
      title: "Für Wen Label",
      type: "string",
      group: "content",
    }),
    defineField({
      name: "fuerWenIntro",
      title: "Für Wen Intro",
      type: "text",
      group: "content",
      description: "HTML erlaubt",
    }),
    defineField({
      name: "fuerWenListe",
      title: "Für Wen Aufzählungen",
      type: "array",
      group: "content",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "fuerWenOutro",
      title: "Für Wen Outro",
      type: "text",
      group: "content",
      description: "HTML erlaubt",
    }),

    // ── GESPRÄCH ───────────────────────────────────────────────────────
    defineField({
      name: "gespraechLabel",
      title: "Gespräch Label",
      type: "string",
      group: "content",
    }),
    defineField({
      name: "gespraechProse",
      title: "Gespräch Text",
      type: "text",
      group: "content",
      description: "HTML erlaubt",
    }),
    defineField({
      name: "zitatGespraech",
      title: "Stehendes Zitat (Gespräch)",
      type: "text",
      rows: 2,
      group: "content",
    }),

    // ── ABGRENZUNG ─────────────────────────────────────────────────────
    defineField({
      name: "abgrenzungTitel",
      title: "Abgrenzung Titel",
      type: "string",
      group: "content",
    }),
    defineField({
      name: "abgrenzungProse",
      title: "Abgrenzung Text",
      type: "text",
      group: "content",
      description: "HTML erlaubt",
    }),

    // ── WIRKUNG ────────────────────────────────────────────────────────
    defineField({
      name: "wirkungLabel",
      title: "Wirkung Label",
      type: "string",
      group: "content",
    }),
    defineField({
      name: "wirkungIntro",
      title: "Wirkung Intro",
      type: "text",
      group: "content",
      description: "HTML erlaubt",
    }),
    defineField({
      name: "wirkungListe",
      title: "Wirkung Kacheln",
      type: "array",
      group: "content",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "wirkungOutro",
      title: "Wirkung Outro",
      type: "text",
      group: "content",
      description: "HTML erlaubt",
    }),

    // ── KI SECTION ─────────────────────────────────────────────────────
    defineField({
      name: "kiLabel",
      title: "KI Label",
      type: "string",
      group: "ki",
    }),
    defineField({
      name: "kiTitel",
      title: "KI Titel",
      type: "string",
      group: "ki",
      description: "HTML erlaubt",
    }),
    defineField({
      name: "kiProse1",
      title: "KI Text 1",
      type: "text",
      group: "ki",
      description: "HTML erlaubt",
    }),
    defineField({
      name: "kiProse2",
      title: "KI Text 2",
      type: "text",
      group: "ki",
      description: "HTML erlaubt",
    }),
    defineField({
      name: "kiListe",
      title: "KI Vorteile",
      type: "array",
      group: "ki",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "kiNote",
      title: "KI Hinweistext",
      type: "text",
      group: "ki",
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
      title: "CTA Titel",
      type: "text",
      rows: 3,
      group: "cta",
      description: "HTML erlaubt",
    }),
    defineField({
      name: "ctaBody",
      title: "CTA Text",
      type: "text",
      rows: 2,
      group: "cta",
    }),
    defineField({
      name: "ctaButton",
      title: "CTA Button",
      type: "string",
      group: "cta",
    }),
    defineField({
      name: "ctaNote",
      title: "CTA Hinweistext",
      type: "string",
      group: "cta",
    }),
    defineField({
      name: "kontaktEmail",
      title: "Kontakt-E-Mail",
      type: "string",
      description: "E-Mail für alle CTA-Buttons",
    }),
  ],
});
