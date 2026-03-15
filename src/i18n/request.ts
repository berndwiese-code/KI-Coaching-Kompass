import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = routing.locales.includes(requested as "de" | "en")
    ? (requested as string)
    : routing.defaultLocale;

  return {
    locale,
    messages: (
      await (locale === "de"
        ? import("../messages/de.json")
        : import("../messages/en.json"))
    ).default,
  };
});
