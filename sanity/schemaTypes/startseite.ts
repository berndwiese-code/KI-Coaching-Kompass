import { defineField, defineType } from "sanity";

export const startseite = defineType({
  name: "startseite",
  title: "Startseite",
  type: "document",
  fields: [
    defineField({
      name: "heroTitel",
      title: "Hero-Titel",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "heroUntertitel",
      title: "Hero-Untertitel",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "ctaText",
      title: "CTA-Text",
      type: "string",
    }),
  ],
});
