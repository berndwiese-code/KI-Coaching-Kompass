# KI-Coaching-Kompass — Projektübersicht für Claude

## Stack
- **Framework**: Next.js 15 (App Router), React 18
- **Styling**: Inline `<style>` in JSX — kein Tailwind, kein CSS-Modul. CSS Custom Properties: `--gold`, `--gold2`, `--bg`, `--bg2`, `--surface`, `--text`, `--text2`, `--muted`, `--border`, `--border2`, `--shadow`
- **CMS**: Sanity v5.17.1 + @sanity/client v7 + next-sanity v9.8
- **Hosting**: Vercel (auto-deploy bei git push auf main)
- **Repo lokal**: `C:\Users\bernd\Desktop\KI-Coaching-Kompass`
- **Push-Befehl**: `cd "C:\Users\bernd\Desktop\KI-Coaching-Kompass"; git push`

## Seiten & Komponenten

| Route | Komponente | Sanity-Typ |
|---|---|---|
| `/` | HomeClient.tsx | `startseite` |
| `/workshop` | WorkshopClient.tsx | `workshop` |
| `/beratung` | BeratungClient.tsx | `beratung` |
| `/zuhoeren` | ZuhoerenClient.tsx | `zuhoeren` |
| `/kompass` | KompassClient.tsx | — |

Alle `app/*/page.tsx` sind async Server Components, die Sanity-Daten fetchen und als Props an die Client-Komponente weitergeben. Fallbacks auf Hardcode-Werte mit `??`.

## Sanity-Setup
- **Project ID**: w8oq2446, Dataset: production
- **Schemas**: `sanity/schemaTypes/` — startseite, tools, artikel, testimonials, workshop, beratung, zuhoeren
- **Queries**: `sanity/lib/queries.ts` — je ein Type + getX() pro Seite
- **Studio-Deploy KAPUTT**: `@sanity/cli` max v5.14.1 ist inkompatibel mit `sanity` v5.17.1. `npx sanity deploy` funktioniert nicht. Alle Seiten haben `??`-Fallbacks, sodass alles ohne Sanity-Inhalt funktioniert.

## Offene strategische Entscheidung
Bernd möchte Texte **ohne Code-Änderung, mit der Maus** editieren. Optionen:
1. **Sanity v6 + React 19 Upgrade** — sofortige Live-Updates, einmalig 2-3h Aufwand, etwas Risiko
2. **TinaCMS Migration** — Browser-UI, aber ~2 Min. bis live, 3-4h Aufwand
3. **Status quo** — Text im Code ändern + git push, ~2 Min. bis live

Entscheidung steht noch aus. Nicht anfangen ohne explizite Bestätigung von Bernd.

## Architektur-Regeln (nicht ändern ohne Absprache)
- Kein Tailwind einführen
- Kein `<Image>` von Next.js — wir nutzen `<img>` (ESLint-Regel dafür deaktiviert)
- `react/no-unescaped-entities` deaktiviert (deutsche Anführungszeichen)
- Portrait (`bernd-wiese.jpg`) ist auf Home, Workshop, Beratung — **nicht** auf Kompass
- Alle Seiten: Light/Dark-Mode via localStorage (`kck-theme`), `useState<Theme>`
- Hamburger-Menü: `@media (max-width: 600px)` → `.nav-cta { display: none }`, `.mobile-menu { left: auto; right: 0 }`

## Bilder (in /public/)
- `bernd-wiese.jpg` — Portrait, rechts im Hero, absolut positioniert, ab 900px sichtbar
- `zuhoeren-banner.jpg` — Banner-Bild auf Zuhören-Seite

## ESLint-Overrides (eslint.config.mjs)
```js
"@next/next/no-img-element": "off"
"react/no-unescaped-entities": "off"
"@typescript-eslint/no-unused-vars": "warn"
```

## Git-Workflow
```
# Commit:
git add [dateien]
git commit -m "beschreibung"

# Push (im PowerShell):
cd "C:\Users\bernd\Desktop\KI-Coaching-Kompass"; git push
```
Niemals `--no-verify`. Bei Secrets im Code: GitHub blockt den Push — Secrets durch Platzhalter ersetzen, dann `git commit --amend --no-edit`, dann `git push --force-with-lease`.

## Bekannte Fallstricke
- Deutsche Anführungszeichen `„..."` in JSX-Strings → `\u201e...\u201c` in Template Literals verwenden
- `git push` schlägt fehl bei Supabase-Keys in Python-Skripten (GitHub Secret Scanning)
- Sanity-Daten in Client-Komponenten: immer über Server Component (page.tsx) fetchen und als Props übergeben
