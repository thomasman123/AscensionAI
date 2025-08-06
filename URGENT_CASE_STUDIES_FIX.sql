-- URGENT: Fix case studies saving error
-- Run this immediately in your Supabase SQL editor

-- Add the metric column that the schema cache expects
ALTER TABLE public.case_studies 
ADD COLUMN IF NOT EXISTS metric text;

-- This will fix the "Could not find the 'metric' column" error
-- After running this, case studies should save properly 