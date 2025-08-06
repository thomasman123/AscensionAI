import React, { useState, useEffect, useRef } from 'react'

export interface SpacerData {
  [key: string]: {
    desktop: number
    mobile: number
  }
}

interface UniversalSpacerProps {
  spacerId: string
  currentView: 'desktop' | 'mobile'
  spacerData?: SpacerData
  onSpacingChange?: (spacerId: string, value: number) => void
  isEditor?: boolean
  defaultSpacing?: {
    desktop: number
    mobile: number
  }
  minHeight?: number
  maxHeight?: number
}

export const UniversalSpacer: React.FC<UniversalSpacerProps> = ({
  spacerId,
  currentView,
  spacerData,
  onSpacingChange,
  isEditor = false,
  defaultSpacing = { desktop: 48, mobile: 32 },
  minHeight = 0,
  maxHeight = 300
}) => {
  const [isHovered, setIsHovered] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [dragStartY, setDragStartY] = useState(0)
  const [dragStartSpacing, setDragStartSpacing] = useState(0)

  const spacerRef = useRef<HTMLDivElement>(null)

  // Get current spacing value
  const currentSpacing = spacerData?.[spacerId]?.[currentView] ?? defaultSpacing[currentView]

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !onSpacingChange) return
      
      const deltaY = e.clientY - dragStartY
      const newSpacing = Math.max(minHeight, Math.min(maxHeight, dragStartSpacing + deltaY))
      onSpacingChange(spacerId, newSpacing)
    }

    const handleMouseUp = () => {
      setIsDragging(false)
      document.body.style.cursor = 'auto'
    }

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      document.body.style.cursor = 'ns-resize'
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
        document.body.style.cursor = 'auto'
      }
    }
  }, [isDragging, dragStartY, dragStartSpacing, spacerId, onSpacingChange, minHeight, maxHeight])

  // In live mode, just render the spacing
  if (!isEditor) {
    return <div style={{ height: `${currentSpacing}px` }} />
  }

  // In editor mode, render the interactive spacer
  return (
    <div
      ref={spacerRef}
      className="relative group"
      style={{ 
        height: `${currentSpacing}px`,
        minHeight: `${Math.max(20, currentSpacing)}px`, // Ensure minimum clickable area
        margin: 0, // Ensure no margin
        padding: 0, // Ensure no padding
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => !isDragging && setIsHovered(false)}
    >
      {/* Full-width draggable area with gray background that fills the entire spacer */}
      <div
        className="absolute inset-0 transition-all duration-200 z-10"
        style={{
          backgroundColor: isDragging ? 'rgba(59, 130, 246, 0.1)' : isHovered ? 'rgba(107, 114, 128, 0.1)' : 'transparent',
          borderTop: isDragging ? '2px solid #3b82f6' : isHovered ? '1px solid #6b7280' : '1px dashed #e5e7eb',
          borderBottom: isDragging ? '2px solid #3b82f6' : isHovered ? '1px solid #6b7280' : '1px dashed #e5e7eb',
          cursor: 'ns-resize',
        }}
        onMouseDown={(e) => {
          e.preventDefault()
          setIsDragging(true)
          setDragStartY(e.clientY)
          setDragStartSpacing(currentSpacing)
        }}
      >
        {/* Center divider line - spans full viewport width */}
        <div
          className="absolute left-0 right-0 top-1/2 -translate-y-1/2 transition-all duration-200"
          style={{
            height: isDragging ? '2px' : '1px',
            backgroundColor: isDragging ? '#3b82f6' : isHovered ? '#6b7280' : '#e5e7eb',
            marginLeft: '-50vw',
            marginRight: '-50vw',
            left: '50%',
            right: '50%',
            width: '100vw',
            boxShadow: isDragging ? '0 0 10px rgba(59, 130, 246, 0.5)' : 'none'
          }}
        />
        
        {/* Center handle */}
        <div 
          className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-200 z-20 ${
            isDragging ? 'scale-110' : ''
          }`}
          style={{
            opacity: isDragging ? 1 : isHovered ? 1 : 0.8
          }}
        >
          <div 
            className={`flex items-center gap-2 px-3 py-2 rounded-full shadow-lg border-2 ${
              isDragging ? 'bg-blue-600 border-blue-700' : isHovered ? 'bg-gray-700 border-gray-800' : 'bg-gray-600 border-gray-700'
            }`}
          >
            {/* Drag dots */}
            <div className="flex gap-0.5">
              <div className="w-1 h-3 bg-white rounded-full" />
              <div className="w-1 h-3 bg-white rounded-full" />
              <div className="w-1 h-3 bg-white rounded-full" />
            </div>
            
            {/* Spacing value or instruction text */}
            <div className="text-xs font-semibold text-white whitespace-nowrap">
              {isHovered || isDragging ? `${currentSpacing}px` : 'Drag to adjust'}
            </div>
          </div>
        </div>

        {/* Drag indicators */}
        {isDragging && (
          <>
            <div className="absolute left-1/2 -translate-x-1/2 -top-8 text-blue-500 animate-bounce">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="absolute left-1/2 -translate-x-1/2 -bottom-8 text-blue-500 animate-bounce">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

// Helper function to generate unique spacer IDs based on position
export const generateSpacerId = (templateId: string, pageNum: number, afterComponent: string) => {
  return `${templateId}_p${pageNum}_after_${afterComponent}`
} 