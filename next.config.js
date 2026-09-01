/** @type {import('next').NextConfig} */
const nextConfig = {
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
