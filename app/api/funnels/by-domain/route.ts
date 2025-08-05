import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const domain = searchParams.get('domain')
    
    if (!domain) {
      return NextResponse.json({ 
        error: 'Domain parameter is required' 
      }, { status: 400 })
    }

    console.log('🔍 Looking up funnel for domain:', domain)

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
      console.log('✅ Found funnel via custom domain:', customDomain.funnel_id)
      
      // Transform the funnel data to include customization fields
      const funnel = customDomain.saved_funnels as any
      const transformedFunnel = {
        ...funnel,
        // Map new customization fields to expected fields
        headline: funnel.headline || 'Your Headline Here',
        subheadline: funnel.subheadline || 'Your subheadline here',
        hero_text: funnel.hero_text || 'Your hero text here',
        cta_text: funnel.cta_text || 'Get Started Now',
        offer_description: funnel.offer_description || 'Your offer description',
        guarantee_text: funnel.guarantee_text || 'Your guarantee',
        primary_color: '#3b82f6', // Always use default colors
        secondary_color: '#1e40af',
        accent_color: '#059669',
        background_color: funnel.background_color || '#FFFFFF',
        text_color: funnel.text_color || '#1F2937',
        font_family: funnel.font_family || 'inter',
        theme_style: funnel.theme_style || 'clean',
        facebook_pixel_code: funnel.facebook_pixel_code,
        google_analytics_code: funnel.google_analytics_code,
        custom_tracking_code: funnel.custom_tracking_code
      }
      
      return NextResponse.json({ 
        funnel: transformedFunnel,
        source: 'custom_domain'
      })
    }

    // If not found by custom domain, try exact domain match (case-insensitive)
    console.log('🔍 Trying exact domain match for:', domain)
    const { data: funnel, error: funnelError } = await supabaseAdmin
      .from('saved_funnels')
      .select('*')
      .eq('domain', domain.toLowerCase())
      .eq('status', 'published')
      .single()

    if (funnel) {
      console.log('✅ Found funnel via exact domain match:', funnel.id, 'stored domain:', funnel.domain)
      
      // Transform the funnel data to include customization fields
      const transformedFunnel = {
        ...funnel,
        // Map new customization fields to expected fields
        headline: funnel.headline || 'Your Headline Here',
        subheadline: funnel.subheadline || 'Your subheadline here',
        hero_text: funnel.hero_text || 'Your hero text here',
        cta_text: funnel.cta_text || 'Get Started Now',
        offer_description: funnel.offer_description || 'Your offer description',
        guarantee_text: funnel.guarantee_text || 'Your guarantee',
        primary_color: '#3b82f6', // Always use default colors
        secondary_color: '#1e40af',
        accent_color: '#059669',
        background_color: funnel.background_color || '#FFFFFF',
        text_color: funnel.text_color || '#1F2937',
        font_family: funnel.font_family || 'inter',
        theme_style: funnel.theme_style || 'clean',
        facebook_pixel_code: funnel.facebook_pixel_code,
        google_analytics_code: funnel.google_analytics_code,
        custom_tracking_code: funnel.custom_tracking_code
      }
      
      return NextResponse.json({ 
        funnel: transformedFunnel,
        source: 'default_domain'
      })
    }

    // As a last resort, try pattern matching (this should rarely be needed)
    console.log('🔍 Trying pattern matching fallback for domain:', domain)
    const domainBase = domain.replace('.ascension-ai-sm36.vercel.app', '')
    console.log('🔍 Pattern matching with base:', domainBase)
    
    const { data: patternFunnel, error: patternError } = await supabaseAdmin
      .from('saved_funnels')
      .select('*')
      .ilike('domain', `%${domainBase}%`)  // Search in domain field, not name field
      .eq('status', 'published')
      .limit(1)
      .single()

    if (patternFunnel) {
      console.log('⚠️  Found funnel via pattern matching:', patternFunnel.id, 'stored domain:', patternFunnel.domain, 'This should not happen often!')
      
      // Transform the funnel data to include customization fields
      const transformedFunnel = {
        ...patternFunnel,
        // Map new customization fields to expected fields
        headline: patternFunnel.headline || 'Your Headline Here',
        subheadline: patternFunnel.subheadline || 'Your subheadline here',
        hero_text: patternFunnel.hero_text || 'Your hero text here',
        cta_text: patternFunnel.cta_text || 'Get Started Now',
        offer_description: patternFunnel.offer_description || 'Your offer description',
        guarantee_text: patternFunnel.guarantee_text || 'Your guarantee',
        primary_color: '#3b82f6', // Always use default colors
        secondary_color: '#1e40af',
        accent_color: '#059669',
        background_color: patternFunnel.background_color || '#FFFFFF',
        text_color: patternFunnel.text_color || '#1F2937',
        font_family: patternFunnel.font_family || 'inter',
        theme_style: patternFunnel.theme_style || 'clean',
        facebook_pixel_code: patternFunnel.facebook_pixel_code,
        google_analytics_code: patternFunnel.google_analytics_code,
        custom_tracking_code: patternFunnel.custom_tracking_code
      }
      
      return NextResponse.json({ 
        funnel: transformedFunnel,
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