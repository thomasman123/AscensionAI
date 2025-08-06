-- Add metric column to case_studies table
-- This column was referenced in the code but never added to the database

ALTER TABLE public.case_studies 
ADD COLUMN IF NOT EXISTS metric text;

-- Add comment for documentation
COMMENT ON COLUMN public.case_studies.metric IS 'Metric or measurement related to the case study result (e.g., "revenue increase", "conversion rate", etc.)'; 