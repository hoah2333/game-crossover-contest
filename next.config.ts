import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  images: { remotePatterns: [{ hostname: "www.wikidot.com" }] },
  turbopack: { rules: { "*.svg": { loaders: ["@svgr/webpack"], as: "*.js" } } },
};

export default nextConfig;
