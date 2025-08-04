# Dependencies & Setup

This document outlines all the required dependencies and setup steps to implement the Promethean design system.

## Required Dependencies

### Core Dependencies

```json
{
  "dependencies": {
    "react": "^18.0.0",
    "next": "^14.0.0",
    "tailwindcss": "^3.4.0",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.0.0",
    "tailwind-merge": "^2.0.0",
    "@radix-ui/react-slot": "^1.0.2",
    "lucide-react": "^0.400.0"
  },
  "devDependencies": {
    "@tailwindcss/typography": "^0.5.10",
    "tailwindcss-animate": "^1.0.7",
    "postcss": "^8.0.0",
    "autoprefixer": "^10.0.0"
  }
}
```

### Font Dependencies

The design system uses Google Fonts. Add this to your HTML head or CSS:

```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&family=Space+Grotesk:wght@300;400;500;600;700&display=swap');
```

### Icon Library

```bash
npm install lucide-react
```

Alternative icon libraries that work well:
- `@heroicons/react`
- `react-icons`
- `@radix-ui/react-icons`

## Setup Instructions

### 1. Install Dependencies

```bash
npm install tailwindcss class-variance-authority clsx tailwind-merge
npm install @radix-ui/react-slot lucide-react
npm install -D @tailwindcss/typography tailwindcss-animate
```

### 2. Tailwind Configuration

Create or update `tailwind.config.js`:

```javascript
const { fontFamily } = require("tailwindcss/defaultTheme")

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        purple: {
          50: "hsl(var(--purple-50))",
          100: "hsl(var(--purple-100))",
          200: "hsl(var(--purple-200))",
          300: "hsl(var(--purple-300))",
          400: "hsl(var(--purple-400))",
          500: "hsl(var(--purple-500))",
          600: "hsl(var(--purple-600))",
          700: "hsl(var(--purple-700))",
          800: "hsl(var(--purple-800))",
          900: "hsl(var(--purple-900))",
          950: "hsl(var(--purple-950))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ["var(--font-sans)", ...fontFamily.sans],
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "100%": {
            transform: "translateX(100%)",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.5s ease-out",
        "fade-up": "fade-up 0.5s ease-out",
        shimmer: "shimmer 2s infinite",
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    require("@tailwindcss/typography"),
  ],
}
```

### 3. Global CSS Setup

Create your global CSS file (e.g., `app/globals.css` or `styles/globals.css`):

```css
/* Import the design system */
@import '../design/global-styles.css';

/* Additional Tailwind layers */
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### 4. Utils Function

Create `lib/utils.ts`:

```typescript
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

### 5. Component Configuration

If using shadcn/ui, create `components.json`:

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "default",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "tailwind.config.js",
    "css": "app/globals.css",
    "baseColor": "slate",
    "cssVariables": true,
    "prefix": ""
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/hooks"
  },
  "iconLibrary": "lucide"
}
```

## Framework-Specific Setup

### Next.js

Add font configuration to your layout:

```typescript
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

### Vite/React

Add font loading to your index.html:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&family=Space+Grotesk:wght@300;400;500;600;700&display=swap" rel="stylesheet">
```

### PostCSS Configuration

Create `postcss.config.js`:

```javascript
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

## Optional Enhancements

### Theme Provider (for theme switching)

```bash
npm install next-themes
```

```typescript
// components/theme-provider.tsx
"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"

export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}
```

### Additional Radix UI Components

```bash
npm install @radix-ui/react-dialog
npm install @radix-ui/react-dropdown-menu
npm install @radix-ui/react-popover
npm install @radix-ui/react-tooltip
```

### Form Handling

```bash
npm install react-hook-form @hookform/resolvers zod
```

### Animation Library (optional)

```bash
npm install framer-motion
```

## Environment Setup

### TypeScript Configuration

Add to your `tsconfig.json`:

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"],
      "@/components/*": ["./components/*"],
      "@/lib/*": ["./lib/*"],
      "@/hooks/*": ["./hooks/*"]
    }
  }
}
```

### ESLint Configuration

```json
{
  "extends": [
    "next/core-web-vitals",
    "@typescript-eslint/recommended"
  ],
  "rules": {
    "@typescript-eslint/no-unused-vars": "error",
    "@typescript-eslint/no-explicit-any": "warn"
  }
}
```

## Verification

After setup, verify everything works by creating a test component:

```typescript
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function TestPage() {
  return (
    <div className="p-8 bg-tier-900 min-h-screen">
      <Card className="max-w-md">
        <CardHeader>
          <CardTitle className="text-title">Test Component</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-body text-tier-300 mb-4">
            If you can see this styled correctly, the design system is working!
          </p>
          <Button className="btn-primary">
            Test Button
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
```

## Troubleshooting

### Common Issues

1. **Fonts not loading**: Check network requests in browser dev tools
2. **Colors not working**: Ensure CSS custom properties are imported
3. **Components not styled**: Verify Tailwind is processing your files
4. **TypeScript errors**: Check path aliases in tsconfig.json

### Debug Commands

```bash
# Check Tailwind build
npx tailwindcss -i ./src/globals.css -o ./dist/output.css --watch

# Verify dependencies
npm list tailwindcss class-variance-authority clsx

# Check PostCSS processing
npx postcss src/globals.css -o dist/output.css
``` 