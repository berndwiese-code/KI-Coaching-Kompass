import { NextRequest, NextResponse } from "next/server";

// Pure Next.js middleware – no next-intl dependency.
// next-intl's createMiddleware pulls in `negotiator` (CJS-only) which
// crashes on Vercel's V8 Edge Runtime regardless of localeDetection setting.
// Locale detection (getRequestConfig) still runs server-side, unaffected.

const locales = ["de", "en"] as const;
const defaultLocale = "de";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Already has a valid locale prefix → pass through
  const hasLocale = locales.some(
    (locale) =>
      pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)
  );
  if (hasLocale) return NextResponse.next();

  // Redirect bare path to default locale
  const url = request.nextUrl.clone();
  url.pathname = `/${defaultLocale}${pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)" ],
};
