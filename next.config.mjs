import bundleAnalyzer from "@next/bundle-analyzer";

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "img.clerk.com",
      },
    ],
  },
};

export default withBundleAnalyzer(nextConfig);
// import bundleAnalyzer from "@next/bundle-analyzer";

// const withBundleAnalyzer = bundleAnalyzer({
//   enabled: process.env.ANALYZE === "true",
// });

// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   images: {
//     domains: ["img.clerk.com"],
//   },
// };

// // export default nextConfig;
// export default withBundleAnalyzer(nextConfig);
