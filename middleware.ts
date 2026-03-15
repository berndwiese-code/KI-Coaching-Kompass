import createMiddleware from "next-intl/middleware";
import { routing } from "./src/i18n/routing";

export default createMiddleware(routing);

export const config = {
  // Match all pathnames except:
  // - /api/* (API routes)
  // - /_next/* (Next.js internals)
  // - /_vercel/* (Vercel internals)
  // - Paths containing a dot (static files like favicon.ico)
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*) "],
};
