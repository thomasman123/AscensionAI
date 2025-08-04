'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { DashboardNav } from '@/components/dashboard-nav'
import { useAuth } from '@/lib/auth-context'
import { ArrowLeft, Save, Eye, Loader2, Upload, Image, Palette, Type, Globe } from 'lucide-react'

interface FunnelEditPageProps {
  params: {
    id: string
  }
}

export default function FunnelEditPage({ params }: FunnelEditPageProps) {
  const { user } = useAuth()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [funnel, setFunnel] = useState<any>(null)
  const [step, setStep] = useState(1)

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
    if (!user) {
      router.push('/login')
      return
    }
    loadFunnel()
  }, [user, params.id])

  const loadFunnel = async () => {
    try {
      const response = await fetch(`/api/funnels/save?userId=${user?.id}&funnelId=${params.id}`)
      if (response.ok) {
        const data = await response.json()
        setFunnel(data.funnel)
        
        // Set customization from funnel data
        setCustomization({
          headline: data.funnel.data?.customization?.headline || '',
          subheadline: data.funnel.data?.customization?.subheadline || '',
          heroText: data.funnel.data?.customization?.heroText || '',
          ctaText: data.funnel.data?.customization?.ctaText || 'Get Started Now',
          offerDescription: data.funnel.data?.customization?.offerDescription || '',
          guaranteeText: data.funnel.data?.customization?.guaranteeText || '',
          colors: data.funnel.data?.customization?.colors || {
            primary: '#3B82F6',
            secondary: '#1E40AF',
            accent: '#F59E0B'
          },
          logoUrl: data.funnel.data?.customization?.logoUrl || '',
          domain: data.funnel.custom_domain || ''
        })
      } else {
        console.error('Failed to load funnel')
        router.push('/funnels')
      }
    } catch (error) {
      console.error('Error loading funnel:', error)
      router.push('/funnels')
    }
    setIsLoading(false)
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const saveData = {
        userId: user?.id,
        funnelId: params.id,
        name: funnel.name,
        type: funnel.type,
        status: funnel.status,
        offerData: funnel.data?.offerData,
        caseStudies: funnel.data?.caseStudies,
        media: funnel.data?.media,
        templateId: funnel.data?.templateId,
        customization
      }

      const response = await fetch('/api/funnels/save', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(saveData)
      })

      if (response.ok) {
        // Redirect back to funnels page
        router.push('/funnels')
      } else {
        const errorData = await response.json()
        alert(errorData.error || 'Failed to save changes')
      }
    } catch (error) {
      console.error('Error saving funnel:', error)
      alert('Failed to save changes')
    }
    setIsSaving(false)
  }

  const handlePreview = () => {
    // Store current customization in localStorage for preview
    localStorage.setItem('previewData', JSON.stringify({
      ...funnel.data,
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
    }
    reader.readAsDataURL(file)
  }

  if (isLoading) {
    return (
      <DashboardNav>
        <div className="h-full flex items-center justify-center bg-tier-950">
          <div className="w-8 h-8 border-2 border-accent-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </DashboardNav>
    )
  }

  if (!funnel) {
    return (
      <DashboardNav>
        <div className="h-full flex items-center justify-center bg-tier-950">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-tier-50 mb-2">Funnel not found</h2>
            <p className="text-tier-400 mb-4">The funnel you're looking for doesn't exist or you don't have access to it.</p>
            <Button onClick={() => router.push('/funnels')} className="bg-accent-500 hover:bg-accent-600">
              Back to Funnels
            </Button>
          </div>
        </div>
      </DashboardNav>
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
                Edit Funnel: {funnel.name}
              </h1>
              <p className="text-lg text-tier-300">
                Update your funnel's content, design, and settings
              </p>
            </div>

            {/* Tabs */}
            <div className="flex justify-center mb-8">
              <div className="flex bg-tier-800 rounded-lg p-1">
                <button
                  onClick={() => setStep(1)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
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
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    step === 2 
                      ? 'bg-accent-500 text-white' 
                      : 'text-tier-300 hover:text-tier-50'
                  }`}
                >
                  <Palette className="w-4 h-4 inline mr-2" />
                  Colors & Branding
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
                          PNG, JPG up to 2MB
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

            {/* Navigation */}
            <div className="flex justify-between items-center mt-8">
              <Button
                variant="outline"
                onClick={() => router.push('/funnels')}
                className="border-tier-600 text-tier-300 hover:border-tier-500"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Funnels
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
                  onClick={handleSave}
                  disabled={isSaving}
                  className="bg-accent-500 hover:bg-accent-600 text-white"
                >
                  {isSaving ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4 mr-2" />
                  )}
                  Save Changes
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardNav>
  )
} 