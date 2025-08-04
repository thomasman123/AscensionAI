'use client'

export const dynamic = 'force-dynamic'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { DashboardNav } from '@/components/dashboard-nav'
import { DomainManager } from '@/components/domain-manager'
import { 
  ArrowRight, 
  ArrowLeft, 
  Save, 
  Eye, 
  Palette,
  Type,
  Globe,
  Loader2
} from 'lucide-react'

function CustomizeContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const funnelType = searchParams.get('type') as 'trigger' | 'gateway'
  
  const [step, setStep] = useState(1)
  const [isGenerating, setIsGenerating] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [generatedCopy, setGeneratedCopy] = useState<any>(null)
  
  // Get data from previous steps
  const [funnelData, setFunnelData] = useState<any>(null)
  
  const [customization, setCustomization] = useState({
    headline: '',
    subheadline: '',
    heroText: '',
    ctaText: 'Get Started Now',
    offerDescription: '',
    guaranteeText: '',
    colors: {
      primary: '#3B82F6',
      secondary: '#1E40AF',
      accent: '#F59E0B'
    },
    logoUrl: '',
    domain: ''
  })

  useEffect(() => {
    if (!funnelType) {
      router.push('/funnels/create')
      return
    }

    // Get data from URL parameters
    const data = searchParams.get('data')
    if (data) {
      try {
        const parsedData = JSON.parse(decodeURIComponent(data))
        setFunnelData(parsedData)
        
        // If we have offer data, generate copy automatically
        if (parsedData.offerData && !generatedCopy) {
          generateCopy(parsedData.offerData)
        }
      } catch (error) {
        console.error('Error parsing funnel data:', error)
        router.push('/funnels/create')
      }
    } else {
      router.push('/funnels/create')
    }
  }, [funnelType, searchParams, router])

  const generateCopy = async (offerData: any) => {
    setIsGenerating(true)
    try {
      const response = await fetch('/api/ai/generate-copy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          offerData,
          templateType: funnelType
        })
      })

      if (response.ok) {
        const data = await response.json()
        setGeneratedCopy(data.copy)
        setCustomization(prev => ({
          ...prev,
          headline: data.copy.headline || '',
          subheadline: data.copy.subheadline || '',
          heroText: data.copy.heroText || '',
          ctaText: data.copy.ctaText || 'Get Started Now',
          offerDescription: data.copy.offerDescription || '',
          guaranteeText: data.copy.guaranteeText || ''
        }))
      }
    } catch (error) {
      console.error('Error generating copy:', error)
    }
    setIsGenerating(false)
  }

  const handleSave = async (status: 'draft' | 'published') => {
    setIsSaving(true)
    try {
      const saveData = {
        userId: '00000000-0000-0000-0000-000000000000',
        name: funnelData?.offerData?.who 
          ? `${funnelData.offerData.who} - ${funnelData.offerData.outcome}` 
          : 'My Funnel',
        type: funnelType,
        status,
        offerData: funnelData?.offerData,
        caseStudies: funnelData?.caseStudies,
        media: funnelData?.media,
        templateId: funnelData?.templateId,
        customization
      }

      const response = await fetch('/api/funnels/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(saveData)
      })

      if (response.ok) {
        const data = await response.json()
        const funnelId = data.funnel.id
        
        if (status === 'published') {
          router.push(`/funnels/success?id=${funnelId}&type=${funnelType}`)
        } else {
          router.push('/funnels')
        }
      } else {
        const errorData = await response.json()
        alert(errorData.error || 'Failed to save funnel')
      }
    } catch (error) {
      console.error('Error saving funnel:', error)
      alert('Failed to save funnel')
    }
    setIsSaving(false)
  }

  const handlePreview = () => {
    // Store current customization in localStorage for preview
    localStorage.setItem('previewData', JSON.stringify({
      ...funnelData,
      customization
    }))
    window.open('/preview', '_blank')
  }

  if (!funnelData) {
    return (
      <div className="h-full flex items-center justify-center bg-tier-950">
        <div className="w-8 h-8 border-2 border-accent-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="h-full overflow-auto bg-tier-950">
      <div className="p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-4">
              <div className="px-3 py-1 bg-accent-500/20 text-accent-400 rounded-full text-sm font-medium">
                Step 8 of 8
              </div>
              <div className="flex-1 bg-tier-800 rounded-full h-2">
                <div 
                  className="bg-accent-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: '100%' }}
                ></div>
              </div>
            </div>
            
            <h1 className="text-3xl font-bold text-tier-50 mb-2">
              Customize Your Funnel
            </h1>
            <p className="text-lg text-tier-300">
              Perfect your copy, colors, and domain to match your brand
            </p>
          </div>

          {/* Step Navigation */}
          <div className="flex gap-4 mb-8">
            <Button
              variant={step === 1 ? "default" : "outline"}
              onClick={() => setStep(1)}
              className={step === 1 ? "bg-accent-500 text-white" : "border-tier-600 text-tier-300"}
            >
              <Type className="w-4 h-4 mr-2" />
              Copy & Content
            </Button>
            <Button
              variant={step === 2 ? "default" : "outline"}
              onClick={() => setStep(2)}
              className={step === 2 ? "bg-accent-500 text-white" : "border-tier-600 text-tier-300"}
            >
              <Palette className="w-4 h-4 mr-2" />
              Colors & Branding
            </Button>
            <Button
              variant={step === 3 ? "default" : "outline"}
              onClick={() => setStep(3)}
              className={step === 3 ? "bg-accent-500 text-white" : "border-tier-600 text-tier-300"}
            >
              <Globe className="w-4 h-4 mr-2" />
              Domain & Settings
            </Button>
          </div>

          {/* Step 1: Copy & Content */}
          {step === 1 && (
            <div className="space-y-6">
              {isGenerating && (
                <Card className="bg-tier-900 border-tier-800">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-center">
                      <Loader2 className="w-6 h-6 animate-spin text-accent-500" />
                      <span className="ml-2 text-tier-300">Generating AI-powered copy...</span>
                    </div>
                  </CardContent>
                </Card>
              )}

              <Card className="bg-tier-900 border-tier-800">
                <CardHeader>
                  <CardTitle className="text-tier-50">Headline & Messaging</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-tier-300 mb-2">Main Headline</label>
                    <Input
                      value={customization.headline}
                      onChange={(e) => setCustomization({...customization, headline: e.target.value})}
                      placeholder="Enter your main headline..."
                      className="bg-tier-800 border-tier-700 text-tier-100"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-tier-300 mb-2">Subheadline</label>
                    <Input
                      value={customization.subheadline}
                      onChange={(e) => setCustomization({...customization, subheadline: e.target.value})}
                      placeholder="Enter your subheadline..."
                      className="bg-tier-800 border-tier-700 text-tier-100"
                    />
                  </div>

                  <div>
                    <label className="block text-tier-300 mb-2">Hero Text</label>
                    <Textarea
                      value={customization.heroText}
                      onChange={(e) => setCustomization({...customization, heroText: e.target.value})}
                      placeholder="Enter your main description..."
                      className="bg-tier-800 border-tier-700 text-tier-100 min-h-[100px]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-tier-300 mb-2">CTA Button Text</label>
                      <Input
                        value={customization.ctaText}
                        onChange={(e) => setCustomization({...customization, ctaText: e.target.value})}
                        placeholder="Get Started Now"
                        className="bg-tier-800 border-tier-700 text-tier-100"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-tier-300 mb-2">Guarantee Text</label>
                      <Input
                        value={customization.guaranteeText}
                        onChange={(e) => setCustomization({...customization, guaranteeText: e.target.value})}
                        placeholder="30-day money-back guarantee"
                        className="bg-tier-800 border-tier-700 text-tier-100"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-tier-300 mb-2">Offer Description</label>
                    <Textarea
                      value={customization.offerDescription}
                      onChange={(e) => setCustomization({...customization, offerDescription: e.target.value})}
                      placeholder="Describe your complete offer..."
                      className="bg-tier-800 border-tier-700 text-tier-100 min-h-[80px]"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Step 2: Colors & Branding */}
          {step === 2 && (
            <div className="space-y-6">
              <Card className="bg-tier-900 border-tier-800">
                <CardHeader>
                  <CardTitle className="text-tier-50">Brand Colors</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-tier-300 mb-2">Primary Color</label>
                      <div className="flex gap-2">
                        <input
                          type="color"
                          value={customization.colors.primary}
                          onChange={(e) => setCustomization({
                            ...customization,
                            colors: { ...customization.colors, primary: e.target.value }
                          })}
                          className="w-12 h-10 rounded border border-tier-700 cursor-pointer"
                        />
                        <Input
                          value={customization.colors.primary}
                          onChange={(e) => setCustomization({
                            ...customization,
                            colors: { ...customization.colors, primary: e.target.value }
                          })}
                          className="bg-tier-800 border-tier-700 text-tier-100"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-tier-300 mb-2">Secondary Color</label>
                      <div className="flex gap-2">
                        <input
                          type="color"
                          value={customization.colors.secondary}
                          onChange={(e) => setCustomization({
                            ...customization,
                            colors: { ...customization.colors, secondary: e.target.value }
                          })}
                          className="w-12 h-10 rounded border border-tier-700 cursor-pointer"
                        />
                        <Input
                          value={customization.colors.secondary}
                          onChange={(e) => setCustomization({
                            ...customization,
                            colors: { ...customization.colors, secondary: e.target.value }
                          })}
                          className="bg-tier-800 border-tier-700 text-tier-100"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-tier-300 mb-2">Accent Color</label>
                      <div className="flex gap-2">
                        <input
                          type="color"
                          value={customization.colors.accent}
                          onChange={(e) => setCustomization({
                            ...customization,
                            colors: { ...customization.colors, accent: e.target.value }
                          })}
                          className="w-12 h-10 rounded border border-tier-700 cursor-pointer"
                        />
                        <Input
                          value={customization.colors.accent}
                          onChange={(e) => setCustomization({
                            ...customization,
                            colors: { ...customization.colors, accent: e.target.value }
                          })}
                          className="bg-tier-800 border-tier-700 text-tier-100"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-tier-300 mb-2">Logo URL (Optional)</label>
                    <Input
                      value={customization.logoUrl}
                      onChange={(e) => setCustomization({...customization, logoUrl: e.target.value})}
                      placeholder="https://yoursite.com/logo.png"
                      className="bg-tier-800 border-tier-700 text-tier-100"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Color Preview */}
              <Card className="bg-tier-900 border-tier-800">
                <CardHeader>
                  <CardTitle className="text-tier-50">Preview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="p-6 rounded-lg border border-tier-700" style={{ backgroundColor: '#ffffff' }}>
                    <h2 
                      className="text-2xl font-bold mb-2"
                      style={{ color: customization.colors.primary }}
                    >
                      {customization.headline || 'Your Headline Here'}
                    </h2>
                    <p 
                      className="text-lg mb-4"
                      style={{ color: customization.colors.secondary }}
                    >
                      {customization.subheadline || 'Your subheadline here'}
                    </p>
                    <button 
                      className="px-6 py-3 rounded-lg text-white font-semibold"
                      style={{ backgroundColor: customization.colors.accent }}
                    >
                      {customization.ctaText}
                    </button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Step 3: Domain & Settings */}
          {step === 3 && (
            <div className="space-y-6">
              {/* Temporary funnel ID for demo - in real app this would be available after saving */}
              <DomainManager 
                funnelId="temp-funnel-id"
                userId="00000000-0000-0000-0000-000000000000"
                onDomainAdded={(domain) => {
                  console.log('Domain added:', domain)
                }}
                onDomainRemoved={(domainId) => {
                  console.log('Domain removed:', domainId)
                }}
              />

              <Card className="bg-tier-900 border-tier-800">
                <CardHeader>
                  <CardTitle className="text-tier-50">Funnel Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-tier-300 mb-2">Default Domain</label>
                    <Input
                      value={customization.domain}
                      onChange={(e) => setCustomization({...customization, domain: e.target.value})}
                      placeholder="your-funnel-name"
                      className="bg-tier-800 border-tier-700 text-tier-100"
                    />
                    <p className="text-tier-500 text-sm mt-1">
                      This will be your funnel URL: {customization.domain || 'your-funnel-name'}.ascensionai.vercel.app
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between mt-8">
            <Button 
              variant="outline" 
              onClick={() => {
                if (step > 1) {
                  setStep(step - 1)
                } else {
                  router.push(`/funnels/create/media?type=${funnelType}&data=${encodeURIComponent(JSON.stringify(funnelData))}`)
                }
              }}
              className="border-tier-600 text-tier-300 hover:border-tier-500"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              {step > 1 ? 'Previous Step' : 'Back to Media'}
            </Button>
            
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={handlePreview}
                className="border-tier-600 text-tier-300 hover:border-tier-500"
              >
                <Eye className="w-4 h-4 mr-2" />
                Preview
              </Button>

              {step < 3 ? (
                <Button
                  onClick={() => setStep(step + 1)}
                  className="bg-accent-500 hover:bg-accent-600 text-white"
                >
                  Next Step
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => handleSave('draft')}
                    disabled={isSaving}
                    className="border-tier-600 text-tier-300 hover:border-tier-500"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save as Draft
                  </Button>
                  <Button
                    onClick={() => handleSave('published')}
                    disabled={isSaving}
                    className="bg-accent-500 hover:bg-accent-600 text-white"
                  >
                    {isSaving ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <ArrowRight className="w-4 h-4 mr-2" />
                    )}
                    Launch Funnel
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function LoadingFallback() {
  return (
    <div className="h-full flex items-center justify-center bg-tier-950">
      <div className="w-8 h-8 border-2 border-accent-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  )
}

export default function CustomizePage() {
  return (
    <DashboardNav>
      <Suspense fallback={<LoadingFallback />}>
        <CustomizeContent />
      </Suspense>
    </DashboardNav>
  )
} 