'use client'

import { useState, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Plus, X, Upload, Image, Video, Trash2, Link, Loader2 } from 'lucide-react'

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
  videoEmbedUrl?: string // For video embeds
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
  const [mediaMode, setMediaMode] = useState<{ [key: string]: 'image' | 'video' }>({})
  const [uploadingStates, setUploadingStates] = useState<{ [key: string]: boolean }>({})

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

  const handleFileUpload = async (id: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Check file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      alert('File size must be less than 10MB')
      return
    }

    // Check file type - only images
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file')
      return
    }

    setUploadingStates(prev => ({ ...prev, [id]: true }))

    try {
      // Upload to Supabase Storage
      const formData = new FormData()
      formData.append('file', file)
      
      const response = await fetch('/api/upload/case-study', {
        method: 'POST',
        body: formData
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Upload failed')
      }
      
      const data = await response.json()
      
      onChange(caseStudies.map(cs => 
        cs.id === id ? { 
          ...cs, 
          mediaFile: undefined, // Clear the file object
          mediaUrl: data.url,
          mediaType: 'image',
          media_url: data.url, // For compatibility
          media_type: 'image' // For compatibility
        } : cs
      ))
    } catch (error) {
      console.error('Upload error:', error)
      alert(error instanceof Error ? error.message : 'Failed to upload image')
    } finally {
      setUploadingStates(prev => ({ ...prev, [id]: false }))
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
        mediaUrl: undefined,
        mediaType: undefined,
        media_url: undefined,
        media_type: undefined,
        videoEmbedUrl: undefined
      } : cs
    ))
    setMediaMode(prev => {
      const newMode = { ...prev }
      delete newMode[id]
      return newMode
    })
  }

  const handleVideoEmbedChange = (id: string, url: string) => {
    onChange(caseStudies.map(cs => 
      cs.id === id ? { 
        ...cs, 
        videoEmbedUrl: url,
        mediaType: 'video',
        media_type: 'video',
        media_url: url
      } : cs
    ))
  }

  const getVideoEmbedUrl = (url: string): string | null => {
    if (!url) return null
    
    // YouTube
    const youtubeMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/)
    if (youtubeMatch) {
      return `https://www.youtube.com/embed/${youtubeMatch[1]}`
    }
    
    // Vimeo
    const vimeoMatch = url.match(/vimeo\.com\/(\d+)/)
    if (vimeoMatch) {
      return `https://player.vimeo.com/video/${vimeoMatch[1]}`
    }
    
    // Loom
    const loomMatch = url.match(/loom\.com\/share\/([a-zA-Z0-9]+)/)
    if (loomMatch) {
      return `https://www.loom.com/embed/${loomMatch[1]}`
    }
    
    // If already an embed URL, return as is
    if (url.includes('/embed/') || url.includes('player.')) {
      return url
    }
    
    return null
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => activeUpload && handleFileUpload(activeUpload, e)}
      />

      {caseStudies.map((caseStudy, index) => (
        <Card key={caseStudy.id} className="bg-tier-900 border-tier-800">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg text-tier-50">
                Case Study {index + 1}
              </CardTitle>
              {caseStudies.length > 1 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveCaseStudy(caseStudy.id)}
                  className="text-tier-400 hover:text-tier-200"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column - Text Fields */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-tier-300">
                  Client Name
                </label>
                <Input
                  value={caseStudy.name}
                  onChange={(e) => handleCaseStudyChange(caseStudy.id, 'name', e.target.value)}
                  placeholder="John Smith"
                  className="bg-tier-950 border-tier-700 text-tier-50 placeholder:text-tier-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-tier-300">
                  Description
                </label>
                <Textarea
                  value={caseStudy.description}
                  onChange={(e) => handleCaseStudyChange(caseStudy.id, 'description', e.target.value)}
                  placeholder="Brief description of their situation..."
                  rows={3}
                  className="bg-tier-950 border-tier-700 text-tier-50 placeholder:text-tier-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-tier-300">
                  Result
                </label>
                <Textarea
                  value={caseStudy.result}
                  onChange={(e) => handleCaseStudyChange(caseStudy.id, 'result', e.target.value)}
                  placeholder="What results did they achieve?"
                  rows={2}
                  className="bg-tier-950 border-tier-700 text-tier-50 placeholder:text-tier-500"
                />
              </div>

              {showMetric && (
                <div>
                  <label className="block text-sm font-medium mb-2 text-tier-300">
                    Key Metric (Optional)
                  </label>
                  <Input
                    value={caseStudy.metric}
                    onChange={(e) => handleCaseStudyChange(caseStudy.id, 'metric', e.target.value)}
                    placeholder="e.g., 250% ROI, $50k/month"
                    className="bg-tier-950 border-tier-700 text-tier-50 placeholder:text-tier-500"
                  />
                </div>
              )}
            </div>

            {/* Right Column - Media Upload/Embed */}
            <div>
              <label className="block text-sm font-medium mb-2 text-tier-300">
                Photo or Video (Optional)
              </label>
              
              {/* Media type selector */}
              {!caseStudy.mediaUrl && !caseStudy.videoEmbedUrl && (
                <div className="flex gap-2 mb-3">
                  <Button
                    variant={mediaMode[caseStudy.id] === 'image' || !mediaMode[caseStudy.id] ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setMediaMode(prev => ({ ...prev, [caseStudy.id]: 'image' }))}
                    className="flex-1"
                  >
                    <Image className="w-4 h-4 mr-1" />
                    Image
                  </Button>
                  <Button
                    variant={mediaMode[caseStudy.id] === 'video' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setMediaMode(prev => ({ ...prev, [caseStudy.id]: 'video' }))}
                    className="flex-1"
                  >
                    <Video className="w-4 h-4 mr-1" />
                    Video
                  </Button>
                </div>
              )}
              
              {/* Image upload */}
              {(mediaMode[caseStudy.id] === 'image' || !mediaMode[caseStudy.id]) && !caseStudy.videoEmbedUrl && (
                <>
                  {(caseStudy.mediaUrl || caseStudy.media_url) ? (
                    <div className="relative">
                      <img 
                        src={caseStudy.mediaUrl || caseStudy.media_url} 
                        alt={caseStudy.name}
                        className="w-full h-48 object-cover rounded-lg border border-tier-700"
                      />
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
                      onClick={() => !uploadingStates[caseStudy.id] && triggerFileUpload(caseStudy.id)}
                      className={`border-2 border-dashed border-tier-700 rounded-lg p-12 text-center hover:border-tier-600 transition-colors ${uploadingStates[caseStudy.id] ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'} bg-tier-950/30`}
                    >
                      {uploadingStates[caseStudy.id] ? (
                        <>
                          <Loader2 className="w-8 h-8 mx-auto mb-3 text-tier-500 animate-spin" />
                          <p className="text-sm text-tier-400">Uploading...</p>
                        </>
                      ) : (
                        <>
                          <Upload className="w-8 h-8 mx-auto mb-3 text-tier-500" />
                          <p className="text-sm text-tier-400">
                            Click to upload image
                          </p>
                          <p className="text-xs text-tier-500 mt-1">
                            Max 10MB • JPG, PNG, WEBP
                          </p>
                        </>
                      )}
                    </div>
                  )}
                </>
              )}
              
              {/* Video embed */}
              {mediaMode[caseStudy.id] === 'video' && !caseStudy.mediaUrl && (
                <>
                  {caseStudy.videoEmbedUrl ? (
                    <div className="relative">
                      {getVideoEmbedUrl(caseStudy.videoEmbedUrl) ? (
                        <iframe
                          src={getVideoEmbedUrl(caseStudy.videoEmbedUrl)!}
                          className="w-full h-48 rounded-lg border border-tier-700"
                          allowFullScreen
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        />
                      ) : (
                        <div className="w-full h-48 rounded-lg border border-tier-700 bg-tier-950 flex items-center justify-center">
                          <p className="text-tier-400 text-sm">Invalid video URL</p>
                        </div>
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
                    <div className="space-y-2">
                      <Input
                        value={caseStudy.videoEmbedUrl || ''}
                        onChange={(e) => handleVideoEmbedChange(caseStudy.id, e.target.value)}
                        placeholder="Paste YouTube, Vimeo, or Loom URL"
                        className="bg-tier-950 border-tier-700 text-tier-50 placeholder:text-tier-500"
                      />
                      <p className="text-xs text-tier-500">
                        Supports YouTube, Vimeo, and Loom videos
                      </p>
                    </div>
                  )}
                </>
              )}
            </div>
          </CardContent>
        </Card>
      ))}

      <Button
        onClick={handleAddCaseStudy}
        variant="outline"
        className="w-full border-tier-700 text-tier-300 hover:text-tier-50 hover:bg-tier-900"
      >
        <Plus className="w-4 h-4 mr-2" />
        Add Another Case Study
      </Button>
    </div>
  )
} 