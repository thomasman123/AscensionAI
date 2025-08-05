'use client'

import { useState, useEffect } from 'react'
import { ArrowLeft, ArrowRight, Calendar } from 'lucide-react'

interface FunnelData {
  customization: {
    headline: string
    subheadline: string
    heroText: string
    ctaText: string
    offerDescription: string
    guaranteeText: string
    colors: {
      primary: string
      secondary: string
      accent: string
      background: string
      text: string
    }
    logoUrl: string
    pixelCodes: {
      facebook: string
      google: string
      custom: string
    }
    font: string
    theme: string
  }
  offerData?: any
  caseStudies?: any
  media?: any
  templateId?: string
}

export default function PreviewPage() {
  const [funnelData, setFunnelData] = useState<FunnelData | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Load preview data from localStorage
    const storedData = localStorage.getItem('previewData')
    if (storedData) {
      try {
        const data = JSON.parse(storedData)
        setFunnelData(data)
      } catch (error) {
        console.error('Error parsing preview data:', error)
      }
    }
    setIsLoading(false)
  }, [])

  useEffect(() => {
    // Get page from URL
    const urlParams = new URLSearchParams(window.location.search)
    const page = urlParams.get('page')
    if (page) {
      setCurrentPage(parseInt(page))
    }
  }, [])

  const goToNextPage = () => {
    setCurrentPage(2)
    const url = new URL(window.location.href)
    url.searchParams.set('page', '2')
    window.history.pushState({}, '', url.toString())
  }

  const goToPreviousPage = () => {
    setCurrentPage(1)
    const url = new URL(window.location.href)
    url.searchParams.set('page', '1')
    window.history.pushState({}, '', url.toString())
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 font-medium">Loading preview...</p>
        </div>
      </div>
    )
  }

  if (!funnelData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-800 mb-4">No Preview Data Found</h1>
          <p className="text-slate-600 mb-6">Please return to the editor to preview your funnel.</p>
          <button
            onClick={() => window.close()}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Close Preview
          </button>
        </div>
      </div>
    )
  }

  const { customization } = funnelData
  // Always use default colors (color editing removed)
  const colors = {
    primary: '#3b82f6',
    secondary: '#1e40af',
    accent: '#059669',
    background: '#FFFFFF',
    text: '#1F2937'
  }

  // Apply theme-specific styling to match funnel-viewer
  const getThemeStyles = () => {
    const theme = customization.theme || 'clean'
    
    switch (theme) {
      case 'clean':
        return {
          background: '#ffffff',
          headerBg: 'rgba(255, 255, 255, 0.95)',
          textPrimary: '#1e293b',
          textSecondary: '#475569',
          accent: '#3b82f6',
          ctaGradient: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
          sectionBg: 'rgba(248, 250, 252, 0.5)',
          cardBg: 'rgba(255, 255, 255, 0.9)',
          borderColor: 'rgba(148, 163, 184, 0.3)'
        }
      case 'modern':
        return {
          background: '#fafafa',
          headerBg: 'rgba(250, 250, 250, 0.95)',
          textPrimary: '#111827',
          textSecondary: '#4b5563',
          accent: '#8b5cf6',
          ctaGradient: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
          sectionBg: 'rgba(243, 244, 246, 0.5)',
          cardBg: 'rgba(255, 255, 255, 0.9)',
          borderColor: 'rgba(156, 163, 175, 0.3)'
        }
      default:
        return {
          background: '#ffffff',
          headerBg: 'rgba(255, 255, 255, 0.95)',
          textPrimary: '#1e293b',
          textSecondary: '#475569',
          accent: '#3b82f6',
          ctaGradient: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
          sectionBg: 'rgba(248, 250, 252, 0.5)',
          cardBg: 'rgba(255, 255, 255, 0.9)',
          borderColor: 'rgba(148, 163, 184, 0.3)'
        }
    }
  }

  const themeStyles = getThemeStyles()

  const renderPage1 = () => (
    <div 
      className="min-h-screen"
      style={{
        backgroundColor: themeStyles.background,
        color: themeStyles.textPrimary,
        fontFamily: 'Inter, sans-serif' // Default to Inter font
      }}
    >
      {/* Pixel Codes */}
      {customization.pixelCodes?.facebook && (
        <div dangerouslySetInnerHTML={{ __html: customization.pixelCodes.facebook }} />
      )}
      {customization.pixelCodes?.google && (
        <div dangerouslySetInnerHTML={{ __html: customization.pixelCodes.google }} />
      )}
      {customization.pixelCodes?.custom && (
        <div dangerouslySetInnerHTML={{ __html: customization.pixelCodes.custom }} />
      )}

      {/* Header */}
      <header 
        className="py-4 px-6 border-b backdrop-blur-md"
        style={{ 
          backgroundColor: themeStyles.headerBg, 
          borderColor: themeStyles.borderColor 
        }}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {customization.logoUrl && !customization.logoUrl.startsWith('blob:') ? (
            <img 
              src={customization.logoUrl} 
              alt="Logo" 
              className="h-8 w-auto"
              onError={(e) => {
                console.error('Logo display error in preview')
                e.currentTarget.style.display = 'none'
              }}
            />
          ) : (
            <div 
              className="text-xl font-bold" 
              style={{ color: themeStyles.textPrimary }}
            >
              Your Logo
            </div>
          )}
          <nav className="hidden md:flex space-x-6">
            <a 
              href="#" 
              className="text-sm font-medium hover:opacity-80 transition-opacity"
              style={{ color: themeStyles.textSecondary }}
            >
              About
            </a>
            <a 
              href="#" 
              className="text-sm font-medium hover:opacity-80 transition-opacity"
              style={{ color: themeStyles.textSecondary }}
            >
              Contact
            </a>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <div className="mb-8">
            <span 
              className="inline-block px-4 py-2 rounded-lg text-white text-sm font-medium mb-6"
              style={{ backgroundColor: themeStyles.accent }}
            >
              ✨ Limited Time Offer
            </span>
          </div>
          
          <h1 
            className="text-4xl md:text-6xl font-bold mb-8 leading-tight"
            style={{ color: themeStyles.textPrimary }}
          >
            {customization.headline || 'Your Compelling Headline Here'}
          </h1>
          <p 
            className="text-xl md:text-2xl mb-12 max-w-4xl mx-auto leading-relaxed font-normal"
            style={{ color: themeStyles.textSecondary }}
          >
            {customization.subheadline || 'A powerful subheadline that explains the value proposition'}
          </p>
          <div className="mb-16 max-w-3xl mx-auto">
            <p 
              className="text-lg leading-relaxed"
              style={{ color: themeStyles.textSecondary }}
            >
              {customization.heroText || 'This is where you describe your offer in detail, explaining how it will transform your prospect\'s life and why they need to act now.'}
            </p>
          </div>
          
          {/* VSL Placeholder */}
          <div className="mb-12">
            <div 
              className="aspect-video rounded-lg flex items-center justify-center text-white text-xl font-semibold max-w-4xl mx-auto shadow-lg"
              style={{ backgroundColor: themeStyles.textSecondary }}
            >
              📹 Your Video Sales Letter Goes Here
            </div>
          </div>

          <div className="inline-block">
            <button 
              onClick={goToNextPage}
              className="px-12 py-6 rounded-lg text-white text-xl font-semibold hover:opacity-90 transition-all duration-200 transform hover:scale-105 inline-flex items-center gap-3 shadow-lg"
              style={{ background: themeStyles.ctaGradient }}
            >
              {customization.ctaText || 'Get Started Now'}
              <ArrowRight className="w-6 h-6" />
            </button>
          </div>
        </div>
      </section>

      {/* What You'll Get Section */}
      <section 
        className="py-16 px-6"
        style={{ backgroundColor: colors.text + '05' }}
      >
        <div className="max-w-4xl mx-auto">
          <h2 
            className="text-3xl font-bold mb-12 text-center"
            style={{ color: colors.text }}
          >
            What You'll Get
          </h2>
          <div className="prose prose-lg max-w-none">
            <div style={{ color: colors.text }}>
              {customization.offerDescription ? (
                customization.offerDescription.split('\n').map((paragraph: string, index: number) => (
                  <p key={index} className="mb-4">{paragraph}</p>
                ))
              ) : (
                <>
                  <ul className="space-y-3 text-left">
                    <li>✅ Complete step-by-step training system</li>
                    <li>✅ Exclusive access to proven strategies</li>
                    <li>✅ Personal support and guidance</li>
                    <li>✅ Bonus materials and resources</li>
                    <li>✅ 30-day money-back guarantee</li>
                  </ul>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 
            className="text-3xl font-bold mb-12 text-center"
            style={{ color: colors.text }}
          >
            Success Stories
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {[1, 2, 3, 4].map((i) => (
              <div 
                key={i}
                className="p-6 rounded-lg border"
                style={{ 
                  backgroundColor: colors.background,
                  borderColor: colors.text + '20'
                }}
              >
                <div className="flex items-center mb-4">
                  <div 
                    className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold"
                    style={{ backgroundColor: colors.primary }}
                  >
                    {String.fromCharCode(64 + i)}
                  </div>
                  <div className="ml-4">
                    <h4 className="font-semibold" style={{ color: colors.text }}>Customer {i}</h4>
                    <p className="text-sm opacity-70" style={{ color: colors.text }}>Verified Customer</p>
                  </div>
                </div>
                <p style={{ color: colors.text }}>
                  "This completely changed my business. I saw results within the first week!"
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Guarantee Section */}
      <section 
        className="py-16 px-6"
        style={{ backgroundColor: colors.accent + '15' }}
      >
        <div className="max-w-4xl mx-auto text-center">
          <h2 
            className="text-2xl font-bold mb-6"
            style={{ color: colors.text }}
          >
            Our Guarantee
          </h2>
          <div className="text-lg">
            {customization.guaranteeText || 'We stand behind our product with a 30-day money-back guarantee. If you\'re not completely satisfied, we\'ll refund every penny.'}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 
            className="text-3xl font-bold mb-8"
            style={{ color: colors.text }}
          >
            Ready to Get Started?
          </h2>
          <button 
            onClick={goToNextPage}
            className="px-8 py-4 rounded-lg text-white text-lg font-semibold hover:opacity-90 transition-opacity inline-flex items-center gap-2"
            style={{ backgroundColor: colors.primary }}
          >
            {customization.ctaText || 'Get Started Now'}
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer 
        className="py-8 px-6 border-t"
        style={{ 
          backgroundColor: colors.background,
          borderColor: colors.text + '20'
        }}
      >
        <div className="max-w-4xl mx-auto text-center text-sm opacity-70" style={{ color: colors.text }}>
          <p>&copy; 2024 Your Business Name. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )

  const renderPage2 = () => (
    <div 
      className="min-h-screen"
      style={{
        backgroundColor: colors.background,
        color: colors.text,
        fontFamily: 'Inter, sans-serif' // Default to Inter font
      }}
    >
      {/* Header */}
      <header 
        className="py-4 px-6 border-b"
        style={{ backgroundColor: colors.background, borderColor: colors.text + '20' }}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {customization.logoUrl && !customization.logoUrl.startsWith('blob:') ? (
            <img 
              src={customization.logoUrl} 
              alt="Logo" 
              className="h-8 w-auto"
              onError={(e) => {
                console.error('Logo display error in preview')
                e.currentTarget.style.display = 'none'
              }}
            />
          ) : (
            <div className="text-xl font-bold" style={{ color: colors.primary }}>
              Your Logo
            </div>
          )}
          <button
            onClick={goToPreviousPage}
            className="text-sm font-medium hover:opacity-80 transition-opacity flex items-center gap-2"
            style={{ color: colors.text }}
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Main Page
          </button>
        </div>
      </header>

      {/* Booking Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 
              className="text-4xl md:text-5xl font-bold mb-6"
              style={{ color: colors.text }}
            >
              Book Your Strategy Call
            </h1>
            <p 
              className="text-xl opacity-80"
              style={{ color: colors.text }}
            >
              Choose a time that works best for you. We'll discuss your goals and create a personalized action plan.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Calendar Placeholder */}
            <div>
              <div 
                className="aspect-square rounded-lg flex flex-col items-center justify-center text-center p-8"
                style={{ backgroundColor: colors.text + '05', borderColor: colors.text + '20' }}
              >
                <Calendar className="w-16 h-16 mb-4" style={{ color: colors.primary }} />
                <h3 className="text-xl font-semibold mb-2" style={{ color: colors.text }}>
                  Calendar Integration
                </h3>
                <p className="opacity-70 mb-4" style={{ color: colors.text }}>
                  Your Calendly, Acuity, or other booking system would be embedded here
                </p>
                <div 
                  className="px-6 py-3 rounded-lg text-white font-medium"
                  style={{ backgroundColor: colors.primary }}
                >
                  Schedule Now
                </div>
              </div>
            </div>

            {/* What to Expect */}
            <div>
              <h3 
                className="text-2xl font-bold mb-6"
                style={{ color: colors.text }}
              >
                What to Expect
              </h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div 
                    className="w-6 h-6 rounded-full flex items-center justify-center text-white text-sm font-bold mt-1"
                    style={{ backgroundColor: colors.primary }}
                  >
                    1
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1" style={{ color: colors.text }}>
                      Discovery Call (15 minutes)
                    </h4>
                    <p className="opacity-70" style={{ color: colors.text }}>
                      We'll discuss your current situation and main challenges
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div 
                    className="w-6 h-6 rounded-full flex items-center justify-center text-white text-sm font-bold mt-1"
                    style={{ backgroundColor: colors.primary }}
                  >
                    2
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1" style={{ color: colors.text }}>
                      Strategy Session (30 minutes)
                    </h4>
                    <p className="opacity-70" style={{ color: colors.text }}>
                      Get a personalized roadmap for achieving your goals
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div 
                    className="w-6 h-6 rounded-full flex items-center justify-center text-white text-sm font-bold mt-1"
                    style={{ backgroundColor: colors.primary }}
                  >
                    3
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1" style={{ color: colors.text }}>
                      Next Steps (15 minutes)
                    </h4>
                    <p className="opacity-70" style={{ color: colors.text }}>
                      Learn about our programs and how we can help you succeed
                    </p>
                  </div>
                </div>
              </div>

              <div 
                className="mt-8 p-6 rounded-lg"
                style={{ backgroundColor: colors.accent + '15' }}
              >
                <h4 className="font-semibold mb-2" style={{ color: colors.text }}>
                  100% Free - No Obligation
                </h4>
                <p className="opacity-80" style={{ color: colors.text }}>
                  This call is completely free with no strings attached. Come prepared with your questions!
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer 
        className="py-8 px-6 border-t mt-12"
        style={{ 
          backgroundColor: colors.background,
          borderColor: colors.text + '20'
        }}
      >
        <div className="max-w-4xl mx-auto text-center text-sm opacity-70" style={{ color: colors.text }}>
          <p>&copy; 2024 Your Business Name. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )

  return currentPage === 1 ? renderPage1() : renderPage2()
} 