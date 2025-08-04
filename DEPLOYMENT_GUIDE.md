# 🚀 Deployment Guide - AscensionAI Funnel Builder

This guide walks you through deploying AscensionAI to GitHub and Vercel with custom domain support.

## 📋 Prerequisites Checklist

Before starting, make sure you have:

- [ ] **GitHub Account** - [Sign up here](https://github.com)
- [ ] **Vercel Account** - [Sign up here](https://vercel.com) (can use GitHub login)
- [ ] **Supabase Account** - [Sign up here](https://supabase.com)
- [ ] **OpenAI Account** - [Get API key here](https://platform.openai.com/api-keys)
- [ ] **Domain** (optional) - For custom branding

## 🔧 Step 1: Environment Setup

### Create Environment Variables File

Create a `.env.local` file in your project root with these variables:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here

# OpenAI Configuration  
OPENAI_API_KEY=sk-your_openai_api_key_here

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_VERCEL_DOMAIN=your-app.vercel.app
```

### Where to Get These Values:

**Supabase Variables:**
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project → Settings → API
3. Copy:
   - `URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon/public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` key → `SUPABASE_SERVICE_ROLE_KEY`

**OpenAI API Key:**
1. Go to [OpenAI Platform](https://platform.openai.com/api-keys)
2. Create new API key
3. Copy the key → `OPENAI_API_KEY`

## 📊 Step 2: Database Setup

### Run Supabase Migrations

```bash
# Install Supabase CLI (if not installed)
npm install -g @supabase/cli

# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref YOUR_PROJECT_REF

# Push the database schema
supabase db push
```

**Alternative: Manual Setup**
If CLI doesn't work, copy and run each migration file manually in Supabase SQL Editor:
1. `supabase/migrations/20240101000001_create_funnel_tables.sql`
2. `supabase/migrations/20240101000002_create_tables_safe.sql`
3. `supabase/migrations/20240101000003_add_default_user.sql`
4. `supabase/migrations/20240101000004_simple_fix.sql`
5. `supabase/migrations/20240101000005_add_custom_domains.sql`

## 📨 Step 3: GitHub Repository Setup

### Option A: Create New Repository on GitHub

1. Go to [GitHub](https://github.com) and click "New repository"
2. Name it "AscensionAI" (or your preferred name)
3. Keep it public or private (your choice)
4. Don't initialize with README (we already have one)
5. Click "Create repository"

### Option B: Use GitHub CLI (if installed)

```bash
# Create repository on GitHub
gh repo create AscensionAI --public --source=. --remote=origin --push
```

### Push Your Code

```bash
# Initialize git (if not done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit: AscensionAI funnel builder"

# Add remote (replace YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/AscensionAI.git

# Rename branch to main
git branch -M main

# Push to GitHub
git push -u origin main
```

## 🌐 Step 4: Vercel Deployment

### Connect GitHub to Vercel

1. **Login to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Sign in with GitHub account

2. **Import Project**:
   - Click "New Project"
   - Import your AscensionAI repository
   - Leave all settings as default
   - Click "Deploy"

3. **Add Environment Variables**:
   After deployment, go to your project → Settings → Environment Variables and add:

   ```
   NEXT_PUBLIC_SUPABASE_URL = your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY = your_anon_key
   SUPABASE_SERVICE_ROLE_KEY = your_service_role_key  
   OPENAI_API_KEY = your_openai_key
   NEXT_PUBLIC_VERCEL_DOMAIN = your-app.vercel.app
   ```

4. **Update App URL**:
   After deployment, update these environment variables:
   ```
   NEXT_PUBLIC_APP_URL = https://your-app.vercel.app
   ```

5. **Redeploy**:
   - Go to Deployments tab
   - Click "Redeploy" on the latest deployment

## 🔧 Step 5: Custom Domain Setup (Optional)

### For Main App

1. **In Vercel Dashboard**:
   - Go to Project → Settings → Domains
   - Add your domain (e.g., `myapp.com`)

2. **Configure DNS**:
   Add CNAME record in your domain registrar:
   ```
   Type: CNAME
   Name: @ (or www)
   Value: cname.vercel-dns.com
   TTL: 3600
   ```

3. **Update Environment Variables**:
   ```
   NEXT_PUBLIC_APP_URL = https://myapp.com
   NEXT_PUBLIC_VERCEL_DOMAIN = myapp.com
   ```

### For Individual Funnels

Users can add their own domains through the app:
1. Go to funnel customization → Domain & Settings
2. Add domain and follow DNS instructions
3. Verify domain once DNS propagates

## ✅ Step 6: Testing

### Test Basic Functionality

1. **Access Your App**:
   - Visit your Vercel URL
   - Make sure homepage loads

2. **Test Funnel Creation**:
   - Create a test funnel
   - Go through all steps
   - Verify save functionality

3. **Test Domain Management**:
   - Add a test domain
   - Check DNS instructions appear
   - Test verification (may fail until DNS is set up)

4. **Test AI Features**:
   - Try generating copy
   - Check OpenAI integration

## 🚨 Troubleshooting

### Common Issues & Solutions

**❌ Build Fails**
- Check all environment variables are set
- Verify Supabase connection
- Check TypeScript errors

**❌ 404 Errors**
- Wait a few minutes for deployment
- Check if build completed successfully
- Verify routing in Next.js

**❌ API Errors**
- Verify environment variables in Vercel
- Check Supabase RLS policies
- Ensure service role key is correct

**❌ OpenAI Not Working**
- Verify API key is valid
- Check you have credits in OpenAI account
- Test API key with curl

**❌ Domain Issues**
- Wait 24 hours for DNS propagation
- Use DNS checkers to verify records
- Make sure verification token is exact

### Debug Commands

```bash
# Test Supabase connection
curl -H "apikey: YOUR_ANON_KEY" https://YOUR_PROJECT.supabase.co/rest/v1/

# Test OpenAI API
curl -H "Authorization: Bearer YOUR_OPENAI_KEY" https://api.openai.com/v1/models
```

## 📈 Step 7: Monitoring & Analytics

### Enable Vercel Analytics

1. In Vercel Dashboard → Analytics
2. Enable analytics for your project
3. View performance metrics

### Supabase Monitoring

1. In Supabase Dashboard → Logs
2. Monitor API usage and errors
3. Set up alerts for high usage

## 🔐 Security Checklist

- [ ] Environment variables are secure
- [ ] Service role key is only in Vercel, not in code
- [ ] RLS policies are enabled
- [ ] API endpoints validate input
- [ ] HTTPS is enforced

## 🎉 Success!

Your AscensionAI funnel builder is now deployed! 

**Next Steps:**
1. Create your first funnel
2. Test custom domain functionality  
3. Customize branding and colors
4. Set up monitoring alerts
5. Start building funnels!

---

## 📞 Need Help?

- **GitHub Issues**: Report bugs or request features
- **Vercel Docs**: [vercel.com/docs](https://vercel.com/docs)
- **Supabase Docs**: [supabase.com/docs](https://supabase.com/docs)
- **Next.js Docs**: [nextjs.org/docs](https://nextjs.org/docs)

**Happy building!** 🚀 