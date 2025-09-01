/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ['pg', 'drizzle-orm'],
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        dns: false,
        child_process: false,
        tls: false,
        pg: false,
        'pg-native': false,
      };
    }
    return config;
  },
};

module.exports = nextConfig;
