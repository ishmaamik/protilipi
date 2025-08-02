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
    config.module.rules.push({
      test: /regenerator-runtime/,
      use: 'babel-loader',
    });

    return config;
  },
  compiler: {
    // Enables the SWC compiler
    reactRemoveProperties: true,
    removeConsole: process.env.NODE_ENV === 'production',
  },
};

module.exports = nextConfig;
