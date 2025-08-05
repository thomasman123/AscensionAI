-- Reset all funnel styling to defaults
-- This migration resets all styling customizations while preserving content

UPDATE public.saved_funnels SET
  -- Reset all color customizations to defaults
  primary_color = '#3b82f6',
  secondary_color = '#1e40af', 
  accent_color = '#059669',
  background_color = '#FFFFFF',
  text_color = '#1F2937',
  
  -- Reset typography and theme to defaults
  font_family = 'inter',
  theme_style = 'clean',
  theme_mode = 'light',
  
  -- Remove custom logos
  logo_url = NULL,
  
  -- Remove all tracking codes
  facebook_pixel_code = NULL,
  google_analytics_code = NULL,
  custom_tracking_code = NULL,
  facebook_pixel_id = NULL,
  google_analytics_id = NULL,
  
  -- Update timestamp
  updated_at = timezone('utc'::text, now())

WHERE 
  -- Only update funnels that have custom styling (not already at defaults)
  (primary_color != '#3b82f6' OR primary_color IS NULL) OR
  (secondary_color != '#1e40af' OR secondary_color IS NULL) OR
  (accent_color != '#059669' OR accent_color IS NULL) OR
  (background_color != '#FFFFFF' OR background_color IS NULL) OR
  (text_color != '#1F2937' OR text_color IS NULL) OR
  (font_family != 'inter' OR font_family IS NULL) OR
  (theme_style != 'clean' OR theme_style IS NULL) OR
  (theme_mode != 'light' OR theme_mode IS NULL) OR
  logo_url IS NOT NULL OR
  facebook_pixel_code IS NOT NULL OR
  google_analytics_code IS NOT NULL OR
  custom_tracking_code IS NOT NULL OR
  facebook_pixel_id IS NOT NULL OR
  google_analytics_id IS NOT NULL;

-- Add comment for documentation
COMMENT ON TABLE public.saved_funnels IS 'Funnel styling reset to defaults - colors, fonts, themes, logos, and tracking codes removed'; 