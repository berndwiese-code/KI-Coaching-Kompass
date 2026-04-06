/**
 * scripts/seed-zuhoeren.ts
 *
 * Patches the Sanity "zuhoeren" document with all fallback values from ZuhoerenClient.tsx.
 * Uses setIfMissing — existing field values are never overwritten.
 *
 * Run:
 *   npx tsx scripts/seed-zuhoeren.ts
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
// Seed data — plain-text equivalents of every ?? fallback in ZuhoerenClient.tsx
// ---------------------------------------------------------------------------
const seedData = {
  heroTitel:      'Die meisten Menschen werden gehört. Aber nur selten wirklich.',
  heroSubtitel:   'Hier geht es nicht um Antworten.\nSondern darum, dass du dich selbst wieder hörst.',
  heroCta:        'Gespräch anfragen',
  zitatKlarheit:  '\u201eKlarheit entsteht nicht, weil jemand sie dir gibt. Sondern weil sie in dir bereits da ist.\u201c',
  zitatGespraech: '\u201eUnd genau deshalb entsteht oft das, was sonst schwer zugänglich ist: echte Klarheit.\u201c',
  ctaEyebrow:     'Einladung',
  ctaTitel:       'Wenn du das Gefühl hast, dass es Zeit ist, einmal wirklich gehört zu werden.',
  ctaBody:        'Du musst nichts vorbereiten.\nDu darfst genau so kommen, wie du gerade bist.',
  ctaButton:      'Gespräch anfragen',
  ctaNote:        'Ohne Verpflichtung. Einfach, um es einmal zu erleben.',
  kontaktEmail:   'bernd.wiese@googlemail.com',
}

// ---------------------------------------------------------------------------
async function main() {
  console.log(`🔍  Querying Sanity project "${projectId}" (${dataset}) …`)

  const existing = await client.fetch<{ _id: string; _rev: string } | null>(
    `*[_type == "zuhoeren"][0]{ _id, _rev }`
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
    console.log('📄  No zuhoeren document found — creating one …')

    const result = await client.create({
      _type: 'zuhoeren',
      ...seedData,
    })

    console.log(`✅  Created new document → _id: ${result._id}`)
  }
}

main().catch(err => {
  console.error('❌  Seed failed:', err.message)
  process.exit(1)
})
