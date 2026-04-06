/**
 * scripts/seed-workshop.ts
 *
 * Patches the Sanity "workshop" document with all fallback values from WorkshopClient.tsx.
 * Uses setIfMissing — existing field values are never overwritten.
 *
 * Run:
 *   npx tsx scripts/seed-workshop.ts
 */

import { createClient } from '@sanity/client'
import * as dotenv from 'dotenv'
import * as path from 'path'

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset   = process.env.NEXT_PUBLIC_SANITY_DATASET
const token     = process.env.SANITY_WRITE_TOKEN ?? process.env.SANITY_API_READ_TOKEN

if (!projectId || !dataset) {
  console.error('❌  Missing NEXT_PUBLIC_SANITY_PROJECT_ID or NEXT_PUBLIC_SANITY_DATASET in .env.local')
  process.exit(1)
}
if (!token || token === 'REPLACE_WITH_YOUR_TOKEN') {
  console.error('❌  No write token found. Add SANITY_WRITE_TOKEN=<editor-token> to .env.local')
  console.error('    Generate one at: https://sanity.io/manage → project → API → Tokens')
  process.exit(1)
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: '2026-03-18',
  token,
  useCdn: false,
})

// ---------------------------------------------------------------------------
// Seed data — plain-text equivalents of every ?? fallback in WorkshopClient.tsx
// ---------------------------------------------------------------------------
const seedData = {
  heroEyebrow:       'Zweitägiger Online-Workshop',
  heroTitel:         'KI-Coaching im Unternehmen',
  heroUntertitel:    'verstehen \u2014 bewerten \u2014 einführen',
  heroPill1:         '2 Nachmittage à 4 Stunden',
  heroPill2:         'Online via Zoom',
  heroPill3:         'Max. 12 Teilnehmer',
  heroPill4:         '399 EUR pro Person',
  heroCtaPrimary:    'Jetzt anmelden',
  heroCtaSecondary:  'Mehr erfahren',
  ctaTitel:          'Nächster Termin',
  ctaBody:           'Mit Anmeldung erhalten Sie sofort Zugang zu Ihren Vorbereitungsmaterialien und einen Buchungslink für Ihr persönliches Vorgespräch.',
  ctaButton:         'Jetzt anmelden',
  ctaEmail:          'kontakt@ki-coaching-kompass.de',
}

// ---------------------------------------------------------------------------
async function main() {
  console.log(`🔍  Querying Sanity project "${projectId}" (${dataset}) …`)

  const existing = await client.fetch<{ _id: string; _rev: string } | null>(
    `*[_type == "workshop"][0]{ _id, _rev }`
  )

  if (existing) {
    console.log(`📄  Found document: ${existing._id}`)
    console.log('📝  Patching with setIfMissing (existing values are preserved) …')

    const result = await client
      .patch(existing._id)
      .setIfMissing(seedData as Record<string, unknown>)
      .commit()

    console.log(`✅  Patched successfully → rev: ${result._rev}`)
  } else {
    console.log('📄  No workshop document found — creating one …')

    const result = await client.create({
      _type: 'workshop',
      ...seedData,
    })

    console.log(`✅  Created new document → _id: ${result._id}`)
  }
}

main().catch(err => {
  console.error('❌  Seed failed:', err.message)
  process.exit(1)
})
