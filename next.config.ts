import type { NextConfig } from "next";

// We do NOT use createNextIntlPlugin here.
// The v3 plugin sets experimental.turbo.resolveAlias (deprecated in Next.js 16)
// AND may inject code into all bundles including the Edge middleware.
// Instead we set turbopack.resolveAlias manually – this is sufficient for
// next-intl server-side (getRequestConfig) to locate the config file.
const nextConfig: NextConfig = {
  turbopack: {
    resolveAlias: {
      "next-intl/config": "./src/i18n/request.ts",
    },
  },
};

export default nextConfig;
