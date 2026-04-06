/**
 * scripts/seed-beratung.ts
 *
 * Patches the Sanity "beratung" document with all fallback values from BeratungClient.tsx.
 * Uses setIfMissing — existing field values are never overwritten.
 *
 * Run:
 *   npx tsx scripts/seed-beratung.ts
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
// Seed data — plain-text equivalents of every ?? fallback in BeratungClient.tsx
// ---------------------------------------------------------------------------
const seedData = {
  heroEyebrow:           'Beratung',
  heroTitel:             'KI-Coaching-Software gezielt einsetzen.',
  heroLead:              'Der Markt für KI-Coaching-Tools wächst rasant \u2014 über 249 Lösungen, jede mit eigenen Stärken, Risiken und Anwendungsfällen. Ich helfe Unternehmen und Coaches, in diesem Markt die richtige Wahl zu treffen.',
  unternehmenCtaTitel:   'Bereit für den ersten Schritt in Ihrer Organisation?',
  unternehmenCtaBody:    'Ein unverbindliches Erstgespräch klärt, ob und wie KI-Coaching zu Ihrem Unternehmen passt. Ohne Tool-Bias, ohne Verkaufsdruck.',
  unternehmenCtaButton:  'Erstgespräch anfragen',
  coachesCtaTitel:       'Starten Sie mit einem Orientierungsgespräch',
  coachesCtaBody:        '60 Minuten, in denen wir Ihre aktuelle Praxis anschauen und klären, welche KI-Tools für Sie wirklich sinnvoll sind \u2014 und welche nicht.',
  coachesCtaButton:      'Orientierungsgespräch buchen',
  kontaktEmail:          'bernd.wiese@googlemail.com',
}

// ---------------------------------------------------------------------------
async function main() {
  console.log(`🔍  Querying Sanity project "${projectId}" (${dataset}) …`)

  const existing = await client.fetch<{ _id: string; _rev: string } | null>(
    `*[_type == "beratung"][0]{ _id, _rev }`
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
    console.log('📄  No beratung document found — creating one …')

    const result = await client.create({
      _type: 'beratung',
      ...seedData,
    })

    console.log(`✅  Created new document → _id: ${result._id}`)
  }
}

main().catch(err => {
  console.error('❌  Seed failed:', err.message)
  process.exit(1)
})
