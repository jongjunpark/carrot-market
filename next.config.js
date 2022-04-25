/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    reactRoot: true,
    // runtime: "nodejs",
    // serverComponents: true,
  },
  images: {
    domains: ["imagedelivery.net", "images.knotehow.com"],
  },
};

module.exports = nextConfig;
