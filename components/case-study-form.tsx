'use client'

import { useState, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Plus, X, Upload, Image, Video, Trash2 } from 'lucide-react'

export interface CaseStudy {
  id: string
  name: string
  description: string
  result: string
  metric?: string
  mediaFile?: File
  mediaUrl?: string
  mediaType?: 'image' | 'video'
  media_url?: string // For database compatibility
  media_type?: string // For database compatibility
}

interface CaseStudyFormProps {
  caseStudies: CaseStudy[]
  onChange: (caseStudies: CaseStudy[]) => void
  showMetric?: boolean
  className?: string
}

export function CaseStudyForm({ 
  caseStudies, 
  onChange, 
  showMetric = true,
  className = ''
}: CaseStudyFormProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [activeUpload, setActiveUpload] = useState<string | null>(null)

  const handleAddCaseStudy = () => {
    const newCaseStudy: CaseStudy = {
      id: Date.now().toString(),
      name: '',
      description: '',
      result: '',
      metric: ''
    }
    onChange([...caseStudies, newCaseStudy])
  }

  const handleRemoveCaseStudy = (id: string) => {
    if (caseStudies.length > 1) {
      onChange(caseStudies.filter(cs => cs.id !== id))
    }
  }

  const handleCaseStudyChange = (id: string, field: keyof CaseStudy, value: string) => {
    onChange(caseStudies.map(cs => 
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
      onChange(caseStudies.map(cs => 
        cs.id === id ? { 
          ...cs, 
          mediaFile: file,
          mediaUrl,
          mediaType: isImage ? 'image' : 'video',
          media_url: mediaUrl, // For compatibility
          media_type: isImage ? 'image' : 'video' // For compatibility
        } : cs
      ))
    }
    setActiveUpload(null)
  }

  const triggerFileUpload = (id: string) => {
    setActiveUpload(id)
    setTimeout(() => {
      fileInputRef.current?.click()
    }, 0)
  }

  const removeMedia = (id: string) => {
    onChange(caseStudies.map(cs => 
      cs.id === id ? { 
        ...cs, 
        mediaFile: undefined,
        mediaUrl: '',
        mediaType: undefined,
        media_url: '',
        media_type: undefined
      } : cs
    ))
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {caseStudies.map((caseStudy, index) => (
        <Card key={caseStudy.id} className="bg-tier-800 border-tier-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-lg text-tier-50">Case Study #{index + 1}</CardTitle>
            {caseStudies.length > 1 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleRemoveCaseStudy(caseStudy.id)}
                className="border-red-500 text-red-400 hover:bg-red-500/10"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
          </CardHeader>
          <CardContent className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column - Text Fields */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-tier-300">
                  Customer Name
                </label>
                <Input
                  type="text"
                  value={caseStudy.name}
                  onChange={(e) => handleCaseStudyChange(caseStudy.id, 'name', e.target.value)}
                  placeholder="e.g., John Smith, CEO of ABC Corp"
                  className="bg-tier-700 border-tier-600 text-tier-50 placeholder-tier-400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-tier-300">
                  Success Story
                </label>
                <Textarea
                  value={caseStudy.description}
                  onChange={(e) => handleCaseStudyChange(caseStudy.id, 'description', e.target.value)}
                  placeholder="Describe the challenge they faced and how your solution helped..."
                  rows={3}
                  className="bg-tier-700 border-tier-600 text-tier-50 placeholder-tier-400"
                />
              </div>

              <div className={showMetric ? "grid grid-cols-2 gap-4" : ""}>
                <div>
                  <label className="block text-sm font-medium mb-2 text-tier-300">
                    Result/Outcome
                  </label>
                  <Input
                    type="text"
                    value={caseStudy.result}
                    onChange={(e) => handleCaseStudyChange(caseStudy.id, 'result', e.target.value)}
                    placeholder="e.g., $50K increase, 300% growth"
                    className="bg-tier-700 border-tier-600 text-tier-50 placeholder-tier-400"
                  />
                </div>

                {showMetric && (
                  <div>
                    <label className="block text-sm font-medium mb-2 text-tier-300">
                      Metric/Timeframe
                    </label>
                    <Input
                      type="text"
                      value={caseStudy.metric || ''}
                      onChange={(e) => handleCaseStudyChange(caseStudy.id, 'metric', e.target.value)}
                      placeholder="e.g., in 6 months, per year"
                      className="bg-tier-700 border-tier-600 text-tier-50 placeholder-tier-400"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Right Column - Media Upload */}
            <div>
              <label className="block text-sm font-medium mb-2 text-tier-300">
                Photo or Video (Optional)
              </label>
              
              {(caseStudy.mediaUrl || caseStudy.media_url) ? (
                <div className="relative">
                  {(caseStudy.mediaType === 'image' || caseStudy.media_type === 'image') ? (
                    <img 
                      src={caseStudy.mediaUrl || caseStudy.media_url} 
                      alt={caseStudy.name}
                      className="w-full h-48 object-cover rounded-lg border border-tier-700"
                    />
                  ) : (
                    <video 
                      src={caseStudy.mediaUrl || caseStudy.media_url}
                      className="w-full h-48 object-cover rounded-lg border border-tier-700"
                      controls
                    />
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeMedia(caseStudy.id)}
                    className="absolute top-2 right-2 bg-tier-950/80 text-tier-200 hover:text-tier-50"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <div
                  onClick={() => triggerFileUpload(caseStudy.id)}
                  className="border-2 border-dashed border-tier-700 rounded-lg p-12 text-center hover:border-tier-600 transition-colors cursor-pointer bg-tier-950/30"
                >
                  <Upload className="w-8 h-8 mx-auto mb-3 text-tier-500" />
                  <p className="text-sm text-tier-400">
                    Click to upload image or video
                  </p>
                  <p className="text-xs text-tier-500 mt-1">
                    Max 10MB • JPG, PNG, MP4, MOV
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}

      <Button
        onClick={handleAddCaseStudy}
        variant="outline"
        className="w-full border-tier-600 text-tier-300 hover:border-tier-500"
      >
        <Plus className="w-4 h-4 mr-2" />
        Add Another Case Study
      </Button>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,video/*"
        className="hidden"
        onChange={(e) => activeUpload && handleFileUpload(activeUpload, e)}
      />
    </div>
  )
} 