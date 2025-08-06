'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { renderFunnelTemplate } from '@/lib/funnel-templates'
import { PremiumSpinner } from '@/components/ui/loading'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

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
  theme_mode?: 'light' | 'dark'
  theme_style?: string
  font_family?: string
  background_color?: string
  text_color?: string
  case_studies_heading?: string
  case_studies_subtext?: string
  booking_heading?: string
  facebook_pixel_code?: string
  google_analytics_code?: string
  custom_tracking_code?: string
  template_id?: string
  case_studies?: any[]
  data?: any // Add data field to interface
}

export default function FunnelPathPage() {
  const params = useParams()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [funnel, setFunnel] = useState<FunnelData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [isContentReady, setIsContentReady] = useState(false)
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
  }, [params.path])

  if (loading) {
    return <PremiumSpinner isContentReady={isContentReady} />
  }

  if (error || !funnel) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Funnel Not Found</h1>
          <p className="text-gray-600 mb-6">{error || 'The requested funnel could not be found.'}</p>
          <button 
            onClick={() => router.push('/')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go Home
          </button>
        </div>
      </div>
    )
  }

  // Font functionality removed - will rebuild design system from scratch

  // Theme styling logic
  const isDarkMode = funnel.theme_mode === 'dark'
  
  const getThemeStyles = () => {
    const theme = funnel.theme_style || 'clean'
    
    switch (theme) {
      case 'clean':
        return {
          background: isDarkMode ? '#0f172a' : '#ffffff',
          headerBg: isDarkMode ? 'rgba(15, 23, 42, 0.9)' : 'rgba(255, 255, 255, 0.95)',
          textPrimary: isDarkMode ? '#f8fafc' : '#1e293b',
          textSecondary: isDarkMode ? '#cbd5e1' : '#475569',
          accent: '#3b82f6',
          ctaGradient: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
          sectionBg: isDarkMode ? 'rgba(30, 41, 59, 0.5)' : 'rgba(248, 250, 252, 0.5)',
          cardBg: isDarkMode ? 'rgba(51, 65, 85, 0.8)' : 'rgba(255, 255, 255, 0.9)',
          borderColor: isDarkMode ? 'rgba(148, 163, 184, 0.2)' : 'rgba(148, 163, 184, 0.3)'
        }
      case 'modern':
        return {
          background: isDarkMode ? '#111827' : '#fafafa',
          headerBg: isDarkMode ? 'rgba(17, 24, 39, 0.9)' : 'rgba(250, 250, 250, 0.95)',
          textPrimary: isDarkMode ? '#f9fafb' : '#111827',
          textSecondary: isDarkMode ? '#d1d5db' : '#4b5563',
          accent: '#8b5cf6',
          ctaGradient: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
          sectionBg: isDarkMode ? 'rgba(55, 65, 81, 0.5)' : 'rgba(243, 244, 246, 0.5)',
          cardBg: isDarkMode ? 'rgba(75, 85, 99, 0.8)' : 'rgba(255, 255, 255, 0.9)',
          borderColor: isDarkMode ? 'rgba(156, 163, 175, 0.2)' : 'rgba(156, 163, 175, 0.3)'
        }
      default:
        return {
          background: isDarkMode ? '#0f172a' : '#ffffff',
          headerBg: isDarkMode ? 'rgba(15, 23, 42, 0.9)' : 'rgba(255, 255, 255, 0.95)',
          textPrimary: isDarkMode ? '#f8fafc' : '#1e293b',
          textSecondary: isDarkMode ? '#cbd5e1' : '#475569',
          accent: '#3b82f6',
          ctaGradient: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
          sectionBg: isDarkMode ? 'rgba(30, 41, 59, 0.5)' : 'rgba(248, 250, 252, 0.5)',
          cardBg: isDarkMode ? 'rgba(51, 65, 85, 0.8)' : 'rgba(255, 255, 255, 0.9)',
          borderColor: isDarkMode ? 'rgba(148, 163, 184, 0.2)' : 'rgba(148, 163, 184, 0.3)'
        }
    }
  }

  const themeStyles = getThemeStyles()

  // Navigate to next page
  const goToNextPage = () => {
    const currentUrl = new URL(window.location.href)
    currentUrl.searchParams.set('page', '2')
    window.location.href = currentUrl.toString()
  }

  // Create content object from funnel data
  const content = {
    heading: funnel.headline || 'Your Compelling Headline Here',
    subheading: funnel.subheadline || 'Your powerful subheadline that explains the value',
    ctaText: funnel.cta_text || 'Get Started Now',
    caseStudiesHeading: funnel.case_studies_heading || 'Success Stories',
    caseStudiesSubtext: funnel.case_studies_subtext || 'See what others have achieved',
    bookingHeading: funnel.booking_heading || 'Book Your Strategy Call',
    footerText: funnel.data?.customization?.footerText || `© 2024 ${funnel.name || 'Your Business'}. All rights reserved.`
  }

  return (
    <>
      <head>
        <title>{funnel.name} | AscensionAI</title>
        <meta name="description" content={funnel.headline || funnel.name} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        
        {/* Tracking codes */}
        {funnel.facebook_pixel_code && (
          <script dangerouslySetInnerHTML={{ __html: funnel.facebook_pixel_code }} />
        )}
        {funnel.google_analytics_code && (
          <script dangerouslySetInnerHTML={{ __html: funnel.google_analytics_code }} />
        )}
        {funnel.custom_tracking_code && (
          <script dangerouslySetInnerHTML={{ __html: funnel.custom_tracking_code }} />
        )}
      </head>
      
      <div className="min-h-screen animate-fade-in">
        {renderFunnelTemplate(funnel.template_id || 'trigger-template-1', {
          funnelData: funnel,
          content,
          themeStyles,
          isEditor: false,
          caseStudies: funnel.case_studies || [],
          goToNextPage,
          currentPage,
          customization: {
            logoUrl: funnel.logo_url,
            themeMode: funnel.theme_mode,
            ...funnel.data?.customization // Include all customization data from the data field
          },
          textSizes: funnel.data?.customization?.textSizes || {
            desktop: {
              heading: 48,
              subheading: 24,
              caseStudiesHeading: 36,
              bookingHeading: 48
            },
            mobile: {
              heading: 36,
              subheading: 20,
              caseStudiesHeading: 28,
              bookingHeading: 36
            }
          },
          buttonSizes: funnel.data?.customization?.buttonSizes || {
            desktop: {
              ctaText: 100
            },
            mobile: {
              ctaText: 100
            }
          },
          logoSize: funnel.data?.customization?.logoSize || {
            desktop: 48,
            mobile: 36
          },
          currentView: isMobileView ? 'mobile' : 'desktop', // Use detected device type
          sectionSpacing: funnel.data?.customization?.sectionSpacing || {
            desktop: {
              afterHeader: 48,
              afterHeading: 24,
              afterSubheading: 48,
              afterVsl: 48,
              afterFirstCta: 64,
              afterCaseStudies: 48,
              beforeFooter: 64
            },
            mobile: {
              afterHeader: 32,
              afterHeading: 16,
              afterSubheading: 32,
              afterVsl: 32,
              afterFirstCta: 48,
              afterCaseStudies: 32,
              beforeFooter: 48
            }
          }
        })}
      </div>
      
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.2s ease-out;
        }
      `}</style>
    </>
  )
} 