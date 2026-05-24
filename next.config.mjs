/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "web-assests.monsterenergy.com"
      },
      {
        protocol: "https",
        hostname: "www.monsterenergy.com"
      }
    ]
  }
};

export default nextConfig;
