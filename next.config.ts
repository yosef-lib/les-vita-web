import type { NextConfig } from "next";

// next-pwa tidak kompatibel dengan Turbopack, gunakan webpack saja untuk production
const isProd = process.env.NODE_ENV === "production";

let nextConfig: NextConfig = {
  turbopack: {},
};

if (isProd) {
  const withPWA = require("next-pwa")({
    dest: "public",
    register: true,
    skipWaiting: true,
    sw: "sw.js",
    disable: false,
  });
  module.exports = withPWA(nextConfig);
} else {
  module.exports = nextConfig;
}
