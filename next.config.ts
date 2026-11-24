import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // No on-screen route indicator in development: it also showed inside the
  // hero's framed dashboard. Compile and runtime errors still surface.
  devIndicators: false,
};

export default nextConfig;
