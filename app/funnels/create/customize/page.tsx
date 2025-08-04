'use client'

export const dynamic = 'force-dynamic'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { DashboardNav } from '@/components/dashboard-nav'
import { openaiService, OfferData, GeneratedCopy } from '@/lib/openai-service'
import { 
  ArrowRight, 
  ArrowLeft, 
  Eye, 
  Save, 
  Palette, 
  Type, 
  Image, 
  Link, 
  Rocket,
  Upload,
  Globe,
  Play,
  FileText,
  Check,
  Sparkles,
  RefreshCw
} from 'lucide-react'

interface FunnelCustomization {
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
  }
  logo?: File
  logoUrl?: string
  domain: string
  embedType: 'vsl' | 'lead-magnet' | 'none'
  embedUrl: string
  calendarEmbedCode: string
}

export default function CustomizePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const funnelType = searchParams.get('type') as 'trigger' | 'gateway'
  const dataParam = searchParams.get('data')
  
  const [customization, setCustomization] = useState<FunnelCustomization>({
    headline: '',
    subheadline: '',
    heroText: '',
    ctaText: '',
    offerDescription: '',
    guaranteeText: '',
    colors: {
      primary: '#3B82F6',
      secondary: '#1E40AF',
      accent: '#F59E0B'
    },
    domain: 'your-funnel-name',
    embedType: 'none',
    embedUrl: '',
    calendarEmbedCode: ''
  })

  const [activeTab, setActiveTab] = useState<'content' | 'design' | 'settings'>('content')
  const [isSaving, setIsSaving] = useState(false)
  const [isGeneratingCopy, setIsGeneratingCopy] = useState(false)
  const [copyGenerated, setCopyGenerated] = useState(false)

  useEffect(() => {
    if (!funnelType || !dataParam) {
      router.push('/funnels/create')
      return
    }

    // Generate AI copy on page load
    generateAICopy()
  }, [funnelType, dataParam, router])

  const generateAICopy = async () => {
    if (!dataParam) return

    setIsGeneratingCopy(true)
    try {
      const funnelData = JSON.parse(decodeURIComponent(dataParam)) as OfferData
      const generatedCopy = await openaiService.generateCopy(funnelData, funnelType)
      
      setCustomization(prev => ({
        ...prev,
        headline: generatedCopy.headline,
        subheadline: generatedCopy.subheadline,
        heroText: generatedCopy.heroText,
        ctaText: generatedCopy.ctaText,
        offerDescription: generatedCopy.offerDescription,
        guaranteeText: generatedCopy.guaranteeText
      }))
      
      setCopyGenerated(true)
    } catch (error) {
      console.error('Error generating copy:', error)
    }
    setIsGeneratingCopy(false)
  }

  const handleInputChange = (field: keyof FunnelCustomization, value: string) => {
    setCustomization(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleColorChange = (colorType: keyof FunnelCustomization['colors'], value: string) => {
    setCustomization(prev => ({
      ...prev,
      colors: {
        ...prev.colors,
        [colorType]: value
      }
    }))
  }

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Logo file size must be less than 5MB')
        return
      }

      const logoUrl = URL.createObjectURL(file)
      setCustomization(prev => ({
        ...prev,
        logo: file,
        logoUrl
      }))
    }
  }

  const handleSave = async (status: 'draft' | 'published' = 'draft') => {
    setIsSaving(true)
    
    try {
      // Parse all the funnel data
      const funnelData = dataParam ? JSON.parse(decodeURIComponent(dataParam)) : {}
      
      // Generate funnel name from offer data
      const funnelName = funnelData.who 
        ? `${funnelData.who} - ${funnelData.outcome || 'Funnel'}`
        : `New ${funnelType === 'trigger' ? 'Trigger' : 'Gateway'} Funnel`
      
      // Prepare save data
      const saveData = {
        name: funnelName,
        type: funnelType,
        status,
        domain: customization.domain,
        offerData: funnelData,
        caseStudies: funnelData.caseStudies || [],
        media: funnelData.media || {},
        templateId: funnelData.selectedTemplate || 'trigger-template-1',
        customization
      }
      
      const response = await fetch('/api/funnels/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(saveData)
      })
      
      if (!response.ok) {
        throw new Error('Failed to save funnel')
      }
      
      const result = await response.json()
      
      // Navigate to success page with the saved funnel data
      router.push(`/funnels/success?type=${funnelType}&funnelId=${result.funnel.id}&status=${status}`)
    } catch (error) {
      console.error('Error saving funnel:', error)
      alert('Failed to save funnel. Please try again.')
    }
    
    setIsSaving(false)
  }

  const handlePrevious = () => {
    router.push(`/funnels/create/template?type=${funnelType}&data=${dataParam}`)
  }

  if (!funnelType || !dataParam) {
    return null
  }

  return (
    <DashboardNav>
      <div className="h-full overflow-auto bg-tier-950">
        <div className="p-8">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-tier-50 mb-2">
                Customize Your Funnel
              </h1>
              <p className="text-lg text-tier-300">
                Review and customize the AI-generated content and design
              </p>
            </div>

            {/* Copy Generation Status */}
            {isGeneratingCopy && (
              <Card className="bg-tier-900 border-tier-800 mb-8">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 border-2 border-accent-500 border-t-transparent rounded-full animate-spin"></div>
                    <div>
                      <h3 className="font-semibold text-tier-50">Generating AI Copy</h3>
                      <p className="text-tier-400">Creating personalized content based on your offer data...</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {copyGenerated && (
              <Card className="bg-accent-500/10 border-accent-500/20 mb-8">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-accent-400" />
                    <span className="text-accent-300 font-medium">AI copy generated successfully!</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={generateAICopy}
                      className="ml-auto text-accent-400 hover:text-accent-300"
                    >
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Regenerate
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Tabs */}
            <div className="flex border-b border-tier-800 mb-8">
              {[
                { id: 'content', label: 'Content', icon: Type },
                { id: 'design', label: 'Design', icon: Palette },
                { id: 'settings', label: 'Settings', icon: Rocket }
              ].map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as typeof activeTab)}
                    className={`flex items-center gap-2 px-6 py-3 border-b-2 transition-colors ${
                      activeTab === tab.id
                        ? 'border-accent-500 text-accent-400'
                        : 'border-transparent text-tier-400 hover:text-tier-300'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                )
              })}
            </div>

            <div className="grid gap-8 lg:grid-cols-3">
              {/* Settings Panel */}
              <div className="lg:col-span-2 space-y-6">
                {activeTab === 'content' && (
                  <>
                    {/* Headlines */}
                    <Card className="bg-tier-900 border-tier-800">
                      <CardHeader>
                        <CardTitle className="text-tier-50">Headlines & Copy</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <label className="text-sm font-medium text-tier-200 mb-2 block">
                            Main Headline
                          </label>
                          <Input
                            value={customization.headline}
                            onChange={(e) => handleInputChange('headline', e.target.value)}
                            className="bg-tier-800 border-tier-700 text-tier-50"
                            placeholder="Your compelling headline..."
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium text-tier-200 mb-2 block">
                            Subheadline
                          </label>
                          <Input
                            value={customization.subheadline}
                            onChange={(e) => handleInputChange('subheadline', e.target.value)}
                            className="bg-tier-800 border-tier-700 text-tier-50"
                            placeholder="Supporting subheadline..."
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium text-tier-200 mb-2 block">
                            Hero Text
                          </label>
                          <Textarea
                            value={customization.heroText}
                            onChange={(e) => handleInputChange('heroText', e.target.value)}
                            className="min-h-[100px] bg-tier-800 border-tier-700 text-tier-50 resize-none"
                            placeholder="Detailed description of your offer..."
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium text-tier-200 mb-2 block">
                            Call to Action Button
                          </label>
                          <Input
                            value={customization.ctaText}
                            onChange={(e) => handleInputChange('ctaText', e.target.value)}
                            className="bg-tier-800 border-tier-700 text-tier-50"
                            placeholder="Get Started Now"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium text-tier-200 mb-2 block">
                            Offer Description (for booking page)
                          </label>
                          <Textarea
                            value={customization.offerDescription}
                            onChange={(e) => handleInputChange('offerDescription', e.target.value)}
                            className="min-h-[80px] bg-tier-800 border-tier-700 text-tier-50 resize-none"
                            placeholder="Brief summary of your offer..."
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium text-tier-200 mb-2 block">
                            Guarantee Text
                          </label>
                          <Input
                            value={customization.guaranteeText}
                            onChange={(e) => handleInputChange('guaranteeText', e.target.value)}
                            className="bg-tier-800 border-tier-700 text-tier-50"
                            placeholder="30-day money-back guarantee"
                          />
                        </div>
                      </CardContent>
                    </Card>

                    {/* Media Embeds */}
                    <Card className="bg-tier-900 border-tier-800">
                      <CardHeader>
                        <CardTitle className="text-tier-50">Media & Embeds</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <label className="text-sm font-medium text-tier-200 mb-2 block">
                            VSL/Embed Type
                          </label>
                          <select
                            value={customization.embedType}
                            onChange={(e) => handleInputChange('embedType', e.target.value)}
                            className="w-full px-3 py-2 bg-tier-800 border border-tier-700 text-tier-50 rounded-md"
                          >
                            <option value="none">No embed</option>
                            <option value="vsl">Video Sales Letter</option>
                            <option value="lead-magnet">Lead Magnet</option>
                          </select>
                        </div>
                        {customization.embedType !== 'none' && (
                          <div>
                            <label className="text-sm font-medium text-tier-200 mb-2 block">
                              Embed URL or Code
                            </label>
                            <Textarea
                              value={customization.embedUrl}
                              onChange={(e) => handleInputChange('embedUrl', e.target.value)}
                              className="min-h-[80px] bg-tier-800 border-tier-700 text-tier-50 resize-none"
                              placeholder="Paste your video embed code or URL..."
                            />
                          </div>
                        )}
                        <div>
                          <label className="text-sm font-medium text-tier-200 mb-2 block">
                            Calendar Embed Code (for booking page)
                          </label>
                          <Textarea
                            value={customization.calendarEmbedCode}
                            onChange={(e) => handleInputChange('calendarEmbedCode', e.target.value)}
                            className="min-h-[100px] bg-tier-800 border-tier-700 text-tier-50 resize-none"
                            placeholder="Paste your calendar embed code (Calendly, Acuity, etc.)..."
                          />
                        </div>
                      </CardContent>
                    </Card>
                  </>
                )}

                {activeTab === 'design' && (
                  <>
                    {/* Logo Upload */}
                    <Card className="bg-tier-900 border-tier-800">
                      <CardHeader>
                        <CardTitle className="text-tier-50">Logo & Branding</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <label className="text-sm font-medium text-tier-200 mb-2 block">
                            Logo Upload
                          </label>
                          <div className="flex items-center gap-4">
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleLogoUpload}
                              className="hidden"
                              id="logo-upload"
                            />
                            <label
                              htmlFor="logo-upload"
                              className="px-4 py-2 bg-tier-800 border border-tier-700 text-tier-300 rounded-md cursor-pointer hover:bg-tier-700 transition-colors"
                            >
                              <Upload className="w-4 h-4 inline mr-2" />
                              Choose File
                            </label>
                            {customization.logoUrl && (
                              <img
                                src={customization.logoUrl}
                                alt="Logo preview"
                                className="w-12 h-12 object-contain rounded"
                              />
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Color Scheme */}
                    <Card className="bg-tier-900 border-tier-800">
                      <CardHeader>
                        <CardTitle className="text-tier-50">Color Scheme</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {Object.entries(customization.colors).map(([colorType, value]) => (
                          <div key={colorType}>
                            <label className="text-sm font-medium text-tier-200 mb-2 block capitalize">
                              {colorType} Color
                            </label>
                            <div className="flex items-center gap-3">
                              <input
                                type="color"
                                value={value}
                                onChange={(e) => handleColorChange(colorType as keyof FunnelCustomization['colors'], e.target.value)}
                                className="w-12 h-8 rounded border border-tier-700"
                              />
                              <Input
                                value={value}
                                onChange={(e) => handleColorChange(colorType as keyof FunnelCustomization['colors'], e.target.value)}
                                className="bg-tier-800 border-tier-700 text-tier-50 flex-1"
                              />
                            </div>
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  </>
                )}

                {activeTab === 'settings' && (
                  <Card className="bg-tier-900 border-tier-800">
                    <CardHeader>
                      <CardTitle className="text-tier-50">Domain & Settings</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-tier-200 mb-2 block">
                          Custom Domain/Subdomain
                        </label>
                        <div className="flex items-center gap-2">
                          <Input
                            value={customization.domain}
                            onChange={(e) => handleInputChange('domain', e.target.value)}
                            className="bg-tier-800 border-tier-700 text-tier-50"
                            placeholder="your-funnel-name"
                          />
                          <span className="text-tier-400">.ascensionai.com</span>
                        </div>
                        <p className="text-xs text-tier-500 mt-1">
                          Your funnel will be available at {customization.domain}.ascensionai.com
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Preview Panel */}
              <div className="space-y-6">
                <Card className="bg-tier-900 border-tier-800">
                  <CardHeader>
                    <CardTitle className="text-tier-50 flex items-center gap-2">
                      <Eye className="w-5 h-5" />
                      Live Preview
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-tier-950 rounded-lg p-4 border border-tier-700">
                      <div className="space-y-4 text-sm">
                        <div style={{ color: customization.colors.primary }}>
                          <div className="font-bold text-lg">{customization.headline || 'Your Headline Here'}</div>
                          <div className="text-tier-400">{customization.subheadline || 'Your subheadline here'}</div>
                        </div>
                        <div className="text-tier-300 text-xs">
                          {customization.heroText || 'Your hero text will appear here...'}
                        </div>
                        <button
                          className="w-full py-2 px-4 rounded font-medium text-sm text-white"
                          style={{ backgroundColor: customization.colors.accent }}
                        >
                          {customization.ctaText || 'Call to Action'}
                        </button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Page Structure */}
                <Card className="bg-tier-900 border-tier-800">
                  <CardHeader>
                    <CardTitle className="text-tier-50">Funnel Structure</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-tier-800 rounded border border-tier-700">
                      <div className="w-6 h-6 bg-accent-500 rounded-full flex items-center justify-center text-xs text-white">1</div>
                      <div>
                        <div className="font-medium text-tier-200">Landing Page</div>
                        <div className="text-xs text-tier-500">VSL + Case Studies + CTA</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-tier-800 rounded border border-tier-700">
                      <div className="w-6 h-6 bg-accent-500 rounded-full flex items-center justify-center text-xs text-white">2</div>
                      <div>
                        <div className="font-medium text-tier-200">Booking Page</div>
                        <div className="text-xs text-tier-500">Calendar + Offer Description</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between mt-8 pt-8 border-t border-tier-800">
              <Button 
                variant="outline" 
                onClick={handlePrevious}
                className="border-tier-600 text-tier-300 hover:border-tier-500"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>
              
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => handleSave('draft')}
                  disabled={isSaving}
                  className="bg-tier-800 border-tier-700 text-tier-300 hover:bg-tier-700"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {isSaving ? 'Saving...' : 'Save Draft'}
                </Button>
                
                <Button 
                  className="bg-accent-500 hover:bg-accent-600 text-white"
                  onClick={() => handleSave('published')}
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Launching...
                    </>
                  ) : (
                    <>
                      <Rocket className="w-4 h-4 mr-2" />
                      Launch Funnel
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardNav>
  )
} 