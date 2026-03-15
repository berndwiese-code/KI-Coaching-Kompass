import createMiddleware from "next-intl/middleware";

export default createMiddleware({
  locales: ["de", "en"],
  defaultLocale: "de",
  localePrefix: "always",

  // Disable Accept-Language / cookie-based locale detection to avoid
  // `negotiator` (CJS) being called in Vercel Edge Runtime.
  localeDetection: false,
});

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
