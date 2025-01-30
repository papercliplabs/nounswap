/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: config => {
    config.externals.push('pino-pretty', 'lokijs', 'encoding');
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
      {
        protocol: "http",
        hostname: "localhost",
        port: "3001",
        pathname: "/**"
      }
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
  },
}

module.exports = nextConfig
