'use client'

import React, { useEffect, useState } from 'react'
import { Theme, ThemeOverrides } from '@/lib/theme-types'
import { generateThemeCSS } from '@/lib/theme-generator'

interface ThemeProviderProps {
  theme: Theme | null
  overrides?: ThemeOverrides
  children: React.ReactNode
}

/**
 * ThemeProvider Component
 * 
 * Wraps any content and applies a theme through CSS variables.
 * This allows themes to be applied to templates without any template modifications.
 * 
 * Usage:
 * <ThemeProvider theme={myTheme}>
 *   {renderFunnelTemplate(templateId, props)}
 * </ThemeProvider>
 */
export default function ThemeProvider({ theme, overrides, children }: ThemeProviderProps) {
  const [themeId, setThemeId] = useState<string>('')
  
  useEffect(() => {
    if (theme) {
      setThemeId(theme.id)
    }
  }, [theme])
  
  if (!theme) {
    // No theme, render children as-is
    return <>{children}</>
  }
  
  // Generate CSS for this theme
  const themeCSS = generateThemeCSS(theme, overrides)
  
  return (
    <>
      {/* Inject theme CSS into the document */}
      <style dangerouslySetInnerHTML={{ __html: themeCSS }} />
      
      {/* Wrap children with theme data attribute */}
      <div data-theme={themeId} className="theme-wrapper">
        {children}
      </div>
      
      {/* Global theme animations and utilities */}
      <style dangerouslySetInnerHTML={{ __html: `
        .theme-wrapper {
          /* Ensure theme CSS variables are inherited */
          position: relative;
          min-height: 100%;
        }
        
        /* Utility classes that templates can use */
        .theme-fade-in {
          animation: var(--theme-anim-fade-in);
        }
        
        .theme-slide-up {
          animation: var(--theme-anim-slide-up);
        }
        
        .theme-scale-in {
          animation: var(--theme-anim-scale-in);
        }
        
        /* Theme-aware transitions */
        .theme-transition {
          transition: all var(--theme-transition-normal) var(--theme-transition-easing);
        }
        
        .theme-transition-fast {
          transition: all var(--theme-transition-fast) var(--theme-transition-easing);
        }
        
        .theme-transition-slow {
          transition: all var(--theme-transition-slow) var(--theme-transition-easing);
        }
        
        /* Hover effects */
        .theme-hover-lift {
          transition: transform var(--theme-transition-normal) var(--theme-transition-easing);
        }
        
        .theme-hover-lift:hover {
          transform: var(--theme-hover-lift);
        }
        
        .theme-hover-glow {
          transition: box-shadow var(--theme-transition-normal) var(--theme-transition-easing);
        }
        
        .theme-hover-glow:hover {
          box-shadow: var(--theme-hover-glow);
        }
        
        .theme-hover-scale {
          transition: transform var(--theme-transition-normal) var(--theme-transition-easing);
        }
        
        .theme-hover-scale:hover {
          transform: var(--theme-hover-scale);
        }
        
        /* Responsive utilities */
        @media (max-width: 768px) {
          .theme-hide-mobile {
            display: none;
          }
        }
        
        @media (min-width: 769px) {
          .theme-hide-desktop {
            display: none;
          }
        }
      ` }} />
    </>
  )
}

/**
 * Hook to load theme from database
 */
export function useTheme(themeId?: string | null) {
  const [theme, setTheme] = useState<Theme | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  useEffect(() => {
    async function loadTheme() {
      if (!themeId) {
        // Load default theme
        try {
          const response = await fetch('/api/themes/default')
          if (response.ok) {
            const defaultTheme = await response.json()
            setTheme(defaultTheme)
          }
        } catch (err) {
          console.error('Failed to load default theme:', err)
        }
        setLoading(false)
        return
      }
      
      try {
        const response = await fetch(`/api/themes/${themeId}`)
        if (!response.ok) {
          throw new Error('Theme not found')
        }
        const themeData = await response.json()
        setTheme(themeData)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load theme')
        console.error('Error loading theme:', err)
      } finally {
        setLoading(false)
      }
    }
    
    loadTheme()
  }, [themeId])
  
  return { theme, loading, error }
} 