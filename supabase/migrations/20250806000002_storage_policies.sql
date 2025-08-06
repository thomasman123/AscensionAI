-- Storage Policies for Logos Bucket
-- Run these in Supabase SQL Editor after creating the 'logos' bucket

-- 1. Allow public read access to logos
INSERT INTO storage.policies (bucket_id, name, mode, definition)
VALUES (
  'logos',
  'Public Access',
  'SELECT',
  '{"roles": ["anon", "authenticated"], "check": "true"}'::jsonb
);

-- 2. Allow authenticated users to upload logos
INSERT INTO storage.policies (bucket_id, name, mode, definition)
VALUES (
  'logos',
  'Authenticated users can upload',
  'INSERT',
  '{"roles": ["authenticated"], "check": "(auth.uid() IS NOT NULL)"}'::jsonb
);

-- 3. Allow authenticated users to update their uploads
INSERT INTO storage.policies (bucket_id, name, mode, definition)
VALUES (
  'logos',
  'Authenticated users can update',
  'UPDATE',
  '{"roles": ["authenticated"], "using": "(auth.uid() IS NOT NULL)", "check": "(auth.uid() IS NOT NULL)"}'::jsonb
);

-- 4. Allow authenticated users to delete their uploads
INSERT INTO storage.policies (bucket_id, name, mode, definition)
VALUES (
  'logos',
  'Authenticated users can delete',
  'DELETE',
  '{"roles": ["authenticated"], "using": "(auth.uid() IS NOT NULL)"}'::jsonb
);

-- Storage Policies for Case Studies Bucket
-- First create the bucket in dashboard with:
-- Name: case-studies
-- Public: ON
-- MIME types: image/png, image/jpeg, image/gif, image/webp
-- Max size: 10MB

-- Then run these policies:

-- 1. Allow public read access to case study images
INSERT INTO storage.policies (bucket_id, name, mode, definition)
VALUES (
  'case-studies',
  'Public Access',
  'SELECT',
  '{"roles": ["anon", "authenticated"], "check": "true"}'::jsonb
);

-- 2. Allow authenticated users to upload case study images
INSERT INTO storage.policies (bucket_id, name, mode, definition)
VALUES (
  'case-studies',
  'Authenticated users can upload',
  'INSERT',
  '{"roles": ["authenticated"], "check": "(auth.uid() IS NOT NULL)"}'::jsonb
);

-- 3. Allow authenticated users to update their uploads
INSERT INTO storage.policies (bucket_id, name, mode, definition)
VALUES (
  'case-studies',
  'Authenticated users can update',
  'UPDATE',
  '{"roles": ["authenticated"], "using": "(auth.uid() IS NOT NULL)", "check": "(auth.uid() IS NOT NULL)"}'::jsonb
);

-- 4. Allow authenticated users to delete their uploads
INSERT INTO storage.policies (bucket_id, name, mode, definition)
VALUES (
  'case-studies',
  'Authenticated users can delete',
  'DELETE',
  '{"roles": ["authenticated"], "using": "(auth.uid() IS NOT NULL)"}'::jsonb
); 