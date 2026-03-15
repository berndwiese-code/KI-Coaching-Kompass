import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

// next-intl v3.26.3 is certified for Next.js 15.
// withNextIntl sets the webpack alias for next-intl/config (required for
// production builds on Vercel which use webpack, not Turbopack).
// We additionally set turbopack.resolveAlias for local Turbopack dev builds.
const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  turbopack: {
    resolveAlias: {
      "next-intl/config": "./src/i18n/request.ts",
    },
  },
};

export default withNextIntl(nextConfig);
