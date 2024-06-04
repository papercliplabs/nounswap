/** @type {import('next').NextConfig} */
const nextConfig = {
      reactStrictMode: false,
      logging: {
        fetches: {
          fullUrl: true,
          level: "verbose"
        },
      },
      images: {
        remotePatterns: [
          {
            protocol: "https",
            hostname: "*",
            port: "",
            pathname: "/**"
          },
        ]
      }
}

module.exports = nextConfig
