// Theme System Types
// These types define the structure of themes that can be applied to any template
// without affecting content - only visual design

export interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  background: {
    main: string;
    alt: string;
    overlay: string;
  };
  text: {
    primary: string;
    secondary: string;
    muted: string;
    inverse: string;
  };
  border: string;
  shadow: string;
}

export interface ThemeTypography {
  fonts: {
    heading: string;
    body: string;
    accent: string;
  };
  sizes: {
    hero: { desktop: string; mobile: string };
    h1: { desktop: string; mobile: string };
    h2: { desktop: string; mobile: string };
    h3: { desktop: string; mobile: string };
    body: { desktop: string; mobile: string };
    small: { desktop: string; mobile: string };
  };
  weights: {
    light: number;
    regular: number;
    medium: number;
    semibold: number;
    bold: number;
  };
  lineHeights: {
    tight: number;
    normal: number;
    relaxed: number;
  };
}

export interface ThemeSpacing {
  section: { desktop: string; mobile: string };
  element: { desktop: string; mobile: string };
  tight: string;
  normal: string;
  loose: string;
}

export interface ThemeAnimations {
  entrances: {
    fadeIn: string;
    slideUp: string;
    scaleIn: string;
  };
  hover: {
    lift: string;
    glow: string;
    scale: string;
  };
  transitions: {
    fast: string;
    normal: string;
    slow: string;
    easing: string;
  };
}

export interface ThemeBorders {
  radius: {
    none: string;
    small: string;
    medium: string;
    large: string;
    full: string;
  };
  width: string;
}

export interface ThemeShadows {
  none: string;
  small: string;
  medium: string;
  large: string;
  glow: string;
}

export interface ThemeEffects {
  blur: string;
  opacity: number;
}

export interface ThemeConfig {
  colors: ThemeColors;
  typography: ThemeTypography;
  spacing: ThemeSpacing;
  animations: ThemeAnimations;
  borders: ThemeBorders;
  shadows: ThemeShadows;
  effects: ThemeEffects;
}

export interface Theme {
  id: string;
  name: string;
  description?: string;
  is_default: boolean;
  is_public: boolean;
  user_id?: string;
  config: ThemeConfig;
  preview_url?: string;
  tags?: string[];
  created_at: string;
  updated_at: string;
}

export interface ThemeOverrides {
  colors?: Partial<ThemeColors>;
  typography?: Partial<ThemeTypography>;
  spacing?: Partial<ThemeSpacing>;
  animations?: Partial<ThemeAnimations>;
  borders?: Partial<ThemeBorders>;
  shadows?: Partial<ThemeShadows>;
  effects?: Partial<ThemeEffects>;
}

// CSS Variable mapping for runtime application
export interface ThemeCSSVariables {
  // Colors
  '--theme-color-primary': string;
  '--theme-color-secondary': string;
  '--theme-color-accent': string;
  '--theme-bg-main': string;
  '--theme-bg-alt': string;
  '--theme-bg-overlay': string;
  '--theme-text-primary': string;
  '--theme-text-secondary': string;
  '--theme-text-muted': string;
  '--theme-text-inverse': string;
  '--theme-border': string;
  '--theme-shadow-color': string;
  
  // Typography
  '--theme-font-heading': string;
  '--theme-font-body': string;
  '--theme-font-accent': string;
  '--theme-size-hero': string;
  '--theme-size-hero-mobile': string;
  '--theme-size-h1': string;
  '--theme-size-h1-mobile': string;
  '--theme-size-h2': string;
  '--theme-size-h2-mobile': string;
  '--theme-size-h3': string;
  '--theme-size-h3-mobile': string;
  '--theme-size-body': string;
  '--theme-size-body-mobile': string;
  '--theme-size-small': string;
  '--theme-size-small-mobile': string;
  '--theme-weight-light': string;
  '--theme-weight-regular': string;
  '--theme-weight-medium': string;
  '--theme-weight-semibold': string;
  '--theme-weight-bold': string;
  '--theme-line-tight': string;
  '--theme-line-normal': string;
  '--theme-line-relaxed': string;
  
  // Spacing
  '--theme-space-section': string;
  '--theme-space-section-mobile': string;
  '--theme-space-element': string;
  '--theme-space-element-mobile': string;
  '--theme-space-tight': string;
  '--theme-space-normal': string;
  '--theme-space-loose': string;
  
  // Animations
  '--theme-anim-fade-in': string;
  '--theme-anim-slide-up': string;
  '--theme-anim-scale-in': string;
  '--theme-hover-lift': string;
  '--theme-hover-glow': string;
  '--theme-hover-scale': string;
  '--theme-transition-fast': string;
  '--theme-transition-normal': string;
  '--theme-transition-slow': string;
  '--theme-transition-easing': string;
  
  // Borders
  '--theme-radius-none': string;
  '--theme-radius-small': string;
  '--theme-radius-medium': string;
  '--theme-radius-large': string;
  '--theme-radius-full': string;
  '--theme-border-width': string;
  
  // Shadows
  '--theme-shadow-none': string;
  '--theme-shadow-small': string;
  '--theme-shadow-medium': string;
  '--theme-shadow-large': string;
  '--theme-shadow-glow': string;
  
  // Effects
  '--theme-effect-blur': string;
  '--theme-effect-opacity': string;
}

// Helper type for partial theme updates
export type PartialThemeConfig = {
  [K in keyof ThemeConfig]?: Partial<ThemeConfig[K]>;
}; 