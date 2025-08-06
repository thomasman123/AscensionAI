import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const domain = searchParams.get('domain')
    
    if (!domain) {
      return NextResponse.json({ error: 'Domain parameter is required' }, { status: 400 })
    }

    // First try custom domain
    const { data: customDomain } = await supabaseAdmin
      .from('custom_domains')
      .select(`
        saved_funnels (
          logo_url,
          data
        )
      `)
      .eq('domain', domain.toLowerCase())
      .eq('verified', true)
      .single()

    if (customDomain?.saved_funnels) {
      const funnel = customDomain.saved_funnels as any
      const logoUrl = funnel.logo_url || funnel.data?.customization?.logoUrl
      return NextResponse.json({ logoUrl })
    }

    // Try direct domain match
    const { data: funnel } = await supabaseAdmin
      .from('saved_funnels')
      .select('logo_url, data')
      .eq('domain', domain.toLowerCase())
      .eq('status', 'published')
      .single()

    if (funnel) {
      const logoUrl = funnel.logo_url || funnel.data?.customization?.logoUrl
      return NextResponse.json({ logoUrl })
    }

    return NextResponse.json({ logoUrl: null })
  } catch (error) {
    console.error('Error fetching logo:', error)
    return NextResponse.json({ logoUrl: null })
  }
} 