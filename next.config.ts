import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack(config) {
    // Sanity v5 ESM chunks import { useEffectEvent } from 'react' as a named ESM import.
    // React uses a CJS build and webpack's static analysis cannot confirm the named export
    // exists, causing a build error. The export DOES exist at runtime in React 19.
    // Setting exportsPresence to 'warn' downgrades this from a fatal error to a warning.
    if (!config.module) config.module = {};
    if (!config.module.parser) config.module.parser = {};
    const parser = config.module.parser as Record<string, Record<string, unknown>>;
    parser.javascript = { ...(parser.javascript ?? {}), exportsPresence: "warn" };
    return config;
  },
};

export default nextConfig;
