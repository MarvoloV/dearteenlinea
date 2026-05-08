import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "8000",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "studio.qullqa.art",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "dearteenlinea.com",
        pathname: "/wp-content/uploads/**",
      },
      {
        protocol: "https",
        hostname: "www.dearteenlinea.com",
        pathname: "/wp-content/uploads/**",
      },
    ],
  },
};

export default nextConfig;
