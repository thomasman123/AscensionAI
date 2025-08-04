# AscensionAI - Funnel Builder Platform

A Next.js application for creating high-converting sales funnels with AI-powered copy generation and custom domain support.

## 🚀 Features

- **AI-Powered Copy Generation**: Generate compelling headlines, descriptions, and CTAs
- **Custom Domain Support**: Connect your own domains to individual funnels
- **Real-time Preview**: See changes as you customize your funnels
- **Professional Templates**: Pre-built templates for trigger and gateway funnels
- **User Management**: Secure authentication with Supabase
- **Database Integration**: Store funnels, domains, and user data
- **Responsive Design**: Beautiful UI that works on all devices

## 🛠️ Tech Stack

- **Frontend**: Next.js 13+ (App Router), React, TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **AI Integration**: OpenAI API
- **Deployment**: Vercel
- **Domain Management**: Custom DNS integration

## 📦 Quick Start

### 1. Clone & Setup

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/AscensionAI.git
cd AscensionAI

# Install dependencies
npm install

# Copy environment variables
cp .env.local.example .env.local
```

### 2. Environment Configuration

Create a `.env.local` file with the following variables:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_VERCEL_DOMAIN=your-app.vercel.app
```

### 3. Database Setup

```bash
# Install Supabase CLI
npm install -g @supabase/cli

# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref YOUR_PROJECT_REF

# Run migrations
supabase db push
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🌐 Deployment to Vercel

### Option 1: Deploy from GitHub (Recommended)

1. **Push to GitHub** (if not done yet):
   ```bash
   git add .
   git commit -m "Initial deployment setup"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/AscensionAI.git
   git push -u origin main
   ```

2. **Connect to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Configure environment variables in Vercel dashboard
   - Deploy!

3. **Update Environment Variables**:
   After deployment, update your `.env.local` and Vercel environment variables:
   ```env
   NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
   NEXT_PUBLIC_VERCEL_DOMAIN=your-app.vercel.app
   ```

### Option 2: Deploy with Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Set production environment variables
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
vercel env add SUPABASE_SERVICE_ROLE_KEY
vercel env add OPENAI_API_KEY
vercel env add NEXT_PUBLIC_VERCEL_DOMAIN

# Deploy to production
vercel --prod
```

## 🔧 Custom Domain Configuration

### For Individual Funnels

Users can add custom domains to their funnels through the domain manager:

1. **Add Domain in App**:
   - Go to funnel customization → Domain & Settings
   - Enter your custom domain (e.g., `mycooloffers.com`)
   - Get DNS configuration instructions

2. **Configure DNS Records**:
   Add these records to your domain registrar:
   
   ```
   Type: CNAME
   Name: mycooloffers.com (or @)
   Value: your-app.vercel.app
   TTL: 3600
   
   Type: TXT
   Name: _ascension-verify.mycooloffers.com
   Value: [verification-token]
   TTL: 3600
   ```

3. **Verify Domain**:
   - Wait for DNS propagation (up to 24 hours)
   - Click "Verify" in the domain manager
   - Domain will show as verified once DNS is properly configured

### For Main App Domain

To use a custom domain for the main app:

1. **Add Domain in Vercel**:
   - Go to your Vercel project dashboard
   - Click "Settings" → "Domains"
   - Add your custom domain

2. **Configure DNS**:
   ```
   Type: CNAME
   Name: @ (or www)
   Value: cname.vercel-dns.com
   ```

## 📊 Database Schema

The app uses these main tables:

- `saved_funnels` - Store funnel configurations
- `custom_domains` - Manage custom domain mappings
- `case_studies` - Store funnel case studies
- `user_offer_profiles` - User's reusable offer profiles
- `writing_style_examples` - AI training examples

## 🎨 Customization

### Adding New Templates

1. Create template in `app/funnels/create/template/`
2. Add template metadata to template selection
3. Update customization logic if needed

### Modifying AI Prompts

Edit prompts in `lib/openai-service.ts` to customize AI-generated copy style.

### Custom Styling

- Main styles: `styles/globals.css`
- Color system: `colors.css`
- Component styles: Tailwind CSS classes

## 📱 API Endpoints

### Funnels
- `POST /api/funnels/save` - Save/update funnels
- `GET /api/funnels/save` - Get user's funnels

### Domains
- `POST /api/domains` - Add custom domain
- `GET /api/domains` - Get domains for user/funnel
- `PUT /api/domains` - Verify domain
- `DELETE /api/domains` - Remove domain

### AI
- `POST /api/ai/generate-copy` - Generate funnel copy
- `POST /api/ai/generate-email-sequence` - Generate email sequences

### User
- `GET /api/user/profile` - Get user offer profiles
- `POST /api/user/profile` - Save offer profile

## 🔐 Security

- Row Level Security (RLS) enabled on all tables
- API routes use service role for admin operations
- Environment variables properly segregated
- Input validation on all forms

## 📈 Monitoring

### Vercel Analytics
Enable analytics in your Vercel dashboard for:
- Page views and performance
- Core Web Vitals
- User behavior insights

### Supabase Monitoring
Monitor in Supabase dashboard:
- Database performance
- API usage
- Authentication metrics

## 🐛 Troubleshooting

### Common Issues

1. **404 Errors on Routes**:
   - Check if Next.js build completed successfully
   - Verify file structure matches App Router conventions

2. **Supabase Connection Issues**:
   - Verify environment variables are correct
   - Check RLS policies are properly configured

3. **Domain Verification Failing**:
   - Wait 24 hours for DNS propagation
   - Use DNS checker tools to verify records
   - Ensure TXT record includes the exact verification token

4. **AI Copy Generation Failing**:
   - Check OpenAI API key is valid and has credits
   - Verify API endpoint is reachable

### Environment Variable Checklist

Make sure these are set in both local and production:

- ✅ `NEXT_PUBLIC_SUPABASE_URL`
- ✅ `NEXT_PUBLIC_SUPABASE_ANON_KEY`  
- ✅ `SUPABASE_SERVICE_ROLE_KEY`
- ✅ `OPENAI_API_KEY`
- ✅ `NEXT_PUBLIC_APP_URL`
- ✅ `NEXT_PUBLIC_VERCEL_DOMAIN`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details.

## 🆘 Support

- **Documentation**: Check this README and inline comments
- **Issues**: Open GitHub issues for bugs or feature requests
- **Discussions**: Use GitHub discussions for questions

---

**Happy funnel building!** 🚀

## 🚀 Next Steps After Deployment

1. **Test the Full Flow**:
   - Create a test funnel
   - Test domain addition
   - Verify AI copy generation

2. **Configure Custom Domain** (Optional):
   - Add your main domain to Vercel
   - Update environment variables

3. **Set Up Monitoring**:
   - Enable Vercel Analytics
   - Set up Supabase alerts

4. **Customize for Your Brand**:
   - Update colors and styling
   - Modify AI prompts
   - Add your logo/branding 