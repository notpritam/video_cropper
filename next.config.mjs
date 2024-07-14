import { config } from "dotenv";

/** @type {import('next').NextConfig} */
const nextConfig = {
  headers: async () => {
    return [
      {
        source: "/",
        headers: [
          {
            key: "Cross-Origin-Embedder-Policy",
            value: "require-corp",
          },
          {
            key: "Cross-Origin-Opener-Policy",
            value: "same-origin",
          },
        ],
      },
    ];
  },
  webpack: (config) => {
    config.resolve.fallback = { fs: false, child_process: false, vertx: false };
    config.externals.push({
      sharp: "commonjs sharp",
      canvas: "commonjs canvas",
    });

    return config;
  },
};

export default nextConfig;
