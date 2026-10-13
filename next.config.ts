import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,

  // Project screenshots / diagrams will live under public/images once supplied.
  // Add remote domains here only if media ever gets hosted externally.
  images: {
    formats: ["image/avif", "image/webp"],
  },

  };

export default nextConfig;
