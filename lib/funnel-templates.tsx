import React from 'react'
import { TriggerTemplatePage1, TriggerTemplatePage2 } from './clean-trigger-template'
import { TRIGGER_TEMPLATE_1_FIELDS, TemplateContent } from './funnel-template-middleware'

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
    return funnelData[fieldId] || fallback
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
          {isEditor ? (
            <div className="px-12 py-4 text-lg font-semibold rounded-lg shadow-lg text-white inline-block" style={{ background: themeStyles.ctaGradient }}>
              {getFieldValue('ctaText', 'Get Started Now')}
            </div>
          ) : (
            <button
              onClick={goToNextPage}
              className="px-12 py-4 text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 text-white"
              style={{ background: themeStyles.ctaGradient }}
            >
              {getFieldValue('ctaText', 'Get Started Now')}
            </button>
          )}
        </section>

        {/* 5. CASE STUDIES */}
        <section className="py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: themeStyles.textPrimary }}>
              {getFieldValue('caseStudiesHeading', 'Success Stories')}
            </h2>
            <p className="text-lg" style={{ color: themeStyles.textSecondary }}>
              {getFieldValue('caseStudiesSubtext', 'See what others have achieved')}
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {caseStudies.length > 0 ? caseStudies.map((caseStudy, index) => (
              <div 
                key={index}
                className="p-6 rounded-lg shadow-lg"
                style={{ backgroundColor: themeStyles.cardBg }}
              >
                <div className="text-center">
                  <h3 className="text-xl font-semibold mb-3" style={{ color: themeStyles.textPrimary }}>
                    {caseStudy.name || `Case Study ${index + 1}`}
                  </h3>
                  <p className="mb-4" style={{ color: themeStyles.textSecondary }}>
                    {caseStudy.description || 'Description not available.'}
                  </p>
                  <div className="text-lg font-bold" style={{ color: themeStyles.accent }}>
                    {caseStudy.result || 'Amazing Result'}
                  </div>
                </div>
              </div>
            )) : (
              <div className="text-center py-8 col-span-full">
                <p className="text-lg" style={{ color: themeStyles.textSecondary }}>
                  {isEditor ? 'Case studies will appear here when added' : 'No case studies added yet.'}
                </p>
              </div>
            )}
          </div>
        </section>

        {/* 6. CTA 2 */}
        <section className="py-8 text-center">
          {isEditor ? (
            <div className="px-12 py-4 text-lg font-semibold rounded-lg shadow-lg text-white inline-block" style={{ background: themeStyles.ctaGradient }}>
              {getFieldValue('ctaText', 'Get Started Now')}
            </div>
          ) : (
            <button
              onClick={goToNextPage}
              className="px-12 py-4 text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 text-white"
              style={{ background: themeStyles.ctaGradient }}
            >
              {getFieldValue('ctaText', 'Get Started Now')}
            </button>
          )}
        </section>

      </div>

      {/* 7. FOOTER */}
      <footer className="py-8 px-6 text-center border-t" style={{ backgroundColor: themeStyles.sectionBg, borderColor: themeStyles.borderColor }}>
        <p className="text-sm" style={{ color: themeStyles.textSecondary }}>
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