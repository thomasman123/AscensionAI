-- Add enhanced customization fields to saved_funnels table
ALTER TABLE public.saved_funnels 
ADD COLUMN background_color text DEFAULT '#FFFFFF',
ADD COLUMN text_color text DEFAULT '#1F2937',
ADD COLUMN font_family text DEFAULT 'inter' CHECK (font_family IN ('inter', 'system', 'serif', 'mono')),
ADD COLUMN theme_style text DEFAULT 'clean' CHECK (theme_style IN ('clean', 'modern', 'classic', 'minimal', 'bold')),
ADD COLUMN facebook_pixel_code text,
ADD COLUMN google_analytics_code text,
ADD COLUMN custom_tracking_code text;

-- Add comments for documentation
COMMENT ON COLUMN public.saved_funnels.background_color IS 'Background color for the funnel (hex code)';
COMMENT ON COLUMN public.saved_funnels.text_color IS 'Text color for the funnel (hex code)';
COMMENT ON COLUMN public.saved_funnels.font_family IS 'Font family used throughout the funnel';
COMMENT ON COLUMN public.saved_funnels.theme_style IS 'Overall theme style of the funnel';
COMMENT ON COLUMN public.saved_funnels.facebook_pixel_code IS 'Complete Facebook pixel tracking code (HTML)';
COMMENT ON COLUMN public.saved_funnels.google_analytics_code IS 'Complete Google Analytics tracking code (HTML)';
COMMENT ON COLUMN public.saved_funnels.custom_tracking_code IS 'Additional custom tracking codes (HTML)'; 