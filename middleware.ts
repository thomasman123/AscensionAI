import { NextRequest, NextResponse } from 'next/server'

export async function middleware(request: NextRequest) {
  const hostname = request.headers.get('host')
  const url = request.nextUrl.clone()
  
  // Skip middleware for internal app routes, API routes, and static files
  if (
    url.pathname.startsWith('/api/') ||
    url.pathname.startsWith('/_next/') ||
    url.pathname.startsWith('/static/') ||
    url.pathname.includes('.') ||
    hostname?.includes('localhost') ||
    hostname?.includes('127.0.0.1') ||
    hostname?.includes('ascension-ai-sm36.vercel.app')
  ) {
    return NextResponse.next()
  }

  // Handle custom domains
  if (hostname && !hostname.includes('ascension-ai-sm36.vercel.app')) {
    console.log('Custom domain detected:', hostname)
    
    // Rewrite to the funnel viewer with the custom domain as a parameter
    url.pathname = `/funnel-viewer`
    url.searchParams.set('domain', hostname)
    url.searchParams.set('path', request.nextUrl.pathname)
    
    console.log('Rewriting to:', url.pathname + url.search)
    return NextResponse.rewrite(url)
  }

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