/** @type {import('next').NextConfig} */
const nextConfig = {
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