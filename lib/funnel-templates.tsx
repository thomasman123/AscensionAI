import React from 'react'
import { TriggerTemplatePage1, TriggerTemplatePage2 } from './clean-trigger-template'

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
  // Use the clean template implementation
  if (currentPage === 2) {
    return <TriggerTemplatePage2
      content={funnelData}
      customization={customization}
      funnelData={funnelData}
      isEditor={isEditor}
      caseStudies={caseStudies}
      onFieldEdit={(fieldId, value) => {
        if (isEditor && renderEditableText) {
          const field = editableFields.find((f: any) => f.id === fieldId)
          if (field) {
            field.value = value
          }
        }
      }}
    />
  }
  
  return <TriggerTemplatePage1
    content={funnelData}
    customization={customization}
    funnelData={funnelData}
    isEditor={isEditor}
    caseStudies={caseStudies}
    vslData={{
      url: funnelData.vsl_url,
      type: funnelData.vsl_type
    }}
    onFieldEdit={(fieldId, value) => {
      if (isEditor && renderEditableText) {
        const field = editableFields.find((f: any) => f.id === fieldId)
        if (field) {
          field.value = value
        }
      }
    }}
    onCtaClick={goToNextPage}
  />
}

// Template registry - add new templates here
export const FUNNEL_TEMPLATES = {
  'trigger-template-1': TriggerTemplate1
}

export const renderFunnelTemplate = (templateId: string, props: FunnelTemplateProps) => {
  const Template = FUNNEL_TEMPLATES[templateId as keyof typeof FUNNEL_TEMPLATES]
  return Template ? <Template {...props} /> : null
} 