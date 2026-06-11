/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // Static export for GitHub Pages hosting
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
