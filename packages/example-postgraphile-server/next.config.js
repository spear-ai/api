/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  experimental: {
    esmExternals: true,
    serverComponentsExternalPackages: [
      "grafast",
      "grafserv",
      "graphile-export",
      "graphql",
      "postgraphile",
      "ruru",
    ],
  },
  poweredByHeader: false,
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
