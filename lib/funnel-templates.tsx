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

  // Handle field editing
  const handleFieldEdit = (fieldId: string, value: string) => {
    if (renderEditableText) {
      const field = editableFields.find(f => f.id === fieldId)
      if (field) {
        // Update the field value and trigger re-render
        field.value = value
        // In a real implementation, this would update the parent state
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