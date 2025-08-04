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
import { useAuth } from '@/lib/auth-context'
import { 
  ArrowRight, 
  ArrowLeft, 
  Save, 
  Eye, 
  Palette,
  Type,
  Globe,
  Loader2,
  Upload,
  Image,
  Sun,
  Moon,
  Sparkles
} from 'lucide-react'

function CustomizeContent() {
  const { user } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const funnelType = searchParams.get('type') as 'trigger' | 'gateway'
  
  const [step, setStep] = useState(1)
  const [isGenerating, setIsGenerating] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [generatedCopy, setGeneratedCopy] = useState<any>(null)
  const [hasGenerated, setHasGenerated] = useState(false)
  const [userSettings, setUserSettings] = useState<any>(null)
  
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
    domain: '',
    facebookPixelId: '',
    googleAnalyticsId: '',
    themeMode: 'light' as 'light' | 'dark'
  })

  // Predefined color schemes
  const colorSchemes = [
    {
      name: "Ocean Blue",
      primary: "#3B82F6",
      secondary: "#1E40AF", 
      accent: "#0EA5E9"
    },
    {
      name: "Emerald Green",
      primary: "#059669",
      secondary: "#047857",
      accent: "#10B981"
    },
    {
      name: "Royal Purple",
      primary: "#7C3AED",
      secondary: "#5B21B6",
      accent: "#8B5CF6"
    },
    {
      name: "Sunset Orange",
      primary: "#EA580C",
      secondary: "#C2410C",
      accent: "#F97316"
    },
    {
      name: "Rose Pink",
      primary: "#E11D48",
      secondary: "#BE185D",
      accent: "#F43F5E"
    },
    {
      name: "Slate Dark",
      primary: "#475569",
      secondary: "#334155",
      accent: "#64748B"
    }
  ]

  // Load user settings for logo
  useEffect(() => {
    const loadUserSettings = async () => {
      if (user) {
        try {
          const response = await fetch(`/api/user/settings?userId=${user.id}`)
          if (response.ok) {
            const data = await response.json()
            setUserSettings(data.settings)
            
            // Set logo from user settings
            if (data.settings.logoUrl) {
              setCustomization(prev => ({
                ...prev,
                logoUrl: data.settings.logoUrl,
                colors: data.settings.defaultColors || prev.colors
              }))
            }
          }
        } catch (error) {
          console.error('Error loading user settings:', error)
        }
      }
    }
    
    loadUserSettings()
  }, [user])

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
        
        // If we have offer data and haven't generated yet, generate copy automatically
        if (parsedData.offerData && !hasGenerated) {
          generateCopy(parsedData.offerData)
        }
      } catch (error) {
        console.error('Error parsing funnel data:', error)
        router.push('/funnels/create')
      }
    } else {
      router.push('/funnels/create')
    }
  }, [funnelType, searchParams, router, hasGenerated])

  const generateCopy = async (offerData: any) => {
    if (isGenerating || hasGenerated) return
    
    setIsGenerating(true)
    setHasGenerated(true)
    
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
      } else {
        console.error('Failed to generate copy:', response.status)
        // Continue without generated copy - user can input manually
      }
    } catch (error) {
      console.error('Error generating copy:', error)
      // Continue without generated copy - user can input manually
    }
    
    setIsGenerating(false)
  }

  const handleSave = async (status: 'draft' | 'published') => {
    setIsSaving(true)
    try {
      const saveData = {
        userId: user?.id || '00000000-0000-0000-0000-000000000000',
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
        
        // Always redirect to funnels page after saving
          router.push('/funnels')
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

  const handleLogoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // For now, we'll use a placeholder URL. In production, you'd upload to a service like Supabase Storage
    const reader = new FileReader()
    reader.onload = (e) => {
      const logoUrl = e.target?.result as string
      setCustomization(prev => ({
        ...prev,
        logoUrl
      }))
      
      // Also save to user settings
      saveUserSettings({ logoUrl })
    }
    reader.readAsDataURL(file)
  }

  const saveUserSettings = async (updates: any) => {
    if (!user) return
    
    try {
      await fetch('/api/user/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          logoUrl: updates.logoUrl || userSettings?.logoUrl,
          companyName: userSettings?.companyName,
          websiteUrl: userSettings?.websiteUrl,
          defaultColors: customization.colors
        })
      })
    } catch (error) {
      console.error('Error saving user settings:', error)
    }
  }

  if (!funnelData) {
    return (
      <div className="h-full flex items-center justify-center bg-tier-950">
        <div className="w-8 h-8 border-2 border-accent-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <DashboardNav>
    <div className="h-full overflow-auto bg-tier-950">
      <div className="p-8">
          <div className="max-w-4xl mx-auto">
          {/* Header */}
            <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-tier-50 mb-2">
              Customize Your Funnel
            </h1>
            <p className="text-lg text-tier-300">
              Perfect your copy, colors, and domain to match your brand
            </p>
              
              {/* Step Indicator */}
              <div className="flex items-center justify-center mt-6 mb-8">
                <div className="text-sm text-tier-400">
                  Step 8 of 8
                </div>
              </div>
          </div>

            {/* AI Generation Status */}
            {isGenerating && (
              <Card className="bg-tier-900 border-tier-800 mb-8">
                <CardContent className="py-8 text-center">
                  <Loader2 className="w-8 h-8 animate-spin text-accent-500 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-tier-50 mb-2">
                    AI is generating your copy...
                  </h3>
                  <p className="text-tier-400">
                    Creating compelling copy based on your offer details. This will take a moment.
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Tabs */}
            <div className="flex justify-center mb-8">
              <div className="flex bg-tier-800 rounded-lg p-1">
                <button
              onClick={() => setStep(1)}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    step === 1 
                      ? 'bg-accent-500 text-white' 
                      : 'text-tier-300 hover:text-tier-50'
                  }`}
            >
                  <Type className="w-4 h-4 inline mr-2" />
              Copy & Content
                </button>
                <button
              onClick={() => setStep(2)}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    step === 2 
                      ? 'bg-accent-500 text-white' 
                      : 'text-tier-300 hover:text-tier-50'
                  }`}
            >
                  <Palette className="w-4 h-4 inline mr-2" />
              Colors & Branding
                </button>
                <button
              onClick={() => setStep(3)}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    step === 3 
                      ? 'bg-accent-500 text-white' 
                      : 'text-tier-300 hover:text-tier-50'
                  }`}
            >
                  <Globe className="w-4 h-4 inline mr-2" />
              Domain & Settings
                </button>
                <button
              onClick={() => setStep(4)}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    step === 4 
                      ? 'bg-accent-500 text-white' 
                      : 'text-tier-300 hover:text-tier-50'
                  }`}
            >
                  <Eye className="w-4 h-4 inline mr-2" />
              Tracking & Analytics
                </button>
              </div>
          </div>

            {/* Content based on step */}
          {step === 1 && (
              <Card className="bg-tier-900 border-tier-800">
                <CardHeader>
                  <CardTitle className="text-tier-50">Headline & Messaging</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-tier-300 mb-2">
                      Main Headline
                    </label>
                    <Input
                      placeholder="Enter your main headline..."
                      value={customization.headline}
                      onChange={(e) => setCustomization(prev => ({ 
                        ...prev, 
                        headline: e.target.value 
                      }))}
                      className="bg-tier-800 border-tier-700 text-tier-100"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-tier-300 mb-2">
                      Subheadline
                    </label>
                    <Input
                      placeholder="Enter your subheadline..."
                      value={customization.subheadline}
                      onChange={(e) => setCustomization(prev => ({ 
                        ...prev, 
                        subheadline: e.target.value 
                      }))}
                      className="bg-tier-800 border-tier-700 text-tier-100"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-tier-300 mb-2">
                      Hero Text
                    </label>
                    <Textarea
                      placeholder="Enter your main description..."
                      value={customization.heroText}
                      onChange={(e) => setCustomization(prev => ({ 
                        ...prev, 
                        heroText: e.target.value 
                      }))}
                      className="bg-tier-800 border-tier-700 text-tier-100 min-h-[100px]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-tier-300 mb-2">
                        CTA Button Text
                      </label>
                      <Input
                        placeholder="Get Started Now"
                        value={customization.ctaText}
                        onChange={(e) => setCustomization(prev => ({ 
                          ...prev, 
                          ctaText: e.target.value 
                        }))}
                        className="bg-tier-800 border-tier-700 text-tier-100"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-tier-300 mb-2">
                        Guarantee Text
                      </label>
                      <Input
                        placeholder="30-day money-back guarantee"
                        value={customization.guaranteeText}
                        onChange={(e) => setCustomization(prev => ({ 
                          ...prev, 
                          guaranteeText: e.target.value 
                        }))}
                        className="bg-tier-800 border-tier-700 text-tier-100"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-tier-300 mb-2">
                      Offer Description
                    </label>
                    <Textarea
                      placeholder="Describe your complete offer..."
                      value={customization.offerDescription}
                      onChange={(e) => setCustomization(prev => ({ 
                        ...prev, 
                        offerDescription: e.target.value 
                      }))}
                      className="bg-tier-800 border-tier-700 text-tier-100"
                    />
                  </div>
                </CardContent>
              </Card>
          )}

          {step === 2 && (
              <Card className="bg-tier-900 border-tier-800">
                <CardHeader>
                  <CardTitle className="text-tier-50">Colors & Branding</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Logo Upload */}
                  <div>
                    <label className="block text-sm font-medium text-tier-300 mb-2">
                      Logo
                    </label>
                    <div className="flex items-center gap-4">
                      {customization.logoUrl ? (
                        <div className="w-20 h-20 bg-tier-800 rounded-lg flex items-center justify-center border border-tier-700">
                          <img 
                            src={customization.logoUrl} 
                            alt="Logo" 
                            className="max-w-full max-h-full object-contain"
                          />
                        </div>
                      ) : (
                        <div className="w-20 h-20 bg-tier-800 rounded-lg flex items-center justify-center border border-tier-700">
                          <Image className="w-6 h-6 text-tier-500" />
                        </div>
                      )}
                      <div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleLogoUpload}
                          className="hidden"
                          id="logo-upload"
                        />
                        <label
                          htmlFor="logo-upload"
                          className="inline-flex items-center px-4 py-2 bg-tier-800 hover:bg-tier-700 border border-tier-600 rounded-md text-tier-300 cursor-pointer transition-colors"
                        >
                          <Upload className="w-4 h-4 mr-2" />
                          Upload Logo
                        </label>
                        <p className="text-tier-500 text-xs mt-1">
                          PNG, JPG up to 2MB. This will be saved to your profile.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Color Selection */}
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-tier-300 mb-2">
                        Primary Color
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={customization.colors.primary}
                          onChange={(e) => setCustomization(prev => ({ 
                            ...prev, 
                            colors: { ...prev.colors, primary: e.target.value }
                          }))}
                          className="w-12 h-8 rounded border border-tier-600"
                        />
                        <Input
                          value={customization.colors.primary}
                          onChange={(e) => setCustomization(prev => ({ 
                            ...prev, 
                            colors: { ...prev.colors, primary: e.target.value }
                          }))}
                          className="bg-tier-800 border-tier-700 text-tier-100 text-sm"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-tier-300 mb-2">
                        Secondary Color
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={customization.colors.secondary}
                          onChange={(e) => setCustomization(prev => ({ 
                            ...prev, 
                            colors: { ...prev.colors, secondary: e.target.value }
                          }))}
                          className="w-12 h-8 rounded border border-tier-600"
                        />
                        <Input
                          value={customization.colors.secondary}
                          onChange={(e) => setCustomization(prev => ({ 
                            ...prev, 
                            colors: { ...prev.colors, secondary: e.target.value }
                          }))}
                          className="bg-tier-800 border-tier-700 text-tier-100 text-sm"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-tier-300 mb-2">
                        Accent Color
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={customization.colors.accent}
                          onChange={(e) => setCustomization(prev => ({ 
                            ...prev, 
                            colors: { ...prev.colors, accent: e.target.value }
                          }))}
                          className="w-12 h-8 rounded border border-tier-600"
                        />
                        <Input
                          value={customization.colors.accent}
                          onChange={(e) => setCustomization(prev => ({ 
                            ...prev, 
                            colors: { ...prev.colors, accent: e.target.value }
                          }))}
                          className="bg-tier-800 border-tier-700 text-tier-100 text-sm"
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {step === 3 && (
              <Card className="bg-tier-900 border-tier-800">
                <CardHeader>
                  <CardTitle className="text-tier-50">Domain & Settings</CardTitle>
                </CardHeader>
                <CardContent>
              <DomainManager 
                funnelId="temp-funnel-id"
                     userId={user?.id || '00000000-0000-0000-0000-000000000000'}
                     onDomainAdded={(domainObj) => {
                       setCustomization(prev => ({ ...prev, domain: domainObj.domain }))
                     }}
                     onDomainRemoved={() => {
                       setCustomization(prev => ({ ...prev, domain: '' }))
                     }}
                   />
                </CardContent>
              </Card>
          )}

            {step === 4 && (
              <Card className="bg-tier-900 border-tier-800">
                <CardHeader>
                  <CardTitle className="text-tier-50">Tracking & Analytics</CardTitle>
                  <p className="text-tier-300 text-sm">
                    Add your tracking codes to monitor conversions and optimize your funnel performance
                  </p>
                </CardHeader>
                <CardContent className="space-y-6">
                  
                  {/* Facebook Pixel */}
                  <div>
                    <label className="block text-sm font-medium text-tier-300 mb-2">
                      Facebook Pixel ID
                    </label>
                    <Input
                      placeholder="123456789012345"
                      value={customization.facebookPixelId}
                      onChange={(e) => setCustomization(prev => ({ ...prev, facebookPixelId: e.target.value }))}
                      className="bg-tier-800 border-tier-700 text-tier-100"
                    />
                    <p className="text-xs text-tier-500 mt-1">
                      Find this in Meta Events Manager → Data Sources → Pixels
                    </p>
                  </div>

                  {/* Google Analytics */}
                  <div>
                    <label className="block text-sm font-medium text-tier-300 mb-2">
                      Google Analytics 4 ID
                    </label>
                    <Input
                      placeholder="G-XXXXXXXXXX"
                      value={customization.googleAnalyticsId}
                      onChange={(e) => setCustomization(prev => ({ ...prev, googleAnalyticsId: e.target.value }))}
                      className="bg-tier-800 border-tier-700 text-tier-100"
                    />
                    <p className="text-xs text-tier-500 mt-1">
                      Find this in Google Analytics → Admin → Data Streams → Measurement ID
                    </p>
                  </div>

                  {/* Theme Mode Selector */}
                  <div>
                    <label className="block text-sm font-medium text-tier-300 mb-2">
                      Theme Mode
                    </label>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setCustomization(prev => ({ ...prev, themeMode: 'light' }))}
                        className={`p-2 rounded-md transition-colors ${
                          customization.themeMode === 'light'
                            ? 'bg-accent-500 text-white'
                            : 'text-tier-300 hover:text-tier-50'
                        }`}
                      >
                        <Sun className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => setCustomization(prev => ({ ...prev, themeMode: 'dark' }))}
                        className={`p-2 rounded-md transition-colors ${
                          customization.themeMode === 'dark'
                            ? 'bg-accent-500 text-white'
                            : 'text-tier-300 hover:text-tier-50'
                        }`}
                      >
                        <Moon className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  {/* Help Text */}
                  <div className="bg-tier-800 rounded-lg p-4 border border-tier-700">
                    <h4 className="text-sm font-semibold text-tier-50 mb-2">Why add tracking?</h4>
                    <ul className="text-xs text-tier-400 space-y-1">
                      <li>• Track conversions for Meta ads optimization</li>
                      <li>• Monitor funnel performance and user behavior</li>
                      <li>• Build custom audiences for retargeting</li>
                      <li>• Measure ROI and campaign effectiveness</li>
                    </ul>
                    <div className="mt-3 pt-3 border-t border-tier-700">
                      <p className="text-xs text-tier-500">
                        <strong>Optional:</strong> You can launch your funnel without tracking and add it later.
                      </p>
                    </div>
                  </div>

                </CardContent>
              </Card>
          )}

          {/* Navigation */}
            <div className="flex justify-between items-center mt-8">
            <Button 
              variant="outline" 
                onClick={() => router.push(`/funnels/create/template?type=${funnelType}&data=${searchParams.get('data')}`)}
              className="border-tier-600 text-tier-300 hover:border-tier-500"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Media
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

                <Button
                  onClick={() => handleSave('draft')}
                  disabled={isSaving}
                  className="bg-tier-700 hover:bg-tier-600 text-white"
                >
                  {isSaving ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4 mr-2" />
                  )}
                  Save Draft
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
            </div>
          </div>
        </div>
      </div>
    </DashboardNav>
  )
}

export default function CustomizePage() {
  return (
    <Suspense fallback={
      <div className="h-full flex items-center justify-center bg-tier-950">
        <div className="w-8 h-8 border-2 border-accent-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    }>
        <CustomizeContent />
      </Suspense>
  )
} 