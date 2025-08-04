-- Add tracking fields to saved_funnels table
ALTER TABLE public.saved_funnels 
ADD COLUMN facebook_pixel_id text,
ADD COLUMN google_analytics_id text,
ADD COLUMN theme_mode text DEFAULT 'light' CHECK (theme_mode IN ('light', 'dark'));

-- Add comment for documentation
COMMENT ON COLUMN public.saved_funnels.facebook_pixel_id IS 'Facebook Pixel ID for conversion tracking';
COMMENT ON COLUMN public.saved_funnels.google_analytics_id IS 'Google Analytics 4 measurement ID';
COMMENT ON COLUMN public.saved_funnels.theme_mode IS 'Theme mode: light or dark'; 