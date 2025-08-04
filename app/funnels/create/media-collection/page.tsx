'use client'

export const dynamic = 'force-dynamic'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { DashboardNav } from '@/components/dashboard-nav'
import { useAuth } from '@/lib/auth-context'
import { 
  ArrowRight, 
  ArrowLeft, 
  Upload, 
  Image, 
  Video, 
  Calendar, 
  Loader2,
  Eye,
  Check
} from 'lucide-react'

interface MediaData {
  vslType: 'video' | 'canva' | 'none'
  vslUrl: string
  vslTitle: string
  calendarEmbedCode: string
  calendarTitle: string
  logoUrl: string
}

function MediaCollectionContent() {
  const { user } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const funnelType = searchParams.get('type') as 'trigger' | 'gateway'
  const dataParam = searchParams.get('data')
  
  const [mediaData, setMediaData] = useState<MediaData>({
    vslType: 'none',
    vslUrl: '',
    vslTitle: '',
    calendarEmbedCode: '',
    calendarTitle: 'Book Your Call',
    logoUrl: ''
  })

  const [isGenerating, setIsGenerating] = useState(false)
  const [funnelData, setFunnelData] = useState<any>(null)

  useEffect(() => {
    if (!funnelType || !dataParam || !user) {
      router.push('/funnels/create')
      return
    }

    // Parse the funnel data
    try {
      const parsedData = JSON.parse(decodeURIComponent(dataParam))
      setFunnelData(parsedData)
    } catch (error) {
      console.error('Error parsing funnel data:', error)
      router.push('/funnels/create')
    }
  }, [funnelType, dataParam, user, router])

  const handleInputChange = (field: keyof MediaData, value: string) => {
    setMediaData(prev => ({ ...prev, [field]: value }))
  }

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Create object URL for preview
    const logoUrl = URL.createObjectURL(file)
    setMediaData(prev => ({ ...prev, logoUrl }))
  }

  const handleGenerateAndLaunch = async () => {
    if (!user || !funnelData) return

    setIsGenerating(true)
    
    try {
      // Generate AI-powered copy using the offer data
      let generatedCopy
      try {
        console.log('Generating AI copy with offer data:', funnelData.offerData)
        const response = await fetch('/api/ai/generate-copy', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            offerData: funnelData.offerData,
            templateType: funnelType,
            writingExamples: []
          })
        })

        if (response.ok) {
          const data = await response.json()
          generatedCopy = data.copy
          console.log('AI copy generated successfully:', generatedCopy)
        } else {
          console.error('AI generation failed, using fallback copy')
          throw new Error('AI generation failed')
        }
      } catch (aiError) {
        console.error('Error generating AI copy:', aiError)
        // Fallback copy using offer data
        generatedCopy = {
          headline: funnelData.offerData.who 
            ? `Transform Your ${funnelData.offerData.niche} Business with Our Proven ${funnelData.offerData.method}`
            : "Transform Your Business Today",
          subheadline: funnelData.offerData.outcome
            ? `Join successful ${funnelData.offerData.who} who achieved ${funnelData.offerData.outcome} in just ${funnelData.offerData.timeframe}`
            : "Get the results you've been looking for",
          heroText: funnelData.offerData.complaint1
            ? `Stop struggling with ${funnelData.offerData.complaint1}. Our proven system helps ${funnelData.offerData.who} achieve ${funnelData.offerData.outcome} using our unique ${funnelData.offerData.method} approach.`
            : "Finally, a solution that actually works.",
          ctaText: "Get Started Now",
          offerDescription: funnelData.offerData.method
            ? `Complete ${funnelData.offerData.method} system designed to help ${funnelData.offerData.who} achieve ${funnelData.offerData.outcome} in ${funnelData.offerData.timeframe}.`
            : "Everything you need to succeed",
          guaranteeText: funnelData.offerData.guarantee || "30-day money-back guarantee"
        }
      }

      // Create customization with AI-generated content
      const customization = {
        headline: generatedCopy.headline,
        subheadline: generatedCopy.subheadline,
        heroText: generatedCopy.heroText,
        ctaText: generatedCopy.ctaText,
        offerDescription: generatedCopy.offerDescription,
        guaranteeText: generatedCopy.guaranteeText,
        colors: {
          primary: '#3B82F6',
          secondary: '#1E40AF',
          accent: '#F59E0B',
          background: '#FFFFFF',
          text: '#1F2937'
        },
        logoUrl: mediaData.logoUrl,
        domain: '',
        font: 'inter',
        theme: 'clean',
        pixelCodes: {
          facebook: '',
          google: '',
          custom: ''
        }
      }

      // Save funnel with media data
      const saveData = {
        userId: user.id,
        name: funnelData?.offerData?.who 
          ? `${funnelData.offerData.who} - ${funnelData.offerData.outcome}` 
          : 'My Funnel',
        type: funnelType,
        status: 'published',
        offerData: funnelData?.offerData,
        caseStudies: funnelData?.caseStudies,
        media: mediaData,
        templateId: funnelData?.templateId,
        customization: customization
      }

      const response = await fetch('/api/funnels/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(saveData)
      })

      if (response.ok) {
        router.push('/funnels')
      } else {
        const errorData = await response.json()
        alert(errorData.error || 'Failed to create funnel')
      }
    } catch (error) {
      console.error('Error creating funnel:', error)
      alert('There was an error creating your funnel. Please try again.')
    }
    
    setIsGenerating(false)
  }

  const handlePrevious = () => {
    router.push(`/funnels/create/template?type=${funnelType}&data=${dataParam}`)
  }

  if (!funnelData) {
    return (
      <div className="h-full flex items-center justify-center bg-tier-950">
        <div className="w-8 h-8 border-2 border-accent-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  if (isGenerating) {
    return (
      <DashboardNav>
        <div className="h-full overflow-auto bg-tier-950">
          <div className="p-8">
            <div className="max-w-2xl mx-auto">
              <Card className="bg-tier-900 border-tier-800">
                <CardContent className="py-16 text-center">
                  <Loader2 className="w-16 h-16 animate-spin text-accent-500 mx-auto mb-6" />
                  <h3 className="text-2xl font-semibold text-tier-50 mb-4">
                    🤖 AI is building your funnel...
                  </h3>
                  <p className="text-tier-400 mb-8">
                    Our AI is analyzing your offer data and generating personalized copy, headlines, and optimizing your funnel for maximum conversions.
                  </p>
                  <div className="space-y-3 text-left max-w-md mx-auto">
                    <div className="flex items-center gap-3 text-tier-300">
                      <Check className="w-5 h-5 text-green-500" />
                      <span>Analyzing offer profile and case studies</span>
                    </div>
                    <div className="flex items-center gap-3 text-tier-300">
                      <Check className="w-5 h-5 text-green-500" />
                      <span>Generating compelling headlines and copy</span>
                    </div>
                    <div className="flex items-center gap-3 text-tier-300">
                      <Loader2 className="w-4 h-4 animate-spin text-accent-500" />
                      <span>Building funnel structure and pages</span>
                    </div>
                    <div className="flex items-center gap-3 text-tier-500">
                      <div className="w-5 h-5 rounded-full border-2 border-tier-600"></div>
                      <span>Deploying to your domain</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
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
                Finalize Your Funnel Assets
              </h1>
              <p className="text-lg text-tier-300">
                Add your VSL, logo, and calendar booking to complete your funnel
              </p>
              
              {/* Step Indicator */}
              <div className="flex items-center justify-center mt-6 mb-8">
                <div className="text-sm text-tier-400">
                  Final Step - Ready to Launch
                </div>
              </div>
            </div>

            <div className="grid gap-8 md:grid-cols-2">
              {/* VSL Section */}
              <Card className="bg-tier-900 border-tier-800">
                <CardHeader>
                  <CardTitle className="text-tier-50 flex items-center gap-2">
                    <Video className="w-5 h-5" />
                    Video Sales Letter
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-tier-300 mb-2">
                      VSL Type
                    </label>
                    <div className="flex gap-2">
                      <Button
                        variant={mediaData.vslType === 'none' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => handleInputChange('vslType', 'none')}
                        className={mediaData.vslType === 'none' ? 'bg-accent-500' : ''}
                      >
                        No Video
                      </Button>
                      <Button
                        variant={mediaData.vslType === 'video' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => handleInputChange('vslType', 'video')}
                        className={mediaData.vslType === 'video' ? 'bg-accent-500' : ''}
                      >
                        YouTube/Vimeo
                      </Button>
                      <Button
                        variant={mediaData.vslType === 'canva' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => handleInputChange('vslType', 'canva')}
                        className={mediaData.vslType === 'canva' ? 'bg-accent-500' : ''}
                      >
                        Canva
                      </Button>
                    </div>
                  </div>

                  {mediaData.vslType !== 'none' && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-tier-300 mb-2">
                          Video URL
                        </label>
                        <Input
                          placeholder="https://youtube.com/watch?v=..."
                          value={mediaData.vslUrl}
                          onChange={(e) => handleInputChange('vslUrl', e.target.value)}
                          className="bg-tier-800 border-tier-700 text-tier-100"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-tier-300 mb-2">
                          Video Title
                        </label>
                        <Input
                          placeholder="Enter video title..."
                          value={mediaData.vslTitle}
                          onChange={(e) => handleInputChange('vslTitle', e.target.value)}
                          className="bg-tier-800 border-tier-700 text-tier-100"
                        />
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>

              {/* Logo Section */}
              <Card className="bg-tier-900 border-tier-800">
                <CardHeader>
                  <CardTitle className="text-tier-50 flex items-center gap-2">
                    <Image className="w-5 h-5" />
                    Logo Upload
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4">
                    {mediaData.logoUrl ? (
                      <div className="w-20 h-20 bg-tier-800 rounded-lg flex items-center justify-center border border-tier-700">
                        <img 
                          src={mediaData.logoUrl} 
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
                        PNG, JPG up to 2MB (optional)
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Calendar Section */}
              <Card className="bg-tier-900 border-tier-800 md:col-span-2">
                <CardHeader>
                  <CardTitle className="text-tier-50 flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    Calendar Booking
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-tier-300 mb-2">
                        Calendar Title
                      </label>
                      <Input
                        placeholder="Book Your Call"
                        value={mediaData.calendarTitle}
                        onChange={(e) => handleInputChange('calendarTitle', e.target.value)}
                        className="bg-tier-800 border-tier-700 text-tier-100"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-tier-300 mb-2">
                      Calendar Embed Code
                    </label>
                    <Textarea
                      placeholder="Paste your Calendly, Acuity, or other calendar embed code here..."
                      value={mediaData.calendarEmbedCode}
                      onChange={(e) => handleInputChange('calendarEmbedCode', e.target.value)}
                      className="bg-tier-800 border-tier-700 text-tier-100 min-h-[100px]"
                    />
                    <p className="text-tier-500 text-xs mt-1">
                      Get this from Calendly → Share → Embed, or your booking platform's embed section
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between mt-8">
              <Button 
                variant="outline" 
                onClick={handlePrevious}
                className="border-tier-600 text-tier-300 hover:border-tier-500"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Template
              </Button>
              
              <div className="text-center">
                <div className="text-sm text-tier-400 mb-1">
                  {funnelType === 'trigger' ? 'Trigger' : 'Gateway'} Funnel
                </div>
                <div className="text-xs text-tier-500">
                  Ready to generate and launch
                </div>
              </div>
              
              <Button 
                className="bg-accent-500 hover:bg-accent-600 text-white"
                onClick={handleGenerateAndLaunch}
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    Generate & Launch Funnel
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </div>

            {/* Info Card */}
            <Card className="bg-tier-900/50 border-tier-800 mt-8">
              <CardContent className="p-6">
                <h3 className="font-semibold text-tier-50 mb-3">🚀 What happens next?</h3>
                <div className="grid gap-4 md:grid-cols-3 text-sm">
                  <div className="text-tier-300">
                    <strong className="text-tier-200">1. AI Generation:</strong> Our AI will analyze all your data and generate personalized copy, headlines, and content.
                  </div>
                  <div className="text-tier-300">
                    <strong className="text-tier-200">2. Auto-Deploy:</strong> Your funnel will be automatically deployed with all your assets integrated.
                  </div>
                  <div className="text-tier-300">
                    <strong className="text-tier-200">3. Ready to Edit:</strong> Access the funnel editor to customize colors, tracking, and fine-tune content.
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardNav>
  )
}

export default function MediaCollectionPage() {
  return (
    <Suspense fallback={
      <div className="h-full flex items-center justify-center bg-tier-950">
        <div className="w-8 h-8 border-2 border-accent-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    }>
      <MediaCollectionContent />
    </Suspense>
  )
} 