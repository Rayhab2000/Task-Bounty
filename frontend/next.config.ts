import type { NextConfig } from "next";
import { getNextSecurityHeadersConfig } from "./security-headers.mjs";

const nextConfig: NextConfig = {
  async headers() {
    return getNextSecurityHeadersConfig();
  },
};

export default nextConfig;
