'use client'

export const dynamic = 'force-dynamic'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { DashboardNav } from '@/components/dashboard-nav'
import { ArrowRight, ArrowLeft, Video, Calendar, Link, Upload, Play, Clock } from 'lucide-react'

interface MediaData {
  vslType: 'video' | 'canva' | 'none'
  vslUrl: string
  vslTitle: string
  calendarEmbedCode: string
  calendarTitle: string
}

export default function MediaPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const funnelType = searchParams.get('type') as 'trigger' | 'gateway'
  const dataParam = searchParams.get('data')
  
  const [mediaData, setMediaData] = useState<MediaData>({
    vslType: 'none',
    vslUrl: '',
    vslTitle: '',
    calendarEmbedCode: '',
    calendarTitle: 'Book Your Call'
  })

  useEffect(() => {
    if (!funnelType || !dataParam) {
      router.push('/funnels/create')
    }
  }, [funnelType, dataParam, router])

  const handleInputChange = (field: keyof MediaData, value: string) => {
    setMediaData(prev => ({ ...prev, [field]: value }))
  }

  const handleNext = () => {
    // Add media data to the existing funnel data
    if (dataParam) {
      try {
        const existingData = JSON.parse(decodeURIComponent(dataParam))
        const updatedData = {
          ...existingData,
          media: mediaData
        }
        const newDataParam = encodeURIComponent(JSON.stringify(updatedData))
        router.push(`/funnels/create/template?type=${funnelType}&data=${newDataParam}`)
      } catch (error) {
        console.error('Error updating data:', error)
        router.push(`/funnels/create/template?type=${funnelType}&data=${dataParam}`)
      }
    }
  }

  const handlePrevious = () => {
    router.push(`/funnels/create/case-studies?type=${funnelType}&data=${dataParam}`)
  }

  const isFormValid = () => {
    if (mediaData.vslType !== 'none' && !mediaData.vslUrl) return false
    if (!mediaData.calendarEmbedCode.trim()) return false
    return true
  }

  const progress = 85 // 7 of 8 steps (updated to reflect new flow)

  return (
    <DashboardNav>
      <div className="h-full overflow-auto bg-tier-950">
        <div className="p-8">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center gap-4 mb-4">
                <div className="px-3 py-1 bg-accent-500/20 text-accent-400 rounded-full text-sm font-medium">
                  Step 7 of 8
                </div>
                <div className="flex-1 bg-tier-800 rounded-full h-2">
                  <div 
                    className="bg-accent-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>
              
              <h1 className="text-3xl font-bold text-tier-50 mb-2">
                Media & Booking Setup
              </h1>
              <p className="text-lg text-tier-300">
                Configure your VSL and calendar booking for the funnel
              </p>
            </div>

            <div className="space-y-8">
              {/* VSL Section */}
              <Card className="bg-tier-900 border-tier-800">
                <CardHeader>
                  <CardTitle className="text-tier-50 flex items-center gap-3">
                    <Video className="w-5 h-5 text-accent-400" />
                    Video Sales Letter (VSL)
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* VSL Type Selection */}
                  <div>
                    <label className="block text-sm font-medium text-tier-300 mb-3">
                      VSL Type
                    </label>
                    <div className="grid grid-cols-3 gap-4">
                      {[
                        { id: 'none', label: 'No VSL', icon: '🚫' },
                        { id: 'video', label: 'Video File/URL', icon: '🎥' },
                        { id: 'canva', label: 'Canva/Presentation', icon: '🎨' }
                      ].map((option) => (
                        <button
                          key={option.id}
                          onClick={() => handleInputChange('vslType', option.id as MediaData['vslType'])}
                          className={`p-4 rounded-lg border-2 transition-all ${
                            mediaData.vslType === option.id
                              ? 'border-accent-500 bg-accent-500/10'
                              : 'border-tier-700 bg-tier-800 hover:border-tier-600'
                          }`}
                        >
                          <div className="text-2xl mb-2">{option.icon}</div>
                          <div className="text-sm font-medium text-tier-300">{option.label}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* VSL URL Input */}
                  {mediaData.vslType !== 'none' && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-tier-300 mb-2">
                          VSL Title
                        </label>
                        <Input
                          placeholder="e.g., Watch: How I Scaled to 7-Figures"
                          value={mediaData.vslTitle}
                          onChange={(e) => handleInputChange('vslTitle', e.target.value)}
                          className="bg-tier-800 border-tier-700 text-tier-100"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-tier-300 mb-2">
                          {mediaData.vslType === 'video' ? 'Video URL' : 'Canva/Presentation URL'}
                        </label>
                        <Input
                          placeholder={
                            mediaData.vslType === 'video' 
                              ? "https://youtube.com/watch?v=... or https://vimeo.com/..." 
                              : "https://canva.com/design/... or presentation link"
                          }
                          value={mediaData.vslUrl}
                          onChange={(e) => handleInputChange('vslUrl', e.target.value)}
                          className="bg-tier-800 border-tier-700 text-tier-100"
                        />
                        <p className="text-xs text-tier-500 mt-1">
                          {mediaData.vslType === 'video' 
                            ? "Supported: YouTube, Vimeo, or direct video URLs"
                            : "Canva, Google Slides, or any embeddable presentation link"
                          }
                        </p>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>

              {/* Calendar Section */}
              <Card className="bg-tier-900 border-tier-800">
                <CardHeader>
                  <CardTitle className="text-tier-50 flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-accent-400" />
                    Calendar Booking
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
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

                  <div>
                    <label className="block text-sm font-medium text-tier-300 mb-2">
                      Calendar Embed Code
                    </label>
                    <Textarea
                      placeholder={`<!-- Calendly inline widget begin -->
<div class="calendly-inline-widget" data-url="https://calendly.com/your-username/call" style="min-width:320px;height:630px;"></div>
<script type="text/javascript" src="https://assets.calendly.com/assets/external/widget.js" async></script>
<!-- Calendly inline widget end -->`}
                      value={mediaData.calendarEmbedCode}
                      onChange={(e) => handleInputChange('calendarEmbedCode', e.target.value)}
                      rows={8}
                      className="bg-tier-800 border-tier-700 text-tier-100 font-mono text-sm"
                    />
                    <p className="text-xs text-tier-500 mt-1">
                      Paste the full embed code from Calendly, Acuity, or your booking platform
                    </p>
                  </div>

                  {/* Calendar Preview */}
                  {mediaData.calendarEmbedCode && (
                    <div className="p-4 bg-tier-800 rounded-lg border border-tier-700">
                      <div className="flex items-center gap-2 mb-2">
                        <Clock className="w-4 h-4 text-accent-400" />
                        <span className="text-sm font-medium text-tier-300">Preview</span>
                      </div>
                      <div className="text-xs text-tier-500 font-mono bg-tier-950 p-3 rounded border">
                        {mediaData.calendarEmbedCode.substring(0, 100)}...
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Navigation */}
            <div className="flex justify-between mt-8">
              <Button
                variant="outline"
                onClick={handlePrevious}
                className="bg-tier-800 border-tier-700 text-tier-300 hover:bg-tier-700"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>
              
              <Button
                onClick={handleNext}
                disabled={!isFormValid()}
                className="bg-accent-500 hover:bg-accent-600 text-white"
              >
                Continue to Templates
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </DashboardNav>
  )
} 