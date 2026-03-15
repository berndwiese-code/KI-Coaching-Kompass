# KI-Coaching-Kompass

Dein Wegweiser für KI-gestütztes Coaching / Your guide to AI-powered coaching.

## Tech Stack

- **Next.js 16** – App Router
- **TypeScript**
- **Tailwind CSS v4**
- **next-intl** – Deutsch / Englisch Internationalisierung

## Sprachstruktur / Language Structure

```
src/
├── app/
│   ├── [locale]/          # Locale-based routing
│   │   ├── layout.tsx     # Locale layout with NextIntlClientProvider
│   │   └── page.tsx       # Home page (translated)
│   ├── globals.css
│   └── layout.tsx         # Root layout shell
├── i18n/
│   ├── routing.ts         # Locale routing config (locales: ['de', 'en'])
│   ├── navigation.ts      # Typed navigation helpers
│   └── request.ts         # Server-side intl request config
└── messages/
    ├── de.json            # German translations
    └── en.json            # English translations
middleware.ts              # Locale detection & redirect
```

Routes:
- `/` → redirect to `/de` (default)
- `/de` → German version
- `/en` → English version

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Adding Translations

Add new keys to both `src/messages/de.json` and `src/messages/en.json`, then use them with:

```tsx
// Server Component
import { getTranslations } from "next-intl/server";
const t = await getTranslations("Namespace");

// Client Component
import { useTranslations } from "next-intl";
const t = useTranslations("Namespace");
```
