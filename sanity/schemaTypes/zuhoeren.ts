import { defineField, defineType } from "sanity";

export const zuhoeren = defineType({
  name: "zuhoeren",
  title: "Zuhören-Seite",
  type: "document",
  groups: [
    { name: "hero", title: "Hero" },
    { name: "zitate", title: "Stehende Zitate" },
    { name: "cta", title: "Einladung / CTA" },
  ],
  fields: [
    // ── HERO ──────────────────────────────────────────────────────────────
    defineField({
      name: "heroTitel",
      title: "Hero-Titel (Zeile 1–3)",
      type: "text",
      rows: 4,
      group: "hero",
      description: 'Mehrzeiliger Titel. Zeilenumbrüche werden übernommen. z.B. "Die meisten Menschen\nwerden gehört.\nAber nur selten\nwirklich."',
    }),
    defineField({
      name: "heroSubtitel",
      title: "Hero-Untertitel",
      type: "text",
      rows: 2,
      group: "hero",
      description: 'z.B. "Hier geht es nicht um Antworten.\nSondern darum, dass du dich selbst wieder hörst."',
    }),
    defineField({
      name: "heroCta",
      title: "Hero CTA-Button",
      type: "string",
      group: "hero",
      description: 'z.B. "Gespräch anfragen"',
    }),

    // ── STEHENDE ZITATE ───────────────────────────────────────────────────
    defineField({
      name: "zitatKlarheit",
      title: "Stehendes Zitat (Klarheit)",
      type: "text",
      rows: 2,
      group: "zitate",
      description: 'Erscheint als großes Blockzitat. z.B. "Klarheit entsteht nicht, weil jemand sie dir gibt. Sondern weil sie in dir bereits da ist."',
    }),
    defineField({
      name: "zitatGespraech",
      title: "Stehendes Zitat (Gespräch)",
      type: "text",
      rows: 2,
      group: "zitate",
      description: 'z.B. "Und genau deshalb entsteht oft das, was sonst schwer zugänglich ist: echte Klarheit."',
    }),

    // ── CTA ───────────────────────────────────────────────────────────────
    defineField({
      name: "ctaEyebrow",
      title: "CTA Eyebrow",
      type: "string",
      group: "cta",
      description: 'z.B. "Einladung"',
    }),
    defineField({
      name: "ctaTitel",
      title: "CTA Titel",
      type: "text",
      rows: 3,
      group: "cta",
      description: 'z.B. "Wenn du das Gefühl hast, dass es Zeit ist, einmal wirklich gehört zu werden."',
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
      description: 'z.B. "Ohne Verpflichtung. Einfach, um es einmal zu erleben."',
    }),
    defineField({
      name: "kontaktEmail",
      title: "Kontakt-E-Mail",
      type: "string",
      description: "E-Mail für alle CTA-Buttons",
    }),
  ],
});
