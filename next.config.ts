import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: '/beratung', destination: '/ki-coaching/beratung', permanent: true },
      { source: '/workshop', destination: '/ki-coaching/workshop', permanent: true },
      { source: '/kompass', destination: '/ki-coaching/kompass', permanent: true },
    ]
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'ALLOWALL',
          },
        ],
      },
    ]
  },
};

export default nextConfig;
