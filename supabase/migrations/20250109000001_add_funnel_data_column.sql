-- Add data column to saved_funnels for storing text sizes and other customization data
ALTER TABLE public.saved_funnels
ADD COLUMN IF NOT EXISTS data jsonb DEFAULT '{}'::jsonb;

-- Add comment to explain what this column stores
COMMENT ON COLUMN public.saved_funnels.data IS 'Stores additional customization data including text sizes, extended settings, etc.';

-- Create an index on the data column for better query performance
CREATE INDEX IF NOT EXISTS idx_saved_funnels_data ON public.saved_funnels USING gin(data); 