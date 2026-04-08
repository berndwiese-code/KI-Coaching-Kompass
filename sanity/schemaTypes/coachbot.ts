import { defineField, defineType } from "sanity";

export const coachbot = defineType({
  name: "coachbot",
  title: "Coachbot Toolseite",
  type: "document",
  groups: [
    { name: "hero", title: "Hero" },
    { name: "highlights", title: "Highlights & Popups" },
    { name: "check", title: "Bernd-Wiese-Check" },
  ],
  fields: [
    // ── HERO ──────────────────────────────────────────────────────────────
    defineField({
      name: "toolName",
      title: "Eyebrow (Tool-Name)",
      type: "string",
      group: "hero",
      initialValue: "Coachbot",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "heroHeadline",
      title: "Hero-Titel",
      type: "string",
      group: "hero",
      description: "Für kursive Hervorhebungen <em>...</em> verwenden.",
    }),
    defineField({
      name: "heroEinleitung",
      title: "Hero Einleitungstext",
      type: "text",
      rows: 4,
      group: "hero",
    }),

    // ── HIGHLIGHTS (PILLS & POPUPS) ───────────────────────────────────────
    defineField({
      name: "highlights",
      title: "Highlights (Die drei Knöpfe)",
      type: "array",
      group: "highlights",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "titel", title: "Knopf-Text (Titel)", type: "string" }),
            defineField({ name: "text", title: "Beschreibung", type: "text", rows: 2 }),
            defineField({ name: "popupText", title: "Popup Inhalt (Eigendefinierter Text)", type: "text", rows: 4 }),
          ],
        },
      ],
    }),

    // ── BERND WIESE CHECK ─────────────────────────────────────────────────
    defineField({
      name: "checkTitel",
      title: "Check Sektions-Titel",
      type: "string",
      group: "check",
    }),
    defineField({
      name: "checkTextLead",
      title: "Lead-Text (Warum empfehle ich dieses Tool?)",
      type: "text",
      rows: 4,
      group: "check",
    }),
    defineField({
      name: "ctaButtonText",
      title: "CTA Button Text",
      type: "string",
      group: "check",
    })
  ],
});
