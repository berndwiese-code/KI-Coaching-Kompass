import { defineField, defineType } from "sanity";

export const artikel = defineType({
  name: "artikel",
  title: "Artikel",
  type: "document",
  fields: [
    defineField({
      name: "titel",
      title: "Titel",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "kategorie",
      title: "Kategorie",
      type: "string",
      options: {
        list: [
          { title: "KI-Grundlagen", value: "grundlagen" },
          { title: "Praxis", value: "praxis" },
          { title: "Tools", value: "tools" },
          { title: "Strategie", value: "strategie" },
        ],
      },
    }),
    defineField({
      name: "excerpt",
      title: "Excerpt",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "inhalt",
      title: "Inhalt",
      type: "array",
      of: [
        {
          type: "block",
          styles: [
            { title: "Normal", value: "normal" },
            { title: "H2", value: "h2" },
            { title: "H3", value: "h3" },
            { title: "Quote", value: "blockquote" },
          ],
          marks: {
            decorators: [
              { title: "Bold", value: "strong" },
              { title: "Italic", value: "em" },
              { title: "Code", value: "code" },
            ],
          },
        },
      ],
    }),
    defineField({
      name: "datum",
      title: "Datum",
      type: "date",
    }),
    defineField({
      name: "autor",
      title: "Autor",
      type: "string",
    }),
  ],
  orderings: [
    {
      title: "Datum (neueste zuerst)",
      name: "datumDesc",
      by: [{ field: "datum", direction: "desc" }],
    },
  ],
});
