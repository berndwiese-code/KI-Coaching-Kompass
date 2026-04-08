import type {StructureResolver} from 'sanity/structure'

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Seiten & Inhalte')
    .items([
      // EINZELSEITEN (mit Liste, um UUID-Fehler der Vergangenheit aufzufangen)
      S.listItem()
        .title('Startseite')
        .child(S.documentTypeList('startseite').title('Startseite (Klicken zum Bearbeiten)')),
      S.listItem()
        .title('Workshop')
        .child(S.documentTypeList('workshop').title('Workshop (Klicken zum Bearbeiten)')),
      S.listItem()
        .title('Beratung')
        .child(S.documentTypeList('beratung').title('Beratung (Klicken zum Bearbeiten)')),
      S.listItem()
        .title('Zuhören')
        .child(S.documentTypeList('zuhoeren').title('Zuhören (Klicken zum Bearbeiten)')),
      S.listItem()
        .title('Über mich')
        .child(S.documentTypeList('ueberMich').title('Über mich (Klicken zum Bearbeiten)')),
      S.listItem()
        .title('KI-Coaching (Hub)')
        .child(S.documentTypeList('kiCoaching').title('KI-Coaching (Hub) (Klicken)')),
      S.listItem()
        .title('Seraia')
        .child(S.documentTypeList('seraia').title('Seraia (Klicken zum Bearbeiten)')),
      S.listItem()
        .title('Sapericus')
        .child(S.documentTypeList('sapericus').title('Sapericus (Klicken zum Bearbeiten)')),
      S.listItem()
        .title('Coachbot')
        .child(S.documentTypeList('coachbot').title('Coachbot (Klicken zum Bearbeiten)')),
      
      S.divider(),
      
      // LISTEN (Multi-Documents)
      ...S.documentTypeListItems().filter(listItem => 
        !['startseite', 'workshop', 'beratung', 'zuhoeren', 'ueberMich', 'kiCoaching', 'seraia', 'sapericus', 'coachbot'].includes(listItem.getId() as string)
      )
    ])
