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

    // Add support for regenerator-runtime
    config.resolve.alias = {
      ...config.resolve.alias,
      'regenerator-runtime/runtime': require.resolve('regenerator-runtime/runtime'),
    };

    return config;
  },
};

module.exports = nextConfig;
