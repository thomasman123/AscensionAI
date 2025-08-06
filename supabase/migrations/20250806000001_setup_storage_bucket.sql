-- Storage bucket setup for logos
-- Note: This must be done through Supabase Dashboard as storage operations
-- are not available through SQL migrations

-- Instructions:
-- 1. Go to Storage section in Supabase Dashboard
-- 2. Create a new bucket named 'logos'
-- 3. Set it as PUBLIC bucket
-- 4. Configure allowed MIME types: image/png, image/jpeg, image/gif, image/webp, image/svg+xml
-- 5. Set max file size to 5MB

-- Storage Policies (apply these in the dashboard):

-- SELECT Policy (Public Access):
-- Policy name: Public Access
-- Target roles: anon, authenticated
-- WITH CHECK: true

-- INSERT Policy (Authenticated Upload):
-- Policy name: Authenticated users can upload
-- Target roles: authenticated  
-- WITH CHECK: auth.uid() IS NOT NULL

-- DELETE Policy (Users delete own files):
-- Policy name: Users can delete their own files
-- Target roles: authenticated
-- USING: auth.uid() IS NOT NULL

-- Note: Once the bucket is created, the upload API at /api/upload/logo will work automatically 