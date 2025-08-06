-- Storage Policies Setup
-- IMPORTANT: Storage policies cannot be created via SQL!
-- They must be configured through the Supabase Dashboard.

-- This file serves as documentation for the required storage setup.

-- Required Buckets:
-- 1. 'logos' - Public bucket for company logos
-- 2. 'case-studies' - Public bucket for case study images

-- For each bucket, create these policies in the Dashboard:

-- SELECT Policy (Public Read Access):
-- - Policy name: Public Read Access
-- - Operation: SELECT
-- - Target roles: anon, authenticated
-- - Policy definition: true

-- INSERT Policy (Authenticated Upload):
-- - Policy name: Authenticated Upload
-- - Operation: INSERT
-- - Target roles: authenticated  
-- - Policy definition: (auth.uid() IS NOT NULL)

-- UPDATE Policy (Authenticated Update):
-- - Policy name: Authenticated Update
-- - Operation: UPDATE
-- - Target roles: authenticated
-- - USING expression: (auth.uid() IS NOT NULL)
-- - WITH CHECK expression: (auth.uid() IS NOT NULL)

-- DELETE Policy (Authenticated Delete):
-- - Policy name: Authenticated Delete
-- - Operation: DELETE
-- - Target roles: authenticated
-- - USING expression: (auth.uid() IS NOT NULL)

-- See STORAGE_BUCKET_SETUP.md for detailed dashboard instructions. 