/**
 * scripts/seed-startseite.ts
 *
 * Patches the Sanity "startseite" document with all fallback values from HomeClient.tsx.
 * Uses setIfMissing — existing field values are never overwritten.
 *
 * Prerequisites:
 *   npm install -D tsx dotenv           (or use ts-node)
 *   Set SANITY_WRITE_TOKEN in .env.local (Editor or higher, from sanity.io/manage → API → Tokens)
 *
 * Run:
 *   npx tsx scripts/seed-startseite.ts
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
// Seed data — plain-text equivalents of every ?? fallback in HomeClient.tsx
// ---------------------------------------------------------------------------
const seedData = {
  // ── Hero ──────────────────────────────────────────────────────────────────
  heroEyebrow:    'KI-Coaching Orientierungsplattform',
  heroTitel:      'KI hat kein Ego. Aber es braucht Präsenz.',
  heroUntertitel: 'Orientierung für Menschen, die KI zur persönlichen Reflexion nutzen — oder es vorhaben. Kein Tool-Hype. Kein Selbstoptimierungsversprechen. Nur ehrliche Begleitung.',
  ctaText:        'Auf die Warteliste',
  heroNote:       'Kein Spam. Kein Algorithmus. Nur echte Impulse.',
  heroSuccessMsg: 'Willkommen im Kompass-Kreis. Wir melden uns.',

  // ── Staffelstab ───────────────────────────────────────────────────────────
  staffelEyebrow: 'Das Staffelstab-Modell',
  staffelTitel:   'Vom Gespräch zur KI — und zurück zum Menschen.',
  staffelLead:    'Ein hybrides Begleitformat in vier Phasen: echte menschliche Tiefenarbeit, nahtlos übergeben an einen personalisierten KI-Begleiter — und zurück.',
  staffelSchritte: [
    {
      _key:         'schritt-01',
      nummer:       '01',
      icon:         '◎',
      titel:        'Tiefenhören',
      beschreibung: '1,5–2 Stunden Einzelsitzung. Kein Ratschlag, keine Agenda. Nur der Raum, der entsteht, wenn jemand wirklich zuhört.',
    },
    {
      _key:         'schritt-02',
      nummer:       '02',
      icon:         '⟶',
      titel:        'Staffelübergabe',
      beschreibung: 'Das Transkript der Session wird zur Basis deines persönlichen CoachBots — kontextualisiert, anonymisiert, übergeben.',
    },
    {
      _key:         'schritt-03',
      nummer:       '03',
      icon:         '◈',
      titel:        'KI-Begleitung',
      beschreibung: 'Ein Monat strukturierte Bot-Begleitung: tägliche Reflexionsfragen, Anker-Calls, eigenem Tempo folgen.',
    },
    {
      _key:         'schritt-04',
      nummer:       '04',
      icon:         '◯',
      titel:        'Integration',
      beschreibung: 'Abschlusssitzung mit dem Coach: Was hat sich bewegt? Was bleibt? Was trägt dich weiter?',
    },
  ],
  staffelPreis:      '490 €',
  staffelPreisLabel: 'Einstiegsangebot · inkl. MwSt.',
  staffelCtaText:    'Platz sichern',

  // ── Tools ─────────────────────────────────────────────────────────────────
  toolsEyebrow:   'KI-Tool-Kompass',
  toolsTitel:     'Welches Tool passt zu dir?',
  toolsFooterText: '12 Tools im Vergleich — gefiltert nach deinem Kontext.',
  toolsFooterCta: 'Alle Tools entdecken',

  // ── Artikel ───────────────────────────────────────────────────────────────
  artikelEyebrow: 'Meine Sicht · Artikel',
  artikelTitel:   'Denken über KI — ohne Euphorie, ohne Angst.',

  // ── Testimonials ──────────────────────────────────────────────────────────
  testimonialsEyebrow: 'Stimmen',
  testimonialsTitel:   'Was Menschen sagen, die dabei waren.',
  trustLogos: [
    'ICF Member',
    'Nancy Kline · Thinking Environment',
    'Theory U · Otto Scharmer',
    'Viktor Frankl Institut',
  ],

  // ── Newsletter ────────────────────────────────────────────────────────────
  newsletterEyebrow:   'Warteliste',
  newsletterTitel:     'Bereit, wenn du es bist. Kein Druck.',
  newsletterLead:      'Trag dich ein und erfahre als Erste/r, wenn das Staffelstab-Bundle und der vollständige Tool-Kompass live gehen.',
  newsletterCtaText:   'Eintragen',
  newsletterSuccessMsg: 'Du bist dabei. Bis bald.',

  // ── Footer ────────────────────────────────────────────────────────────────
  footerCopyright: '© 2025 KI-Coaching Kompass · Bernd Schmid · Freiburg',
}

// ---------------------------------------------------------------------------
async function main() {
  console.log(`🔍  Querying Sanity project "${projectId}" (${dataset}) …`)

  const existing = await client.fetch<{ _id: string; _rev: string } | null>(
    `*[_type == "startseite"][0]{ _id, _rev }`
  )

  if (existing) {
    console.log(`📄  Found document: ${existing._id}`)
    console.log('📝  Patching with setIfMissing (existing values are preserved) …')

    const result = await client
      .patch(existing._id)
      .setIfMissing(seedData as Record<string, unknown>)
      .commit()

    console.log(`✅  Patched successfully → rev: ${result._rev}`)
    console.log('    Open the Presentation Tab and click any text to verify overlays.')
  } else {
    console.log('📄  No startseite document found — creating one …')

    const result = await client.create({
      _type: 'startseite',
      ...seedData,
    })

    console.log(`✅  Created new document → _id: ${result._id}`)
  }
}

main().catch(err => {
  console.error('❌  Seed failed:', err.message)
  process.exit(1)
})
