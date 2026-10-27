import type { NextConfig } from "next";
import { withBotId } from "botid/next/config";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // keep the dev badge out of screenshots, the OG render and the event-screen film
  devIndicators: false,
  // the brochure travels with the registration function: it is attached to the confirmation email
  outputFileTracingIncludes: {
    "/api/register": ["./src/assets/the-next-order-brochure.pdf"],
  },
  async redirects() {
    return [
      // V2 became the site: its old preview address goes home
      { source: "/v2", destination: "/", permanent: false },
      // the brochure (page 3, with its QR code) prints the first address: it lands on the event's own domain
      {
        source: "/:path*",
        has: [{ type: "host", value: "thenextorder.vercel.app" }],
        destination: "https://thenextorder.events/:path*",
        permanent: true,
      },
    ];
  },
};

export default withBotId(nextConfig);
