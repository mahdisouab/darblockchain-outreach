import type { NextConfig } from "next";

const isExport = process.env.NEXT_EXPORT === "1";
const repoBase = "/darblockchain-outreach";

const nextConfig: NextConfig = {
  ...(isExport && {
    output: "export",
    trailingSlash: true,
    basePath: repoBase,
    assetPrefix: repoBase,
  }),
  images: {
    unoptimized: isExport,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default nextConfig;

