import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/games",
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
