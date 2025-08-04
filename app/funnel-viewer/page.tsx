'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, Star, Clock, Users, ArrowRight, Play } from 'lucide-react'

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
}

export default function FunnelViewer() {
  const searchParams = useSearchParams()
  const domain = searchParams.get('domain')
  const path = searchParams.get('path') || '/'
  
  const [funnelData, setFunnelData] = useState<FunnelData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (domain) {
      loadFunnelByDomain(domain)
    }
  }, [domain])

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading funnel...</p>
        </div>
      </div>
    )
  }

  if (error || !funnelData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="text-6xl mb-4">🚀</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            {error || 'Funnel Not Found'}
          </h1>
          <p className="text-gray-600 mb-6">
            {error === 'Funnel not found for this domain' 
              ? 'This domain is not connected to any active funnel. Please check the domain configuration.'
              : 'There was an issue loading this funnel. Please try again later.'
            }
          </p>
          <Button
            onClick={() => window.location.reload()}
            className="bg-blue-500 hover:bg-blue-600 text-white"
          >
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  const styles = {
    '--primary-color': funnelData.primary_color,
    '--secondary-color': funnelData.secondary_color,
    '--accent-color': funnelData.accent_color,
  } as React.CSSProperties

  return (
    <div className="min-h-screen bg-white" style={styles}>
      {/* Header */}
      {funnelData.logo_url && (
        <header className="py-4 px-6 border-b">
          <img 
            src={funnelData.logo_url} 
            alt="Logo" 
            className="h-12 max-w-xs"
          />
        </header>
      )}

      {/* Hero Section */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 
            className="text-4xl md:text-6xl font-bold mb-6"
            style={{ color: funnelData.primary_color }}
          >
            {funnelData.headline}
          </h1>
          
          <p 
            className="text-xl md:text-2xl mb-8 text-gray-600"
          >
            {funnelData.subheadline}
          </p>

          <div className="prose prose-lg mx-auto mb-12 text-gray-700">
            <p>{funnelData.hero_text}</p>
          </div>

          {/* Video Section */}
          {funnelData.vsl_type === 'youtube' && funnelData.vsl_url && (
            <div className="mb-12">
              <h3 className="text-2xl font-semibold mb-6">{funnelData.vsl_title}</h3>
              <div className="aspect-video max-w-3xl mx-auto">
                <iframe
                  src={funnelData.vsl_url.replace('watch?v=', 'embed/')}
                  title={funnelData.vsl_title}
                  className="w-full h-full rounded-lg shadow-lg"
                  allowFullScreen
                />
              </div>
            </div>
          )}

          {funnelData.vsl_type === 'custom' && funnelData.vsl_url && (
            <div className="mb-12">
              <h3 className="text-2xl font-semibold mb-6">{funnelData.vsl_title}</h3>
              <div className="aspect-video max-w-3xl mx-auto">
                <video
                  src={funnelData.vsl_url}
                  title={funnelData.vsl_title}
                  className="w-full h-full rounded-lg shadow-lg"
                  controls
                />
              </div>
            </div>
          )}

          {/* CTA Button */}
          <Button
            size="lg"
            className="text-xl px-12 py-6 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all"
            style={{ 
              backgroundColor: funnelData.accent_color,
              color: 'white'
            }}
          >
            {funnelData.cta_text}
            <ArrowRight className="w-6 h-6 ml-3" />
          </Button>
        </div>
      </section>

      {/* Offer Section */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 
            className="text-3xl md:text-4xl font-bold text-center mb-12"
            style={{ color: funnelData.primary_color }}
          >
            What You'll Get
          </h2>
          
          <Card className="mb-8">
            <CardContent className="p-8">
              <div className="prose prose-lg mx-auto text-gray-700">
                <p>{funnelData.offer_description}</p>
              </div>
            </CardContent>
          </Card>

          {/* Features/Benefits */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <Card>
              <CardContent className="p-6 text-center">
                <CheckCircle className="w-12 h-12 mx-auto mb-4" style={{ color: funnelData.accent_color }} />
                <h3 className="text-xl font-semibold mb-2">Proven Results</h3>
                <p className="text-gray-600">Get the exact strategies that work</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 text-center">
                <Star className="w-12 h-12 mx-auto mb-4" style={{ color: funnelData.accent_color }} />
                <h3 className="text-xl font-semibold mb-2">Expert Support</h3>
                <p className="text-gray-600">Direct access to our team</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 text-center">
                <Clock className="w-12 h-12 mx-auto mb-4" style={{ color: funnelData.accent_color }} />
                <h3 className="text-xl font-semibold mb-2">Fast Results</h3>
                <p className="text-gray-600">See results in weeks, not months</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Guarantee Section */}
      {funnelData.guarantee_text && (
        <section className="py-16 px-6">
          <div className="max-w-3xl mx-auto text-center">
            <Badge 
              className="text-lg px-6 py-2 mb-6"
              style={{ backgroundColor: funnelData.accent_color, color: 'white' }}
            >
              100% Guarantee
            </Badge>
            <p className="text-lg text-gray-700">{funnelData.guarantee_text}</p>
          </div>
        </section>
      )}

      {/* Calendar Section */}
      {funnelData.calendar_embed_code && (
        <section className="py-16 px-6 bg-gray-50">
          <div className="max-w-4xl mx-auto text-center">
            <h2 
              className="text-3xl md:text-4xl font-bold mb-8"
              style={{ color: funnelData.primary_color }}
            >
              {funnelData.calendar_title}
            </h2>
            
            <div 
              className="calendar-embed"
              dangerouslySetInnerHTML={{ __html: funnelData.calendar_embed_code }}
            />
          </div>
        </section>
      )}

      {/* Final CTA */}
      <section className="py-16 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <h2 
            className="text-3xl font-bold mb-8"
            style={{ color: funnelData.primary_color }}
          >
            Ready to Get Started?
          </h2>
          
          <Button
            size="lg"
            className="text-xl px-12 py-6 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all"
            style={{ 
              backgroundColor: funnelData.accent_color,
              color: 'white'
            }}
          >
            {funnelData.cta_text}
            <ArrowRight className="w-6 h-6 ml-3" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 bg-gray-100 text-center text-gray-600">
        <p>&copy; 2024 {funnelData.name}. All rights reserved.</p>
      </footer>
    </div>
  )
} 