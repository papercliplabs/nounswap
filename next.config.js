/** @type {import('next').NextConfig} */
const nextConfig = {
      logging: {
        fetches: {
          fullUrl: true,
          level: "verbose"
        },
      },
}

module.exports = nextConfig
