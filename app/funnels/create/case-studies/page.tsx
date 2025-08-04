'use client'

export const dynamic = 'force-dynamic'

import { useState, useEffect, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { DashboardNav } from '@/components/dashboard-nav'
import { ArrowRight, ArrowLeft, Plus, X, Upload, Image, Video, FileText } from 'lucide-react'

interface CaseStudy {
  id: string
  name: string
  description: string
  result: string
  mediaFile?: File
  mediaUrl?: string
  mediaType?: 'image' | 'video'
}

export default function CaseStudiesPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const funnelType = searchParams.get('type') as 'trigger' | 'gateway'
  const dataParam = searchParams.get('data')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [activeUpload, setActiveUpload] = useState<string | null>(null)
  
  const [caseStudies, setCaseStudies] = useState<CaseStudy[]>([
    {
      id: '1',
      name: '',
      description: '',
      result: ''
    }
  ])

  useEffect(() => {
    if (!funnelType || !dataParam) {
      router.push('/funnels/create')
    }
  }, [funnelType, dataParam, router])

  const handleAddCaseStudy = () => {
    const newCaseStudy: CaseStudy = {
      id: Date.now().toString(),
      name: '',
      description: '',
      result: ''
    }
    setCaseStudies(prev => [...prev, newCaseStudy])
  }

  const handleRemoveCaseStudy = (id: string) => {
    if (caseStudies.length > 1) {
      setCaseStudies(prev => prev.filter(cs => cs.id !== id))
    }
  }

  const handleCaseStudyChange = (id: string, field: keyof CaseStudy, value: string) => {
    setCaseStudies(prev => prev.map(cs => 
      cs.id === id ? { ...cs, [field]: value } : cs
    ))
  }

  const handleFileUpload = (id: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Check file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        alert('File size must be less than 10MB')
        return
      }

      // Check file type
      const isImage = file.type.startsWith('image/')
      const isVideo = file.type.startsWith('video/')
      
      if (!isImage && !isVideo) {
        alert('Please upload an image or video file')
        return
      }

      const mediaUrl = URL.createObjectURL(file)
      setCaseStudies(prev => prev.map(cs => 
        cs.id === id ? { 
          ...cs, 
          mediaFile: file,
          mediaUrl,
          mediaType: isImage ? 'image' : 'video'
        } : cs
      ))
    }
  }

  const triggerFileUpload = (id: string) => {
    setActiveUpload(id)
    setTimeout(() => {
      fileInputRef.current?.click()
    }, 0)
  }

  const handleNext = () => {
    const offerData = dataParam ? JSON.parse(decodeURIComponent(dataParam)) : {}
    const validCaseStudies = caseStudies.filter(cs => 
      cs.name.trim() !== '' && cs.description.trim() !== '' && cs.result.trim() !== ''
    )
    
    const combinedData = {
      ...offerData,
      caseStudies: validCaseStudies
    }
    
    router.push(`/funnels/create/media?type=${funnelType}&data=${encodeURIComponent(JSON.stringify(combinedData))}`)
  }

  const handlePrevious = () => {
    router.push(`/funnels/create/mechanism?type=${funnelType}&data=${dataParam}`)
  }

  const validCaseStudies = caseStudies.filter(cs => 
    cs.name.trim() !== '' && cs.description.trim() !== '' && cs.result.trim() !== ''
  )
  const canContinue = validCaseStudies.length > 0

  if (!funnelType || !dataParam) {
    return null
  }

  return (
    <DashboardNav>
      <div className="h-full overflow-auto bg-tier-950">
        <div className="min-h-full p-8">
          <div className="max-w-4xl mx-auto">
            {/* Progress */}
            <div className="text-center mb-8">
              <div className="text-sm text-tier-400 mb-2">
                Step 6 of 8 - Case Studies & Proof
              </div>
              <div className="w-full bg-tier-800 rounded-full h-2">
                <div 
                  className="bg-accent-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: '75%' }}
                ></div>
              </div>
            </div>

            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-tier-50 mb-2">
                Add Your Case Studies
              </h1>
              <p className="text-lg text-tier-300">
                Showcase real results to build trust and credibility with your audience
              </p>
            </div>

            {/* Case Studies */}
            <div className="space-y-6 mb-8">
              {caseStudies.map((caseStudy, index) => (
                <Card key={caseStudy.id} className="bg-tier-900 border-tier-800">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-title text-tier-50">Case Study {index + 1}</h3>
                      {caseStudies.length > 1 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveCaseStudy(caseStudy.id)}
                          className="text-tier-400 hover:text-tier-200"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      )}
                    </div>

                    <div className="grid gap-6 lg:grid-cols-2">
                      {/* Left Column - Text Content */}
                      <div className="space-y-4">
                        <div>
                          <label className="text-label-medium text-tier-200 block mb-2">
                            Case Study Name *
                          </label>
                          <Input
                            placeholder="e.g., Sarah's Digital Marketing Agency"
                            value={caseStudy.name}
                            onChange={(e) => handleCaseStudyChange(caseStudy.id, 'name', e.target.value)}
                            className="input-base"
                          />
                        </div>

                        <div>
                          <label className="text-label-medium text-tier-200 block mb-2">
                            Description *
                          </label>
                          <Textarea
                            placeholder="Describe the client's situation, challenge, and what you did to help them..."
                            value={caseStudy.description}
                            onChange={(e) => handleCaseStudyChange(caseStudy.id, 'description', e.target.value)}
                            className="input-base min-h-[100px] resize-none"
                          />
                        </div>

                        <div>
                          <label className="text-label-medium text-tier-200 block mb-2">
                            Result Achieved *
                          </label>
                          <Textarea
                            placeholder="e.g., Increased revenue by 300% in 6 months, went from $5K to $20K monthly..."
                            value={caseStudy.result}
                            onChange={(e) => handleCaseStudyChange(caseStudy.id, 'result', e.target.value)}
                            className="input-base min-h-[80px] resize-none"
                          />
                        </div>
                      </div>

                      {/* Right Column - Media Upload */}
                      <div>
                        <label className="text-label-medium text-tier-200 block mb-2">
                          Photo or Video (Optional)
                        </label>
                        
                        {caseStudy.mediaUrl ? (
                          <div className="relative">
                            {caseStudy.mediaType === 'image' ? (
                              <img 
                                src={caseStudy.mediaUrl} 
                                alt={caseStudy.name}
                                className="w-full h-48 object-cover rounded-lg border border-tier-700"
                              />
                            ) : (
                              <video 
                                src={caseStudy.mediaUrl}
                                className="w-full h-48 object-cover rounded-lg border border-tier-700"
                                controls
                              />
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleCaseStudyChange(caseStudy.id, 'mediaUrl', '')}
                              className="absolute top-2 right-2 bg-tier-950/80 text-tier-200 hover:text-tier-50"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        ) : (
                          <div 
                            onClick={() => triggerFileUpload(caseStudy.id)}
                            className="border-2 border-dashed border-tier-600 rounded-lg p-8 text-center cursor-pointer hover:border-tier-500 transition-colors"
                          >
                            <Upload className="w-8 h-8 text-tier-400 mx-auto mb-3" />
                            <p className="text-tier-300 font-medium">Upload Photo or Video</p>
                            <p className="text-tier-500 text-sm mt-1">
                              Max 10MB • JPG, PNG, MP4, MOV
                            </p>
                            <div className="flex items-center justify-center gap-4 mt-3 text-tier-400">
                              <div className="flex items-center gap-1">
                                <Image className="w-4 h-4" />
                                <span className="text-xs">Images</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Video className="w-4 h-4" />
                                <span className="text-xs">Videos</span>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {/* Add Case Study Button */}
              {caseStudies.length < 5 && (
                <Button
                  variant="outline"
                  onClick={handleAddCaseStudy}
                  className="w-full border-tier-600 text-tier-300 hover:border-tier-500 hover:text-tier-200 py-4"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Another Case Study
                </Button>
              )}
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between">
              <Button 
                variant="outline" 
                onClick={handlePrevious}
                className="border-tier-600 text-tier-300 hover:border-tier-500"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>
              
              <div className="text-center">
                <div className="text-sm text-tier-400 mb-1">
                  {funnelType === 'trigger' ? 'Trigger' : 'Gateway'} Funnel
                </div>
                <div className="text-xs text-tier-500">
                  {validCaseStudies.length} case studies ready
                </div>
              </div>
              
              <Button 
                className="bg-accent-500 hover:bg-accent-600 text-white disabled:opacity-50"
                onClick={handleNext}
                disabled={!canContinue}
              >
                Continue to Media Setup
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>

            {/* Hidden File Input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,video/*"
              onChange={(e) => activeUpload && handleFileUpload(activeUpload, e)}
              className="hidden"
            />

            {/* Tips */}
            <Card className="bg-tier-900/50 border-tier-800 mt-8">
              <CardContent className="p-6">
                <h3 className="font-semibold text-tier-50 mb-3 flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  💡 Case Study Tips
                </h3>
                <div className="grid gap-3 text-sm">
                  <div className="text-tier-300">
                    <strong className="text-tier-200">Be specific with numbers:</strong> "Increased revenue by 300%" is better than "made more money"
                  </div>
                  <div className="text-tier-300">
                    <strong className="text-tier-200">Tell a story:</strong> Describe the before state, what you did, and the after results
                  </div>
                  <div className="text-tier-300">
                    <strong className="text-tier-200">Use real names:</strong> "Sarah's Agency" feels more authentic than "Client A"
                  </div>
                  <div className="text-tier-300">
                    <strong className="text-tier-200">Include timeframes:</strong> "In just 90 days" adds urgency and credibility
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