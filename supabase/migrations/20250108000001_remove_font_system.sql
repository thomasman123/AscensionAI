-- Remove font functionality - will rebuild design system from scratch
-- Reset all font fields to null
UPDATE public.saved_funnels
SET font_family = null
WHERE font_family IS NOT NULL;

-- Add comment for documentation
COMMENT ON COLUMN public.saved_funnels.font_family IS 'Font functionality removed - will rebuild design system from scratch'; 