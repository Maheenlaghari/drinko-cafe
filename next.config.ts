import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    agentFeedback: true,
    cpus: 1,
  },
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
