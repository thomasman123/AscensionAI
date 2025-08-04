-- Add custom domain functionality for funnels
-- This migration adds support for custom domains and domain validation

-- Add custom domain fields to saved_funnels table
ALTER TABLE public.saved_funnels 
ADD COLUMN IF NOT EXISTS custom_domain text,
ADD COLUMN IF NOT EXISTS domain_verified boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS domain_verification_token text,
ADD COLUMN IF NOT EXISTS domain_config_instructions text;

-- Create domains table for tracking domain configurations
CREATE TABLE IF NOT EXISTS public.custom_domains (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  funnel_id uuid references public.saved_funnels(id) on delete cascade not null,
  domain text not null unique,
  verified boolean default false,
  verification_token text not null,
  dns_records jsonb,
  ssl_status text default 'pending',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  last_verified_at timestamp with time zone
);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_custom_domains_user_id ON public.custom_domains(user_id);
CREATE INDEX IF NOT EXISTS idx_custom_domains_funnel_id ON public.custom_domains(funnel_id);
CREATE INDEX IF NOT EXISTS idx_custom_domains_domain ON public.custom_domains(domain);
CREATE INDEX IF NOT EXISTS idx_custom_domains_verified ON public.custom_domains(verified);

-- Enable RLS on custom_domains table
ALTER TABLE public.custom_domains ENABLE ROW LEVEL SECURITY;

-- RLS policies for custom_domains
CREATE POLICY "Users can view their own domains" ON public.custom_domains
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own domains" ON public.custom_domains
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own domains" ON public.custom_domains
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own domains" ON public.custom_domains
  FOR DELETE USING (auth.uid() = user_id);

-- Add updated_at trigger for custom_domains
CREATE TRIGGER handle_updated_at_custom_domains BEFORE UPDATE ON public.custom_domains
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Function to generate domain verification token
CREATE OR REPLACE FUNCTION generate_domain_verification_token()
RETURNS text AS $$
BEGIN
  RETURN 'ascension-verify-' || encode(gen_random_bytes(16), 'hex');
END;
$$ LANGUAGE plpgsql;

-- Function to validate domain format
CREATE OR REPLACE FUNCTION is_valid_domain(domain_name text)
RETURNS boolean AS $$
BEGIN
  -- Basic domain validation (can be enhanced)
  RETURN domain_name ~ '^[a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?)*$'
    AND length(domain_name) <= 253
    AND domain_name NOT LIKE '%.%.'
    AND domain_name NOT LIKE '.%'
    AND domain_name NOT LIKE '%.'
    AND domain_name != 'localhost'
    AND domain_name NOT LIKE '%.localhost'
    AND domain_name NOT LIKE '%.local';
END;
$$ LANGUAGE plpgsql; 