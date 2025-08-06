import { Theme, ThemeConfig, ThemeOverrides, ThemeCSSVariables } from './theme-types';

/**
 * Generates CSS variables from a theme configuration
 * This allows themes to be applied without modifying template code
 */
export function generateThemeCSS(theme: Theme, overrides?: ThemeOverrides): string {
  const config = mergeThemeOverrides(theme.config, overrides);
  const cssVars = themeToCSSVariables(config);
  
  return `
    /* Theme: ${theme.name} */
    [data-theme="${theme.id}"] {
      ${Object.entries(cssVars)
        .map(([key, value]) => `${key}: ${value};`)
        .join('\n      ')}
    }
    
    /* Apply background to theme wrapper */
    [data-theme="${theme.id}"] {
      background: var(--theme-bg-main);
      min-height: 100vh;
      position: relative;
    }
    
    /* Glass morphism cards within theme */
    [data-theme="${theme.id}"] .glass-card {
      background: var(--theme-bg-alt);
      backdrop-filter: blur(var(--theme-effect-blur));
      -webkit-backdrop-filter: blur(var(--theme-effect-blur));
      border: var(--theme-border-width) solid var(--theme-border);
    }
    
    /* Theme overlay backgrounds */
    [data-theme="${theme.id}"] .theme-overlay {
      background: var(--theme-bg-overlay);
      backdrop-filter: blur(calc(var(--theme-effect-blur) / 2));
      -webkit-backdrop-filter: blur(calc(var(--theme-effect-blur) / 2));
    }
    
    /* Apply theme fonts */
    [data-theme="${theme.id}"] h1,
    [data-theme="${theme.id}"] h2,
    [data-theme="${theme.id}"] h3,
    [data-theme="${theme.id}"] h4,
    [data-theme="${theme.id}"] h5,
    [data-theme="${theme.id}"] h6 {
      font-family: var(--theme-font-heading);
      color: var(--theme-text-primary);
    }
    
    [data-theme="${theme.id}"] body,
    [data-theme="${theme.id}"] p,
    [data-theme="${theme.id}"] div {
      font-family: var(--theme-font-body);
      color: var(--theme-text-primary);
    }
    
    [data-theme="${theme.id}"] code,
    [data-theme="${theme.id}"] pre,
    [data-theme="${theme.id}"] .accent-font {
      font-family: var(--theme-font-accent);
    }
    
    /* Responsive adjustments */
    @media (max-width: 768px) {
      [data-theme="${theme.id}"] {
        --theme-size-hero: ${config.typography.sizes.hero.mobile};
        --theme-size-h1: ${config.typography.sizes.h1.mobile};
        --theme-size-h2: ${config.typography.sizes.h2.mobile};
        --theme-size-h3: ${config.typography.sizes.h3.mobile};
        --theme-size-body: ${config.typography.sizes.body.mobile};
        --theme-size-small: ${config.typography.sizes.small.mobile};
        --theme-space-section: ${config.spacing.section.mobile};
        --theme-space-element: ${config.spacing.element.mobile};
      }
    }
    
    /* Animation keyframes */
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    
    @keyframes slideUp {
      from { 
        opacity: 0;
        transform: translateY(20px);
      }
      to { 
        opacity: 1;
        transform: translateY(0);
      }
    }
    
    @keyframes scaleIn {
      from { 
        opacity: 0;
        transform: scale(0.95);
      }
      to { 
        opacity: 1;
        transform: scale(1);
      }
    }
  `;
}

/**
 * Converts theme configuration to CSS variables
 */
function themeToCSSVariables(config: ThemeConfig): ThemeCSSVariables {
  return {
    // Colors
    '--theme-color-primary': config.colors.primary,
    '--theme-color-secondary': config.colors.secondary,
    '--theme-color-accent': config.colors.accent,
    '--theme-bg-main': config.colors.background.main,
    '--theme-bg-alt': config.colors.background.alt,
    '--theme-bg-overlay': config.colors.background.overlay,
    '--theme-text-primary': config.colors.text.primary,
    '--theme-text-secondary': config.colors.text.secondary,
    '--theme-text-muted': config.colors.text.muted,
    '--theme-text-inverse': config.colors.text.inverse,
    '--theme-border': config.colors.border,
    '--theme-shadow-color': config.colors.shadow,
    
    // Typography
    '--theme-font-heading': config.typography.fonts.heading,
    '--theme-font-body': config.typography.fonts.body,
    '--theme-font-accent': config.typography.fonts.accent,
    '--theme-size-hero': config.typography.sizes.hero.desktop,
    '--theme-size-hero-mobile': config.typography.sizes.hero.mobile,
    '--theme-size-h1': config.typography.sizes.h1.desktop,
    '--theme-size-h1-mobile': config.typography.sizes.h1.mobile,
    '--theme-size-h2': config.typography.sizes.h2.desktop,
    '--theme-size-h2-mobile': config.typography.sizes.h2.mobile,
    '--theme-size-h3': config.typography.sizes.h3.desktop,
    '--theme-size-h3-mobile': config.typography.sizes.h3.mobile,
    '--theme-size-body': config.typography.sizes.body.desktop,
    '--theme-size-body-mobile': config.typography.sizes.body.mobile,
    '--theme-size-small': config.typography.sizes.small.desktop,
    '--theme-size-small-mobile': config.typography.sizes.small.mobile,
    '--theme-weight-light': String(config.typography.weights.light),
    '--theme-weight-regular': String(config.typography.weights.regular),
    '--theme-weight-medium': String(config.typography.weights.medium),
    '--theme-weight-semibold': String(config.typography.weights.semibold),
    '--theme-weight-bold': String(config.typography.weights.bold),
    '--theme-line-tight': String(config.typography.lineHeights.tight),
    '--theme-line-normal': String(config.typography.lineHeights.normal),
    '--theme-line-relaxed': String(config.typography.lineHeights.relaxed),
    
    // Spacing
    '--theme-space-section': config.spacing.section.desktop,
    '--theme-space-section-mobile': config.spacing.section.mobile,
    '--theme-space-element': config.spacing.element.desktop,
    '--theme-space-element-mobile': config.spacing.element.mobile,
    '--theme-space-tight': config.spacing.tight,
    '--theme-space-normal': config.spacing.normal,
    '--theme-space-loose': config.spacing.loose,
    
    // Animations
    '--theme-anim-fade-in': config.animations.entrances.fadeIn,
    '--theme-anim-slide-up': config.animations.entrances.slideUp,
    '--theme-anim-scale-in': config.animations.entrances.scaleIn,
    '--theme-hover-lift': config.animations.hover.lift,
    '--theme-hover-glow': config.animations.hover.glow,
    '--theme-hover-scale': config.animations.hover.scale,
    '--theme-transition-fast': config.animations.transitions.fast,
    '--theme-transition-normal': config.animations.transitions.normal,
    '--theme-transition-slow': config.animations.transitions.slow,
    '--theme-transition-easing': config.animations.transitions.easing,
    
    // Borders
    '--theme-radius-none': config.borders.radius.none,
    '--theme-radius-small': config.borders.radius.small,
    '--theme-radius-medium': config.borders.radius.medium,
    '--theme-radius-large': config.borders.radius.large,
    '--theme-radius-full': config.borders.radius.full,
    '--theme-border-width': config.borders.width,
    
    // Shadows
    '--theme-shadow-none': config.shadows.none,
    '--theme-shadow-small': config.shadows.small,
    '--theme-shadow-medium': config.shadows.medium,
    '--theme-shadow-large': config.shadows.large,
    '--theme-shadow-glow': config.shadows.glow,
    
    // Effects
    '--theme-effect-blur': config.effects.blur,
    '--theme-effect-opacity': String(config.effects.opacity),
  };
}

/**
 * Merges theme overrides with base configuration
 */
function mergeThemeOverrides(base: ThemeConfig, overrides?: ThemeOverrides): ThemeConfig {
  if (!overrides) return base;
  
  return {
    colors: { ...base.colors, ...overrides.colors },
    typography: { ...base.typography, ...overrides.typography },
    spacing: { ...base.spacing, ...overrides.spacing },
    animations: { ...base.animations, ...overrides.animations },
    borders: { ...base.borders, ...overrides.borders },
    shadows: { ...base.shadows, ...overrides.shadows },
    effects: { ...base.effects, ...overrides.effects },
  };
}

/**
 * Generates inline styles for elements using theme variables
 * This is used by templates to apply theme-aware styling
 */
export const themeStyles = {
  // Text styles
  hero: {
    fontFamily: 'var(--theme-font-heading)',
    fontSize: 'var(--theme-size-hero)',
    fontWeight: 'var(--theme-weight-bold)',
    lineHeight: 'var(--theme-line-tight)',
    color: 'var(--theme-text-primary)',
  },
  h1: {
    fontFamily: 'var(--theme-font-heading)',
    fontSize: 'var(--theme-size-h1)',
    fontWeight: 'var(--theme-weight-bold)',
    lineHeight: 'var(--theme-line-tight)',
    color: 'var(--theme-text-primary)',
  },
  h2: {
    fontFamily: 'var(--theme-font-heading)',
    fontSize: 'var(--theme-size-h2)',
    fontWeight: 'var(--theme-weight-semibold)',
    lineHeight: 'var(--theme-line-tight)',
    color: 'var(--theme-text-primary)',
  },
  h3: {
    fontFamily: 'var(--theme-font-heading)',
    fontSize: 'var(--theme-size-h3)',
    fontWeight: 'var(--theme-weight-semibold)',
    lineHeight: 'var(--theme-line-normal)',
    color: 'var(--theme-text-primary)',
  },
  body: {
    fontFamily: 'var(--theme-font-body)',
    fontSize: 'var(--theme-size-body)',
    fontWeight: 'var(--theme-weight-regular)',
    lineHeight: 'var(--theme-line-normal)',
    color: 'var(--theme-text-primary)',
  },
  bodySecondary: {
    fontFamily: 'var(--theme-font-body)',
    fontSize: 'var(--theme-size-body)',
    fontWeight: 'var(--theme-weight-regular)',
    lineHeight: 'var(--theme-line-normal)',
    color: 'var(--theme-text-secondary)',
  },
  small: {
    fontFamily: 'var(--theme-font-body)',
    fontSize: 'var(--theme-size-small)',
    fontWeight: 'var(--theme-weight-regular)',
    lineHeight: 'var(--theme-line-normal)',
    color: 'var(--theme-text-muted)',
  },
  
  // Button styles
  button: {
    fontFamily: 'var(--theme-font-body)',
    fontSize: 'var(--theme-size-body)',
    fontWeight: 'var(--theme-weight-medium)',
    padding: 'var(--theme-space-tight) var(--theme-space-normal)',
    borderRadius: 'var(--theme-radius-medium)',
    transition: `all var(--theme-transition-normal) var(--theme-transition-easing)`,
  },
  buttonPrimary: {
    backgroundColor: 'var(--theme-color-primary)',
    color: 'var(--theme-text-inverse)',
    border: 'none',
  },
  buttonSecondary: {
    backgroundColor: 'transparent',
    color: 'var(--theme-color-primary)',
    border: `var(--theme-border-width) solid var(--theme-color-primary)`,
  },
  
  // Container styles
  section: {
    padding: 'var(--theme-space-section) var(--theme-space-element)',
    backgroundColor: 'var(--theme-bg-main)',
  },
  sectionAlt: {
    padding: 'var(--theme-space-section) var(--theme-space-element)',
    backgroundColor: 'var(--theme-bg-alt)',
  },
  card: {
    padding: 'var(--theme-space-element)',
    backgroundColor: 'var(--theme-bg-overlay)',
    borderRadius: 'var(--theme-radius-medium)',
    boxShadow: 'var(--theme-shadow-medium)',
    border: `var(--theme-border-width) solid var(--theme-border)`,
  },
  
  // Animation classes
  fadeIn: {
    animation: 'var(--theme-anim-fade-in)',
  },
  slideUp: {
    animation: 'var(--theme-anim-slide-up)',
  },
  scaleIn: {
    animation: 'var(--theme-anim-scale-in)',
  },
  
  // Hover effects
  hoverLift: {
    transition: `transform var(--theme-transition-normal) var(--theme-transition-easing)`,
    '&:hover': {
      transform: 'var(--theme-hover-lift)',
    },
  },
  hoverGlow: {
    transition: `box-shadow var(--theme-transition-normal) var(--theme-transition-easing)`,
    '&:hover': {
      boxShadow: 'var(--theme-hover-glow)',
    },
  },
}; 