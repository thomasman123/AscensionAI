'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { DashboardNav } from '@/components/dashboard-nav'
import { useAuth } from '@/lib/auth-context'
import { renderFunnelTemplate } from '@/lib/funnel-templates'
import { 
  ArrowLeft, 
  Save, 
  Loader2, 
  Upload, 
  Image, 
  Palette, 
  Type, 
  Globe,
  Monitor,
  Smartphone,
  Code,
  Settings,
  Eye,
  Edit3,
  Plus,
  Sun,
  Moon,
  X,
  Trash2,
  ChevronRight
} from 'lucide-react'

import { CaseStudyForm, type CaseStudy } from '@/components/case-study-form'
import { MediaUpload } from '@/components/media-upload'
import { DomainManager } from '@/components/domain-manager'

interface FunnelEditPageProps {
  params: {
    id: string
  }
}

interface EditableField {
  id: string
  type: 'text' | 'textarea' | 'image'
  value: string
  placeholder: string
  label: string
}

interface SelectedElement {
  fieldId: string
  type: 'text' | 'button'
  isCtaButton?: boolean
}

export default function FunnelEditPage({ params }: FunnelEditPageProps) {
  const { user } = useAuth()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [funnel, setFunnel] = useState<any>(null)
  const [currentView, setCurrentView] = useState<'desktop' | 'mobile'>('desktop')
  const [editorMode, setEditorMode] = useState<'preview' | 'settings'>('preview')
  const [activeEdit, setActiveEdit] = useState<string | null>(null)
  const [justActivated, setJustActivated] = useState<string | null>(null)
  const [currentEditPage, setCurrentEditPage] = useState<number>(1)
  const [showCaseStudiesModal, setShowCaseStudiesModal] = useState(false)
  const [caseStudies, setCaseStudies] = useState<any[]>([])
  const [isSavingCaseStudies, setIsSavingCaseStudies] = useState(false)
  
  // New states for settings tray
  const [selectedElement, setSelectedElement] = useState<SelectedElement | null>(null)
  const [showSettingsTray, setShowSettingsTray] = useState(false)
  const [elementClicks, setElementClicks] = useState<Record<string, number>>({})

  const [customization, setCustomization] = useState({
    heading: '',
    subheading: '',
    ctaText: 'Get Started Now',
    caseStudiesHeading: 'Success Stories',
    caseStudiesSubtext: 'See what others have achieved',
    bookingHeading: 'Book Your Strategy Call',
    logoUrl: '',
    domain: '',
    pixelCodes: {
      facebook: '',
      google: '',
      custom: ''
    },
    // Font styling removed - will rebuild design system from scratch
    funnelTheme: 'light', // This controls only the funnel preview appearance
    // Metadata fields
    metaTitle: '',
    metaDescription: '',
    metaKeywords: '',
    themeMode: 'light', // This controls the live funnel theme
    // Responsive text sizes for resizable elements
    textSizes: {
      desktop: {
        heading: 100,
        subheading: 100,
        caseStudiesHeading: 100,
        bookingHeading: 100
      },
      mobile: {
        heading: 100,
        subheading: 100,
        caseStudiesHeading: 100,
        bookingHeading: 100
      }
    },
    // Logo sizes for desktop and mobile
    logoSize: {
      desktop: 48,
      mobile: 36
    },
    // Button sizes for desktop and mobile
    buttonSizes: {
      desktop: {
        ctaText: 100
      },
      mobile: {
        ctaText: 100
      }
    }
  })

  // Get page count based on template type
  const getTemplatePageCount = (templateId: string): number => {
    switch (templateId) {
      case 'trigger-template-1':
        return 2 // Page 1: trigger content, Page 2: booking
      default:
        return 1
    }
  }

  const totalPages = getTemplatePageCount(funnel?.template_id || 'trigger-template-1')

  // Get editable fields based on current editing page
  const getEditableFieldsForPage = (page: number): EditableField[] => {
    if (page === 2) {
      // Page 2: Booking page fields
      return [
        {
          id: 'bookingHeading',
          type: 'text',
          value: customization.bookingHeading,
          placeholder: 'Book Your Strategy Call',
          label: 'Booking Page Heading'
        }
      ]
    }
    
    // Page 1: Trigger page fields (default)
    return [
      {
        id: 'heading',
        type: 'text',
        value: customization.heading,
        placeholder: 'Your Compelling Headline Here',
        label: 'Main Heading'
      },
      {
        id: 'subheading',
        type: 'text',
        value: customization.subheading,
        placeholder: 'Your powerful subheadline that explains the value',
        label: 'Subheading'
      },
      {
        id: 'ctaText',
        type: 'text',
        value: customization.ctaText,
        placeholder: 'Get Started Now',
        label: 'CTA Button Text'
      },
      {
        id: 'caseStudiesHeading',
        type: 'text',
        value: customization.caseStudiesHeading,
        placeholder: 'Success Stories',
        label: 'Case Studies Heading'
      },
      {
        id: 'caseStudiesSubtext',
        type: 'text',
        value: customization.caseStudiesSubtext,
        placeholder: 'See what others have achieved',
        label: 'Case Studies Subtext'
      }
    ]
  }

  const editableFields = getEditableFieldsForPage(currentEditPage)

  useEffect(() => {
    if (!user) {
      router.push('/login')
      return
    }
    loadFunnel()
  }, [user, params.id])

  // Debug: Track activeEdit state changes
  useEffect(() => {
    console.log('activeEdit state changed to:', activeEdit)
  }, [activeEdit])

  // Clear grace period after timeout
  useEffect(() => {
    if (justActivated) {
      const timer = setTimeout(() => {
        console.log('Grace period ending for:', justActivated)
        setJustActivated(null)
      }, 500) // 500ms grace period
      return () => clearTimeout(timer)
    }
  }, [justActivated])

  // Clear active edit when switching pages
  useEffect(() => {
    setActiveEdit(null)
    setJustActivated(null)
  }, [currentEditPage])

  // Close settings tray when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (showSettingsTray) {
        const tray = document.querySelector('.settings-tray')
        if (tray && !tray.contains(e.target as Node)) {
          setShowSettingsTray(false)
        }
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [showSettingsTray])

  const loadFunnel = async () => {
    try {
      const response = await fetch(`/api/funnels/save?userId=${user?.id}&funnelId=${params.id}`)
      if (response.ok) {
        const data = await response.json()
        setFunnel(data.funnel)
      
      // Load case studies for this funnel
      await loadCaseStudies(data.funnel.id)
        
        setCustomization({
          heading: data.funnel.data?.customization?.heading || data.funnel.headline || '',
          subheading: data.funnel.data?.customization?.subheading || data.funnel.subheadline || '',
          ctaText: data.funnel.data?.customization?.ctaText || data.funnel.cta_text || 'Get Started Now',
          caseStudiesHeading: data.funnel.data?.customization?.caseStudiesHeading || 'Success Stories',
          caseStudiesSubtext: data.funnel.data?.customization?.caseStudiesSubtext || 'See what others have achieved',
          bookingHeading: data.funnel.data?.customization?.bookingHeading || 'Book Your Strategy Call',
          logoUrl: data.funnel.data?.customization?.logoUrl || '',
          domain: data.funnel.custom_domain || '',
          pixelCodes: data.funnel.data?.customization?.pixelCodes || {
            facebook: '',
            google: '',
            custom: ''
          },
          funnelTheme: data.funnel.data?.customization?.funnelTheme || 'light',
          // Metadata fields
          metaTitle: data.funnel.meta_title || '',
          metaDescription: data.funnel.meta_description || '',
          metaKeywords: data.funnel.meta_keywords || '',
          themeMode: data.funnel.theme_mode || 'light',
          // Text sizes for resizable elements
          textSizes: data.funnel.data?.customization?.textSizes || {
            desktop: {
              heading: 100,
              subheading: 100,
              caseStudiesHeading: 100,
              bookingHeading: 100
            },
            mobile: {
              heading: 100,
              subheading: 100,
              caseStudiesHeading: 100,
              bookingHeading: 100
            }
          },
          // Logo sizes for desktop and mobile
          logoSize: data.funnel.data?.customization?.logoSize || {
            desktop: 48,
            mobile: 36
          },
          // Button sizes for desktop and mobile
          buttonSizes: data.funnel.data?.customization?.buttonSizes || {
            desktop: {
              ctaText: 100
            },
            mobile: {
              ctaText: 100
            }
          }
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

  const loadCaseStudies = async (funnelId?: string) => {
    const id = funnelId || funnel?.id
    if (!id) return
    
    try {
      const response = await fetch(`/api/case-studies?funnelId=${id}`)
      const data = await response.json()
      setCaseStudies(data.caseStudies || [])
    } catch (error) {
      console.error('Error loading case studies:', error)
    }
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
        customization,
        // Ensure logo is included in the save data
        logoUrl: customization.logoUrl
      }

      console.log('Saving funnel with data:', saveData)

      const response = await fetch('/api/funnels/save', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(saveData)
      })

      console.log('Save response status:', response.status)
      
      // First check if response is ok before trying to parse
      if (!response.ok) {
        let errorMessage = 'Failed to save changes'
        try {
          const errorData = await response.json()
          errorMessage = errorData.error || errorMessage
        } catch (e) {
          // If JSON parsing fails, try to get text
          const errorText = await response.text()
          console.error('Response was not JSON:', errorText)
          errorMessage = `Server error: ${response.status}`
        }
        alert(errorMessage)
        return
      }

      // Try to parse the successful response
      try {
        const responseData = await response.json()
        console.log('Save successful:', responseData)
        alert('Funnel saved successfully!')
        router.push('/funnels')
      } catch (e) {
        // If JSON parsing fails on success, still treat it as success
        console.log('Save completed but response was not JSON')
        alert('Funnel saved successfully!')
        router.push('/funnels')
      }
    } catch (error) {
      console.error('Error saving funnel:', error)
      alert('Failed to save changes: ' + (error instanceof Error ? error.message : String(error)))
    }
    setIsSaving(false)
  }

  const handleFieldUpdate = (fieldId: string, value: string) => {
    setCustomization(prev => ({
      ...prev,
      [fieldId]: value
    }))
    
    // Also update the editableFields array to keep them in sync
    const fieldIndex = editableFields.findIndex(f => f.id === fieldId)
    if (fieldIndex !== -1) {
      editableFields[fieldIndex].value = value
    }
  }

  const handleElementClick = (fieldId: string, type: 'text' | 'button', isCtaButton?: boolean) => {
    const clicks = elementClicks[fieldId] || 0
    const newClicks = clicks + 1
    setElementClicks({ ...elementClicks, [fieldId]: newClicks })

    // Reset click count after a delay
    setTimeout(() => {
      setElementClicks(prev => ({ ...prev, [fieldId]: 0 }))
    }, 500)

    if (newClicks === 1) {
      // First click - show settings tray
      setSelectedElement({ fieldId, type, isCtaButton })
      setShowSettingsTray(true)
      setActiveEdit(null)
    } else if (newClicks === 2) {
      // Second click - edit text inline
      setShowSettingsTray(false)
      setActiveEdit(fieldId)
      setJustActivated(fieldId)
    }
  }

  const handleTextSizeChange = (fieldId: string, size: number) => {
    setCustomization(prev => ({
      ...prev,
      textSizes: {
        ...prev.textSizes,
        [currentView]: {
          ...prev.textSizes[currentView],
          [fieldId]: size
        }
      }
    }))
  }

  const handleButtonSizeChange = (fieldId: string, size: number) => {
    if (!customization.buttonSizes) {
      setCustomization(prev => ({
        ...prev,
        buttonSizes: {
          desktop: { ctaText: 100 },
          mobile: { ctaText: 100 }
        }
      }))
    }
    
    setCustomization(prev => ({
      ...prev,
      buttonSizes: {
        ...prev.buttonSizes,
        [currentView]: {
          ...prev.buttonSizes[currentView],
          [fieldId]: size
        }
      }
    }))
  }

  const handleLogoSizeChange = (size: number) => {
    setCustomization(prev => ({
      ...prev,
      logoSize: {
        ...prev.logoSize,
        [currentView]: size
      }
    }))
  }

  // Removed color editing - using default colors only

  const handlePixelCodeChange = (platform: string, value: string) => {
    setCustomization(prev => ({
      ...prev,
      pixelCodes: {
        ...prev.pixelCodes,
        [platform]: value
      }
    }))
  }

  const handleLogoUpload = (url: string, file?: File) => {
    setCustomization(prev => ({
      ...prev,
      logoUrl: url
    }))
  }

  const renderEditableText = (field: EditableField) => {
    const isActive = activeEdit === field.id
    const isCta = field.id === 'ctaText'
    const isBookingHeading = field.id === 'bookingHeading'
    
    if (isActive) {
      // Active editing mode
      return field.type === 'textarea' ? (
        <Textarea
          value={field.value}
          onChange={(e) => handleFieldUpdate(field.id, e.target.value)}
          onBlur={() => {
            if (justActivated === field.id) {
              return
            }
            setActiveEdit(null)
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && e.shiftKey === false && field.type === 'text') {
              setActiveEdit(null)
            }
            if (e.key === 'Escape') {
              setActiveEdit(null)
            }
          }}
          autoFocus
          className="w-full bg-white border-2 border-accent-500 rounded px-3 py-2 text-gray-900"
          placeholder={field.placeholder}
        />
      ) : (
        <Input
          value={field.value}
          onChange={(e) => handleFieldUpdate(field.id, e.target.value)}
          onBlur={() => {
            if (justActivated === field.id) {
              return
            }
            setActiveEdit(null)
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              setActiveEdit(null)
            }
            if (e.key === 'Escape') {
              setActiveEdit(null)
            }
          }}
          autoFocus
          className={isCta 
            ? "bg-white border-2 border-accent-500 rounded-lg px-12 py-4 text-lg font-semibold text-gray-900 text-center"
            : isBookingHeading
              ? "bg-white border-2 border-accent-500 rounded-lg px-6 py-3 text-3xl font-bold text-gray-900 text-center w-full"
              : "w-full bg-white border-2 border-accent-500 rounded px-3 py-2 text-gray-900"
          }
          placeholder={field.placeholder}
        />
      )
    }

    const displayText = field.value || field.placeholder
    const isPlaceholder = !field.value

    // Handle multiline text for textarea fields
    const renderText = () => {
      if (field.type === 'textarea' && displayText.includes('\n')) {
        return displayText.split('\n').map((line, index) => (
          <div key={index} className="mb-2 last:mb-0">
            {line}
          </div>
        ))
      }
      return displayText
    }

    // Get text size for current view
    const viewSizes = customization.textSizes[currentView]
    const textSize = viewSizes && typeof viewSizes === 'object' && field.id in viewSizes 
      ? (viewSizes as any)[field.id] 
      : 100
    const buttonSize = isCta ? (customization.buttonSizes?.[currentView]?.ctaText || 100) : 100

    // Special styling for CTA buttons
    if (isCta) {
      return (
        <div
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            handleElementClick(field.id, 'button', true)
          }}
          className="relative group cursor-pointer inline-block"
        >
          <div
            className="px-12 py-4 text-lg font-semibold rounded-lg shadow-lg text-white transition-all duration-200 hover:shadow-xl hover:scale-105"
            style={{
              background: 'linear-gradient(135deg, #3b82f6, #1e40af)',
              border: '2px solid transparent',
              color: isPlaceholder ? '#E5E7EB' : '#FFFFFF',
              fontStyle: isPlaceholder ? 'italic' : 'normal',
              fontSize: `${textSize}%`,
              transform: `scale(${buttonSize / 100})`
            }}
          >
            {renderText()}
            <div className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <Edit3 className="w-5 h-5 text-blue-500 bg-white rounded-full p-1 shadow-lg" />
            </div>
          </div>
        </div>
      )
    }

    // Special styling for booking heading (large headline)
    if (isBookingHeading) {
      return (
        <div
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            handleElementClick(field.id, 'text')
          }}
          className="relative group cursor-pointer text-center"
        >
          <h1
            className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 hover:bg-blue-50 rounded p-2 transition-colors"
            style={{
              color: isPlaceholder ? '#9CA3AF' : 'inherit',
              fontStyle: isPlaceholder ? 'italic' : 'normal',
              fontSize: `${textSize}%`
            }}
          >
            {renderText()}
            <div className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <Edit3 className="w-5 h-5 text-blue-500 bg-white rounded-full p-1 shadow-lg" />
            </div>
          </h1>
        </div>
      )
    }

    // Regular text field styling
    return (
      <div
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          handleElementClick(field.id, 'text')
        }}
        className="relative group cursor-pointer hover:bg-blue-50 rounded p-2 transition-colors min-h-[2rem] flex items-start"
        style={{
          color: isPlaceholder ? '#9CA3AF' : 'inherit',
          fontStyle: isPlaceholder ? 'italic' : 'normal',
          fontSize: `${textSize}%`
        }}
      >
        <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
          <Edit3 className="w-4 h-4 text-blue-500 bg-white rounded p-0.5 shadow" />
        </div>
        <div className="flex-1 pt-1">
          {renderText()}
        </div>
      </div>
    )
  }

  // Case Studies Management Functions - handled by CaseStudyForm component

  const handleSaveCaseStudies = async () => {
    setIsSavingCaseStudies(true)
    try {
      const response = await fetch('/api/case-studies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          funnelId: funnel?.id,
          userId: user?.id,
          caseStudies: caseStudies.filter(cs => cs.name && cs.description && cs.result)
        })
      })

      if (response.ok) {
        setShowCaseStudiesModal(false)
        await loadCaseStudies()
        alert('Case studies saved successfully!')
      } else {
        alert('Failed to save case studies')
      }
    } catch (error) {
      console.error('Error saving case studies:', error)
      alert('Failed to save case studies')
    }
    setIsSavingCaseStudies(false)
  }

  const renderSettingsTray = () => {
    if (!showSettingsTray || !selectedElement) return null

    const isButton = selectedElement.type === 'button'
    const fieldId = selectedElement.fieldId
    const currentTextSize = customization.textSizes[currentView]?.[fieldId as keyof typeof customization.textSizes[typeof currentView]] || 100
    const currentButtonSize = isButton ? (customization.buttonSizes?.[currentView]?.ctaText || 100) : 100

    return (
      <div className="settings-tray fixed right-0 top-0 h-full w-80 bg-tier-900 border-l border-tier-800 shadow-2xl z-50 transform transition-transform duration-300 ease-in-out"
        style={{ transform: showSettingsTray ? 'translateX(0)' : 'translateX(100%)' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-tier-800">
          <h3 className="text-lg font-semibold text-tier-50">
            {isButton ? 'Button Settings' : 'Text Settings'}
          </h3>
          <button
            onClick={() => setShowSettingsTray(false)}
            className="text-tier-400 hover:text-tier-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-6">
          {/* Font Size */}
          <div>
            <label className="block text-sm font-medium text-tier-300 mb-2">
              Font Size ({currentView === 'mobile' ? 'Mobile' : 'Desktop'})
            </label>
            <div className="flex items-center gap-2">
              <input
                type="range"
                min="50"
                max="200"
                value={currentTextSize}
                onChange={(e) => handleTextSizeChange(fieldId, parseInt(e.target.value))}
                className="flex-1"
              />
              <span className="text-tier-400 w-12 text-right">{currentTextSize}%</span>
            </div>
            <div className="flex justify-between mt-2">
              <button
                onClick={() => handleTextSizeChange(fieldId, 50)}
                className="text-xs text-tier-500 hover:text-tier-300"
              >
                50%
              </button>
              <button
                onClick={() => handleTextSizeChange(fieldId, 100)}
                className="text-xs text-tier-500 hover:text-tier-300"
              >
                100%
              </button>
              <button
                onClick={() => handleTextSizeChange(fieldId, 150)}
                className="text-xs text-tier-500 hover:text-tier-300"
              >
                150%
              </button>
              <button
                onClick={() => handleTextSizeChange(fieldId, 200)}
                className="text-xs text-tier-500 hover:text-tier-300"
              >
                200%
              </button>
            </div>
          </div>

          {/* Button Size (only for buttons) */}
          {isButton && (
            <div>
              <label className="block text-sm font-medium text-tier-300 mb-2">
                Button Size ({currentView === 'mobile' ? 'Mobile' : 'Desktop'})
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min="50"
                  max="150"
                  value={currentButtonSize}
                  onChange={(e) => handleButtonSizeChange('ctaText', parseInt(e.target.value))}
                  className="flex-1"
                />
                <span className="text-tier-400 w-12 text-right">{currentButtonSize}%</span>
              </div>
              <div className="flex justify-between mt-2">
                <button
                  onClick={() => handleButtonSizeChange('ctaText', 75)}
                  className="text-xs text-tier-500 hover:text-tier-300"
                >
                  Small
                </button>
                <button
                  onClick={() => handleButtonSizeChange('ctaText', 100)}
                  className="text-xs text-tier-500 hover:text-tier-300"
                >
                  Medium
                </button>
                <button
                  onClick={() => handleButtonSizeChange('ctaText', 125)}
                  className="text-xs text-tier-500 hover:text-tier-300"
                >
                  Large
                </button>
              </div>
            </div>
          )}

          {/* Instructions */}
          <div className="bg-tier-800 rounded-lg p-3">
            <p className="text-sm text-tier-400">
              <strong className="text-tier-300">Tip:</strong> Click the element again to edit the text content directly.
            </p>
          </div>

          {/* Device Preview Note */}
          <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-3">
            <p className="text-sm text-blue-400">
              You're editing for <strong>{currentView === 'mobile' ? 'Mobile' : 'Desktop'}</strong> view. 
              Switch views to edit the other size.
            </p>
          </div>
        </div>
      </div>
    )
  }

  const renderCaseStudiesModal = () => {
    if (!showCaseStudiesModal) return null

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-tier-900 rounded-lg border border-tier-800 w-full max-w-4xl max-h-[90vh] overflow-hidden">
          {/* Modal Header */}
          <div className="flex items-center justify-between p-6 border-b border-tier-800">
            <h2 className="text-xl font-semibold text-tier-50">Manage Case Studies</h2>
            <button
              onClick={() => setShowCaseStudiesModal(false)}
              className="text-tier-400 hover:text-tier-200"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Modal Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
            <div className="text-sm text-tier-400 mb-6">
              Add customer success stories and testimonials to build trust and credibility on your funnel.
            </div>

            <CaseStudyForm 
              caseStudies={caseStudies}
              onChange={setCaseStudies}
              showMetric={true}
            />
          </div>

          {/* Modal Footer */}
          <div className="flex items-center justify-between p-6 border-t border-tier-800">
            <Button
              variant="outline"
              onClick={() => setShowCaseStudiesModal(false)}
              className="border-tier-600 text-tier-300"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveCaseStudies}
              disabled={isSavingCaseStudies}
              className="bg-accent-500 hover:bg-accent-600 text-white"
            >
              {isSavingCaseStudies ? 'Saving...' : 'Save Case Studies'}
            </Button>
          </div>
        </div>
      </div>
    )
  }

  const renderFunnelPreview = () => {
    const containerClass = currentView === 'mobile' 
      ? 'w-[375px] mx-auto border-8 border-gray-800 rounded-[2.5rem] bg-gray-800 shadow-xl overflow-hidden'
      : 'w-full max-w-6xl mx-auto border border-gray-200 rounded-lg shadow-sm overflow-hidden'

    // Apply theme-specific styling - match live funnel exactly
    const getThemeStyles = () => {
      const isDarkTheme = customization.funnelTheme === 'dark'
      
      return {
        background: isDarkTheme ? '#0f172a' : '#ffffff',
        textPrimary: isDarkTheme ? '#f8fafc' : '#1e293b',
        textSecondary: isDarkTheme ? '#cbd5e1' : '#475569',
        accent: '#3b82f6', // Using default primary color
        ctaGradient: 'linear-gradient(135deg, #3b82f6, #1e40af)', // Using default gradient
        sectionBg: isDarkTheme ? 'rgba(30, 41, 59, 0.5)' : 'rgba(248, 250, 252, 0.5)',
        cardBg: isDarkTheme ? 'rgba(51, 65, 85, 0.8)' : 'rgba(255, 255, 255, 0.9)',
        borderColor: isDarkTheme ? 'rgba(148, 163, 184, 0.2)' : 'rgba(148, 163, 184, 0.3)'
      }
    }

    const themeStyles = getThemeStyles()

    return (
      <div className={containerClass}>
        {currentView === 'mobile' && (
          <div className="h-6 bg-gray-800 flex items-center justify-center">
            <div className="w-16 h-1 bg-gray-600 rounded-full"></div>
          </div>
        )}
        <div 
          className="min-h-screen transition-all duration-300"
          style={{ 
            backgroundColor: themeStyles.background
          }}
        >
          {/* Render Template Content - Logo is handled by the template itself */}
          {renderFunnelTemplate(funnel?.template_id || 'trigger-template-1', {
            funnelData: {
              heading: customization.heading,
              subheading: customization.subheading,
              ctaText: customization.ctaText,
              caseStudiesHeading: customization.caseStudiesHeading,
              caseStudiesSubtext: customization.caseStudiesSubtext,
              bookingHeading: customization.bookingHeading,
              vsl_url: null, // No VSL in editor preview
              vsl_title: null,
              template_id: funnel?.template_id || 'trigger-template-1',
              name: funnel?.name || 'Your Business',
              calendar_embed_code: funnel?.calendar_embed_code
            },
            themeStyles,
            isEditor: true,
            renderEditableText,
            editableFields,
            caseStudies: [], // TODO: Load case studies for preview
            goToNextPage: () => {}, // Provide empty function to prevent scrolling in editor
            currentPage: currentEditPage, // Pass the current edit page
            customization: customization, // Pass customization settings for font styling
            textSizes: customization.textSizes, // Pass text sizes to the template
            onTextSizeChange: handleTextSizeChange, // Pass text size handler to the template
            currentView: currentView, // Pass current view (desktop/mobile)
            logoSize: customization.logoSize, // Pass logo sizes
            onLogoSizeChange: handleLogoSizeChange, // Pass logo size handler to the template
            onElementClick: handleElementClick, // Pass element click handler to the template
            buttonSizes: customization.buttonSizes, // Pass button sizes to the template
            onFieldEdit: handleFieldUpdate // Pass field update handler for text editing
          })}
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <DashboardNav>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-accent-500" />
            <p className="text-tier-300">Loading funnel...</p>
          </div>
        </div>
      </DashboardNav>
    )
  }

  return (
    <>
      <DashboardNav>
        <div className={`h-full flex flex-col bg-tier-950`}>
        {/* Top Bar */}
        <div className={`border-b border-tier-800 bg-tier-900`}>
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  onClick={() => router.push('/funnels')}
                  className={`border-tier-600 text-tier-300 hover:border-tier-500`}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
                
                <div className="flex flex-col">
                  <h1 className={`text-xl font-bold text-tier-50`}>
                    Edit: {funnel?.name}
                  </h1>
                  {totalPages > 1 && (
                    <span className="text-sm text-tier-400">
                      Currently editing: {currentEditPage === 1 ? 'Trigger Page' : currentEditPage === 2 ? 'Booking Page' : `Page ${currentEditPage}`}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3">
                {/* Funnel Theme Toggle */}
                <button
                  onClick={() => setCustomization(prev => ({ ...prev, funnelTheme: prev.funnelTheme === 'light' ? 'dark' : 'light' }))}
                  className="p-2 rounded-md transition-colors hover:bg-tier-800 text-tier-300 hover:text-tier-50"
                  title={`Switch funnel to ${customization.funnelTheme === 'light' ? 'dark' : 'light'} theme`}
                >
                  {customization.funnelTheme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                </button>

                {/* Page Selection */}
                {totalPages > 1 && (
                  <div className="flex items-center gap-2">
                    <span className="text-tier-300 text-sm">Page:</span>
                    <select
                      value={currentEditPage}
                      onChange={(e) => setCurrentEditPage(parseInt(e.target.value))}
                      className="bg-tier-800 border border-tier-600 text-tier-50 rounded px-3 py-1 text-sm focus:outline-none focus:border-accent-500"
                    >
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                        <option key={pageNum} value={pageNum}>
                          {pageNum === 1 ? 'Page 1 (Trigger)' : pageNum === 2 ? 'Page 2 (Booking)' : `Page ${pageNum}`}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* View Toggle */}
                <div className="flex rounded-lg p-1 bg-tier-800">
                  <button
                    onClick={() => setCurrentView('desktop')}
                    className={`p-2 rounded-md transition-colors ${
                      currentView === 'desktop'
                        ? 'bg-accent-500 text-white'
                        : 'text-tier-300 hover:text-tier-50'
                    }`}
                  >
                    <Monitor className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setCurrentView('mobile')}
                    className={`p-2 rounded-md transition-colors ${
                      currentView === 'mobile'
                        ? 'bg-accent-500 text-white'
                        : 'text-tier-300 hover:text-tier-50'
                    }`}
                  >
                    <Smartphone className="w-4 h-4" />
                  </button>
                </div>

                {/* Mode Toggle */}
                <div className="flex rounded-lg p-1 bg-tier-800">
                  <button
                    onClick={() => setEditorMode('preview')}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      editorMode === 'preview'
                        ? 'bg-accent-500 text-white'
                        : 'text-tier-300 hover:text-tier-50'
                    }`}
                  >
                    <Eye className="w-4 h-4 inline mr-2" />
                    Preview
                  </button>
                  <button
                    onClick={() => setEditorMode('settings')}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      editorMode === 'settings'
                        ? 'bg-accent-500 text-white'
                        : 'text-tier-300 hover:text-tier-50'
                    }`}
                  >
                    <Settings className="w-4 h-4 inline mr-2" />
                    Settings
                  </button>
                </div>

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
                  Save
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Preview Panel */}
          <div className={`flex-1 overflow-auto p-6 bg-tier-900`}>
            {editorMode === 'preview' ? (
              <div className="space-y-4">
                <div className="text-center">
                  <p className={`text-sm text-tier-300`}>
                    Click on any text to edit directly • {currentView === 'mobile' ? 'Mobile' : 'Desktop'} view
                  </p>
                </div>
                {renderFunnelPreview()}
              </div>
            ) : (
              <div className="max-w-4xl mx-auto space-y-8">
                {/* Page Content Editing */}
                {totalPages > 1 && (
                  <Card className={`bg-tier-900 border-tier-800`}>
                    <CardHeader>
                      <CardTitle className={`flex items-center gap-2 text-tier-50`}>
                        <Edit3 className="w-5 h-5" />
                        Page Content Editing
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-tier-50 font-medium">
                            Currently editing: {currentEditPage === 1 ? 'Page 1 (Trigger)' : currentEditPage === 2 ? 'Page 2 (Booking)' : `Page ${currentEditPage}`}
                          </p>
                          <p className="text-sm text-tier-400 mt-1">
                            {currentEditPage === 1 
                              ? 'Headline, subheadline, CTAs, and case studies'
                              : currentEditPage === 2 
                                ? 'Booking headline and calendar section'
                                : 'Page content'
                            }
                          </p>
                        </div>
                        <div className="flex gap-2">
                          {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                            <button
                              key={pageNum}
                              onClick={() => setCurrentEditPage(pageNum)}
                              className={`px-3 py-1 rounded text-sm transition-colors ${
                                currentEditPage === pageNum
                                  ? 'bg-accent-500 text-white'
                                  : 'bg-tier-800 text-tier-300 hover:bg-tier-700'
                              }`}
                            >
                              {pageNum === 1 ? 'Trigger' : pageNum === 2 ? 'Booking' : `Page ${pageNum}`}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="text-sm text-tier-400">
                        💡 <strong>Tip:</strong> Click elements in the preview above to edit them directly. The settings below apply to ALL pages of this funnel.
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Global Funnel Settings Notice */}
                <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <div className="text-blue-400 mt-0.5">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-blue-400 font-medium mb-1">Global Settings</h4>
                      <p className="text-blue-300/80 text-sm">
                        All settings below (logo, fonts, colors, tracking, etc.) apply to the entire funnel across all pages. 
                        Only text content is editable per page.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Pixel Tracking */}
                <Card className={`bg-tier-900 border-tier-800`}>
                  <CardHeader>
                    <CardTitle className={`flex items-center gap-2 text-tier-50`}>
                      <Code className="w-5 h-5" />
                      Global Tracking & Analytics
                    </CardTitle>
                    <p className="text-sm text-tier-400 mt-1">
                      These tracking codes apply to all pages of your funnel
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className={`block text-sm font-medium mb-2 text-tier-300`}>
                        Facebook Pixel
                      </label>
                      <Textarea
                        value={customization.pixelCodes.facebook}
                        onChange={(e) => handlePixelCodeChange('facebook', e.target.value)}
                        placeholder="Paste your Facebook pixel code here..."
                        className={`bg-tier-800 border-tier-700 text-tier-50`}
                      />
                    </div>
                    <div>
                      <label className={`block text-sm font-medium mb-2 text-tier-300`}>
                        Google Analytics
                      </label>
                      <Textarea
                        value={customization.pixelCodes.google}
                        onChange={(e) => handlePixelCodeChange('google', e.target.value)}
                        placeholder="Paste your Google Analytics code here..."
                        className={`bg-tier-800 border-tier-700 text-tier-50`}
                      />
                    </div>
                    <div>
                      <label className={`block text-sm font-medium mb-2 text-tier-300`}>
                        Custom Tracking Code
                      </label>
                      <Textarea
                        value={customization.pixelCodes.custom}
                        onChange={(e) => handlePixelCodeChange('custom', e.target.value)}
                        placeholder="Any additional tracking codes..."
                        className={`bg-tier-800 border-tier-700 text-tier-50`}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Colors & Branding */}
                <Card className={`bg-tier-900 border-tier-800`}>
                  <CardHeader>
                    <CardTitle className={`flex items-center gap-2 text-tier-50`}>
                      <Palette className="w-5 h-5" />
                      Global Branding & Design
                    </CardTitle>
                    <p className="text-sm text-tier-400 mt-1">
                      These settings apply to all pages of your funnel
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <MediaUpload
                        value={customization.logoUrl}
                        onChange={handleLogoUpload}
                        accept="image/*"
                        maxSize={5}
                        label="Logo (All Pages)"
                        placeholder="Upload Logo"
                        preview={true}
                      />

                      <p className="text-xs text-tier-400 mt-1">
                        Recommended: PNG or JPG, max 5MB. Logo appears on all pages.
                      </p>
                    </div>

                    {/* Live Funnel Theme Setting */}
                    <div>
                      <label className="block text-sm font-medium mb-2 text-tier-300">
                        Live Funnel Theme
                      </label>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setCustomization(prev => ({ ...prev, themeMode: 'light' }))}
                          className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
                            customization.themeMode === 'light'
                              ? 'bg-accent-500 text-white'
                              : 'bg-tier-800 text-tier-300 hover:text-tier-50'
                          }`}
                        >
                          <Sun className="w-4 h-4" />
                          Light
                        </button>
                        <button
                          onClick={() => setCustomization(prev => ({ ...prev, themeMode: 'dark' }))}
                          className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
                            customization.themeMode === 'dark'
                              ? 'bg-accent-500 text-white'
                              : 'bg-tier-800 text-tier-300 hover:text-tier-50'
                          }`}
                        >
                          <Moon className="w-4 h-4" />
                          Dark
                        </button>
                      </div>
                      <p className="text-sm mt-2 text-tier-400">
                        Choose how your live funnel appears to visitors. This controls the actual theme visitors see.
                      </p>
                    </div>

                    {/* Preview Theme Setting */}
                    <div>
                      <label className="block text-sm font-medium mb-2 text-tier-300">
                        Editor Preview Theme
                      </label>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setCustomization(prev => ({ ...prev, funnelTheme: 'light' }))}
                          className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
                            customization.funnelTheme === 'light'
                              ? 'bg-accent-500 text-white'
                              : 'bg-tier-800 text-tier-300 hover:text-tier-50'
                          }`}
                        >
                          <Sun className="w-4 h-4" />
                          Light
                        </button>
                        <button
                          onClick={() => setCustomization(prev => ({ ...prev, funnelTheme: 'dark' }))}
                          className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
                            customization.funnelTheme === 'dark'
                              ? 'bg-accent-500 text-white'
                              : 'bg-tier-800 text-tier-300 hover:text-tier-50'
                          }`}
                        >
                          <Moon className="w-4 h-4" />
                          Dark
                        </button>
                      </div>
                      <p className="text-sm mt-2 text-tier-400">
                        Choose how the funnel appears in this editor preview. This only affects the editor, not the live page.
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* SEO & Metadata Settings */}
                <Card className={`bg-tier-900 border-tier-800`}>
                  <CardHeader>
                    <CardTitle className={`flex items-center gap-2 text-tier-50`}>
                      <Globe className="w-5 h-5" />
                      Global SEO & Metadata
                    </CardTitle>
                    <p className="text-sm text-tier-400 mt-1">
                      These SEO settings apply to all pages of your funnel
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2 text-tier-300">
                        Page Title
                      </label>
                      <Input
                        value={customization.metaTitle}
                        onChange={(e) => setCustomization(prev => ({ ...prev, metaTitle: e.target.value }))}
                        placeholder="Custom page title (leave empty to use headline)"
                        className="bg-tier-800 border-tier-700 text-tier-50 placeholder-tier-400"
                      />
                      <p className="text-sm mt-1 text-tier-400">
                        This will be the browser tab title. If empty, will use your headline.
                      </p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2 text-tier-300">
                        Meta Description
                      </label>
                      <Textarea
                        value={customization.metaDescription}
                        onChange={(e) => setCustomization(prev => ({ ...prev, metaDescription: e.target.value }))}
                        placeholder="Brief description for search engines (150-160 characters)"
                        className="bg-tier-800 border-tier-700 text-tier-50 placeholder-tier-400"
                        rows={3}
                      />
                      <p className="text-sm mt-1 text-tier-400">
                        This appears in search engine results. Keep it under 160 characters.
                      </p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2 text-tier-300">
                        Keywords
                      </label>
                      <Input
                        value={customization.metaKeywords}
                        onChange={(e) => setCustomization(prev => ({ ...prev, metaKeywords: e.target.value }))}
                        placeholder="keyword1, keyword2, keyword3"
                        className="bg-tier-800 border-tier-700 text-tier-50 placeholder-tier-400"
                      />
                      <p className="text-sm mt-1 text-tier-400">
                        Comma-separated keywords related to your offer.
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Case Studies Management */}
                <Card className={`bg-tier-900 border-tier-800`}>
                  <CardHeader>
                    <CardTitle className={`flex items-center gap-2 text-tier-50`}>
                      <Edit3 className="w-5 h-5" />
                      Case Studies
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-tier-400">
                      Add customer success stories and testimonials to build trust and credibility.
                    </p>
                    <Button
                      onClick={() => setShowCaseStudiesModal(true)}
                      className="w-full bg-accent-500 hover:bg-accent-600 text-white"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Manage Case Studies ({caseStudies.length})
                    </Button>
                  </CardContent>
                </Card>

                {/* Domain Settings */}
                <DomainManager 
                  funnelId={funnel?.id || params.id}
                  userId={user?.id}
                  onDomainAdded={(domain) => {
                    console.log('Domain added:', domain)
                    // Update the funnel's custom domain
                    setCustomization(prev => ({ ...prev, domain: domain.domain }))
                  }}
                  onDomainRemoved={(domainId) => {
                    console.log('Domain removed:', domainId)
                    // Clear the custom domain
                    setCustomization(prev => ({ ...prev, domain: '' }))
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Case Studies Modal */}
      {renderCaseStudiesModal()}
      {renderSettingsTray()}
    </DashboardNav>
    </>
  )
} 