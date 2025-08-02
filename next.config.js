/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // Remove proxyTimeout as it was incorrectly set
    workerThreads: true,
  },
  compiler: {
    // Enable SWC compiler
    removeConsole: process.env.NODE_ENV === 'production',
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
