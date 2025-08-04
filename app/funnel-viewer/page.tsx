'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, Star, Clock, Users, ArrowRight, Play, ArrowLeft, Sun, Moon, Shield, Zap, Target } from 'lucide-react'
import Head from 'next/head'

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

  // Show minimal loading while component is mounting
  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
        <div className="relative">
          <div className="w-12 h-12 border-4 border-blue-200 dark:border-blue-800 border-t-blue-600 dark:border-t-blue-400 rounded-full animate-spin"></div>
          <div className="absolute inset-0 w-12 h-12 border-4 border-transparent border-t-blue-400 rounded-full animate-spin animation-delay-150"></div>
        </div>
      </div>
    )
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
      const response = await fetch(`/api/funnels/by-domain?domain=${encodeURIComponent(domainName)}`)
      
      if (response.ok) {
        const data = await response.json()
        setFunnelData(data.funnel)
      } else if (response.status === 404) {
        setError('Funnel not found for this domain')
      } else {
        setError('Failed to load funnel')
      }
    } catch (error) {
      console.error('Error loading funnel:', error)
      setError('Failed to load funnel')
    }
    setLoading(false)
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

  // Toggle theme mode
  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
        <div className="relative">
          <div className="w-12 h-12 border-4 border-blue-200 dark:border-blue-800 border-t-blue-600 dark:border-t-blue-400 rounded-full animate-spin"></div>
          <div className="absolute inset-0 w-12 h-12 border-4 border-transparent border-t-blue-400 rounded-full animate-spin animation-delay-150"></div>
        </div>
      </div>
    )
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
          <title>{funnelData.headline} | {funnelData.name}</title>
          <meta name="description" content={funnelData.subheadline} />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          
          {/* Open Graph Meta Tags */}
          <meta property="og:title" content={funnelData.headline} />
          <meta property="og:description" content={funnelData.subheadline} />
          <meta property="og:type" content="website" />
          <meta property="og:url" content={typeof window !== 'undefined' ? window.location.href : ''} />
          {funnelData.logo_url && <meta property="og:image" content={funnelData.logo_url} />}
          
          {/* Twitter Card */}
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content={funnelData.headline} />
          <meta name="twitter:description" content={funnelData.subheadline} />
          {funnelData.logo_url && <meta name="twitter:image" content={funnelData.logo_url} />}
          
          {/* Facebook Pixel */}
          {funnelData.facebook_pixel_id && (
            <script
              dangerouslySetInnerHTML={{
                __html: `
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
                `
              }}
            />
          )}
          
          {/* Google Analytics */}
          {funnelData.google_analytics_id && (
            <>
              <script async src={`https://www.googletagmanager.com/gtag/js?id=${funnelData.google_analytics_id}`}></script>
              <script
                dangerouslySetInnerHTML={{
                  __html: `
                    window.dataLayer = window.dataLayer || [];
                    function gtag(){dataLayer.push(arguments);}
                    gtag('js', new Date());
                    gtag('config', '${funnelData.google_analytics_id}');
                  `
                }}
              />
            </>
          )}
          
          {/* Structured Data */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "Product",
                "name": funnelData.name,
                "description": funnelData.offer_description,
                "brand": {
                  "@type": "Brand",
                  "name": funnelData.name
                },
                "offers": {
                  "@type": "Offer",
                  "description": funnelData.offer_description,
                  "availability": "https://schema.org/InStock"
                }
              })
            }}
          />
        </Head>
        
        <div 
          className="min-h-screen transition-all duration-300"
          style={{ 
            backgroundColor: themeStyles.background,
            ...styles 
          }}
        >
          {/* Header */}
          <header 
            className="backdrop-blur-md border-b sticky top-0 z-50"
            style={{ 
              backgroundColor: themeStyles.headerBg,
              borderColor: themeStyles.borderColor
            }}
          >
            <div className="container mx-auto px-6 py-4 flex items-center justify-between">
              {funnelData.logo_url ? (
                <img 
                  src={funnelData.logo_url} 
                  alt="Logo" 
                  className="h-10 max-w-xs object-contain"
                />
              ) : (
                <div 
                  className="text-xl font-bold"
                  style={{ color: themeStyles.textPrimary }}
                >
                  Your Logo
                </div>
              )}
              
              {/* Theme Toggle */}
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleTheme}
                style={{ color: themeStyles.textSecondary }}
                className="hover:opacity-80 transition-opacity"
              >
                {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </Button>
            </div>
          </header>

          {/* Hero Section */}
          <section className="py-16 px-6">            
            <div className="max-w-6xl mx-auto text-center">
              <div className="mb-8">
                <Badge 
                  className="mb-6 border-0 px-4 py-2 font-medium shadow-sm"
                  style={{ 
                    backgroundColor: themeStyles.accent,
                    color: '#ffffff'
                  }}
                >
                  ✨ Limited Time Offer
                </Badge>
              </div>
              
              <h1 
                className="text-4xl md:text-6xl font-bold mb-8 leading-tight"
                style={{ color: themeStyles.textPrimary }}
              >
                {funnelData.headline}
              </h1>
              
              <p 
                className="text-xl md:text-2xl mb-12 max-w-4xl mx-auto leading-relaxed font-normal"
                style={{ color: themeStyles.textSecondary }}
              >
                {funnelData.subheadline}
              </p>

              <div className="max-w-3xl mx-auto mb-16">
                <p 
                  className="text-lg leading-relaxed"
                  style={{ color: themeStyles.textSecondary }}
                >
                  {funnelData.hero_text}
                </p>
              </div>

              {/* Video Section */}
              {funnelData.vsl_type === 'video' && funnelData.vsl_url && (
                <div className="mb-16">
                  <h3 className="text-3xl font-semibold mb-8 text-slate-900 dark:text-slate-100">{funnelData.vsl_title}</h3>
                  <div className="aspect-video max-w-4xl mx-auto relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur-lg opacity-25 scale-105"></div>
                    {funnelData.vsl_url.includes('youtube.com') || funnelData.vsl_url.includes('youtu.be') ? (
                      <iframe
                        src={funnelData.vsl_url.replace('watch?v=', 'embed/').replace('youtu.be/', 'www.youtube.com/embed/')}
                        title={funnelData.vsl_title}
                        className="w-full h-full rounded-2xl shadow-2xl relative z-10 border border-slate-200 dark:border-slate-700"
                        allowFullScreen
                      />
                    ) : (
                      <video
                        src={funnelData.vsl_url}
                        title={funnelData.vsl_title}
                        className="w-full h-full rounded-2xl shadow-2xl relative z-10 border border-slate-200 dark:border-slate-700"
                        controls
                      />
                    )}
                  </div>
                </div>
              )}

              {funnelData.vsl_type === 'canva' && funnelData.vsl_url && (
                <div className="mb-16">
                  <h3 className="text-3xl font-semibold mb-8 text-slate-900 dark:text-slate-100">{funnelData.vsl_title}</h3>
                  <div className="aspect-video max-w-4xl mx-auto relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur-lg opacity-25 scale-105"></div>
                    <iframe
                      src={funnelData.vsl_url}
                      title={funnelData.vsl_title}
                      className="w-full h-full rounded-2xl shadow-2xl relative z-10 border border-slate-200 dark:border-slate-700"
                      allowFullScreen
                    />
                  </div>
                </div>
              )}

              {/* CTA Button */}
              <div className="inline-block">
                <Button
                  onClick={goToNextPage}
                  size="lg"
                  className="text-xl px-12 py-6 rounded-lg font-semibold text-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 border-0"
                  style={{ 
                    background: themeStyles.ctaGradient,
                  }}
                >
                  {funnelData.cta_text}
                  <ArrowRight className="w-6 h-6 ml-3" />
                </Button>
              </div>
            </div>
          </section>

          {/* Offer Section */}
          <section className="py-20 px-6 bg-slate-50/50 dark:bg-slate-800/50 backdrop-blur-sm">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-bold mb-6 text-slate-900 dark:text-slate-100">
                  What You'll Get
                </h2>
                <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                  Everything you need to transform your business
                </p>
              </div>
              
              <Card className="mb-12 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-slate-200 dark:border-slate-700 shadow-xl">
                <CardContent className="p-12">
                  <div className="prose prose-xl prose-slate dark:prose-invert mx-auto text-center">
                    <p className="text-lg leading-relaxed text-slate-700 dark:text-slate-300">{funnelData.offer_description}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Features/Benefits */}
              <div className="grid md:grid-cols-3 gap-8">
                {[
                  { icon: CheckCircle, title: "Proven Results", description: "Get the exact strategies that work", color: "emerald" },
                  { icon: Star, title: "Expert Support", description: "Direct access to our team", color: "blue" },
                  { icon: Clock, title: "Fast Results", description: "See results in weeks, not months", color: "purple" }
                ].map((feature, index) => {
                  const IconComponent = feature.icon
                  return (
                    <Card key={index} className="group bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-slate-200 dark:border-slate-700 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                      <CardContent className="p-8 text-center">
                        <div className={`w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-${feature.color}-500 to-${feature.color}-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                          <IconComponent className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="text-xl font-semibold mb-3 text-slate-900 dark:text-slate-100">{feature.title}</h3>
                        <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{feature.description}</p>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </div>
          </section>

          {/* Guarantee Section */}
          {funnelData.guarantee_text && (
            <section className="py-20 px-6">
              <div className="max-w-4xl mx-auto text-center">
                <div className="relative inline-block mb-8">
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-green-600 rounded-full blur-lg opacity-30 scale-110"></div>
                  <Badge className="relative text-lg px-8 py-4 bg-gradient-to-r from-emerald-500 to-green-600 text-white border-0 font-semibold shadow-xl">
                    <Shield className="w-5 h-5 mr-2" />
                    100% Money-Back Guarantee
                  </Badge>
                </div>
                <p className="text-xl leading-relaxed text-slate-700 dark:text-slate-300 max-w-3xl mx-auto">
                  {funnelData.guarantee_text}
                </p>
              </div>
            </section>
          )}

          {/* Final CTA */}
          <section className="py-20 px-6 bg-gradient-to-r from-slate-900 to-slate-800 dark:from-slate-800 dark:to-slate-900">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-4xl md:text-5xl font-bold mb-8 text-white">
                Ready to Get Started?
              </h2>
              <p className="text-xl mb-12 text-slate-300 max-w-2xl mx-auto">
                Join thousands of successful entrepreneurs who transformed their business
              </p>
              
              <div className="relative inline-block">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur-lg opacity-50 scale-110 animate-pulse"></div>
                <Button
                  onClick={goToNextPage}
                  size="lg"
                  className="relative text-xl px-16 py-8 rounded-full font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 border-0"
                >
                  {funnelData.cta_text}
                  <ArrowRight className="w-6 h-6 ml-3" />
                </Button>
              </div>
            </div>
          </section>

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
          {funnelData.logo_url && <meta property="og:image" content={funnelData.logo_url} />}
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
              
              {/* Theme Toggle */}
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleTheme}
                className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
              >
                {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </Button>
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
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
      <div className="relative">
        <div className="w-12 h-12 border-4 border-blue-200 dark:border-blue-800 border-t-blue-600 dark:border-t-blue-400 rounded-full animate-spin"></div>
        <div className="absolute inset-0 w-12 h-12 border-4 border-transparent border-t-blue-400 rounded-full animate-spin animation-delay-150"></div>
      </div>
    </div>
  )
}

export default function FunnelViewer() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <FunnelViewerContent />
    </Suspense>
  )
} 