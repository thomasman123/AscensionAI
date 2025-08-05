import React from 'react'
import { TriggerTemplatePage1, TriggerTemplatePage2 } from './clean-trigger-template'
import { TRIGGER_TEMPLATE_1_FIELDS } from './funnel-template-middleware'

export interface FunnelTemplateProps {
  funnelData: any
  themeStyles: any
  isEditor?: boolean
  renderEditableText?: (field: any) => React.ReactNode
  editableFields?: any[]
  caseStudies?: any[]
  goToNextPage?: () => void
  customization?: any
  currentPage?: number
}

export const TriggerTemplate1 = ({ 
  funnelData, 
  themeStyles,
  isEditor = false, 
  renderEditableText,
  editableFields = [],
  caseStudies = [],
  goToNextPage,
  customization
}: FunnelTemplateProps) => {
  
  // Simple helper to get field value for editing or display
  const getFieldValue = (fieldId: string, fallback: string = '') => {
    if (isEditor && renderEditableText) {
      const field = editableFields.find(f => f.id === fieldId)
      if (field) {
        return renderEditableText(field)
      }
    }
    
    // Map field IDs to actual database column names
    const fieldMapping: Record<string, string> = {
      'heading': 'headline',
      'subheading': 'subheadline', 
      'ctaText': 'cta_text',
      'caseStudiesHeading': 'case_studies_heading',
      'caseStudiesSubtext': 'case_studies_subtext',
      'bookingHeading': 'booking_heading'
    }
    
    const dbField = fieldMapping[fieldId] || fieldId
    return funnelData[dbField] || funnelData[fieldId] || fallback
  }

  // Helper to render CTA buttons properly
  const renderCtaButton = (fieldId: string = 'ctaText', fallback: string = 'Get Started Now') => {
    if (isEditor && renderEditableText) {
      const field = editableFields.find(f => f.id === fieldId)
      if (field) {
        // console.log('Rendering CTA in editor mode for field:', fieldId)
        return (
          <div className="inline-block">
            {renderEditableText(field)}
          </div>
        )
      }
    }
    
    // For non-editor mode, render actual clickable button
    const ctaText = getFieldValue(fieldId, fallback)
    return (
      <button
        onClick={goToNextPage || (() => {})}
        className="px-12 py-4 text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 text-white"
        style={{ 
          background: themeStyles.ctaGradient || 'linear-gradient(135deg, #3b82f6, #1e40af)',
          border: 'none'
        }}
      >
        {ctaText}
      </button>
    )
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: themeStyles.background }}>
      <div className="container mx-auto px-6 max-w-4xl">
        
        {/* 1. HEADING */}
        <section className="text-center py-12">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6" style={{ color: themeStyles.textPrimary }}>
            {getFieldValue('heading', 'Your Compelling Headline Here')}
          </h1>
        </section>

        {/* 2. SUBHEADING */}
        <section className="text-center py-4">
          <p className="text-xl md:text-2xl max-w-3xl mx-auto" style={{ color: themeStyles.textSecondary }}>
            {getFieldValue('subheading', 'Your powerful subheadline that explains the value')}
          </p>
        </section>

        {/* 3. VSL */}
        <section className="py-12 text-center">
          <div className="max-w-4xl mx-auto">
            {funnelData.vsl_url && !isEditor ? (
              funnelData.vsl_type === 'youtube' ? (
                <div className="relative aspect-video rounded-lg overflow-hidden shadow-xl">
                  <iframe
                    src={funnelData.vsl_url}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              ) : (
                <video
                  src={funnelData.vsl_url}
                  controls
                  className="w-full max-w-4xl rounded-lg shadow-xl"
                  style={{ maxHeight: '70vh' }}
                />
              )
            ) : (
              <div className="relative aspect-video rounded-lg overflow-hidden shadow-xl bg-gray-100 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="text-gray-500">VSL Video Player</p>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* 4. CTA 1 */}
        <section className="py-8 text-center">
          {renderCtaButton('ctaText', 'Get Started Now')}
        </section>

        {/* 5. CASE STUDIES */}
        <section className="py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: themeStyles.textPrimary }}>
              {getFieldValue('caseStudiesHeading', 'Success Stories')}
            </h2>
            <p className="text-lg max-w-2xl mx-auto" style={{ color: themeStyles.textSecondary }}>
              {getFieldValue('caseStudiesSubtext', 'See what others have achieved')}
            </p>
          </div>

          {caseStudies && caseStudies.length > 0 ? (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {caseStudies.map((study, index) => (
                <div
                  key={index}
                  className="p-6 rounded-xl shadow-lg"
                  style={{ 
                    backgroundColor: themeStyles.cardBg,
                    border: `1px solid ${themeStyles.borderColor}`
                  }}
                >
                  <div className="text-center mb-4">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold mb-2" style={{ color: themeStyles.textPrimary }}>
                      {study.title}
                    </h3>
                  </div>
                  <p className="text-center mb-4" style={{ color: themeStyles.textSecondary }}>
                    {study.description}
                  </p>
                  <div className="text-center">
                    <div className="text-2xl font-bold" style={{ color: themeStyles.accent }}>
                      {study.result}
                    </div>
                    <div className="text-sm" style={{ color: themeStyles.textSecondary }}>
                      {study.metric}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <p style={{ color: themeStyles.textSecondary }}>
                Case studies will appear here when added
              </p>
            </div>
          )}
        </section>

        {/* 6. CTA 2 */}
        <section className="py-8 text-center">
          {renderCtaButton('ctaText', 'Get Started Now')}
        </section>

        {/* 7. BOOKING SECTION */}
        <section className="py-16 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-6" style={{ color: themeStyles.textPrimary }}>
              {getFieldValue('bookingHeading', 'Book Your Strategy Call')}
            </h2>
            
            {funnelData.calendar_embed_code && !isEditor ? (
              <div 
                className="calendar-embed"
                dangerouslySetInnerHTML={{ __html: funnelData.calendar_embed_code }}
              />
            ) : (
              <div className="bg-gray-100 p-12 rounded-lg">
                <div className="text-gray-500 mb-4">
                  <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <p className="text-gray-600">Calendar booking widget will appear here</p>
              </div>
            )}
          </div>
        </section>

      </div>

      {/* FOOTER */}
      <footer 
        className="py-8 px-6 text-center border-t"
        style={{ 
          borderColor: themeStyles.borderColor,
          backgroundColor: themeStyles.sectionBg 
        }}
      >
        <p 
          className="text-sm"
          style={{ color: themeStyles.textSecondary }}
        >
          © 2024 {funnelData.name || 'Your Business'}. All rights reserved.
        </p>
      </footer>
    </div>
  )
}

// Template registry - add new templates here
export const FUNNEL_TEMPLATES = {
  'trigger-template-1': TriggerTemplate1
}

export const renderFunnelTemplate = (templateId: string, props: FunnelTemplateProps) => {
  const Template = FUNNEL_TEMPLATES[templateId as keyof typeof FUNNEL_TEMPLATES]
  return Template ? <Template {...props} /> : null
} 