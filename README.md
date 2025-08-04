# Ascension AI - Automated Client Acquisition Engine

Your fully automated client acquisition engine — a one-click system that builds high-converting funnels and ad campaigns based entirely on your offer.

## Overview

Ascension AI is a cutting-edge marketing automation platform that takes your core offer — who it's for, what problem it solves, and why it works — and instantly generates a full-stack marketing system. It writes your video scripts, static and video ad copy, landing pages, email follow-ups, and even builds and hosts your funnel on your custom domain.

### Key Features

- **Smart Funnel Generation**: AI-powered landing pages and complete sales funnels
- **Ad Campaign Creation**: Static and video ad copy with targeting strategies  
- **Email Automation**: Complete email sequences and nurture campaigns
- **Custom Domain Hosting**: Instant deployment with enterprise-grade hosting
- **CRM Integration**: Seamless connection with GoHighLevel, HubSpot, and more
- **Performance Analytics**: Real-time tracking and AI-powered optimization

## Tech Stack

- **Frontend**: Next.js 14 with App Router
- **Styling**: Tailwind CSS with Promethean Design System
- **Backend**: Supabase (Authentication & Database)
- **Components**: Radix UI primitives
- **Icons**: Lucide React
- **Language**: TypeScript

## Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account (for backend services)

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd ascension-ai
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.local.example .env.local
```

Edit `.env.local` with your Supabase credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

4. **Run the development server**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Project Structure

```
ascension-ai/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Homepage
├── components/            # Reusable components
│   └── ui/               # UI components (Button, Card, etc.)
├── lib/                  # Utility functions
│   ├── utils.ts          # Class name utilities
│   └── supabase.ts       # Supabase client
├── styles/               # Global styles
│   └── globals.css       # Main stylesheet
├── colors.css            # Design system colors
├── global-styles.css     # Design system base styles
├── animations.css        # Animation utilities
└── tailwind.config.js    # Tailwind configuration
```

## Design System

This project uses the **Promethean Design System**, a comprehensive dark-themed design system featuring:

- **11-tier color system** (tier-950 to tier-50)
- **Purple brand identity** with professional gradients
- **Inter & Space Grotesk typography**
- **Smooth animations** and premium interactions
- **Accessibility-first** approach

### Key Design Tokens

```css
/* Primary backgrounds */
--tier-950: Main app background
--tier-900: Primary content areas  
--tier-800: Card backgrounds
--tier-700: Input backgrounds

/* Text colors */
--tier-50: Primary text (highest contrast)
--tier-300: Secondary text
--tier-500: Muted text

/* Brand colors */
--purple-600: Primary brand color
--purple-700: Hover states
```

## Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

### Component Development

Components follow the shadcn/ui pattern with class-variance-authority for variants:

```tsx
import { Button } from '@/components/ui/button'

// Usage
<Button variant="default" size="lg">
  Get Started
</Button>
```

### Styling Guidelines

- Use the tier color system for consistent theming
- Apply typography classes (`text-display`, `text-title`, `text-body`)
- Leverage animation utilities for smooth interactions
- Maintain accessibility with proper contrast ratios

## Deployment

### Vercel (Recommended)

1. Connect your repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Other Platforms

The application can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- AWS Amplify
- Docker containers

## Supabase Setup

### Database Schema

The application requires these tables:

```sql
-- Users table (handled by Supabase Auth)
-- User profiles
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name TEXT,
  last_name TEXT,
  company TEXT,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Authentication

Supabase Auth is configured for:
- Email/password authentication
- OAuth providers (Google, GitHub, etc.)
- Row Level Security (RLS)
- User session management

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is proprietary software. All rights reserved.

## Support

For support and questions:
- Documentation: [docs.ascension-ai.com](https://docs.ascension-ai.com)
- Email: support@ascension-ai.com
- Discord: [Join our community](https://discord.gg/ascension-ai)

---

Built with ❤️ for entrepreneurs who refuse to settle for ordinary. 