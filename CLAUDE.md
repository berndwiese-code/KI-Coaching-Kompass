# KI-Coaching-Kompass — Projektübersicht für Claude

## Stack
- **Framework**: Next.js 15 (App Router), React 18
- **Styling**: Inline `<style>` in JSX — kein Tailwind, kein CSS-Modul. CSS Custom Properties: `--gold`, `--gold2`, `--bg`, `--bg2`, `--surface`, `--text`, `--text2`, `--muted`, `--border`, `--border2`, `--shadow`
- **CMS**: Sanity v5.19 + @sanity/cli v6 + @sanity/client v7 + next-sanity v9.8
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
- **Studio-Deploy**: `npx sanity deploy` direkt aus dem Repo-Root (`C:\Users\bernd\Desktop\KI-Coaching-Kompass`). `sanity.cli.ts` und `sanity.config.ts` liegen im Root — kein separates Studio-Verzeichnis nötig.
- **Studio-URL**: https://ki-coaching-kompass.sanity.studio/ (appId: r3k22vpi0pzm0w5r8qngj3fw)
- **Node.js**: v22.x LTS erforderlich. @sanity/cli v6 funktioniert nicht mit Node.js 20.x (zu alt) oder Node.js 24.x ohne jsdom-Override.
- **jsdom-Override** in package.json nötig: `"overrides": { "@sanity/cli-core": { "jsdom": "24.1.3" } }` — verhindert ESM-Kompatibilitätsfehler mit @asamuzakjp/css-color.
- Alle Seiten haben `??`-Fallbacks, sodass alles auch ohne Sanity-Inhalt funktioniert.

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
