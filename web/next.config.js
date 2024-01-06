/** @type {import('next').NextConfig} */
const nextConfig = {
      logging: {
        fetches: {
          fullUrl: true,
          level: "verbose"
        },
      },
      experimental: {
        windowHistorySupport: true,
      },
}

module.exports = nextConfig
