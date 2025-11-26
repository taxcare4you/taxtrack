// next.config.ts
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: 'standalone', // optional — safe to keep or remove for Vercel
};

export default nextConfig;