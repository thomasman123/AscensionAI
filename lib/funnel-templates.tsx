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
  customization,
  currentPage = 1
}: FunnelTemplateProps) => {
  
  // Convert funnelData to clean content structure
  const content: TemplateContent = {
    heading: funnelData.headline || 'Your Compelling Headline Here',
    subheading: funnelData.subheadline || 'Your powerful subheadline that explains the value',
    ctaText: funnelData.cta_text || 'Get Started Now',
    caseStudiesHeading: funnelData.case_studies_heading || 'Success Stories',
    caseStudiesSubtext: funnelData.case_studies_subtext || 'See what others have achieved',
    bookingHeading: funnelData.booking_heading || 'Book Your Strategy Call'
  }

  // VSL data
  const vslData = {
    url: funnelData.vsl_url,
    title: funnelData.vsl_title,
    type: funnelData.vsl_type || 'none'
  }

  // Handle field editing - use the parent's renderEditableText if available
  const handleFieldEdit = (fieldId: string, value: string) => {
    if (renderEditableText) {
      const field = editableFields.find(f => f.id === fieldId)
      if (field) {
        // Update the field value directly in the parent's field array
        field.value = value
        console.log(`Updated ${fieldId} to: ${value}`)
      }
    }
  }

  // Render the appropriate page
  if (currentPage === 2) {
    return (
      <TriggerTemplatePage2
        content={content}
        customization={customization}
        isEditor={isEditor}
        caseStudies={caseStudies}
        onFieldEdit={handleFieldEdit}
      />
    )
  }

  // If we're in editor mode, we should use the parent's renderEditableText system
  // instead of the clean template's built-in editing
  if (isEditor && renderEditableText) {
    // Return a simplified version that integrates with the parent's editing system
    return (
      <div className="min-h-screen" style={{ backgroundColor: customization?.themeMode === 'dark' ? '#0f172a' : '#ffffff' }}>
        <div className="container mx-auto px-6 max-w-4xl">
          
          {/* 1. HEADING */}
          <section className="text-center py-12">
            {renderEditableText(editableFields.find(f => f.id === 'heading') || editableFields[0])}
          </section>

          {/* 2. SUBHEADING */}
          <section className="text-center py-4">
            {renderEditableText(editableFields.find(f => f.id === 'subheading') || editableFields[1])}
          </section>

          {/* 3. VSL */}
          <section className="py-12 text-center">
            <div className="max-w-4xl mx-auto">
              <div className="relative aspect-video rounded-lg overflow-hidden shadow-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-gray-500 dark:text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="text-gray-500 dark:text-gray-400">VSL Video Player</p>
                </div>
              </div>
            </div>
          </section>

          {/* 4. CTA 1 */}
          <section className="py-8 text-center">
            <div className="px-12 py-4 text-lg rounded-lg shadow-lg transition-all duration-200 text-white inline-block bg-gradient-to-r from-blue-500 to-blue-600">
              {renderEditableText(editableFields.find(f => f.id === 'ctaText') || editableFields[2])}
            </div>
          </section>

          {/* 5. CASE STUDIES */}
          <section className="py-16">
            <div className="text-center mb-12">
              <div className="text-3xl md:text-4xl mb-4">
                {renderEditableText(editableFields.find(f => f.id === 'caseStudiesHeading') || editableFields[3])}
              </div>
              <div className="text-lg">
                {renderEditableText(editableFields.find(f => f.id === 'caseStudiesSubtext') || editableFields[4])}
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="text-center py-8 col-span-full">
                <p className="text-lg text-gray-500">
                  Case studies will appear here when added
                </p>
              </div>
            </div>
          </section>

          {/* 6. CTA 2 */}
          <section className="py-8 text-center">
            <div className="px-12 py-4 text-lg rounded-lg shadow-lg transition-all duration-200 text-white inline-block bg-gradient-to-r from-blue-500 to-blue-600">
              {renderEditableText(editableFields.find(f => f.id === 'ctaText') || editableFields[2])}
            </div>
          </section>

        </div>

        {/* 7. FOOTER */}
        <footer className="py-8 px-6 text-center border-t bg-gray-50">
          <p className="text-sm text-gray-500">
            © 2024 Electrical Business. All rights reserved.
          </p>
        </footer>
      </div>
    )
  }

  return (
    <TriggerTemplatePage1
      content={content}
      customization={customization}
      isEditor={isEditor}
      caseStudies={caseStudies}
      vslData={vslData}
      onFieldEdit={handleFieldEdit}
      onCtaClick={goToNextPage}
    />
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