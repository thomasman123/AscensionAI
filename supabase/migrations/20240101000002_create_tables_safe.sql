-- Safe migration that handles existing objects
-- Run this if the previous migration had errors

-- Create custom types (only if they don't exist)
DO $$ BEGIN
    CREATE TYPE funnel_type AS ENUM ('trigger', 'gateway');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE funnel_status AS ENUM ('draft', 'published');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE vsl_type AS ENUM ('video', 'canva', 'none');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- User Offer Profiles table (create if not exists)
CREATE TABLE IF NOT EXISTS public.user_offer_profiles (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade,
  name text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  
  -- Avatar fields
  niche text,
  income text,
  age text,
  traits text,
  primary_goal_1 text,
  primary_goal_2 text,
  primary_goal_3 text,
  secondary_goal_1 text,
  secondary_goal_2 text,
  secondary_goal_3 text,
  complaint_1 text,
  complaint_2 text,
  complaint_3 text,
  fear text,
  false_solution text,
  mistaken_belief text,
  objection_1 text,
  objection_2 text,
  objection_3 text,
  expensive_alternative_1 text,
  expensive_alternative_2 text,
  expensive_alternative_3 text,
  avatar_story text,
  
  -- Transformation and core offer
  who text,
  outcome text,
  method text,
  timeframe text,
  guarantee text,
  
  -- Activation points
  activation_point_1 text,
  activation_point_2 text,
  activation_point_3 text,
  activation_point_4 text,
  activation_point_5 text,
  
  -- Mechanisms
  mechanism_point_1 text,
  mechanism_point_2 text,
  mechanism_point_3 text,
  mechanism_point_4 text,
  mechanism_point_5 text
);

-- Saved Funnels table (create if not exists)
CREATE TABLE IF NOT EXISTS public.saved_funnels (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade,
  offer_profile_id uuid references public.user_offer_profiles(id) on delete set null,
  name text not null,
  type funnel_type not null,
  status funnel_status default 'draft',
  domain text,
  template_id text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  
  -- Media settings
  vsl_type vsl_type default 'none',
  vsl_url text,
  vsl_title text,
  calendar_embed_code text,
  calendar_title text default 'Book Your Call',
  
  -- Customization
  headline text,
  subheadline text,
  hero_text text,
  cta_text text,
  offer_description text,
  guarantee_text text,
  primary_color text default '#3b82f6',
  secondary_color text default '#1e40af',
  accent_color text default '#059669',
  logo_url text
);

-- Case Studies table (create if not exists)
CREATE TABLE IF NOT EXISTS public.case_studies (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade,
  offer_profile_id uuid references public.user_offer_profiles(id) on delete cascade,
  funnel_id uuid references public.saved_funnels(id) on delete cascade,
  name text not null,
  description text not null,
  result text not null,
  media_url text,
  media_type text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Writing Style Examples table (create if not exists)
CREATE TABLE IF NOT EXISTS public.writing_style_examples (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade,
  title text not null,
  content text not null,
  type text not null check (type in ('headline', 'subheading', 'cta', 'body', 'email')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create indexes if they don't exist
CREATE INDEX IF NOT EXISTS idx_user_offer_profiles_user_id ON public.user_offer_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_case_studies_user_id ON public.case_studies(user_id);
CREATE INDEX IF NOT EXISTS idx_case_studies_offer_profile_id ON public.case_studies(offer_profile_id);
CREATE INDEX IF NOT EXISTS idx_case_studies_funnel_id ON public.case_studies(funnel_id);
CREATE INDEX IF NOT EXISTS idx_saved_funnels_user_id ON public.saved_funnels(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_funnels_offer_profile_id ON public.saved_funnels(offer_profile_id);
CREATE INDEX IF NOT EXISTS idx_writing_style_examples_user_id ON public.writing_style_examples(user_id);

-- Enable Row Level Security
ALTER TABLE public.user_offer_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.case_studies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_funnels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.writing_style_examples ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Users can view their own offer profiles" ON public.user_offer_profiles;
DROP POLICY IF EXISTS "Users can insert their own offer profiles" ON public.user_offer_profiles;
DROP POLICY IF EXISTS "Users can update their own offer profiles" ON public.user_offer_profiles;
DROP POLICY IF EXISTS "Users can delete their own offer profiles" ON public.user_offer_profiles;

DROP POLICY IF EXISTS "Users can view their own case studies" ON public.case_studies;
DROP POLICY IF EXISTS "Users can insert their own case studies" ON public.case_studies;
DROP POLICY IF EXISTS "Users can update their own case studies" ON public.case_studies;
DROP POLICY IF EXISTS "Users can delete their own case studies" ON public.case_studies;

DROP POLICY IF EXISTS "Users can view their own funnels" ON public.saved_funnels;
DROP POLICY IF EXISTS "Users can insert their own funnels" ON public.saved_funnels;
DROP POLICY IF EXISTS "Users can update their own funnels" ON public.saved_funnels;
DROP POLICY IF EXISTS "Users can delete their own funnels" ON public.saved_funnels;

DROP POLICY IF EXISTS "Users can view their own writing examples" ON public.writing_style_examples;
DROP POLICY IF EXISTS "Users can insert their own writing examples" ON public.writing_style_examples;
DROP POLICY IF EXISTS "Users can update their own writing examples" ON public.writing_style_examples;
DROP POLICY IF EXISTS "Users can delete their own writing examples" ON public.writing_style_examples;

-- Create RLS policies
CREATE POLICY "Users can view their own offer profiles" ON public.user_offer_profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own offer profiles" ON public.user_offer_profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own offer profiles" ON public.user_offer_profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own offer profiles" ON public.user_offer_profiles
  FOR DELETE USING (auth.uid() = user_id);

-- Policies for case_studies
CREATE POLICY "Users can view their own case studies" ON public.case_studies
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own case studies" ON public.case_studies
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own case studies" ON public.case_studies
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own case studies" ON public.case_studies
  FOR DELETE USING (auth.uid() = user_id);

-- Policies for saved_funnels
CREATE POLICY "Users can view their own funnels" ON public.saved_funnels
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own funnels" ON public.saved_funnels
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own funnels" ON public.saved_funnels
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own funnels" ON public.saved_funnels
  FOR DELETE USING (auth.uid() = user_id);

-- Policies for writing_style_examples
CREATE POLICY "Users can view their own writing examples" ON public.writing_style_examples
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own writing examples" ON public.writing_style_examples
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own writing examples" ON public.writing_style_examples
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own writing examples" ON public.writing_style_examples
  FOR DELETE USING (auth.uid() = user_id);

-- Create or replace function for updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  new.updated_at = timezone('utc'::text, now());
  RETURN new;
END;
$$ language plpgsql;

-- Drop existing triggers if they exist
DROP TRIGGER IF EXISTS handle_updated_at ON public.user_offer_profiles;
DROP TRIGGER IF EXISTS handle_updated_at ON public.saved_funnels;

-- Create triggers for updated_at
CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.user_offer_profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.saved_funnels
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at(); 