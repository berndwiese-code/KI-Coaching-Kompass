import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

// Explicit path ensures the plugin can always find the i18n request config
const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

// next-intl v3's plugin sets experimental.turbo.resolveAlias (Next.js 14/15 era).
// Next.js 16 ignores that deprecated key – the alias is never applied, causing
// "Couldn't find next-intl config file" at runtime.  We set the current key
// (root-level turbopack.resolveAlias) ourselves so the alias is always present.
const nextConfig: NextConfig = {
  turbopack: {
    resolveAlias: {
      "next-intl/config": "./src/i18n/request.ts",
    },
  },
};

export default withNextIntl(nextConfig);
