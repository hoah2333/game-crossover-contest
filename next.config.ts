import type { NextConfig } from "next";

const nextConfig: NextConfig = { reactCompiler: true, images: { remotePatterns: [{ hostname: "www.wikidot.com" }] } };

export default nextConfig;
