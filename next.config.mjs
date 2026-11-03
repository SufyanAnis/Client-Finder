/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  async redirects() {
    // The old inbound "Request services" form became the public contact page.
    return [
      { source: "/request", destination: "/contact", permanent: true },
      // personal project — nothing is sold
      { source: "/pricing/:path*", destination: "/", permanent: false },
      { source: "/refund-policy", destination: "/terms", permanent: false },
    ];
  },
  async headers() {
    return [{
      source: "/:path*",
      headers: [
        { key: "X-Content-Type-Options", value: "nosniff" },
        { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
      ],
    }];
  },
};

export default nextConfig;
