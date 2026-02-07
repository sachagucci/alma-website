import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === 'production';

const nextConfig: NextConfig = {
  output: 'export',
  // GitHub Pages deploys to https://sachagucci.github.io/website/
  basePath: isProd ? '/website' : '',
  assetPrefix: isProd ? '/website/' : '',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
