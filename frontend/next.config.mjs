/** @type {import('next').NextConfig} */
const nextConfig = {
  // Deploys build into a separate folder and swap it in, so the running site keeps its assets during the build.
  distDir: process.env.NEXT_DIST_DIR || ".next",
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "i.ytimg.com" },
      { protocol: "https", hostname: "img.youtube.com" }
    ]
  }
};

export default nextConfig;

