import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  // All supported locales
  locales: ["de", "en"],

  // Default locale – used when no locale prefix matches
  defaultLocale: "de",

  // Always prefix all routes (/de, /en)
  localePrefix: "always",

  // Disable Accept-Language auto-detection: prevents `negotiator` (CJS package)
  // from being called in Vercel Edge Runtime, which can cause MIDDLEWARE_INVOCATION_FAILED.
  // Users are redirected to /de by default and can switch to /en manually.
  localeDetection: false,

  // Disable locale cookie to prevent syncCookie.js from calling
  // getAcceptLanguageLocale → negotiator on every first request.
  localeCookie: false,
});
