import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Standalone mode bundles the server + minimal node_modules for Electron packaging
  output: "standalone",
};

export default nextConfig;
