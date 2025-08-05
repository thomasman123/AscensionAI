/**
 * Funnel Styling Service
 * Converts user customization settings into actual CSS styling for funnel templates
 */

export interface FontGroup {
  name: string
  description: string
  fonts: string[]
  primary: string
  cssMapping: {
    heading: string      // For h1, main headlines
    subheading: string   // For h2, subheadings
    body: string         // For paragraphs, descriptions
    cta: string         // For buttons, CTAs
  }
}

export interface FunnelStyles {
  colors: {
    primary: string
    secondary: string
    accent: string
    background: string
    text: string
  }
  fonts: {
    heading: string
    subheading: string
    body: string
    cta: string
  }
  theme: 'light' | 'dark'
  spacing: {
    section: string
    text: string
  }
}

// Define font groups with CSS font families
export const FONT_GROUPS: Record<string, FontGroup> = {
  professional: {
    name: 'Professional',
    description: 'Clean, readable fonts for business',
    fonts: ['Inter', 'Roboto', 'Open Sans'],
    primary: 'Inter',
    cssMapping: {
      heading: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      subheading: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      body: '"Open Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      cta: '"Roboto", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
    }
  },
  classic: {
    name: 'Classic',
    description: 'Traditional, elegant typography',
    fonts: ['Georgia', 'Times New Roman', 'Playfair Display'],
    primary: 'Georgia',
    cssMapping: {
      heading: '"Playfair Display", Georgia, "Times New Roman", serif',
      subheading: 'Georgia, "Times New Roman", serif',
      body: 'Georgia, "Times New Roman", serif',
      cta: '"Playfair Display", Georgia, serif'
    }
  },
  modern: {
    name: 'Modern',
    description: 'Contemporary, stylish fonts',
    fonts: ['Poppins', 'Montserrat', 'Nunito Sans'],
    primary: 'Poppins',
    cssMapping: {
      heading: '"Poppins", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      subheading: '"Montserrat", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      body: '"Nunito Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      cta: '"Poppins", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
    }
  }
}

// Generate CSS styles for different text elements
export function generateFunnelStyles(customization: any): FunnelStyles {
  const fontGroup = FONT_GROUPS[customization.fontGroup || 'professional']
  const isDark = customization.themeMode === 'dark'

  return {
    colors: {
      primary: '#3b82f6',
      secondary: '#1e40af', 
      accent: '#059669',
      background: isDark ? '#0f172a' : '#ffffff',
      text: isDark ? '#f8fafc' : '#1e293b'
    },
    fonts: {
      heading: fontGroup.cssMapping.heading,
      subheading: fontGroup.cssMapping.subheading,
      body: fontGroup.cssMapping.body,
      cta: fontGroup.cssMapping.cta
    },
    theme: isDark ? 'dark' : 'light',
    spacing: {
      section: '2rem',
      text: '1rem'
    }
  }
}

// Generate inline styles for specific text element types
export function getTextElementStyle(
  elementType: 'heading' | 'subheading' | 'body' | 'cta',
  funnelStyles: FunnelStyles,
  additionalStyles?: React.CSSProperties
): React.CSSProperties {
  const baseStyles: React.CSSProperties = {
    fontFamily: funnelStyles.fonts[elementType],
    color: elementType === 'heading' ? funnelStyles.colors.text : 
           elementType === 'subheading' ? funnelStyles.colors.text : 
           elementType === 'cta' ? '#ffffff' :
           funnelStyles.colors.text
  }

  // Add element-specific styling
  const elementSpecificStyles: React.CSSProperties = {}
  
  switch (elementType) {
    case 'heading':
      elementSpecificStyles.fontWeight = '700'
      elementSpecificStyles.lineHeight = '1.2'
      break
    case 'subheading':
      elementSpecificStyles.fontWeight = '600'
      elementSpecificStyles.lineHeight = '1.4'
      break
    case 'body':
      elementSpecificStyles.fontWeight = '400'
      elementSpecificStyles.lineHeight = '1.6'
      break
    case 'cta':
      elementSpecificStyles.fontWeight = '600'
      elementSpecificStyles.lineHeight = '1.2'
      break
  }

  return {
    ...baseStyles,
    ...elementSpecificStyles,
    ...additionalStyles
  }
}

// Generate theme-specific styling (for backwards compatibility)
export function getThemeStyles(theme: string, isDark: boolean = false) {
  const baseColors = {
    background: isDark ? '#0f172a' : '#ffffff',
    headerBg: isDark ? 'rgba(15, 23, 42, 0.9)' : 'rgba(255, 255, 255, 0.95)',
    textPrimary: isDark ? '#f8fafc' : '#1e293b',
    textSecondary: isDark ? '#cbd5e1' : '#475569',
    accent: '#3b82f6',
    ctaGradient: 'linear-gradient(135deg, #3b82f6, #1e40af)',
    sectionBg: isDark ? 'rgba(30, 41, 59, 0.5)' : 'rgba(248, 250, 252, 0.5)',
    cardBg: isDark ? 'rgba(51, 65, 85, 0.8)' : 'rgba(255, 255, 255, 0.9)',
    borderColor: isDark ? 'rgba(148, 163, 184, 0.2)' : 'rgba(148, 163, 184, 0.3)'
  }

  return baseColors
}

// Get Google Fonts import URL for the selected font group
export function getGoogleFontsUrl(fontGroup: string): string {
  const group = FONT_GROUPS[fontGroup] || FONT_GROUPS.professional
  
  const fontUrls = {
    professional: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Open+Sans:wght@400;500;600&family=Roboto:wght@400;500;600;700&display=swap',
    classic: 'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=Georgia:wght@400;500;600;700&display=swap',
    modern: 'https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&family=Montserrat:wght@400;500;600;700&family=Nunito+Sans:wght@400;500;600;700&display=swap'
  }
  
  return fontUrls[fontGroup as keyof typeof fontUrls] || fontUrls.professional
} 