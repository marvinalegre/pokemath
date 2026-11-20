import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,

  turbopack: {
    root: "/home/marvin",
  },
};

export default nextConfig;
