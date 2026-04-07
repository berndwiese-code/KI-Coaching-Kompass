import { defineField, defineType, defineArrayMember } from "sanity";

export const kiCoaching = defineType({
  name: "kiCoaching",
  title: "KI-Coaching",
  type: "document",
  fields: [
    defineField({ name: "navCta", type: "string", title: "Nav Button Text" }),
    defineField({ name: "navCtaUrl", type: "string", title: "Nav Button Link" }),
    defineField({ name: "heroEyebrow", type: "string", title: "Hero Eyebrow" }),
    defineField({ 
      name: "heroTitle", 
      type: "string", 
      title: "Hero Titel (HTML erlaubt)",
      description: "Erlaubt <br/> und <em>...</em>"
    }),
    defineField({ name: "heroLead", type: "text", title: "Hero Lead" }),
    defineField({
      name: "cards",
      title: "Karten",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "icon", type: "string", title: "Emoji Icon" }),
            defineField({ name: "label", type: "string", title: "Dachzeile" }),
            defineField({ name: "title", type: "string", title: "Titel" }),
            defineField({ name: "body", type: "text", title: "Text body" }),
            defineField({ name: "arrowText", type: "string", title: "Link Text" }),
            defineField({ name: "url", type: "string", title: "URL (lokal oder extern)" }),
          ]
        })
      ]
    }),
    defineField({
      name: "links",
      title: "Weiterführende Links (Footer-nah)",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "label", type: "string", title: "Link Text" }),
            defineField({ name: "url", type: "string", title: "URL" }),
          ]
        })
      ]
    })
  ]
});
