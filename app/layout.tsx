import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '@/styles/globals.css'
import { AuthProvider } from '@/lib/auth-context'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Ascension AI - Sales Intelligence for Modern Teams',
  description: 'Transform your marketing operations with real-time analytics, AI-powered insights, and seamless team collaboration. Built for performance.',
  keywords: ['sales intelligence', 'real-time analytics', 'team collaboration', 'AI marketing', 'sales automation', 'marketing analytics'],
  authors: [{ name: 'Ascension AI' }],
  creator: 'Ascension AI',
  publisher: 'Ascension AI',
  metadataBase: new URL('https://ascension-ai.com'),
  openGraph: {
    type: 'website',
    title: 'Ascension AI - Sales Intelligence for Modern Teams',
    description: 'Transform your marketing operations with real-time analytics, AI-powered insights, and seamless team collaboration. Built for performance.',
    siteName: 'Ascension AI',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ascension AI - Sales Intelligence for Modern Teams',
    description: 'Transform your marketing operations with real-time analytics, AI-powered insights, and seamless team collaboration. Built for performance.',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} font-sans antialiased`}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
} 