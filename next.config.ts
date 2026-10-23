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
  // V2 became the site: its old preview address goes home
  async redirects() {
    return [{ source: "/v2", destination: "/", permanent: false }];
  },
};

export default withBotId(nextConfig);
