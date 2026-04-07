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
      description: 'z.B. "KI-Coaching-Software<br /><em>gezielt einsetzen.</em>" (HTML erlaubt)',
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
      name: "unternehmenChallenge",
      title: "Ausgangssituation (Challenge)",
      type: "text",
      group: "unternehmen",
      description: "HTML erlaubt (z.B. <strong>...</strong>)",
    }),
    defineField({
      name: "unternehmenFacts",
      title: "Fakten (Unternehmen)",
      type: "array",
      group: "unternehmen",
      of: [
        {
          type: "object",
          name: "fact",
          fields: [
            { name: "num", type: "string", title: "Zahl/Wert" },
            { name: "label", type: "string", title: "Bezeichnung (HTML erlaubt)" },
          ],
        },
      ],
    }),
    defineField({
      name: "unternehmenLeistungenLabel",
      title: "Leistungen Label",
      type: "string",
      group: "unternehmen",
    }),
    defineField({
      name: "unternehmenLeistungenTitel",
      title: "Leistungen Titel",
      type: "string",
      group: "unternehmen",
      description: "HTML erlaubt (<em>...</em>)",
    }),
    defineField({
      name: "unternehmenLeistungenBody",
      title: "Leistungen Einleitungstext",
      type: "text",
      group: "unternehmen",
    }),
    defineField({
      name: "unternehmenLeistungenListe",
      title: "Leistungen Kacheln",
      type: "array",
      group: "unternehmen",
      of: [
        {
          type: "object",
          name: "leistung",
          fields: [
            { name: "icon", type: "string", title: "Emoji/Icon" },
            { name: "title", type: "string", title: "Titel" },
            { name: "body", type: "text", title: "Beschreibung" },
          ],
        },
      ],
    }),
    defineField({
      name: "unternehmenProzessLabel",
      title: "Vorgehen Label",
      type: "string",
      group: "unternehmen",
    }),
    defineField({
      name: "unternehmenProzessTitel",
      title: "Vorgehen Titel",
      type: "string",
      group: "unternehmen",
      description: "HTML erlaubt",
    }),
    defineField({
      name: "unternehmenProzessListe",
      title: "Prozess Schritte",
      type: "array",
      group: "unternehmen",
      of: [
        {
          type: "object",
          name: "step",
          fields: [
            { name: "number", type: "string", title: "Nummer (z.B. 01)" },
            { name: "title", type: "string", title: "Titel" },
            { name: "body", type: "text", title: "Beschreibung" },
          ],
        },
      ],
    }),
    defineField({
      name: "unternehmenToolsLabel",
      title: "Tool-Landschaft Label",
      type: "string",
      group: "unternehmen",
    }),
    defineField({
      name: "unternehmenToolsTitel",
      title: "Tool-Landschaft Titel",
      type: "string",
      group: "unternehmen",
      description: "HTML erlaubt",
    }),
    defineField({
      name: "unternehmenToolsBody",
      title: "Tool-Landschaft Einleitung",
      type: "text",
      group: "unternehmen",
    }),
    defineField({
      name: "unternehmenToolsListe",
      title: "Tool Cluster",
      type: "array",
      group: "unternehmen",
      of: [
        {
          type: "object",
          name: "cluster",
          fields: [
            { name: "title", type: "string", title: "Kategorie-Titel" },
            { name: "tools", type: "text", title: "Beschreibung & Tools (HTML für <strong>...</strong> erlaubt)" },
          ],
        },
      ],
    }),
    defineField({
      name: "unternehmenCtaTitel",
      title: "CTA-Titel (Unternehmen)",
      type: "string",
      group: "unternehmen",
      description: "HTML erlaubt",
    }),
    defineField({
      name: "unternehmenCtaBody",
      title: "CTA-Text (Unternehmen)",
      type: "text",
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
      name: "coachesChallenge",
      title: "Ausgangssituation (Challenge)",
      type: "text",
      group: "coaches",
      description: "HTML erlaubt (z.B. <strong>...</strong>)",
    }),
    defineField({
      name: "coachesFacts",
      title: "Fakten (Coaches)",
      type: "array",
      group: "coaches",
      of: [
        {
          type: "object",
          name: "fact",
          fields: [
            { name: "num", type: "string", title: "Zahl/Wert" },
            { name: "label", type: "string", title: "Bezeichnung (HTML erlaubt)" },
          ],
        },
      ],
    }),
    defineField({
      name: "coachesLeistungenLabel",
      title: "Leistungen Label",
      type: "string",
      group: "coaches",
    }),
    defineField({
      name: "coachesLeistungenTitel",
      title: "Leistungen Titel",
      type: "string",
      group: "coaches",
      description: "HTML erlaubt (<em>...</em>)",
    }),
    defineField({
      name: "coachesLeistungenBody",
      title: "Leistungen Einleitungstext",
      type: "text",
      group: "coaches",
    }),
    defineField({
      name: "coachesLeistungenListe",
      title: "Leistungen Kacheln",
      type: "array",
      group: "coaches",
      of: [
        {
          type: "object",
          name: "leistung",
          fields: [
            { name: "icon", type: "string", title: "Emoji/Icon" },
            { name: "title", type: "string", title: "Titel" },
            { name: "body", type: "text", title: "Beschreibung" },
          ],
        },
      ],
    }),
    defineField({
      name: "coachesToolsLabel",
      title: "Tool-Landschaft Label",
      type: "string",
      group: "coaches",
    }),
    defineField({
      name: "coachesToolsTitel",
      title: "Tool-Landschaft Titel",
      type: "string",
      group: "coaches",
      description: "HTML erlaubt",
    }),
    defineField({
      name: "coachesToolsBody",
      title: "Tool-Landschaft Einleitung",
      type: "text",
      group: "coaches",
    }),
    defineField({
      name: "coachesToolsListe",
      title: "Tool Cluster",
      type: "array",
      group: "coaches",
      of: [
        {
          type: "object",
          name: "cluster",
          fields: [
            { name: "title", type: "string", title: "Kategorie-Titel" },
            { name: "tools", type: "text", title: "Beschreibung & Tools (HTML für <strong>...</strong> erlaubt)" },
          ],
        },
      ],
    }),
    defineField({
      name: "coachesProzessLabel",
      title: "Vorgehen Label",
      type: "string",
      group: "coaches",
    }),
    defineField({
      name: "coachesProzessTitel",
      title: "Vorgehen Titel",
      type: "string",
      group: "coaches",
      description: "HTML erlaubt",
    }),
    defineField({
      name: "coachesProzessListe",
      title: "Prozess Schritte",
      type: "array",
      group: "coaches",
      of: [
        {
          type: "object",
          name: "step",
          fields: [
            { name: "number", type: "string", title: "Nummer (z.B. 01)" },
            { name: "title", type: "string", title: "Titel" },
            { name: "body", type: "text", title: "Beschreibung" },
          ],
        },
      ],
    }),
    defineField({
      name: "coachesCtaTitel",
      title: "CTA-Titel (Coaches)",
      type: "string",
      group: "coaches",
      description: "HTML erlaubt",
    }),
    defineField({
      name: "coachesCtaBody",
      title: "CTA-Text (Coaches)",
      type: "text",
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
      group: "hero",
      description: "Gilt für alle CTA-Buttons auf der Seite",
    }),
  ],
});
