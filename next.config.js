/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    VERCEL_TOKEN: process.env.VERCEL_TOKEN,
    VERCEL_PROJECT_ID: process.env.VERCEL_PROJECT_ID,
  },
  images: {
    domains: [
      'localhost',
      'ascension-ai-sm36.vercel.app',
      // Add common image hosting domains
      'hhbqnfglxpolmtarajld.supabase.co',
      'zziqdjirramdmuqrfmbp.supabase.co', // Add your specific Supabase project
      'supabase.co',
      'supabase.com',
      // Add any other domains you might use for images
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
      {
        protocol: 'https',
        hostname: '**.supabase.com',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
  // Allow custom domains to work with the app
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ]
  },
  // Handle custom domains
  async rewrites() {
    return {
      beforeFiles: [
        // Handle funnel viewer for custom domains
        {
          source: '/',
          has: [
            {
              type: 'host',
              value: '(?!.*ascension-ai-sm36\\.vercel\\.app).*',
            },
          ],
          destination: '/funnel-viewer',
        },
      ],
    }
  },
}

module.exports = nextConfig 