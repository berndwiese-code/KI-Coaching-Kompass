import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  // All supported locales
  locales: ["de", "en"],

  // Default locale when no prefix matches
  defaultLocale: "de",
});
