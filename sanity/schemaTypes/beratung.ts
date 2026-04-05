import { defineField, defineType } from "sanity";

export const beratung = defineType({
  name: "beratung",
  title: "Beratungs-Seite",
  type: "document",
  groups: [
    { name: "hero", title: "Hero" },
    { name: "unternehmen", title: "Tab: Unternehmen" },
    { name: "coaches", title: "Tab: Coaches" },
  ],
  fields: [
    // ── HERO ──────────────────────────────────────────────────────────────
    defineField({
      name: "heroEyebrow",
      title: "Eyebrow",
      type: "string",
      group: "hero",
      description: 'z.B. "Beratung"',
    }),
    defineField({
      name: "heroTitel",
      title: "Hero-Titel",
      type: "string",
      group: "hero",
      description: 'z.B. "KI-Coaching-Software gezielt einsetzen."',
    }),
    defineField({
      name: "heroLead",
      title: "Hero-Lead",
      type: "text",
      rows: 3,
      group: "hero",
      description: "Der einleitende Satz unter dem Titel",
    }),

    // ── UNTERNEHMEN ───────────────────────────────────────────────────────
    defineField({
      name: "unternehmenCtaTitel",
      title: "CTA-Titel (Unternehmen)",
      type: "string",
      group: "unternehmen",
    }),
    defineField({
      name: "unternehmenCtaBody",
      title: "CTA-Text (Unternehmen)",
      type: "text",
      rows: 3,
      group: "unternehmen",
    }),
    defineField({
      name: "unternehmenCtaButton",
      title: "CTA-Button (Unternehmen)",
      type: "string",
      group: "unternehmen",
    }),

    // ── COACHES ───────────────────────────────────────────────────────────
    defineField({
      name: "coachesCtaTitel",
      title: "CTA-Titel (Coaches)",
      type: "string",
      group: "coaches",
    }),
    defineField({
      name: "coachesCtaBody",
      title: "CTA-Text (Coaches)",
      type: "text",
      rows: 3,
      group: "coaches",
    }),
    defineField({
      name: "coachesCtaButton",
      title: "CTA-Button (Coaches)",
      type: "string",
      group: "coaches",
    }),

    defineField({
      name: "kontaktEmail",
      title: "Kontakt-E-Mail",
      type: "string",
      description: "Gilt für alle CTA-Buttons auf der Seite",
    }),
  ],
});
