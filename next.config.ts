import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Turbopack/webpack can hit file-lock (EBUSY) issues under `.next/` on Windows.
  // Using a separate dist folder avoids collisions with watchers/AV on `.next`.
  distDir: process.env.NEXT_DIST_DIR || "build",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "platform-lookaside.fbsbx.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "media.licdn.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "example.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "*.amazonaws.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "cdn.builder.io",
        port: "",
        pathname: "/**",
      },
    ],
  },
  // Disable request logging to prevent OAuth authorization codes from appearing in terminal
  logging: {
    fetches: {
      fullUrl: false,
    },
  },
  // Proxy /api/data-types and /api/smrc to Express server
  async rewrites() {
    const apiServer = process.env.API_SERVER_URL || "http://localhost:5000";
    return [
      { source: "/api/data-types", destination: `${apiServer}/api/data-types` },
      {
        source: "/api/data-types/:path*",
        destination: `${apiServer}/api/data-types/:path*`,
      },
      { source: "/api/smrc", destination: `${apiServer}/api/smrc` },
      {
        source: "/api/smrc/:path*",
        destination: `${apiServer}/api/smrc/:path*`,
      },
    ];
  },
  // Suppress development server request logs for OAuth callbacks
  onDemandEntries: {
    // Reduce log verbosity
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2,
  },
  // Configure HTTP headers globally
  async headers() {
    return [
      {
        // Apply to all routes
        source: "/:path*",
        headers: [
          {
            key: "Permissions-Policy",
            // Allow camera and microphone for same-origin (video testimonial). Allow unload for SDKs.
            value: "camera=(self), microphone=(self), unload=*, geolocation=()",
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
