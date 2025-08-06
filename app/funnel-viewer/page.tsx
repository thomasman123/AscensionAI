'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, Star, Clock, Users, ArrowRight, Play, ArrowLeft, Sun, Moon, Shield, Zap, Target } from 'lucide-react'
import Head from 'next/head'
import { renderFunnelTemplate } from '@/lib/funnel-templates'
import ThemeProvider, { useTheme } from '@/components/theme-provider'
// Font styling removed - will rebuild design system from scratch

// Force dynamic rendering
export const dynamic = 'force-dynamic'

// Font functionality removed - will rebuild design system from scratch

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
  template_id?: string
  theme_id?: string
  theme_overrides?: any
  // Metadata fields
  meta_title?: string
  meta_description?: string
  meta_keywords?: string
}

// Facebook Pixel and Analytics tracking functions
const trackPageView = (pageName: string, funnelData: FunnelData) => {
  // Facebook Pixel
  if (typeof window !== 'undefined' && (window as any).fbq) {
    (window as any).fbq('track', 'PageView', {
      content_name: funnelData.name,
      content_category: funnelData.type,
      page_title: pageName === 'page1' ? funnelData.headline : funnelData.calendar_title,
      funnel_id: funnelData.id
    })
  }

  // Google Analytics
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', 'page_view', {
      page_title: pageName === 'page1' ? funnelData.headline : funnelData.calendar_title,
      page_location: window.location.href,
      funnel_name: funnelData.name,
      funnel_type: funnelData.type,
      funnel_step: pageName
    })
  }
}

const trackConversion = (eventName: string, funnelData: FunnelData, value?: number) => {
  // Facebook Pixel
  if (typeof window !== 'undefined' && (window as any).fbq) {
    (window as any).fbq('track', eventName, {
      content_name: funnelData.name,
      content_category: funnelData.type,
      value: value || 0,
      currency: 'USD',
      funnel_id: funnelData.id
    })
  }

  // Google Analytics
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', eventName.toLowerCase().replace(' ', '_'), {
      event_category: 'funnel_conversion',
      event_label: funnelData.name,
      value: value || 0,
      funnel_type: funnelData.type
    })
  }
}

function FunnelViewerContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [domain, setDomain] = useState<string | null>(null)
  const [path, setPath] = useState<string>('/')
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false)
  
  const [funnelData, setFunnelData] = useState<FunnelData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)
  const [caseStudies, setCaseStudies] = useState<any[]>([])
  
  // Load theme based on funnel's theme_id
  const { theme, loading: themeLoading } = useTheme(funnelData?.theme_id)

  useEffect(() => {
    // Wait for component to mount and search params to be available
    setMounted(true)
    const domainParam = searchParams.get('domain')
    const pathParam = searchParams.get('path') || '/'
    const pageParam = parseInt(searchParams.get('page') || '1')
    
    console.log('Search params:', { domain: domainParam, path: pathParam, page: pageParam })
    console.log('Current URL:', window.location.href)
    console.log('Current hostname:', window.location.hostname)
    
    // Fallback: if no domain param, try to get from hostname
    let finalDomain = domainParam
    if (!finalDomain && typeof window !== 'undefined') {
      const currentHostname = window.location.hostname
      // Only use hostname if it's not a vercel domain
      if (!currentHostname.includes('vercel.app') && !currentHostname.includes('localhost')) {
        console.log('Using hostname as fallback domain:', currentHostname)
        finalDomain = currentHostname
      }
    }
    
    console.log('Final domain to use:', finalDomain)
    
    setDomain(finalDomain)
    setPath(pathParam)
    setCurrentPage(pageParam)
  }, [searchParams])

  useEffect(() => {
    // Only process after component is mounted and we have checked for domain
    if (!mounted) return

    if (!domain) {
      console.log('No domain parameter found after mounting, redirecting to main app')
      // Use a longer delay to prevent rapid redirects
      setTimeout(() => {
        window.location.href = '/'
      }, 2000)
      return
    }
    
    console.log('Loading funnel for domain:', domain)
    loadFunnelByDomain(domain)
  }, [domain, mounted])

  // Track page views when funnel data loads or page changes
  useEffect(() => {
    if (funnelData && !loading) {
      const pageName = currentPage === 1 ? 'page1' : 'page2'
      trackPageView(pageName, funnelData)
      
      // Set theme mode from funnel data
      if (funnelData.theme_mode) {
        setIsDarkMode(funnelData.theme_mode === 'dark')
      }
    }
  }, [funnelData, currentPage, loading])

  // Remove loading animation - load normally
  if (!mounted) {
    return null
  }

  // If no domain after mounting, show redirect message
  if (!domain) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <div className="relative mb-6">
            <div className="w-12 h-12 border-4 border-blue-200 dark:border-blue-800 border-t-blue-600 dark:border-t-blue-400 rounded-full animate-spin mx-auto"></div>
          </div>
          <p className="text-slate-600 dark:text-slate-400 font-medium">Redirecting...</p>
        </div>
      </div>
    )
  }

  const loadFunnelByDomain = async (domainName: string) => {
    try {
      setLoading(true)
      const response = await fetch(`/api/funnels/by-domain?domain=${encodeURIComponent(domainName)}`)
      
      if (response.ok) {
        const data = await response.json()
        console.log('Loaded funnel data:', data)
        setFunnelData(data.funnel)
        
        // Load case studies for this funnel
        if (data.funnel?.id) {
          const caseStudiesResponse = await fetch(`/api/case-studies?funnelId=${data.funnel.id}`)
          if (caseStudiesResponse.ok) {
            const caseStudiesData = await caseStudiesResponse.json()
            setCaseStudies(caseStudiesData.caseStudies || [])
          }
        }
      } else {
        const errorData = await response.json()
        setError(errorData.error || 'Failed to load funnel')
      }
    } catch (err) {
      console.error('Error loading funnel:', err)
      setError('Failed to load funnel')
    } finally {
      setLoading(false)
    }
  }

  // Navigate to next page with conversion tracking
  const goToNextPage = () => {
    if (funnelData) {
      trackConversion('ViewContent', funnelData) // Facebook standard event
      trackConversion('cta_click', funnelData) // Custom tracking
    }
    
    const currentUrl = new URL(window.location.href)
    currentUrl.searchParams.set('page', '2')
    window.location.href = currentUrl.toString()
  }

  // Navigate back to first page
  const goToPreviousPage = () => {
    const currentUrl = new URL(window.location.href)
    currentUrl.searchParams.set('page', '1')
    window.location.href = currentUrl.toString()
  }

  // Track calendar interaction
  const trackCalendarInteraction = () => {
    if (funnelData) {
      trackConversion('Lead', funnelData, 25) // Facebook standard event with value
      trackConversion('calendar_interaction', funnelData)
    }
  }

  // Theme mode is now controlled by funnel creator settings, not user interaction

  // Remove loading animation - load normally
  if (loading || themeLoading) {
    return null
  }

  if (error || !funnelData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-4">
        <div className="text-center max-w-md mx-auto">
          <div className="w-24 h-24 bg-gradient-to-br from-red-100 to-orange-100 dark:from-red-900/30 dark:to-orange-900/30 rounded-full flex items-center justify-center mb-6 mx-auto">
            <div className="text-4xl">🚀</div>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4">
            {error || 'Funnel Not Found'}
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
            {error === 'Funnel not found for this domain' 
              ? 'This domain is not connected to any active funnel. Please check the domain configuration.'
              : 'There was an issue loading this funnel. Please try again later.'
            }
          </p>
          <Button
            onClick={() => window.location.reload()}
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all duration-200"
          >
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  const themeClass = isDarkMode ? 'dark' : ''
  
  // Apply theme-specific styling
  const getThemeStyles = () => {
    const theme = (funnelData as any).theme_style || 'clean'
    
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
  
  const styles = {
    '--primary-color': funnelData.primary_color,
    '--secondary-color': funnelData.secondary_color,
    '--accent-color': funnelData.accent_color,
  } as React.CSSProperties

  // Dynamic metadata for each page
  const currentPageTitle = currentPage === 1 
    ? funnelData.headline 
    : funnelData.calendar_title || 'Book Your Call'
  
  const currentPageDescription = currentPage === 1 
    ? funnelData.subheadline 
    : `Schedule your consultation for ${funnelData.name}`

  // Render Page 1 - Main Funnel Content
  if (currentPage === 1) {
    return (
      <div className={themeClass}>
        <Head>
          <title>{funnelData.meta_title || funnelData.headline} | {funnelData.name}</title>
          <meta name="description" content={funnelData.meta_description || funnelData.subheadline} />
          {funnelData.meta_keywords && <meta name="keywords" content={funnelData.meta_keywords} />}
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          
          {/* Open Graph Meta Tags */}
          <meta property="og:title" content={funnelData.meta_title || funnelData.headline} />
          <meta property="og:description" content={funnelData.meta_description || funnelData.subheadline} />
          <meta property="og:type" content="website" />
          <meta property="og:url" content={typeof window !== 'undefined' ? window.location.href : ''} />
          {funnelData.logo_url && <meta property="og:image" content={funnelData.logo_url} />}
          
          {/* Twitter Card */}
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content={funnelData.meta_title || funnelData.headline} />
          <meta name="twitter:description" content={funnelData.meta_description || funnelData.subheadline} />
          {funnelData.logo_url && !funnelData.logo_url.startsWith('blob:') && <meta name="twitter:image" content={funnelData.logo_url} />}
          
          {/* Facebook Pixel */}
          {funnelData.facebook_pixel_id && (
            <script>
              {`
                !function(f,b,e,v,n,t,s)
                {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                n.queue=[];t=b.createElement(e);t.async=!0;
                t.src=v;s=b.getElementsByTagName(e)[0];
                s.parentNode.insertBefore(t,s)}(window, document,'script',
                'https://connect.facebook.net/en_US/fbevents.js');
                fbq('init', '${funnelData.facebook_pixel_id}');
                fbq('track', 'PageView');
              `}
            </script>
          )}
        </Head>
        
        <div 
          className="min-h-screen transition-all duration-300"
          style={{ 
            backgroundColor: themeStyles.background,
            ...styles 
          }}
        >
          {/* 1. Logo at top (centered) */}
          <header className="py-6 px-6 text-center">
                      {funnelData.logo_url ? (
            <img 
              src={funnelData.logo_url} 
              alt="Logo" 
              className="h-12 max-w-xs object-contain mx-auto"
              onError={(e) => {
                console.error('Logo display error in funnel viewer')
                e.currentTarget.style.display = 'none'
              }}
            />
          ) : (
            <div 
              className="text-xl font-bold mx-auto inline-block"
              style={{ color: themeStyles.textPrimary }}
            >
              Your Logo
            </div>
          )}
          </header>

          {/* Render Template Content */}
          <ThemeProvider theme={theme} overrides={funnelData.theme_overrides}>
            {renderFunnelTemplate(funnelData.template_id || 'trigger-template-1', {
              funnelData,
              themeStyles,
              isEditor: false,
              caseStudies,
              goToNextPage,
              currentPage,
              customization: {
                themeMode: (funnelData as any).theme_mode || 'light',
                ...(funnelData as any).data?.customization
              },
              universalSpacers: (funnelData as any).data?.customization?.universalSpacers || {},
              currentView: typeof window !== 'undefined' && window.innerWidth < 768 ? 'mobile' : 'desktop'
            })}
          </ThemeProvider>
        </div>
      </div>
    )
  }

  // Render Page 2 - Calendar/Booking Page
  if (currentPage === 2) {
    return (
      <div className={themeClass}>
        <Head>
          <title>{funnelData.calendar_title || 'Book Your Call'} | {funnelData.name}</title>
          <meta name="description" content={`Schedule your consultation for ${funnelData.name}`} />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          
          {/* Open Graph Meta Tags */}
          <meta property="og:title" content={funnelData.calendar_title || 'Book Your Call'} />
          <meta property="og:description" content={`Schedule your consultation for ${funnelData.name}`} />
          <meta property="og:type" content="website" />
          <meta property="og:url" content={typeof window !== 'undefined' ? window.location.href : ''} />
          {funnelData.logo_url && !funnelData.logo_url.startsWith('blob:') && <meta property="og:image" content={funnelData.logo_url} />}
        </Head>
        
        <div 
          className="min-h-screen transition-all duration-300"
          style={{ 
            backgroundColor: themeStyles.background,
            ...styles 
          }}
        >
          {/* Header */}
          <header className="backdrop-blur-md bg-white/80 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-50">
            <div className="container mx-auto px-6 py-4 flex items-center justify-between">
              {funnelData.logo_url ? (
                <img 
                  src={funnelData.logo_url} 
                  alt="Logo" 
                  className="h-10 max-w-xs object-contain"
                />
              ) : (
                <div className="h-10 w-24 bg-gradient-to-r from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-600 rounded-lg animate-pulse"></div>
              )}
              
              {/* Removed theme toggle - now controlled by funnel creator settings */}
            </div>
          </header>

          {/* Back Button */}
          <div className="py-6 px-6">
            <Button
              onClick={goToPreviousPage}
              variant="ghost"
              className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-200" />
              Back to Previous Page
            </Button>
          </div>

          {/* Calendar Section */}
          {funnelData.calendar_embed_code ? (
            <section className="py-16 px-6">
              <div className="max-w-5xl mx-auto text-center">
                <div className="mb-12">
                  <Badge className="mb-6 bg-gradient-to-r from-emerald-500 to-green-600 text-white border-0 px-4 py-2 font-medium shadow-lg">
                    🗓️ Almost There!
                  </Badge>
                  
                  <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 dark:from-slate-100 dark:via-slate-200 dark:to-slate-100 bg-clip-text text-transparent">
                    {funnelData.calendar_title || 'Book Your Call'}
                  </h1>
                  
                  <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                    Choose a time that works best for you and let's get started!
                  </p>
                </div>
                
                <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-slate-200 dark:border-slate-700 shadow-2xl max-w-4xl mx-auto">
                  <CardContent className="p-8">
                    <div 
                      className="calendar-embed"
                      onClick={trackCalendarInteraction}
                      dangerouslySetInnerHTML={{ __html: funnelData.calendar_embed_code }}
                    />
                  </CardContent>
                </Card>
              </div>
            </section>
          ) : (
            // Fallback if no calendar is configured
            <section className="py-16 px-6">
              <div className="max-w-3xl mx-auto text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full flex items-center justify-center mb-8 mx-auto shadow-xl">
                  <CheckCircle className="w-12 h-12 text-white" />
                </div>
                
                <h1 className="text-4xl md:text-5xl font-bold mb-6 text-slate-900 dark:text-slate-100">
                  Thank You!
                </h1>
                
                <p className="text-xl text-slate-600 dark:text-slate-400 mb-12">
                  We'll be in touch with you shortly to get started.
                </p>
                
                <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-slate-200 dark:border-slate-700 shadow-xl">
                  <CardContent className="p-10">
                    <h3 className="text-2xl font-semibold mb-8 text-slate-900 dark:text-slate-100">What Happens Next?</h3>
                    <div className="space-y-6 text-left max-w-lg mx-auto">
                      {[
                        { step: 1, text: "We'll review your information and prepare a customized strategy" },
                        { step: 2, text: "Our team will reach out within 24 hours to schedule your consultation" },
                        { step: 3, text: "We'll work together to implement your growth strategy" }
                      ].map((item, index) => (
                        <div key={index} className="flex items-start gap-4">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white flex items-center justify-center text-sm font-semibold shadow-lg flex-shrink-0">
                            {item.step}
                          </div>
                          <p className="text-slate-700 dark:text-slate-300 leading-relaxed pt-1">{item.text}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </section>
          )}

          {/* Footer */}
          <footer className="py-12 px-6 bg-slate-100 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700">
            <div className="text-center text-slate-600 dark:text-slate-400">
              <p>&copy; 2024 {funnelData.name}. All rights reserved.</p>
            </div>
          </footer>
        </div>
      </div>
    )
  }

  // Fallback for invalid page numbers
  return (
          <div 
        className={`${themeClass} min-h-screen flex items-center justify-center`}
        style={{ backgroundColor: themeStyles.background }}
      >
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">Page Not Found</h1>
        <Button 
          onClick={() => goToPreviousPage()}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
        >
          Go to Page 1
        </Button>
      </div>
    </div>
  )
}

function LoadingFallback() {
  return null
}

export default function FunnelViewer() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <FunnelViewerContent />
    </Suspense>
  )
} 