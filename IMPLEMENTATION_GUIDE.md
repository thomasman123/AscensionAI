# Implementation Guide

This guide walks you through replicating the Promethean design system in your own application step by step.

## Quick Start (5 minutes)

### 1. Copy Essential Files
Copy these files to your project:
```
design/colors.css          → src/styles/design-system/colors.css
design/global-styles.css   → src/styles/design-system/global.css
design/animations.css      → src/styles/design-system/animations.css
```

### 2. Install Dependencies
```bash
npm install tailwindcss class-variance-authority clsx tailwind-merge @radix-ui/react-slot lucide-react
```

### 3. Update Your Main CSS
```css
/* In your main CSS file (e.g., globals.css) */
@import './design-system/global.css';
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### 4. Copy Tailwind Config
Replace your `tailwind.config.js` with the configuration from `design/dependencies.md`.

### 5. Add Utils Function
```typescript
// lib/utils.ts
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

**You're ready to go!** Start using the design system classes and components.

## Full Implementation (30 minutes)

### Step 1: Project Setup

#### Install All Dependencies
```bash
# Core dependencies
npm install tailwindcss class-variance-authority clsx tailwind-merge
npm install @radix-ui/react-slot lucide-react
npm install -D @tailwindcss/typography tailwindcss-animate
```

### Step 2: Design System Integration

#### Copy Design System Files
1. Create `design-system/` folder in your project
2. Copy all files from this `design/` folder
3. Update import paths as needed

#### Update Your Layout
```typescript
// For Next.js app/layout.tsx
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-sans",
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  )
}
```

### Step 3: Component Implementation

#### Create Base Components
```typescript
// components/ui/button.tsx
// Copy from design/components/button.tsx

// components/ui/card.tsx  
// Copy from your original components/ui/card.tsx

// components/ui/input.tsx
// Create following the patterns in global-styles.css
```

### Step 4: Page Implementation

#### Dashboard Page Example
```typescript
// pages/dashboard.tsx or app/dashboard/page.tsx
import { MainLayout } from '@/components/layout/main-layout'
import { KPICard } from '@/components/ui/kpi-card'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function Dashboard() {
  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-display text-tier-50">Dashboard</h1>
          <p className="text-body text-tier-300">Welcome back!</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <KPICard 
            title="Revenue" 
            metric="$124,590" 
            trend={{ direction: "up", value: "+12%" }}
          />
        </div>
      </div>
    </MainLayout>
  )
}
```

### Step 5: Customization

#### Brand Colors
```css
/* Customize in colors.css */
:root {
  /* Change purple to your brand color */
  --purple-600: 200 100% 50%;  /* Custom blue */
  --brand-primary: var(--purple-600);
}
```

## Framework-Specific Instructions

### Next.js 14+ (App Router)
```typescript
// app/layout.tsx
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" })

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  )
}
```

### Vite + React
```typescript
// main.tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'  // Contains design system imports

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <div className="dark">
      <App />
    </div>
  </React.StrictMode>,
)
```

## Testing Your Implementation

### Visual Testing
1. **Typography**: Test all text classes (`text-display`, `text-title`, etc.)
2. **Colors**: Verify tier colors and purple palette work
3. **Spacing**: Check consistent spacing across components
4. **Animations**: Test hover effects and transitions

### Component Testing
```typescript
// Test basic components
<Button variant="default">Default Button</Button>
<Button variant="destructive">Destructive</Button>
<Button variant="outline">Outline</Button>

<Card className="p-6">
  <h3 className="text-title text-tier-100">Card Title</h3>
  <p className="text-body text-tier-300">Card content</p>
</Card>
```

## Deployment Checklist

- [ ] All design system files copied
- [ ] Dependencies installed
- [ ] Tailwind config updated  
- [ ] Fonts loading correctly
- [ ] Colors displaying properly
- [ ] Animations working smoothly
- [ ] Responsive design tested
- [ ] Accessibility verified
- [ ] Performance optimized
- [ ] Production build tested

With this implementation, you'll have a pixel-perfect replica of the Promethean design system that can be customized for your specific needs while maintaining the sophisticated, professional aesthetic. 