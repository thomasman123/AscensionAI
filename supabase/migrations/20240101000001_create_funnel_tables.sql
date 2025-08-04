-- Enable Row Level Security
alter default privileges revoke execute on functions from public;

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

-- User Offer Profiles table
create table public.user_offer_profiles (
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

-- Case Studies table
create table public.case_studies (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade,
  offer_profile_id uuid references public.user_offer_profiles(id) on delete cascade,
  funnel_id uuid, -- Will reference funnels table
  name text not null,
  description text not null,
  result text not null,
  media_url text,
  media_type text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Saved Funnels table
create table public.saved_funnels (
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

-- Update case_studies to reference funnels
alter table public.case_studies 
add constraint fk_funnel_id 
foreign key (funnel_id) references public.saved_funnels(id) on delete cascade;

-- Writing Style Examples table (for AI training)
create table public.writing_style_examples (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade,
  title text not null,
  content text not null,
  type text not null check (type in ('headline', 'subheading', 'cta', 'body', 'email')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Indexes for better performance
create index idx_user_offer_profiles_user_id on public.user_offer_profiles(user_id);
create index idx_case_studies_user_id on public.case_studies(user_id);
create index idx_case_studies_offer_profile_id on public.case_studies(offer_profile_id);
create index idx_case_studies_funnel_id on public.case_studies(funnel_id);
create index idx_saved_funnels_user_id on public.saved_funnels(user_id);
create index idx_saved_funnels_offer_profile_id on public.saved_funnels(offer_profile_id);
create index idx_writing_style_examples_user_id on public.writing_style_examples(user_id);

-- Row Level Security (RLS) policies
alter table public.user_offer_profiles enable row level security;
alter table public.case_studies enable row level security;
alter table public.saved_funnels enable row level security;
alter table public.writing_style_examples enable row level security;

-- Policies for user_offer_profiles
create policy "Users can view their own offer profiles" on public.user_offer_profiles
  for select using (auth.uid() = user_id);

create policy "Users can insert their own offer profiles" on public.user_offer_profiles
  for insert with check (auth.uid() = user_id);

create policy "Users can update their own offer profiles" on public.user_offer_profiles
  for update using (auth.uid() = user_id);

create policy "Users can delete their own offer profiles" on public.user_offer_profiles
  for delete using (auth.uid() = user_id);

-- Policies for case_studies
create policy "Users can view their own case studies" on public.case_studies
  for select using (auth.uid() = user_id);

create policy "Users can insert their own case studies" on public.case_studies
  for insert with check (auth.uid() = user_id);

create policy "Users can update their own case studies" on public.case_studies
  for update using (auth.uid() = user_id);

create policy "Users can delete their own case studies" on public.case_studies
  for delete using (auth.uid() = user_id);

-- Policies for saved_funnels
create policy "Users can view their own funnels" on public.saved_funnels
  for select using (auth.uid() = user_id);

create policy "Users can insert their own funnels" on public.saved_funnels
  for insert with check (auth.uid() = user_id);

create policy "Users can update their own funnels" on public.saved_funnels
  for update using (auth.uid() = user_id);

create policy "Users can delete their own funnels" on public.saved_funnels
  for delete using (auth.uid() = user_id);

-- Policies for writing_style_examples
create policy "Users can view their own writing examples" on public.writing_style_examples
  for select using (auth.uid() = user_id);

create policy "Users can insert their own writing examples" on public.writing_style_examples
  for insert with check (auth.uid() = user_id);

create policy "Users can update their own writing examples" on public.writing_style_examples
  for update using (auth.uid() = user_id);

create policy "Users can delete their own writing examples" on public.writing_style_examples
  for delete using (auth.uid() = user_id);

-- Function to automatically set updated_at
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql;

-- Triggers for updated_at
create trigger handle_updated_at before update on public.user_offer_profiles
  for each row execute function public.handle_updated_at();

create trigger handle_updated_at before update on public.saved_funnels
  for each row execute function public.handle_updated_at(); 