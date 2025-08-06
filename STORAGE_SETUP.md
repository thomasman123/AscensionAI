# Supabase Storage Setup Guide

## Overview
This guide walks you through setting up Supabase Storage for handling file uploads (logos, images, etc.) in the AscensionAI platform.

## Benefits of Using Supabase Storage
- **Performance**: Faster page loads by serving images from CDN instead of base64 data
- **Scalability**: No database bloat from storing large base64 strings
- **Cost-effective**: Reduces database storage costs
- **Direct URLs**: Images can be cached by browsers and CDNs

## Setup Instructions

### 1. Create Storage Bucket in Supabase Dashboard

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

### 2. Configure Storage Policies

After creating the bucket, set up the following policies:

#### SELECT Policy (Public Read Access)
- **Policy name**: `Public Access`
- **Target roles**: `anon, authenticated`
- **WITH CHECK expression**: `true`

#### INSERT Policy (Authenticated Upload)
- **Policy name**: `Authenticated users can upload`
- **Target roles**: `authenticated`
- **WITH CHECK expression**: `auth.uid() IS NOT NULL`

#### DELETE Policy (Optional - for file management)
- **Policy name**: `Users can delete files`
- **Target roles**: `authenticated`
- **USING expression**: `auth.uid() IS NOT NULL`

### 3. Test the Implementation

1. Go to any funnel creation or edit page
2. Upload a logo using the logo upload field
3. Check the browser console for any errors
4. Verify the logo displays correctly

## Implementation Details

### API Route
The upload is handled by `/api/upload/logo` which:
- Validates file type and size
- Generates unique filenames with timestamps
- Uploads to Supabase Storage
- Returns the public URL

### MediaUpload Component
The component automatically detects logo uploads and:
- Uses Supabase Storage for logo images
- Falls back to base64 for other media types
- Shows upload progress and errors

### URL Format
Uploaded files will have URLs like:
```
https://[project-id].supabase.co/storage/v1/object/public/logos/logo-[timestamp].[ext]
```

## Troubleshooting

### Common Issues

1. **"Failed to upload file" error**
   - Check that the bucket exists and is public
   - Verify the storage policies are configured correctly
   - Check Supabase logs for detailed error messages

2. **Images not displaying**
   - Ensure the bucket is set to public
   - Check that the SELECT policy allows anonymous access
   - Verify the URL is correctly formatted

3. **Upload fails silently**
   - Check browser console for errors
   - Verify your Supabase service key is configured
   - Check file size and type restrictions

### Debugging Steps
1. Check browser Network tab for failed requests
2. Look at Supabase logs under Settings > Logs
3. Test with a small PNG file first
4. Verify environment variables are set correctly

## Migration of Existing Data

For existing base64 logos in the database, you can:
1. Create a migration script to extract and upload them
2. Update the database records with new URLs
3. Or leave them as-is (the system handles both formats)

## Future Enhancements

Consider extending storage for:
- Case study images/videos
- VSL video uploads
- User avatars
- Other marketing assets

## Security Considerations

- Only authenticated users can upload
- File type validation prevents malicious uploads
- Size limits prevent storage abuse
- Public URLs are unguessable due to timestamps 