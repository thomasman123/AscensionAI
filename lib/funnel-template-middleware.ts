/**
 * Funnel Template Middleware
 * Clean system for managing funnel templates and editable content
 */

import React from 'react'

// Define what fields can be edited in templates
export interface TemplateField {
  id: string
  type: 'text' | 'textarea' | 'heading'
  label: string
  placeholder: string
  section: string // Which template section this belongs to
}

// Define template structure for Trigger Template 1
export const TRIGGER_TEMPLATE_1_FIELDS: TemplateField[] = [
  {
    id: 'heading',
    type: 'heading',
    label: 'Main Heading',
    placeholder: 'Your Compelling Headline Here',
    section: 'hero'
  },
  {
    id: 'subheading',
    type: 'text',
    label: 'Subheading',
    placeholder: 'Your powerful subheadline that explains the value',
    section: 'hero'
  },
  {
    id: 'ctaText',
    type: 'text',
    label: 'CTA Button Text',
    placeholder: 'Get Started Now',
    section: 'cta'
  },
  {
    id: 'caseStudiesHeading',
    type: 'text',
    label: 'Case Studies Heading',
    placeholder: 'Success Stories',
    section: 'case-studies'
  },
  {
    id: 'caseStudiesSubtext',
    type: 'text',
    label: 'Case Studies Subtext',
    placeholder: 'See what others have achieved',
    section: 'case-studies'
  },
  {
    id: 'bookingHeading',
    type: 'heading',
    label: 'Booking Page Heading',
    placeholder: 'Book Your Strategy Call',
    section: 'booking'
  }
]

// Template content structure
export interface TemplateContent {
  [key: string]: string
}

// Get field value with fallback
export function getFieldValue(
  fieldId: string, 
  content: TemplateContent, 
  fields: TemplateField[]
): string {
  const field = fields.find(f => f.id === fieldId)
  return content[fieldId] || field?.placeholder || ''
}

// Generate default content for a template
export function getDefaultContent(fields: TemplateField[]): TemplateContent {
  const content: TemplateContent = {}
  fields.forEach(field => {
    content[field.id] = field.placeholder
  })
  return content
}

// Template component props
export interface TemplateProps {
  content: TemplateContent
  customization?: any
  funnelData?: any
  isEditor?: boolean
  caseStudies?: any[]
  vslData?: {
    url?: string
    title?: string
    type?: 'video' | 'youtube' | 'none'
  }
  onFieldEdit?: (fieldId: string, value: string) => void
  onCtaClick?: () => void
  textSizes?: {
    desktop?: {
      [key: string]: number
    }
    mobile?: {
      [key: string]: number
    }
  }
  onTextSizeChange?: (fieldId: string, size: number) => void
  currentView?: 'desktop' | 'mobile'
  logoSize?: {
    desktop: number
    mobile: number
  }
  onLogoSizeChange?: (size: number) => void
} 