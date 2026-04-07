import type {StructureResolver} from 'sanity/structure'

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Seiten & Inhalte')
    .items([
      // SINGLETONS
      S.listItem()
        .title('Startseite')
        .child(
          S.document()
            .schemaType('startseite')
            .documentId('startseite')
        ),
      S.listItem()
        .title('Workshop')
        .child(
          S.document()
            .schemaType('workshop')
            .documentId('workshop')
        ),
      S.listItem()
        .title('Beratung')
        .child(
          S.document()
            .schemaType('beratung')
            .documentId('beratung')
        ),
      S.listItem()
        .title('Zuhören')
        .child(
          S.document()
            .schemaType('zuhoeren')
            .documentId('zuhoeren')
        ),
      S.listItem()
        .title('Über mich')
        .child(
          S.document()
            .schemaType('ueberMich')
            .documentId('ueberMich')
        ),
      
      S.divider(),
      
      // LISTEN (Multi-Documents)
      ...S.documentTypeListItems().filter(listItem => 
        !['startseite', 'workshop', 'beratung', 'zuhoeren', 'ueberMich'].includes(listItem.getId() as string)
      )
    ])
