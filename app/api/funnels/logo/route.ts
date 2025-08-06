import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function GET(request: NextRequest) {
  try {
    const path = request.nextUrl.searchParams.get('path')
    console.log('🔍 API: Received path:', path)
    
    if (!path) {
      return NextResponse.json({ error: 'Path is required' }, { status: 400 })
    }
    
    // Handle legacy subdomain pattern (e.g., electricians-scale-to-100kmo-t2mucm.ascension-ai-sm36.vercel.app)
    const cleanPath = path.replace('.ascension-ai-sm36.vercel.app', '')
    const fullDomain = `ascension-ai-sm36.vercel.app/funnel/${cleanPath}`
    
    console.log('🔍 API: Clean path:', cleanPath)
    console.log('🔍 API: Full domain lookup:', fullDomain)
    
    // First try custom domain
    const { data: customDomain, error: customDomainError } = await supabaseAdmin
      .from('custom_domains')
      .select(`
        saved_funnels (
          logo_url,
          data
        )
      `)
      .eq('domain', fullDomain.toLowerCase())
      .eq('verified', true)
      .single()
    
    console.log('🔍 API: Custom domain result:', customDomain, 'error:', customDomainError)
    
    if (customDomain?.saved_funnels) {
      const funnels = customDomain.saved_funnels as any
      const funnel = Array.isArray(funnels) ? funnels[0] : funnels
      const logoUrl = funnel?.logo_url || funnel?.data?.customization?.logoUrl || null
      console.log('🔍 API: Found logo via custom domain:', logoUrl)
      return NextResponse.json({ logoUrl })
    }
    
    // Try direct domain match
    const { data: funnel, error } = await supabaseAdmin
      .from('saved_funnels')
      .select('logo_url, data')
      .eq('domain', fullDomain.toLowerCase())
      .eq('status', 'published')
      .single()
    
    console.log('🔍 API: Direct domain result:', funnel, 'error:', error)
    
    if (funnel) {
      const logoUrl = funnel?.logo_url || funnel?.data?.customization?.logoUrl || null
      console.log('🔍 API: Found logo via direct domain:', logoUrl)
      return NextResponse.json({ logoUrl })
    }
    
    // Legacy fallback: try pattern matching for old-style domains
    if (path.includes('.ascension-ai-sm36.vercel.app')) {
      console.log('🔍 API: Trying legacy pattern matching with base:', cleanPath)
      
      const { data: patternFunnel, error: patternError } = await supabaseAdmin
        .from('saved_funnels')
        .select('logo_url, data')
        .ilike('domain', `%${cleanPath}%`)
        .eq('status', 'published')
        .limit(1)
        .single()
      
      console.log('🔍 API: Pattern match result:', patternFunnel, 'error:', patternError)
      
      if (patternFunnel) {
        const logoUrl = patternFunnel?.logo_url || patternFunnel?.data?.customization?.logoUrl || null
        console.log('🔍 API: Found logo via pattern matching:', logoUrl)
        return NextResponse.json({ logoUrl })
      }
    }
    
    console.log('🔍 API: No logo found')
    return NextResponse.json({ logoUrl: null })
  } catch (error) {
    console.error('❌ API: Error fetching funnel logo:', error)
    return NextResponse.json({ logoUrl: null })
  }
} 