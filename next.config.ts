import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

// Explicit path ensures the plugin can always find the i18n request config
const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {};

export default withNextIntl(nextConfig);
