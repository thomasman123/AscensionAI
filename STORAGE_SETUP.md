# Supabase Storage Setup Guide

## Overview
This guide walks you through setting up Supabase Storage for handling file uploads (logos, images, etc.) in the AscensionAI platform.

## Benefits of Using Supabase Storage
- **Performance**: Faster page loads by serving images from CDN instead of base64 data
- **Scalability**: No database bloat from storing large base64 strings
- **Cost-effective**: Reduces database storage costs
- **Direct URLs**: Images can be cached by browsers and CDNs

## Setup Instructions

### 1. Create Storage Buckets in Supabase Dashboard

#### Logos Bucket
1. Navigate to your Supabase project dashboard
2. Click on **Storage** in the left sidebar
3. Click **Create a new bucket**
4. Configure the bucket:
   - **Bucket name**: `logos`
   - **Public bucket**: Toggle ON ✅
   - **Allowed MIME types**: 
     ```
     image/png, image/jpeg, image/gif, image/webp, image/svg+xml
     ```
   - **Max file size**: 5MB (5242880 bytes)

#### Case Studies Bucket
1. Click **Create a new bucket** again
2. Configure the bucket:
   - **Bucket name**: `case-studies`
   - **Public bucket**: Toggle ON ✅
   - **Allowed MIME types**: 
     ```
     image/png, image/jpeg, image/gif, image/webp
     ```
   - **Max file size**: 10MB (10485760 bytes)

### 2. Configure Storage Policies

After creating the buckets, run these SQL commands in your Supabase SQL Editor:

```sql
-- Storage Policies for Logos Bucket
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
```

### 3. Test the Implementation

1. **Logo Upload**: Go to any funnel creation or edit page
   - Upload a logo using the logo upload field
   - Check the browser console for any errors
   - Verify the logo displays correctly

2. **Case Study Images**: Go to case studies section
   - Select "Image" option
   - Upload an image
   - Verify it displays correctly

3. **Case Study Videos**: 
   - Select "Video" option
   - Paste a YouTube, Vimeo, or Loom URL
   - Verify the video embeds correctly

## Implementation Details

### API Routes
1. **Logo Upload** (`/api/upload/logo`):
   - Validates file type and size (5MB max)
   - Uploads to `logos` bucket
   - Returns public URL

2. **Case Study Upload** (`/api/upload/case-study`):
   - Validates image files only (10MB max)
   - Uploads to `case-studies` bucket
   - Returns public URL

### Components
1. **MediaUpload Component**:
   - Automatically detects logo uploads
   - Uses Supabase Storage for logos
   - Falls back to base64 for other media

2. **CaseStudyForm Component**:
   - Toggle between image upload and video embed
   - Images uploaded to Supabase Storage
   - Videos stored as embed URLs (no file upload)

### URL Formats
- **Logo URLs**: `https://[project-id].supabase.co/storage/v1/object/public/logos/logo-[timestamp].[ext]`
- **Case Study Images**: `https://[project-id].supabase.co/storage/v1/object/public/case-studies/case-study-[timestamp].[ext]`
- **Video Embeds**: Direct YouTube/Vimeo/Loom embed URLs

## Troubleshooting

### Common Issues

1. **"Failed to upload file" error**
   - Check that both buckets exist and are public
   - Verify the storage policies are configured correctly
   - Check Supabase logs for detailed error messages

2. **Images not displaying**
   - Ensure the buckets are set to public
   - Check that the SELECT policy allows anonymous access
   - Verify the URL is correctly formatted

3. **Video embeds not working**
   - Ensure you're using a supported platform (YouTube, Vimeo, Loom)
   - Check that the URL is a valid video link
   - Try using the share URL from the platform

### Debugging Steps
1. Check browser Network tab for failed requests
2. Look at Supabase logs under Settings > Logs
3. Test with a small PNG file first
4. Verify environment variables are set correctly

## Migration of Existing Data

For existing base64 images in the database:
1. Logos will continue to work (system handles both formats)
2. Case study images stored as base64 will still display
3. New uploads will automatically use Supabase Storage

## Future Enhancements

Consider extending storage for:
- VSL video uploads (currently using embed URLs)
- User avatars
- Other marketing assets
- Document uploads (PDFs, etc.)

## Security Considerations

- Only authenticated users can upload
- File type validation prevents malicious uploads
- Size limits prevent storage abuse
- Public URLs are unguessable due to timestamps
- Video embeds avoid large file storage costs 