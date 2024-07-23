/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.resolve.fallback = { fs: false };

    return config;
  },
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
  },
  redirects: () => {
    return [
      {
        source: '/stats',
        destination: '/stats/treasury',
        permanent: true,
      },
    ]
  }
}

module.exports = nextConfig
