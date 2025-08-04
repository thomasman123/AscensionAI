import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const domain = searchParams.get('domain')
    
    if (!domain) {
      return NextResponse.json({ 
        error: 'Domain parameter is required' 
      }, { status: 400 })
    }

    console.log('Looking up funnel for domain:', domain)

    // First try to find by custom domain
    let { data: customDomain, error: customDomainError } = await supabaseAdmin
      .from('custom_domains')
      .select(`
        funnel_id,
        verified,
        saved_funnels (*)
      `)
      .eq('domain', domain.toLowerCase())
      .eq('verified', true)
      .single()

    if (customDomain && customDomain.saved_funnels) {
      console.log('Found funnel via custom domain:', customDomain.funnel_id)
      return NextResponse.json({ 
        funnel: customDomain.saved_funnels,
        source: 'custom_domain'
      })
    }

    // If not found by custom domain, try default domain format
    const { data: funnel, error: funnelError } = await supabaseAdmin
      .from('saved_funnels')
      .select('*')
      .eq('domain', domain)
      .eq('status', 'published')
      .single()

    if (funnel) {
      console.log('Found funnel via default domain:', funnel.id)
      return NextResponse.json({ 
        funnel,
        source: 'default_domain'
      })
    }

    // Try matching against domain patterns
    const domainBase = domain.replace('.ascension-ai-sm36.vercel.app', '')
    const { data: patternFunnel, error: patternError } = await supabaseAdmin
      .from('saved_funnels')
      .select('*')
      .ilike('name', `%${domainBase}%`)
      .eq('status', 'published')
      .limit(1)
      .single()

    if (patternFunnel) {
      console.log('Found funnel via pattern matching:', patternFunnel.id)
      return NextResponse.json({ 
        funnel: patternFunnel,
        source: 'pattern_match'
      })
    }

    console.log('No funnel found for domain:', domain)
    return NextResponse.json({ 
      error: 'Funnel not found for this domain' 
    }, { status: 404 })

  } catch (error) {
    console.error('Error looking up funnel by domain:', error)
    return NextResponse.json({ 
      error: 'Failed to lookup funnel' 
    }, { status: 500 })
  }
} 