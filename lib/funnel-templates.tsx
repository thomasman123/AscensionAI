import React from 'react'
import { generateFunnelStyles, getTextElementStyle, FunnelStyles } from './funnel-styling-service'

export interface FunnelTemplateProps {
  funnelData: any
  themeStyles: any
  isEditor?: boolean
  renderEditableText?: (field: any) => React.ReactNode
  editableFields?: any[]
  caseStudies?: any[]
  goToNextPage?: () => void
  customization?: any // User's customization settings
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
  
  // Generate funnel styles from customization
  const funnelStyles: FunnelStyles = customization 
    ? generateFunnelStyles(customization)
    : {
        colors: { primary: '#3b82f6', secondary: '#1e40af', accent: '#059669', background: '#ffffff', text: '#1e293b' },
        fonts: { 
          heading: '"Inter", sans-serif', 
          subheading: '"Inter", sans-serif', 
          body: '"Inter", sans-serif', 
          cta: '"Inter", sans-serif' 
        },
        theme: 'light',
        spacing: { section: '2rem', text: '1rem' }
      }
  
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
    <>
      <div className="container mx-auto px-6 max-w-4xl">
        
        {/* 2. Headline (centered) */}
        <section className="text-center py-8">
          <h1 
            className="text-4xl md:text-5xl lg:text-6xl leading-tight mb-6"
            style={getTextElementStyle('heading', funnelStyles)}
          >
            {getFieldValue('headline', 'Your Compelling Headline Here')}
          </h1>
        </section>

        {/* 3. Sub heading (centered) */}
        <section className="text-center py-4">
          <p 
            className="text-xl md:text-2xl max-w-3xl mx-auto"
            style={getTextElementStyle('subheading', funnelStyles, { color: themeStyles.textSecondary })}
          >
            {getFieldValue('subheadline', 'Your powerful subheadline that explains the value')}
          </p>
        </section>

        {/* 3.5. Hero Text (centered) */}
        <section className="text-center py-6">
          <div className="max-w-4xl mx-auto">
            <p 
              className="text-lg md:text-xl leading-relaxed"
              style={getTextElementStyle('body', funnelStyles, { color: themeStyles.textSecondary })}
            >
              {getFieldValue('heroText', 'Stop trading hours for dollars and start building a profitable business that runs like a well-oiled machine... even when you\'re not on the tools')}
            </p>
          </div>
        </section>

        {/* 4. VSL (centered) */}
        {(funnelData.vsl_url || isEditor) && (
          <section className="py-12 text-center">
            <div className="max-w-4xl mx-auto">
              {funnelData.vsl_url && !isEditor ? (
                // Live VSL
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
                // Editor VSL placeholder
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
              {funnelData.vsl_title && (
                <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
                  {funnelData.vsl_title}
                </p>
              )}
            </div>
          </section>
        )}

        {/* 4.5. Offer Description */}
        <section className="py-8 text-center">
          <div className="max-w-3xl mx-auto">
            <p 
              className="text-lg leading-relaxed"
              style={getTextElementStyle('body', funnelStyles, { color: themeStyles.textSecondary })}
            >
              {getFieldValue('offerDescription', 'Discover the proven strategies that successful electrical business owners use to scale their operations and increase profitability.')}
            </p>
          </div>
        </section>

        {/* 5. CTA Button (centered) */}
        <section className="py-8 text-center">
          {isEditor ? (
            <div
              className="px-12 py-4 text-lg rounded-lg shadow-lg transition-all duration-200 text-white inline-block"
              style={{ 
                background: themeStyles.ctaGradient,
                border: 'none',
                ...getTextElementStyle('cta', funnelStyles, { color: '#ffffff' })
              }}
            >
              {getFieldValue('ctaText', 'Get Started Now')}
            </div>
          ) : (
            <button
              onClick={goToNextPage}
              className="px-12 py-4 text-lg rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 text-white"
              style={{ 
                background: themeStyles.ctaGradient,
                border: 'none',
                ...getTextElementStyle('cta', funnelStyles, { color: '#ffffff' })
              }}
            >
              {getFieldValue('ctaText', 'Get Started Now')}
            </button>
          )}
        </section>

        {/* 6. Case Studies */}
        <section className="py-16">
          <div className="text-center mb-12">
            <h2 
              className="text-3xl md:text-4xl mb-4"
              style={getTextElementStyle('heading', funnelStyles, { 
                color: themeStyles.textPrimary,
                fontSize: '2.25rem' // Override to slightly smaller than main heading
              })}
            >
              Success Stories
            </h2>
            <p 
              className="text-lg"
              style={getTextElementStyle('body', funnelStyles, { color: themeStyles.textSecondary })}
            >
              See what others have achieved
            </p>
          </div>
          
          {/* Case Studies Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {caseStudies.length > 0 ? caseStudies.map((caseStudy, index) => (
              <div 
                key={index}
                className="p-6 rounded-lg shadow-lg"
                style={{ backgroundColor: themeStyles.cardBg }}
              >
                <div className="text-center">
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
              </div>
            )) : (
              <div className="text-center py-8 col-span-full">
                <p 
                  className="text-lg"
                  style={{ color: themeStyles.textSecondary }}
                >
                  {isEditor ? 'Case studies will appear here when added' : 'No case studies added yet.'}
                </p>
              </div>
            )}
          </div>
        </section>

        {/* 6.5. Guarantee Text */}
        <section className="py-8 text-center">
          <div className="max-w-3xl mx-auto">
            <div 
              className="p-6 rounded-lg border-2 border-dashed"
              style={{ 
                borderColor: themeStyles.accent + '40',
                backgroundColor: themeStyles.sectionBg 
              }}
            >
              <p 
                className="text-lg font-medium"
                style={getTextElementStyle('body', funnelStyles, { 
                  color: themeStyles.textPrimary,
                  fontWeight: '600'
                })}
              >
                {getFieldValue('guaranteeText', '100% Satisfaction Guarantee - If you\'re not completely satisfied with the results, we\'ll work with you until you are or provide a full refund.')}
              </p>
            </div>
          </div>
        </section>

        {/* 7. CTA Button (centered) */}
        <section className="py-8 text-center">
          {isEditor ? (
            <div
              className="px-12 py-4 text-lg font-semibold rounded-lg shadow-lg transition-all duration-200 text-white inline-block"
              style={{ 
                background: themeStyles.ctaGradient,
                border: 'none'
              }}
            >
              {getFieldValue('ctaText', 'Get Started Now')}
            </div>
          ) : (
            <button
              onClick={goToNextPage}
              className="px-12 py-4 text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 text-white"
              style={{ 
                background: themeStyles.ctaGradient,
                border: 'none'
              }}
            >
              {getFieldValue('ctaText', 'Get Started Now')}
            </button>
          )}
        </section>
      </div>

      {/* 8. Footer */}
      <footer 
        className="py-8 px-6 text-center border-t"
        style={{ 
          backgroundColor: themeStyles.sectionBg,
          borderColor: themeStyles.borderColor
        }}
      >
        <div className="container mx-auto">
          <p 
            className="text-sm"
            style={{ color: themeStyles.textSecondary }}
          >
            © 2024 {funnelData.name || 'Your Business'}. All rights reserved.
          </p>
        </div>
      </footer>
    </>
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