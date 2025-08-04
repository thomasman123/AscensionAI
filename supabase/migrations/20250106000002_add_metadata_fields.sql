-- Add metadata fields to saved_funnels table
ALTER TABLE public.saved_funnels 
ADD COLUMN meta_title text,
ADD COLUMN meta_description text,
ADD COLUMN meta_keywords text,
ADD COLUMN theme_mode text DEFAULT 'light' CHECK (theme_mode IN ('light', 'dark'));

-- Add comments for documentation
COMMENT ON COLUMN public.saved_funnels.meta_title IS 'Custom page title for SEO (overrides default "Ascension AI")';
COMMENT ON COLUMN public.saved_funnels.meta_description IS 'Custom page description for SEO';
COMMENT ON COLUMN public.saved_funnels.meta_keywords IS 'Custom page keywords for SEO';
COMMENT ON COLUMN public.saved_funnels.theme_mode IS 'Theme mode for the funnel - light or dark (controlled by funnel creator)'; 