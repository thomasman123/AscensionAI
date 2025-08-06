import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function GET(request: NextRequest) {
  try {
    const path = request.nextUrl.searchParams.get('path')
    console.log('🔍 API: Received path:', path)
    
    if (!path) {
      return NextResponse.json({ error: 'Path is required' }, { status: 400 })
    }
    
    const fullDomain = `ascension-ai-sm36.vercel.app/funnel/${path}`
    console.log('🔍 API: Full domain lookup:', fullDomain)
    
    // First try custom domain
    const { data: customDomain, error: customDomainError } = await supabaseAdmin
      .from('custom_domains')
      .select('funnel_id')
      .eq('domain', fullDomain)
      .single()
    
    console.log('🔍 API: Custom domain result:', customDomain, 'error:', customDomainError)
    
    let funnel = null
    
    if (customDomain) {
      const { data, error } = await supabaseAdmin
        .from('funnels')
        .select('logo_url, data')
        .eq('id', customDomain.funnel_id)
        .eq('status', 'published')
        .single()
      
      console.log('🔍 API: Funnel via custom domain:', data, 'error:', error)
      funnel = data
    } else {
      // Try direct domain
      const { data, error } = await supabaseAdmin
        .from('funnels')
        .select('logo_url, data')
        .eq('domain', fullDomain)
        .eq('status', 'published')
        .single()
      
      console.log('🔍 API: Funnel via direct domain:', data, 'error:', error)
      funnel = data
    }
    
    const logoUrl = funnel?.logo_url || funnel?.data?.customization?.logoUrl || null
    console.log('🔍 API: Final logo URL:', logoUrl)
    
    return NextResponse.json({ logoUrl })
  } catch (error) {
    console.error('❌ API: Error fetching funnel logo:', error)
    return NextResponse.json({ logoUrl: null })
  }
} 