/**
 * Clean Trigger Template 1
 * Exact structure: Heading -> Subheading -> VSL -> CTA 1 -> Case Studies -> CTA 2 -> Footer
 */

import React from 'react'
import { TemplateProps, getFieldValue, TRIGGER_TEMPLATE_1_FIELDS } from './funnel-template-middleware'
import { generateFunnelStyles, getTextElementStyle } from './funnel-styling-service'

// Helper function to render case study card
const renderCaseStudyCard = (caseStudy: any, index: number, themeStyles: any, funnelStyles: any) => {
  return (
    <div className="text-center">
      {/* Case Study Image */}
      {(caseStudy.mediaUrl || caseStudy.media_url) && (
        <div className="mb-4">
          {(caseStudy.mediaType === 'image' || caseStudy.media_type === 'image') ? (
            <img 
              src={caseStudy.mediaUrl || caseStudy.media_url} 
              alt={caseStudy.name}
              className="w-full h-48 object-cover rounded-lg"
              style={{ border: `1px solid ${themeStyles.borderColor}` }}
            />
          ) : (
            <video 
              src={caseStudy.mediaUrl || caseStudy.media_url}
              className="w-full h-48 object-cover rounded-lg"
              style={{ border: `1px solid ${themeStyles.borderColor}` }}
              controls
            />
          )}
        </div>
      )}
      <h3 
        className="text-xl mb-3"
        style={getTextElementStyle('subheading', funnelStyles, { 
          color: themeStyles.textPrimary,
          fontSize: '1.25rem'
        })}
      >
        {caseStudy.name || `Case Study ${index + 1}`}
      </h3>
      <p 
        className="mb-4"
        style={getTextElementStyle('body', funnelStyles, { color: themeStyles.textSecondary })}
      >
        {caseStudy.description || 'Description not available.'}
      </p>
      <div 
        className="text-lg"
        style={getTextElementStyle('subheading', funnelStyles, { 
          color: themeStyles.accent,
          fontWeight: '700'
        })}
      >
        {caseStudy.result || 'Amazing Result'}
      </div>
    </div>
  )
}

export const TriggerTemplatePage1: React.FC<TemplateProps> = ({
  content,
  customization,
  isEditor = false,
  caseStudies = [],
  vslData,
  onFieldEdit,
  onCtaClick
}) => {
  // Generate funnel styles
  const funnelStyles = customization ? generateFunnelStyles(customization) : {
    colors: { primary: '#3b82f6', secondary: '#1e40af', accent: '#059669', background: '#ffffff', text: '#1e293b' },
    fonts: { heading: '"Inter", sans-serif', subheading: '"Inter", sans-serif', body: '"Inter", sans-serif', cta: '"Inter", sans-serif' },
    theme: 'light' as const,
    spacing: { section: '2rem', text: '1rem' }
  }

  const isDark = customization?.themeMode === 'dark'
  const themeStyles = {
    background: isDark ? '#0f172a' : '#ffffff',
    textPrimary: isDark ? '#f8fafc' : '#1e293b',
    textSecondary: isDark ? '#cbd5e1' : '#475569',
    accent: '#3b82f6',
    ctaGradient: 'linear-gradient(135deg, #3b82f6, #1e40af)',
    sectionBg: isDark ? 'rgba(30, 41, 59, 0.5)' : 'rgba(248, 250, 252, 0.5)',
    cardBg: isDark ? 'rgba(51, 65, 85, 0.8)' : 'rgba(255, 255, 255, 0.9)',
    borderColor: isDark ? 'rgba(148, 163, 184, 0.2)' : 'rgba(148, 163, 184, 0.3)'
  }

  const EditableText: React.FC<{
    fieldId: string
    children: React.ReactNode
    className?: string
    style?: React.CSSProperties
  }> = ({ fieldId, children, className, style }) => {
    if (isEditor && onFieldEdit) {
      return (
        <div
          className={`${className} cursor-pointer hover:bg-blue-50 hover:outline hover:outline-2 hover:outline-blue-300 rounded p-1 transition-all`}
          style={style}
          onClick={() => {
            const newValue = prompt(`Edit ${fieldId}:`, getFieldValue(fieldId, content, TRIGGER_TEMPLATE_1_FIELDS))
            if (newValue !== null) onFieldEdit(fieldId, newValue)
          }}
        >
          {children}
        </div>
      )
    }
    return <div className={className} style={style}>{children}</div>
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: themeStyles.background }}>
      {/* HEADER WITH LOGO */}
      <header className="py-6 px-6 border-b" style={{ borderColor: themeStyles.borderColor }}>
        <div className="container mx-auto max-w-4xl">
          <div className="flex justify-center">
            {customization?.logoUrl ? (
              <img 
                src={customization.logoUrl} 
                alt="Logo" 
                className="h-12 object-contain"
              />
            ) : (
              <div className="h-12 flex items-center">
                <span className="text-2xl font-bold" style={{ color: themeStyles.textPrimary }}>
                  {customization?.companyName || 'Your Business'}
                </span>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 max-w-4xl">
        
        {/* 1. HEADING */}
        <section className="text-center py-12">
          <EditableText
            fieldId="heading"
            className="text-4xl md:text-5xl lg:text-6xl leading-tight mb-6"
            style={getTextElementStyle('heading', funnelStyles)}
          >
            {getFieldValue('heading', content, TRIGGER_TEMPLATE_1_FIELDS)}
          </EditableText>
        </section>

        {/* 2. SUBHEADING */}
        <section className="text-center py-4">
          <EditableText
            fieldId="subheading"
            className="text-xl md:text-2xl max-w-3xl mx-auto"
            style={getTextElementStyle('subheading', funnelStyles, { color: themeStyles.textSecondary })}
          >
            {getFieldValue('subheading', content, TRIGGER_TEMPLATE_1_FIELDS)}
          </EditableText>
        </section>

        {/* 3. VSL */}
        <section className="py-12 text-center">
          <div className="max-w-4xl mx-auto">
            {vslData?.url ? (
              vslData.type === 'youtube' ? (
                <div className="relative aspect-video rounded-lg overflow-hidden shadow-xl">
                  <iframe
                    src={vslData.url}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              ) : (
                <video
                  src={vslData.url}
                  controls
                  className="w-full max-w-4xl rounded-lg shadow-xl"
                  style={{ maxHeight: '70vh' }}
                />
              )
            ) : (
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
            )}
          </div>
        </section>

        {/* 4. CTA 1 */}
        <section className="py-8 text-center">
          {isEditor ? (
            <EditableText
              fieldId="ctaText"
              className="px-12 py-4 text-lg rounded-lg shadow-lg transition-all duration-200 text-white inline-block"
              style={{ 
                background: themeStyles.ctaGradient,
                border: 'none',
                ...getTextElementStyle('cta', funnelStyles, { color: '#ffffff' })
              }}
            >
              {getFieldValue('ctaText', content, TRIGGER_TEMPLATE_1_FIELDS)}
            </EditableText>
          ) : (
            <button
              onClick={onCtaClick}
              className="px-12 py-4 text-lg rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 text-white"
              style={{ 
                background: themeStyles.ctaGradient,
                border: 'none',
                ...getTextElementStyle('cta', funnelStyles, { color: '#ffffff' })
              }}
            >
              {getFieldValue('ctaText', content, TRIGGER_TEMPLATE_1_FIELDS)}
            </button>
          )}
        </section>

        {/* 5. CASE STUDIES */}
        <section className="py-16">
          <div className="text-center mb-12">
            <EditableText
              fieldId="caseStudiesHeading"
              className="text-3xl md:text-4xl mb-4"
              style={getTextElementStyle('heading', funnelStyles, { 
                color: themeStyles.textPrimary,
                fontSize: '2.25rem'
              })}
            >
              {getFieldValue('caseStudiesHeading', content, TRIGGER_TEMPLATE_1_FIELDS)}
            </EditableText>
            <EditableText
              fieldId="caseStudiesSubtext"
              className="text-lg"
              style={getTextElementStyle('body', funnelStyles, { color: themeStyles.textSecondary })}
            >
              {getFieldValue('caseStudiesSubtext', content, TRIGGER_TEMPLATE_1_FIELDS)}
            </EditableText>
          </div>
          
          {/* Case Studies Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {caseStudies.length > 0 ? caseStudies.map((caseStudy, index) => (
              <div 
                key={index}
                className="p-6 rounded-lg shadow-lg"
                style={{ backgroundColor: themeStyles.cardBg }}
              >
                {renderCaseStudyCard(caseStudy, index, themeStyles, funnelStyles)}
              </div>
            )) : (
              <div className="text-center py-8 col-span-full">
                <p 
                  className="text-lg"
                  style={getTextElementStyle('body', funnelStyles, { color: themeStyles.textSecondary })}
                >
                  {isEditor ? 'Case studies will appear here when added' : 'No case studies added yet.'}
                </p>
              </div>
            )}
          </div>
        </section>

        {/* 6. CTA 2 */}
        <section className="py-8 text-center">
          {isEditor ? (
            <EditableText
              fieldId="ctaText"
              className="px-12 py-4 text-lg rounded-lg shadow-lg transition-all duration-200 text-white inline-block"
              style={{ 
                background: themeStyles.ctaGradient,
                border: 'none',
                ...getTextElementStyle('cta', funnelStyles, { color: '#ffffff' })
              }}
            >
              {getFieldValue('ctaText', content, TRIGGER_TEMPLATE_1_FIELDS)}
            </EditableText>
          ) : (
            <button
              onClick={onCtaClick}
              className="px-12 py-4 text-lg rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 text-white"
              style={{ 
                background: themeStyles.ctaGradient,
                border: 'none',
                ...getTextElementStyle('cta', funnelStyles, { color: '#ffffff' })
              }}
            >
              {getFieldValue('ctaText', content, TRIGGER_TEMPLATE_1_FIELDS)}
            </button>
          )}
        </section>

      </div>

      {/* 7. FOOTER */}
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
          © 2024 Electrical Business. All rights reserved.
        </p>
      </footer>
    </div>
  )
}

export const TriggerTemplatePage2: React.FC<TemplateProps> = ({
  content,
  customization,
  isEditor = false,
  caseStudies = [],
  onFieldEdit
}) => {
  // Generate funnel styles
  const funnelStyles = customization ? generateFunnelStyles(customization) : {
    colors: { primary: '#3b82f6', secondary: '#1e40af', accent: '#059669', background: '#ffffff', text: '#1e293b' },
    fonts: { heading: '"Inter", sans-serif', subheading: '"Inter", sans-serif', body: '"Inter", sans-serif', cta: '"Inter", sans-serif' },
    theme: 'light' as const,
    spacing: { section: '2rem', text: '1rem' }
  }

  const isDark = customization?.themeMode === 'dark'
  const themeStyles = {
    background: isDark ? '#0f172a' : '#ffffff',
    textPrimary: isDark ? '#f8fafc' : '#1e293b',
    textSecondary: isDark ? '#cbd5e1' : '#475569',
    accent: '#3b82f6',
    sectionBg: isDark ? 'rgba(30, 41, 59, 0.5)' : 'rgba(248, 250, 252, 0.5)',
    cardBg: isDark ? 'rgba(51, 65, 85, 0.8)' : 'rgba(255, 255, 255, 0.9)',
    borderColor: isDark ? 'rgba(148, 163, 184, 0.2)' : 'rgba(148, 163, 184, 0.3)'
  }

  const EditableText: React.FC<{
    fieldId: string
    children: React.ReactNode
    className?: string
    style?: React.CSSProperties
  }> = ({ fieldId, children, className, style }) => {
    if (isEditor && onFieldEdit) {
      return (
        <div
          className={`${className} cursor-pointer hover:bg-blue-50 hover:outline hover:outline-2 hover:outline-blue-300 rounded p-1 transition-all`}
          style={style}
          onClick={() => {
            const newValue = prompt(`Edit ${fieldId}:`, getFieldValue(fieldId, content, TRIGGER_TEMPLATE_1_FIELDS))
            if (newValue !== null) onFieldEdit(fieldId, newValue)
          }}
        >
          {children}
        </div>
      )
    }
    return <div className={className} style={style}>{children}</div>
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: themeStyles.background }}>
      {/* HEADER WITH LOGO */}
      <header className="py-6 px-6 border-b" style={{ borderColor: themeStyles.borderColor }}>
        <div className="container mx-auto max-w-4xl">
          <div className="flex justify-center">
            {customization?.logoUrl ? (
              <img 
                src={customization.logoUrl} 
                alt="Logo" 
                className="h-12 object-contain"
              />
            ) : (
              <div className="h-12 flex items-center">
                <span className="text-2xl font-bold" style={{ color: themeStyles.textPrimary }}>
                  {customization?.companyName || 'Your Business'}
                </span>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 max-w-4xl">
        
        {/* 1. HEADING 2 */}
        <section className="text-center py-12">
          <EditableText
            fieldId="bookingHeading"
            className="text-4xl md:text-5xl lg:text-6xl leading-tight mb-6"
            style={getTextElementStyle('heading', funnelStyles)}
          >
            {getFieldValue('bookingHeading', content, TRIGGER_TEMPLATE_1_FIELDS)}
          </EditableText>
        </section>

        {/* 2. BOOKING CALENDAR EMBED */}
        <section className="py-12">
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-lg shadow-lg p-8 min-h-[600px] flex items-center justify-center">
              <p className="text-gray-500 text-center">
                Calendar booking widget will be embedded here
              </p>
            </div>
          </div>
        </section>

        {/* 3. CASE STUDIES */}
        <section className="py-16">
          <div className="text-center mb-12">
            <EditableText
              fieldId="caseStudiesHeading"
              className="text-3xl md:text-4xl mb-4"
              style={getTextElementStyle('heading', funnelStyles, { 
                color: themeStyles.textPrimary,
                fontSize: '2.25rem'
              })}
            >
              {getFieldValue('caseStudiesHeading', content, TRIGGER_TEMPLATE_1_FIELDS)}
            </EditableText>
            <EditableText
              fieldId="caseStudiesSubtext"
              className="text-lg"
              style={getTextElementStyle('body', funnelStyles, { color: themeStyles.textSecondary })}
            >
              {getFieldValue('caseStudiesSubtext', content, TRIGGER_TEMPLATE_1_FIELDS)}
            </EditableText>
          </div>
          
          {/* Case Studies Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {caseStudies.length > 0 ? caseStudies.map((caseStudy, index) => (
              <div 
                key={index}
                className="p-6 rounded-lg shadow-lg"
                style={{ backgroundColor: themeStyles.cardBg }}
              >
                {renderCaseStudyCard(caseStudy, index, themeStyles, funnelStyles)}
              </div>
            )) : (
              <div className="text-center py-8 col-span-full">
                <p 
                  className="text-lg"
                  style={getTextElementStyle('body', funnelStyles, { color: themeStyles.textSecondary })}
                >
                  No case studies added yet.
                </p>
              </div>
            )}
          </div>
        </section>

      </div>

      {/* 4. FOOTER */}
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
          © 2024 Electrical Business. All rights reserved.
        </p>
      </footer>
    </div>
  )
} 