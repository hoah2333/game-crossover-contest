import createNextIntlPlugin from "next-intl/plugin";

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  images: {
    remotePatterns: [{ hostname: "*.wikidot.com" }, { hostname: "*.scpwikicn.com" }, { hostname: "*.wdfiles.com" }],
  },
  turbopack: { rules: { "*.svg": { loaders: ["@svgr/webpack"], as: "*.js" } } },
  cacheComponents: true,
};

const withNextIntl = createNextIntlPlugin("./app/lib/i18n/request.ts");

export default withNextIntl(nextConfig);
