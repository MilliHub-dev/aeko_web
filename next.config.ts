import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "dev.aeko.social",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "api.aeko.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "ui-avatars.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "example.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
  typedRoutes: false,
  experimental: {
    serverActions: {
      bodySizeLimit: "100mb",
    },
    // Increase proxy body size limit to avoid "Unexpected end of form"
    proxyTimeout: 60000,
    // Fix "Request body exceeded 10MB" error
    // @ts-ignore
    proxyClientMaxBodySize: "100mb",
  },
};

export default nextConfig;
