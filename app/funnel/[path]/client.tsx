'use client'

import { useState, useEffect, useCallback } from 'react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { renderFunnelTemplate } from '@/lib/funnel-templates'
import { PremiumSpinner } from '@/components/ui/loading'

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
  const [loading, setLoading] = useState(true) // Always start with loading true
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [isContentReady, setIsContentReady] = useState(false) // Start false
  const [isMobileView, setIsMobileView] = useState(false)
  
  // Log the logo URL to debug
  console.log('🎨 Client: Initial logo URL:', initialLogoUrl)

  // Preload logo immediately
  useEffect(() => {
    if (initialLogoUrl && !initialLogoUrl.startsWith('data:')) {
      const img = new Image()
      img.src = initialLogoUrl
      console.log('🖼️ Preloading logo:', initialLogoUrl)
    }
  }, [initialLogoUrl])

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
    // Show loading animation even with server-side data
    if (initialFunnel) {
      // Simulate loading for smooth animation
      setTimeout(() => {
        setIsContentReady(true)
      }, 100)
      
      setTimeout(() => {
        setLoading(false)
      }, 500) // Show loading for at least 500ms
      return
    }

    // Only load if we don't have initial data
    const loadFunnel = async () => {
      try {
        if (!params.path) {
          setError('No funnel path provided')
          setLoading(false)
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
          // Logo is already loaded from server, no need to update
          // Immediate content ready signal
          setIsContentReady(true)
          // Complete animation after progress bar reaches 100%
          setTimeout(() => setLoading(false), 150)
        } else {
          const errorData = await response.json()
          console.error('❌ Failed to load funnel:', errorData)
          setError(errorData.error || 'Funnel not found')
          setLoading(false)
        }
      } catch (err) {
        console.error('❌ Error loading funnel:', err)
        setError('Failed to load funnel')
        setLoading(false)
      }
    }

    loadFunnel()
  }, [params.path, initialFunnel])

  if (loading) {
    return <PremiumSpinner isContentReady={isContentReady} logoUrl={initialLogoUrl || undefined} />
  }

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

  const customization = {
    themeMode,
    heading: funnel.heading || funnel.headline || 'Transform Your Business',
    subheading: funnel.subheading || funnel.subheadline || 'Discover the proven system',
    ctaText: funnel.cta_text || 'Get Started Now',
    caseStudiesHeading: funnel.case_studies_heading || 'Success Stories',
    caseStudiesSubtext: funnel.case_studies_subtext || 'See what our clients have achieved',
    bookingHeading: funnel.booking_heading || 'Schedule Your Call',
    footerText: funnel.footer_text || '© 2024 All rights reserved',
    logoUrl: initialLogoUrl || funnel.logo_url || funnel.data?.customization?.logoUrl,
    ...(funnel.data?.customization || {}),
    universalSpacers: funnel.data?.customization?.universalSpacers || {}
  }

  const handleGoToNextPage = () => {
    const nextPage = currentPage + 1
    const newUrl = new URL(window.location.href)
    newUrl.searchParams.set('page', nextPage.toString())
    router.push(newUrl.pathname + newUrl.search)
  }

  return (
    <div style={{ backgroundColor: themeStyles.background }} className="min-h-screen">
      {/* Render Template Content */}
      {renderFunnelTemplate(funnel.template_id || 'trigger-template-1', {
        funnelData: {
          heading: customization.heading,
          subheading: customization.subheading,
          ctaText: customization.ctaText,
          caseStudiesHeading: customization.caseStudiesHeading,
          caseStudiesSubtext: customization.caseStudiesSubtext,
          bookingHeading: customization.bookingHeading,
          footerText: customization.footerText,
          vsl_url: funnel.vsl_url,
          vsl_title: funnel.vsl_title || 'Watch This Important Message',
          template_id: funnel.template_id || 'trigger-template-1',
          name: funnel.name || 'Your Business',
          calendar_embed_code: funnel.calendar_embed_code
        },
        themeStyles,
        isEditor: false,
        caseStudies: funnel.data?.caseStudies || [],
        goToNextPage: handleGoToNextPage,
        currentPage,
        customization,
        currentView: isMobileView ? 'mobile' : 'desktop',
        universalSpacers: funnel.data?.customization?.universalSpacers || {}
      })}
      
      {/* Facebook Pixel */}
      {funnel.facebook_pixel_id && (
        <script
          dangerouslySetInnerHTML={{
            __html: `
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window,document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '${funnel.facebook_pixel_id}');
              fbq('track', 'PageView');
            `
          }}
        />
      )}
      
      {/* Google Analytics */}
      {funnel.google_analytics_id && (
        <>
          <script
            async
            src={`https://www.googletagmanager.com/gtag/js?id=${funnel.google_analytics_id}`}
          />
          <script
            dangerouslySetInnerHTML={{
              __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${funnel.google_analytics_id}');
              `
            }}
          />
        </>
      )}
    </div>
  )
} 