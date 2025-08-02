/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["images.pexels.com"],
  },
  experimental: {
    proxyTimeout: 30000,
    workerThreads: true,
  }
};

module.exports = nextConfig;
