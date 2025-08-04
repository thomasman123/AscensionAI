import { NextRequest, NextResponse } from 'next/server'

export async function middleware(request: NextRequest) {
  const hostname = request.headers.get('host')
  const url = request.nextUrl.clone()
  
  console.log('🔍 Middleware - Hostname:', hostname)
  console.log('🔍 Middleware - URL pathname:', url.pathname)
  console.log('🔍 Middleware - Original URL:', request.url)
  
  // Skip middleware for internal app routes, API routes, and static files
  const shouldSkip = (
    url.pathname.startsWith('/api/') ||
    url.pathname.startsWith('/_next/') ||
    url.pathname.startsWith('/static/') ||
    url.pathname.includes('.') ||
    hostname?.includes('localhost') ||
    hostname?.includes('127.0.0.1') ||
    hostname === 'ascension-ai-sm36.vercel.app' || // Only skip the exact main domain, not subdomains
    // Skip deployment URLs that contain project/user identifiers
    hostname?.includes('-thomas-8419s-projects.vercel.app') ||
    hostname?.match(/^ascension-ai-sm36-[a-z0-9]+-.*\.vercel\.app$/)
  )
  
  if (shouldSkip) {
    console.log('🔍 Middleware - Skipping for:', hostname, 'pathname:', url.pathname, 'reasons:', {
      api: url.pathname.startsWith('/api/'),
      next: url.pathname.startsWith('/_next/'),
      static: url.pathname.startsWith('/static/'),
      hasDot: url.pathname.includes('.'),
      localhost: hostname?.includes('localhost'),
      mainDomain: hostname === 'ascension-ai-sm36.vercel.app',
      deployment: hostname?.includes('-thomas-8419s-projects.vercel.app'),
      pattern: hostname?.match(/^ascension-ai-sm36-[a-z0-9]+-.*\.vercel\.app$/)
    })
    return NextResponse.next()
  }

  // Handle custom domains AND subdomains of our Vercel app (but not the main domain)
  const isCustomDomain = hostname && !hostname.includes('vercel.app')
  const isSubdomain = hostname && hostname.endsWith('.ascension-ai-sm36.vercel.app') && hostname !== 'ascension-ai-sm36.vercel.app'
  
  if (isCustomDomain || isSubdomain) {
    console.log('✅ Funnel domain detected:', hostname, 'type:', isCustomDomain ? 'custom' : 'subdomain')
    
    // Rewrite to the funnel viewer with the custom domain as a parameter
    url.pathname = `/funnel-viewer`
    url.searchParams.set('domain', hostname)
    url.searchParams.set('path', request.nextUrl.pathname)
    
    console.log('✅ Rewriting to:', url.pathname + url.search)
    console.log('✅ Search params after set:', url.searchParams.toString())
    return NextResponse.rewrite(url)
  }

  console.log('🔍 Middleware - No action taken for:', hostname)
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
} 