import { Suspense } from 'react'
import { PremiumSpinner } from '@/components/ui/loading'
import FunnelPageClient from './client'
import { supabaseAdmin } from '@/lib/supabase-admin'

// Force dynamic rendering to ensure fresh data
export const dynamic = 'force-dynamic'
export const revalidate = 0

interface FunnelData {
  id: string
  name: string
  type: 'trigger' | 'gateway'
  headline: string
  subheadline: string
  hero_text: string
  cta_text: string
  offer_description: string
  guarantee_text: string
  primary_color: string
  secondary_color: string
  accent_color: string
  logo_url?: string
  vsl_type?: string
  vsl_url?: string
  vsl_title?: string
  calendar_embed_code?: string
  calendar_title?: string
  facebook_pixel_id?: string
  google_analytics_id?: string
  domain?: string
  data?: any
  template_id?: string
  heading?: string
  subheading?: string
  case_studies_heading?: string
  case_studies_subtext?: string
  booking_heading?: string
  footer_text?: string
  status?: string
}

async function getFunnelData(path: string | string[]) {
  const funnelPath = Array.isArray(path) ? path.join('/') : path
  const fullDomain = `ascension-ai-sm36.vercel.app/funnel/${funnelPath}`
  
  console.log('🔍 Server: Loading funnel for path:', funnelPath)
  console.log('🔍 Server: Full domain lookup:', fullDomain)
  
  // First try custom domain
  const { data: customDomain } = await supabaseAdmin
    .from('custom_domains')
    .select(`
      saved_funnels (
        id,
        name,
        type,
        headline,
        subheadline,
        hero_text,
        cta_text,
        offer_description,
        guarantee_text,
        primary_color,
        secondary_color,
        accent_color,
        logo_url,
        vsl_type,
        vsl_url,
        vsl_title,
        calendar_embed_code,
        calendar_title,
        facebook_pixel_id,
        google_analytics_id,
        domain,
        data,
        template_id,
        case_studies_heading,
        case_studies_subtext,
        booking_heading,
        footer_text,
        status
      )
    `)
    .eq('domain', fullDomain.toLowerCase())
    .eq('verified', true)
    .single()

  if (customDomain?.saved_funnels) {
    console.log('✅ Server: Found funnel via custom domain')
    const funnels = customDomain.saved_funnels as any
    return Array.isArray(funnels) ? funnels[0] : funnels
  }

  // Try direct domain match
  const { data: funnel } = await supabaseAdmin
    .from('saved_funnels')
    .select('*')
    .eq('domain', fullDomain.toLowerCase())
    .eq('status', 'published')
    .single()

  if (funnel) {
    console.log('✅ Server: Found funnel via direct domain')
  } else {
    console.log('❌ Server: No funnel found')
  }

  return funnel as FunnelData | null
}

export default async function FunnelPage({ params }: { params: { path: string | string[] } }) {
  const funnel = await getFunnelData(params.path)
  const logoUrl = funnel?.logo_url || funnel?.data?.customization?.logoUrl || null
  
  return (
    <Suspense fallback={<PremiumSpinner logoUrl={logoUrl || undefined} />}>
      <FunnelPageClient params={params} initialFunnel={funnel} initialLogoUrl={logoUrl} />
    </Suspense>
  )
} 