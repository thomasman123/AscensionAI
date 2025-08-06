import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function GET(request: NextRequest) {
  try {
    const path = request.nextUrl.searchParams.get('path')
    
    if (!path) {
      return NextResponse.json({ error: 'Path is required' }, { status: 400 })
    }
    
    const fullDomain = `ascension-ai-sm36.vercel.app/funnel/${path}`
    
    // First try custom domain
    const { data: customDomain } = await supabaseAdmin
      .from('custom_domains')
      .select('funnel_id')
      .eq('domain', fullDomain)
      .single()
    
    let funnel = null
    
    if (customDomain) {
      const { data } = await supabaseAdmin
        .from('funnels')
        .select('logo_url, data')
        .eq('id', customDomain.funnel_id)
        .eq('status', 'published')
        .single()
      
      funnel = data
    } else {
      // Try direct domain
      const { data } = await supabaseAdmin
        .from('funnels')
        .select('logo_url, data')
        .eq('domain', fullDomain)
        .eq('status', 'published')
        .single()
      
      funnel = data
    }
    
    const logoUrl = funnel?.logo_url || funnel?.data?.customization?.logoUrl || null
    
    return NextResponse.json({ logoUrl })
  } catch (error) {
    console.error('Error fetching funnel logo:', error)
    return NextResponse.json({ logoUrl: null })
  }
} 