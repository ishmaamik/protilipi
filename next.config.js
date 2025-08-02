/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    proxyTimeout: true,
    workerThreads: true,
  },
  webpack: (config, { isServer }) => {
    // Ignore missing test files during build
    if (!isServer) {
      config.resolve.fallback = {
        fs: false,
      };
    }
    return config;
  },
};

module.exports = nextConfig;
