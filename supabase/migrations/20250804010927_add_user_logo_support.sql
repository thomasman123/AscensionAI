-- Add logo support to user profiles
-- Migration to add logo_url field to user_offer_profiles table

-- Add logo_url column to user_offer_profiles table
ALTER TABLE public.user_offer_profiles 
ADD COLUMN IF NOT EXISTS logo_url text;

-- Create user settings table for global user preferences
CREATE TABLE IF NOT EXISTS public.user_settings (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null unique,
  logo_url text,
  company_name text,
  website_url text,
  default_colors jsonb default '{"primary": "#3B82F6", "secondary": "#1E40AF", "accent": "#F59E0B"}'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Add index for better performance
CREATE INDEX IF NOT EXISTS idx_user_settings_user_id ON public.user_settings(user_id);

-- Enable RLS on user_settings table
ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;

-- RLS policies for user_settings
CREATE POLICY "Users can view their own settings" ON public.user_settings
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own settings" ON public.user_settings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own settings" ON public.user_settings
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own settings" ON public.user_settings
  FOR DELETE USING (auth.uid() = user_id);
