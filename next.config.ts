import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  // Using custom domain almahealth.ca - no basePath needed
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
