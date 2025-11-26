/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,       // disables strict mode warnings
  swcMinify: true,              // enables faster builds with SWC minifier
  eslint: {
    ignoreDuringBuilds: true,   // ignores ESLint errors during production builds
  },
  typescript: {
    ignoreBuildErrors: true,    // ignores TS errors during production builds
  },
  experimental: {
    appDir: true,               // if using the new App Router
  },
};

export default nextConfig;