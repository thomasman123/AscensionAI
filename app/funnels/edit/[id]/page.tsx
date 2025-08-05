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
import { FONT_GROUPS, getGoogleFontsUrl } from '@/lib/funnel-styling-service'
import Head from 'next/head'
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
  Moon
} from 'lucide-react'

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

export default function FunnelEditPage({ params }: FunnelEditPageProps) {
  const { user } = useAuth()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [funnel, setFunnel] = useState<any>(null)
  const [currentView, setCurrentView] = useState<'desktop' | 'mobile'>('desktop')
  const [editorMode, setEditorMode] = useState<'preview' | 'settings'>('preview')
  const [activeEdit, setActiveEdit] = useState<string | null>(null)

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
    fontGroup: 'professional', // Font groups instead of individual fonts
    funnelTheme: 'light', // This controls only the funnel preview appearance
    // Metadata fields
    metaTitle: '',
    metaDescription: '',
    metaKeywords: '',
    themeMode: 'light' // This controls the live funnel theme
  })

  // Use font groups from styling service
  const fontGroups = FONT_GROUPS

  const editableFields: EditableField[] = [
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
    },
    {
      id: 'bookingHeading',
      type: 'text',
      value: customization.bookingHeading,
      placeholder: 'Book Your Strategy Call',
      label: 'Booking Page Heading'
    }
  ]

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
          fontGroup: data.funnel.data?.customization?.fontGroup || 'professional',
          funnelTheme: data.funnel.data?.customization?.funnelTheme || 'light',
          // Metadata fields
          metaTitle: data.funnel.meta_title || '',
          metaDescription: data.funnel.meta_description || '',
          metaKeywords: data.funnel.meta_keywords || '',
          themeMode: data.funnel.theme_mode || 'light'
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

      console.log('Saving funnel with data:', saveData)

      const response = await fetch('/api/funnels/save', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(saveData)
      })

      console.log('Save response status:', response.status)
      
      if (response.ok) {
        const responseData = await response.json()
        console.log('Save successful:', responseData)
        alert('Funnel saved successfully!')
        router.push('/funnels')
      } else {
        const errorData = await response.json()
        console.error('Save failed:', errorData)
        alert(errorData.error || 'Failed to save changes')
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

  const handleLogoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

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

  const renderEditableText = (field: EditableField) => {
    const isActive = activeEdit === field.id
    const isCta = field.id === 'ctaText'
    
    if (isActive) {
      return field.type === 'textarea' ? (
        <Textarea
          value={field.value}
          onChange={(e) => handleFieldUpdate(field.id, e.target.value)}
          onBlur={() => setActiveEdit(null)}
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
          onBlur={() => setActiveEdit(null)}
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

    // Special styling for CTA buttons
    if (isCta) {
      return (
        <div
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            console.log('CTA button clicked for editing:', field.id)
            setActiveEdit(field.id)
          }}
          className="relative group cursor-pointer inline-block"
        >
          <div
            className="px-12 py-4 text-lg font-semibold rounded-lg shadow-lg text-white transition-all duration-200 hover:shadow-xl hover:scale-105"
            style={{
              background: 'linear-gradient(135deg, #3b82f6, #1e40af)',
              border: '2px solid transparent',
              color: isPlaceholder ? '#E5E7EB' : '#FFFFFF',
              fontStyle: isPlaceholder ? 'italic' : 'normal'
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

    // Regular text field styling
    return (
      <div
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          setActiveEdit(field.id)
        }}
        className="relative group cursor-pointer hover:bg-blue-50 rounded p-2 transition-colors min-h-[2rem] flex items-start"
        style={{
          color: isPlaceholder ? '#9CA3AF' : 'inherit',
          fontStyle: isPlaceholder ? 'italic' : 'normal'
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
          {/* 1. Logo at top (centered) */}
          <header className="py-6 px-6 text-center">
            {customization.logoUrl ? (
              <img 
                src={customization.logoUrl} 
                alt="Logo" 
                className="h-12 max-w-xs object-contain mx-auto cursor-pointer"
                onClick={() => setActiveEdit('logo')}
              />
            ) : (
              <div 
                className="text-xl font-bold mx-auto inline-block"
                style={{ color: themeStyles.textPrimary }}
              >
                Your Logo
              </div>
            )}
          </header>

                              {/* Render Template Content */}
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
              name: funnel?.name || 'Your Business'
            },
            themeStyles,
            isEditor: true,
            renderEditableText,
            editableFields,
            caseStudies: [], // TODO: Load case studies for preview
            goToNextPage: () => {}, // Provide empty function to prevent scrolling in editor
            customization: customization // Pass customization settings for font styling
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
      <Head>
        {/* Google Fonts */}
        <link
          href={getGoogleFontsUrl(customization.fontGroup)}
          rel="stylesheet"
        />
      </Head>
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
                <h1 className={`text-xl font-bold text-tier-50`}>
                  Edit: {funnel?.name}
                </h1>
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
                {/* Pixel Tracking */}
                <Card className={`bg-tier-900 border-tier-800`}>
                  <CardHeader>
                    <CardTitle className={`flex items-center gap-2 text-tier-50`}>
                      <Code className="w-5 h-5" />
                      Pixel Tracking
                    </CardTitle>
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
                      Colors & Branding
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <label className={`block text-sm font-medium mb-2 capitalize text-tier-300`}>
                        Logo
                      </label>
                      <div className="flex items-center gap-4">
                        {customization.logoUrl && (
                          <img 
                            src={customization.logoUrl} 
                            alt="Logo" 
                            className="h-12 w-auto border rounded"
                          />
                        )}
                        <label className="cursor-pointer">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleLogoUpload}
                            className="hidden"
                          />
                          <Button variant="outline" className={`border-tier-600 text-tier-300`}>
                            <Upload className="w-4 h-4 mr-2" />
                            {customization.logoUrl ? 'Change Logo' : 'Upload Logo'}
                          </Button>
                        </label>
                      </div>
                    </div>

                    {/* Font Groups Selection */}
                    <div>
                      <label className={`block text-sm font-medium mb-2 text-tier-300`}>
                        Font Style
                      </label>
                      <div className="grid gap-4">
                        {Object.entries(fontGroups).map(([key, group]: [string, any]) => (
                          <div
                            key={key}
                            onClick={() => setCustomization(prev => ({ ...prev, fontGroup: key }))}
                            className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                              customization.fontGroup === key
                                ? 'border-accent-500 bg-accent-500/10'
                                : 'border-tier-700 bg-tier-800 hover:border-tier-600'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-medium text-tier-50">{group.name}</h4>
                              {customization.fontGroup === key && (
                                <div className="w-2 h-2 bg-accent-500 rounded-full"></div>
                              )}
                            </div>
                            <p className="text-sm text-tier-300 mb-2">{group.description}</p>
                            <div className="text-xs text-tier-400">
                              Fonts: {group.fonts.join(', ')}
                            </div>
                          </div>
                        ))}
                      </div>
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
                      SEO & Metadata
                    </CardTitle>
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
                      onClick={() => {/* TODO: Open case study management modal */}}
                      className="w-full bg-accent-500 hover:bg-accent-600 text-white"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Manage Case Studies
                    </Button>
                  </CardContent>
                </Card>

                {/* Domain Settings */}
                <Card className={`bg-tier-900 border-tier-800`}>
                  <CardHeader>
                    <CardTitle className={`flex items-center gap-2 text-tier-50`}>
                      <Globe className="w-5 h-5" />
                      Domain Settings
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div>
                      <label className={`block text-sm font-medium mb-2 text-tier-300`}>
                        Custom Domain
                      </label>
                      <Input
                        value={customization.domain}
                        onChange={(e) => setCustomization(prev => ({ ...prev, domain: e.target.value }))}
                        placeholder="yourdomain.com"
                        className={`bg-tier-800 border-tier-700 text-tier-50`}
                      />
                      <p className={`text-sm mt-2 text-tier-400`}>
                        Configure your custom domain to make your funnel accessible at your own URL.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardNav>
    </>
  )
} 