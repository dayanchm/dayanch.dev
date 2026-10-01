/** @type {import('next').NextConfig} */
const nextConfig = {
  distDir: process.env.NEXT_BUILD_DIR || '.next',
  outputFileTracingRoot: __dirname,
  images: {
    domains: ["blog.bursawebtasarim.biz.tr", "localhost"],
    formats: ["image/webp"]
  },
  reactStrictMode: true,
  compiler: {
    removeConsole: false
  },
};

module.exports = nextConfig;
