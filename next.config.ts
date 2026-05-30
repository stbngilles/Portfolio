import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  // Disable source maps to avoid a Turbopack bug with non-ASCII chars in the project path
  productionBrowserSourceMaps: false,
};

export default nextConfig;
