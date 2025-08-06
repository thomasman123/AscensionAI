-- Quick fix for case studies saving issue
-- Run this in your Supabase SQL editor to add the missing metric column

ALTER TABLE public.case_studies 
ADD COLUMN IF NOT EXISTS metric text;

-- This will allow case studies to save properly 