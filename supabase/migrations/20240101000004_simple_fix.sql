-- Temporary fix for development - remove foreign key constraints
-- This allows us to use a dummy UUID without requiring actual auth users

-- Drop foreign key constraints temporarily
ALTER TABLE public.user_offer_profiles DROP CONSTRAINT IF EXISTS user_offer_profiles_user_id_fkey;
ALTER TABLE public.case_studies DROP CONSTRAINT IF EXISTS case_studies_user_id_fkey;
ALTER TABLE public.saved_funnels DROP CONSTRAINT IF EXISTS saved_funnels_user_id_fkey;
ALTER TABLE public.writing_style_examples DROP CONSTRAINT IF EXISTS writing_style_examples_user_id_fkey;

-- Alternatively, you can run this in production once you have proper Supabase Auth:
-- This would re-add the constraints:
/*
ALTER TABLE public.user_offer_profiles 
ADD CONSTRAINT user_offer_profiles_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE public.case_studies 
ADD CONSTRAINT case_studies_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE public.saved_funnels 
ADD CONSTRAINT saved_funnels_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE public.writing_style_examples 
ADD CONSTRAINT writing_style_examples_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
*/ 