/** @type {import('next').NextConfig} */
const repoName = process.env.GITHUB_REPOSITORY?.split("/")[1] ?? "";
const isUserSite = repoName.endsWith(".github.io");
const inferredGithubBasePath =
  process.env.GITHUB_ACTIONS === "true" && repoName && !isUserSite ? `/${repoName}` : "";
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? inferredGithubBasePath;

const nextConfig = {
  output: "export",
  trailingSlash: true,
  basePath: basePath || undefined,
  assetPrefix: basePath || undefined,
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath
  },
  images: {
    unoptimized: true,
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
