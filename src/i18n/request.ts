import { getRequestConfig } from "next-intl/server";
import { hasLocale } from "next-intl";
import { routing } from "./routing";

export default getRequestConfig(async ({ requestLocale }) => {
  // Validate locale from request
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  // Use explicit imports so bundlers (Turbopack/Webpack) can statically
  // analyse the module graph – dynamic template-literal imports are not supported.
  const messages = (
    await (locale === "de"
      ? import("../messages/de.json")
      : import("../messages/en.json"))
  ).default;

  return { locale, messages };
});
