'use client'

import { useState, useEffect, useCallback } from 'react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { renderFunnelTemplate } from '@/lib/funnel-templates'

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

interface FunnelPageClientProps {
  params: { path: string | string[] }
  initialFunnel: FunnelData | null
  initialLogoUrl: string | null
}

export default function FunnelPageClient({ params, initialFunnel, initialLogoUrl }: FunnelPageClientProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [funnel, setFunnel] = useState<FunnelData | null>(initialFunnel)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [isMobileView, setIsMobileView] = useState(false)

  useEffect(() => {
    // Get page from URL params
    const pageParam = parseInt(searchParams.get('page') || '1')
    setCurrentPage(pageParam)
  }, [searchParams])

  useEffect(() => {
    // Detect mobile view
    const checkMobile = () => {
      setIsMobileView(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    // Only load if we don't have initial data
    if (initialFunnel) return

    const loadFunnel = async () => {
      try {
        if (!params.path) {
          setError('No funnel path provided')
          return
        }

        const funnelPath = Array.isArray(params.path) ? params.path.join('/') : params.path
        const fullDomain = `ascension-ai-sm36.vercel.app/funnel/${funnelPath}`
        
        console.log('🔍 Loading funnel for path:', funnelPath)
        console.log('🔍 Full domain lookup:', fullDomain)

        const response = await fetch(`/api/funnels/by-domain?domain=${encodeURIComponent(fullDomain)}`)
        
        if (response.ok) {
          const data = await response.json()
          setFunnel(data.funnel)
          console.log('✅ Funnel loaded successfully:', data.funnel?.name)
        } else {
          const errorData = await response.json()
          console.error('❌ Failed to load funnel:', errorData)
          setError(errorData.error || 'Funnel not found')
        }
      } catch (err) {
        console.error('❌ Error loading funnel:', err)
        setError('Failed to load funnel')
      }
    }

    loadFunnel()
  }, [params.path, initialFunnel])

  if (error || !funnel) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-auto p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            {error || 'Funnel not found'}
          </h1>
          <p className="text-gray-600 mb-6">
            The funnel you're looking for doesn't exist or has been removed.
          </p>
          <button
            onClick={() => router.push('/')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go to Homepage
          </button>
        </div>
      </div>
    )
  }

  const goToNextPage = () => {
    const nextPage = currentPage + 1
    router.push(`${window.location.pathname}?page=${nextPage}`)
  }

  const goToPreviousPage = () => {
    const prevPage = Math.max(1, currentPage - 1)
    router.push(`${window.location.pathname}?page=${prevPage}`)
  }

  // Prepare customization data
  const customization = {
    headline: funnel.data?.customization?.heading || funnel.headline || funnel.heading || 'Welcome',
    subheadline: funnel.data?.customization?.subheading || funnel.subheadline || funnel.subheading || '',
    heroText: funnel.data?.customization?.heroText || funnel.hero_text || '',
    ctaText: funnel.data?.customization?.ctaText || funnel.cta_text || 'Get Started',
    offerDescription: funnel.data?.customization?.offerDescription || funnel.offer_description || '',
    guaranteeText: funnel.data?.customization?.guaranteeText || funnel.guarantee_text || '',
    colors: {
      primary: funnel.primary_color || '#3b82f6',
      secondary: funnel.secondary_color || '#1e40af',
      accent: funnel.accent_color || '#059669'
    },
    caseStudiesHeading: funnel.data?.customization?.caseStudiesHeading || funnel.case_studies_heading || 'Success Stories',
    caseStudiesSubtext: funnel.data?.customization?.caseStudiesSubtext || funnel.case_studies_subtext || 'See what others have achieved',
    bookingHeading: funnel.data?.customization?.bookingHeading || funnel.booking_heading || 'Schedule Your Call',
    footerText: funnel.data?.customization?.footerText || '© 2024 All rights reserved',
    logoUrl: initialLogoUrl || funnel.logo_url || funnel.data?.customization?.logoUrl,
    ...(funnel.data?.customization || {}),
    universalSpacers: funnel.data?.customization?.universalSpacers || {}
  }

  // Get case studies
  const caseStudies = funnel.data?.caseStudies || []

  // Theme styles
  const themeMode = funnel.data?.customization?.funnelTheme || 'light'
  const isDarkTheme = themeMode === 'dark'
  
  const themeStyles = {
    background: isDarkTheme ? '#0f172a' : '#ffffff',
    textPrimary: isDarkTheme ? '#f8fafc' : '#1e293b',
    textSecondary: isDarkTheme ? '#cbd5e1' : '#475569',
    accent: funnel.primary_color || '#3b82f6',
    ctaGradient: `linear-gradient(135deg, ${funnel.primary_color || '#3b82f6'}, ${funnel.secondary_color || '#1e40af'})`,
    sectionBg: isDarkTheme ? 'rgba(30, 41, 59, 0.5)' : 'rgba(248, 250, 252, 0.5)',
    cardBg: isDarkTheme ? 'rgba(51, 65, 85, 0.8)' : 'rgba(255, 255, 255, 0.9)',
    borderColor: isDarkTheme ? 'rgba(148, 163, 184, 0.2)' : 'rgba(148, 163, 184, 0.3)'
  }

  // Render the funnel template
  return (
    <div>
      {renderFunnelTemplate(funnel.template_id || 'trigger-template-1', {
        funnelData: funnel,
        customization,
        caseStudies,
        currentPage,
        isEditor: false,
        goToNextPage,
        currentView: isMobileView ? 'mobile' : 'desktop',
        content: {
          heading: funnel.data?.customization?.heading || funnel.headline || '',
          subheading: funnel.data?.customization?.subheading || funnel.subheadline || '',
          ctaText: funnel.data?.customization?.ctaText || funnel.cta_text || 'Get Started',
          caseStudiesHeading: funnel.data?.customization?.caseStudiesHeading || funnel.case_studies_heading || 'Success Stories',
          caseStudiesSubtext: funnel.data?.customization?.caseStudiesSubtext || funnel.case_studies_subtext || 'See what others have achieved',
          bookingHeading: funnel.data?.customization?.bookingHeading || funnel.booking_heading || 'Book Your Strategy Call',
          heroText: funnel.data?.customization?.heroText || funnel.hero_text || '',
          offerDescription: funnel.data?.customization?.offerDescription || funnel.offer_description || '',
          guaranteeText: funnel.data?.customization?.guaranteeText || funnel.guarantee_text || '',
          footerText: funnel.data?.customization?.footerText || '© 2024 All rights reserved.'
        },
        themeStyles
      })}
    </div>
  )
} 