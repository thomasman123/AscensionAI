# Supabase Storage Bucket Setup - Dashboard Instructions

## Important: Storage policies must be set through the Dashboard, not SQL!

### Step 1: Create the Logos Bucket

1. Go to your Supabase Dashboard
2. Click **Storage** in the left sidebar
3. Click **New bucket**
4. Configure:
   - Name: `logos`
   - Public bucket: **ON** ✅
   - Click **Create bucket**

### Step 2: Set Logos Bucket Policies

1. Click on the `logos` bucket
2. Click **Policies** tab
3. Click **New policy** and select **For full customization**

#### Create SELECT Policy (Public Read):
- Policy name: `Public Read Access`
- Allowed operation: **SELECT**
- Target roles: Check both `anon` and `authenticated`
- Policy definition:
  ```
  true
  ```
- Click **Review** then **Save policy**

#### Create INSERT Policy (Upload):
- Click **New policy** → **For full customization**
- Policy name: `Authenticated Upload`
- Allowed operation: **INSERT**
- Target roles: Check `authenticated`
- Policy definition:
  ```
  (auth.uid() IS NOT NULL)
  ```
- Click **Review** then **Save policy**

#### Create UPDATE Policy:
- Click **New policy** → **For full customization**
- Policy name: `Authenticated Update`
- Allowed operation: **UPDATE**
- Target roles: Check `authenticated`
- USING expression:
  ```
  (auth.uid() IS NOT NULL)
  ```
- WITH CHECK expression:
  ```
  (auth.uid() IS NOT NULL)
  ```
- Click **Review** then **Save policy**

#### Create DELETE Policy:
- Click **New policy** → **For full customization**
- Policy name: `Authenticated Delete`
- Allowed operation: **DELETE**
- Target roles: Check `authenticated`
- USING expression:
  ```
  (auth.uid() IS NOT NULL)
  ```
- Click **Review** then **Save policy**

### Step 3: Create the Case Studies Bucket

1. Go back to Storage main page
2. Click **New bucket**
3. Configure:
   - Name: `case-studies`
   - Public bucket: **ON** ✅
   - Click **Create bucket**

### Step 4: Set Case Studies Bucket Policies

Repeat the same policies as above for the `case-studies` bucket:

1. **Public Read Access** (SELECT) - `true`
2. **Authenticated Upload** (INSERT) - `(auth.uid() IS NOT NULL)`
3. **Authenticated Update** (UPDATE) - `(auth.uid() IS NOT NULL)` for both USING and WITH CHECK
4. **Authenticated Delete** (DELETE) - `(auth.uid() IS NOT NULL)`

### Step 5: Configure File Upload Limits (Optional)

For each bucket, you can also set:

1. Click on the bucket name
2. Click **Configuration** tab
3. Set:
   - **Allowed MIME types**: 
     - For logos: `image/png,image/jpeg,image/gif,image/webp,image/svg+xml`
     - For case-studies: `image/png,image/jpeg,image/gif,image/webp`
   - **Max file size**: 
     - For logos: 5MB (5242880 bytes)
     - For case-studies: 10MB (10485760 bytes)

### Quick Policy Templates Alternative

Instead of custom policies, you can use templates:

1. When creating a new policy, choose **Get started quickly**
2. Select:
   - **Give users access to only their own top level folder** for INSERT/UPDATE/DELETE
   - **Give all users access to a folder** for SELECT (set folder to `/`)

### Verify Your Setup

1. Test uploading a logo through your app
2. Check that the image displays publicly
3. Try uploading without authentication (should fail)
4. Check browser console for any errors

### Troubleshooting

If uploads fail:
- Ensure buckets are set to PUBLIC
- Check that all 4 policies exist for each bucket
- Verify your Supabase anon/service keys are correct
- Look at browser Network tab for detailed errors
- Check Supabase Dashboard → Settings → API Logs 