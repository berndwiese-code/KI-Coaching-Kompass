import { defineField, defineType } from "sanity";

export const ueberMich = defineType({
  name: "ueberMich",
  title: "Über mich",
  type: "document",
  fields: [
    defineField({ 
      name: "eyebrow", 
      type: "string", 
      title: "Eyebrow" 
    }),
    defineField({ 
      name: "name", 
      type: "string", 
      title: "Name" 
    }),
    defineField({ 
      name: "subname", 
      type: "string", 
      title: "Untername / Rolle" 
    }),
    defineField({ 
      name: "portraitLinkText", 
      type: "string", 
      title: "Bild-Link Text",
      description: "z.B. LinkedIn ↗"
    }),
    defineField({ 
      name: "portraitLinkUrl", 
      type: "url", 
      title: "Bild-Link URL" 
    }),
    defineField({ 
      name: "prose", 
      type: "text", 
      title: "Haupttext (HTML erlaubt)",
      description: "Verwende <p>...</p> für Absätze und <br/> für Zeilenumbrüche bzw. <em>...</em> für kursiv." 
    }),
    defineField({ 
      name: "contactLabel", 
      type: "string", 
      title: "Kontakt Titel" 
    }),
    defineField({ 
      name: "emailText", 
      type: "string", 
      title: "E-Mail Text" 
    }),
    defineField({ 
      name: "emailUrl", 
      type: "string", 
      title: "E-Mail Link (mailto:...)" 
    }),
    defineField({ 
      name: "linkedInText", 
      type: "string", 
      title: "LinkedIn Text" 
    }),
    defineField({ 
      name: "linkedInUrl", 
      type: "url", 
      title: "LinkedIn URL" 
    }),
    defineField({ 
      name: "phoneText", 
      type: "string", 
      title: "Telefon Text" 
    }),
    defineField({ 
      name: "phoneUrl", 
      type: "string", 
      title: "Telefon Link (tel:...)" 
    }),
  ]
});
