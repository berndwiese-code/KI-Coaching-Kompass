import { createClient } from '@sanity/client'
import * as dotenv from 'dotenv'
import * as path from 'path'

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

// Sanity Client initialisieren
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: '2026-03-18',
  token: process.env.SANITY_WRITE_TOKEN, // Das ist der Editor-Token aus deiner .env.local
  useCdn: false,
})

async function main() {
  console.log('Sende Befehl an Sanity...')
  // Holen wir uns das Startseiten-Dokument
  const existing = await client.fetch(`*[_type == "startseite"][0]{ _id }`)
  
  if (existing) {
    // Ändern wir den Wert live in der Datenbank
    const result = await client
      .patch(existing._id)
      .set({ footerCopyright: '© 2025 KI-Coaching Kompass · Bernd Wiese · Freiburg' })
      .commit()
      
    console.log(`Erfolg! Copyright wurde repariert in Dokument: ${result._id}`)
  } else {
    console.log('Fehler: Die Startseite wurde in Sanity nicht gefunden.')
  }
}

main().catch(err => {
  console.error('Fehler aufgetreten:', err.message)
  process.exit(1)
})
