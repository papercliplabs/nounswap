/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack(config) {
        config.resolve.fallback = {
    
          // if you miss it, all the other options in fallback, specified
          // by next.js will be dropped.
          ...config.resolve.fallback,  
    
          fs: false, // the solution
        };
        
        return config;
      },
      logging: {
        fetches: {
          fullUrl: true,
          level: "verbose"
        },
      },
      headers: () => [
        {
          source: '/',
          headers: [
            {
              key: 'Cache-Control',
              value: 'no-store',
            },
          ],
        },
        {
            source: '/swap:id*',
            headers: [
                {
                key: 'Cache-Control',
                value: 'no-store',
                },
            ],
        },
        {
            source: '/props',
            headers: [
              {
                key: 'Cache-Control',
                value: 'no-store',
              },
            ],
        },
      ],
}

module.exports = nextConfig
