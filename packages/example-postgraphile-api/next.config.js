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
  redirects() {
    return [
      {
        destination: "/api/graphiql",
        permanent: false,
        source: "/",
      },
    ];
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
