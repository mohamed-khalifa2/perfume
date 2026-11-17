import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The storefront is database-driven and prices are recalculated per request,
  // so routes opt into dynamic rendering explicitly rather than through
  // cacheComponents / partialPrefetching.
  cacheComponents: false,
  partialPrefetching: false,
  experimental: {
    // Server Actions default to a 1 MB request body. Images are optimized in
    // the browser before submission; this headroom covers unoptimized files
    // (older browsers) and multipart overhead.
    serverActions: {
      bodySizeLimit: "12mb",
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.pexels.com",
        pathname: "/photos/**",
      },
      {
        protocol: "https",
        hostname: "picsum.photos",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "fastly.picsum.photos",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
      {
        protocol: "https",
        hostname: "*.supabase.in",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
