'use client'

import { useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Upload, Image, Video, X, Loader2 } from 'lucide-react'

interface MediaUploadProps {
  value?: string
  onChange: (url: string, file?: File) => void
  accept?: string
  maxSize?: number // in MB
  label?: string
  placeholder?: string
  className?: string
  preview?: boolean
}

export function MediaUpload({
  value,
  onChange,
  accept = 'image/*,video/*',
  maxSize = 10,
  label = 'Upload Media',
  placeholder = 'Click to upload',
  className = '',
  preview = true
}: MediaUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setError(null)
    
    // Check file size
    if (file.size > maxSize * 1024 * 1024) {
      setError(`File size must be less than ${maxSize}MB`)
      return
    }

    // Check file type if specific accept pattern is provided
    if (accept !== '*') {
      const acceptTypes = accept.split(',').map(t => t.trim())
      const isValidType = acceptTypes.some(type => {
        if (type.endsWith('/*')) {
          // Handle wildcard types like image/* or video/*
          const category = type.split('/')[0]
          return file.type.startsWith(category + '/')
        }
        return file.type === type
      })

      if (!isValidType) {
        setError('Please upload a valid file type')
        return
      }
    }

    setIsLoading(true)
    try {
      // Create object URL for preview
      const url = URL.createObjectURL(file)
      onChange(url, file)
    } catch (err) {
      setError('Failed to process file')
      console.error('File processing error:', err)
    } finally {
      setIsLoading(false)
    }

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const triggerFileSelect = () => {
    fileInputRef.current?.click()
  }

  const removeMedia = () => {
    onChange('')
  }

  const getMediaType = (url: string): 'image' | 'video' | 'unknown' => {
    if (!url) return 'unknown'
    
    // Check file extension
    const ext = url.split('.').pop()?.toLowerCase()
    if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(ext || '')) return 'image'
    if (['mp4', 'webm', 'mov', 'avi'].includes(ext || '')) return 'video'
    
    // Check if it's a blob URL with file info
    if (url.startsWith('blob:')) {
      // For blob URLs, we can't easily determine type, so return unknown
      return 'unknown'
    }
    
    return 'unknown'
  }

  if (value && preview) {
    const mediaType = getMediaType(value)
    
    return (
      <div className={`relative ${className}`}>
        {label && (
          <label className="block text-sm font-medium mb-2 text-tier-300">
            {label}
          </label>
        )}
        
        <div className="relative">
          {mediaType === 'image' ? (
            <img 
              src={value} 
              alt="Uploaded media"
              className="w-full h-48 object-cover rounded-lg border border-tier-700"
            />
          ) : mediaType === 'video' ? (
            <video 
              src={value}
              className="w-full h-48 object-cover rounded-lg border border-tier-700"
              controls
            />
          ) : (
            <div className="w-full h-48 bg-tier-800 rounded-lg border border-tier-700 flex items-center justify-center">
              <p className="text-tier-400">Preview not available</p>
            </div>
          )}
          
          <Button
            variant="ghost"
            size="sm"
            onClick={removeMedia}
            className="absolute top-2 right-2 bg-tier-950/80 text-tier-200 hover:text-tier-50"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium mb-2 text-tier-300">
          {label}
        </label>
      )}
      
      <div
        onClick={triggerFileSelect}
        className="border-2 border-dashed border-tier-700 rounded-lg p-12 text-center hover:border-tier-600 transition-colors cursor-pointer bg-tier-950/30"
      >
        {isLoading ? (
          <Loader2 className="w-8 h-8 mx-auto mb-3 text-tier-500 animate-spin" />
        ) : (
          <Upload className="w-8 h-8 mx-auto mb-3 text-tier-500" />
        )}
        
        <p className="text-sm text-tier-400">
          {isLoading ? 'Processing...' : placeholder}
        </p>
        
        {!isLoading && (
          <p className="text-xs text-tier-500 mt-1">
            Max {maxSize}MB • {accept === 'image/*' ? 'JPG, PNG, GIF' : accept === 'video/*' ? 'MP4, MOV, WEBM' : 'All files'}
          </p>
        )}
        
        {error && (
          <p className="text-xs text-red-400 mt-2">{error}</p>
        )}
      </div>
      
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  )
} 