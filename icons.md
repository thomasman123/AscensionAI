# Icon Guidelines

The Promethean design system uses Lucide React as the primary icon library for consistent, high-quality iconography.

## Icon Library

### Primary: Lucide React
- **Package**: `lucide-react`
- **Style**: Consistent stroke-based icons
- **Sizes**: 16px, 20px, 24px, 32px (with 24px as default)
- **Stroke width**: 1.5-2 (adjustable based on context)

### Installation
```bash
npm install lucide-react
```

### Basic Usage
```typescript
import { Home, User, Settings, ChevronRight } from 'lucide-react'

function Component() {
  return (
    <div>
      <Home className="h-5 w-5 text-tier-400" />
      <User className="h-6 w-6 text-tier-200" strokeWidth={1.5} />
    </div>
  )
}
```

## Icon Sizing

### Standard Sizes
```css
/* Extra small - 16px */
.icon-xs { height: 1rem; width: 1rem; }

/* Small - 20px */  
.icon-sm { height: 1.25rem; width: 1.25rem; }

/* Default - 24px */
.icon-md { height: 1.5rem; width: 1.5rem; }

/* Large - 32px */
.icon-lg { height: 2rem; width: 2rem; }

/* Extra large - 40px */
.icon-xl { height: 2.5rem; width: 2.5rem; }
```

### Tailwind Classes
```typescript
// Using Tailwind size utilities
<Icon className="h-4 w-4" />   // 16px
<Icon className="h-5 w-5" />   // 20px  
<Icon className="h-6 w-6" />   // 24px (default)
<Icon className="h-8 w-8" />   // 32px
<Icon className="h-10 w-10" /> // 40px
```

## Color Guidelines

### Icon Colors
```css
/* Primary icon color - high contrast */
.icon-primary { color: hsl(var(--tier-50)); }

/* Secondary icon color - medium contrast */  
.icon-secondary { color: hsl(var(--tier-200)); }

/* Muted icon color - low contrast */
.icon-muted { color: hsl(var(--tier-400)); }

/* Disabled icon color */
.icon-disabled { color: hsl(var(--tier-600)); }

/* Brand icon color */
.icon-brand { color: hsl(var(--purple-600)); }

/* Status colors */
.icon-success { color: hsl(var(--status-success)); }
.icon-warning { color: hsl(var(--status-warning)); }
.icon-error { color: hsl(var(--status-error)); }
```

### Usage Examples
```typescript
// High contrast for primary actions
<Home className="h-5 w-5 text-tier-50" />

// Medium contrast for secondary elements
<Settings className="h-5 w-5 text-tier-200" />

// Low contrast for supporting elements
<ChevronRight className="h-4 w-4 text-tier-400" />

// Brand color for brand elements
<Zap className="h-5 w-5 text-purple-600" />
```

## Common Icon Patterns

### Navigation Icons
```typescript
import { 
  Home,
  BarChart3, 
  CreditCard,
  Shield,
  Settings,
  Users,
  Sparkles
} from 'lucide-react'

// Sidebar navigation
const navigationIcons = {
  dashboard: Home,
  analytics: BarChart3,
  appointments: CreditCard,
  security: Shield,
  settings: Settings,
  team: Users,
  ai: Sparkles
}
```

### Action Icons
```typescript
import {
  Plus,
  Edit3,
  Trash2,
  Download,
  Upload,
  Search,
  Filter,
  MoreHorizontal
} from 'lucide-react'

// Common actions
const actionIcons = {
  add: Plus,
  edit: Edit3,
  delete: Trash2,
  download: Download,
  upload: Upload,
  search: Search,
  filter: Filter,
  menu: MoreHorizontal
}
```

### Status Icons
```typescript
import {
  CheckCircle2,
  AlertCircle,
  XCircle,
  Info,
  TrendingUp,
  TrendingDown
} from 'lucide-react'

// Status indicators
const statusIcons = {
  success: CheckCircle2,
  warning: AlertCircle,
  error: XCircle,
  info: Info,
  positive: TrendingUp,
  negative: TrendingDown
}
```

## Icon Implementation

### Button Icons
```typescript
<Button variant="default" size="sm">
  <Plus className="h-4 w-4 mr-2" />
  Add Item
</Button>

<Button variant="ghost" size="icon">
  <Settings className="h-4 w-4" />
</Button>
```

### Card Icons
```typescript
<Card>
  <CardHeader className="flex flex-row items-center space-y-0 pb-2">
    <CardTitle className="text-sm font-medium">
      Total Revenue
    </CardTitle>
    <DollarSign className="h-4 w-4 text-tier-400" />
  </CardHeader>
  <CardContent>
    <div className="text-2xl font-bold">$45,231.89</div>
  </CardContent>
</Card>
```

### List Icons
```typescript
<div className="flex items-center gap-3">
  <div className="p-2 bg-tier-800 rounded-lg">
    <FileText className="h-5 w-5 text-tier-300" />
  </div>
  <div>
    <p className="text-sm font-medium text-tier-100">Document Name</p>
    <p className="text-xs text-tier-400">2 hours ago</p>
  </div>
</div>
```

## Accessibility

### ARIA Labels
```typescript
// For icon-only buttons
<Button variant="ghost" size="icon" aria-label="Settings">
  <Settings className="h-4 w-4" />
</Button>

// For decorative icons (hide from screen readers)
<div>
  <Home className="h-5 w-5" aria-hidden="true" />
  <span>Home</span>
</div>
```

### Focus States
```typescript
// Icons inherit focus states from parent elements
<button className="focus:ring-2 focus:ring-purple-500 rounded">
  <Search className="h-5 w-5" />
</button>
```

## Customization

### Stroke Width
```typescript
// Thin stroke for large icons
<Home className="h-8 w-8" strokeWidth={1} />

// Default stroke
<Home className="h-6 w-6" strokeWidth={1.5} />

// Bold stroke for emphasis
<Home className="h-4 w-4" strokeWidth={2} />
```

### Animation
```typescript
// Rotating icon
<RefreshCw className="h-4 w-4 animate-spin" />

// Hover effects
<button className="group">
  <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
</button>
```

## Icon Guidelines

### Do's
- Use consistent sizing throughout the interface
- Maintain proper contrast ratios
- Provide alt text for meaningful icons
- Use semantic icons that match their function
- Keep stroke width consistent within the same context

### Don'ts  
- Don't mix icon styles (outlined vs filled)
- Don't use icons smaller than 16px for interactive elements
- Don't rely solely on color to convey meaning
- Don't use too many different icon sizes in one interface
- Don't use icons without proper spacing

## Brand Icon Usage

### Logo Icon
```typescript
// Brand icon in sidebar
<div className="flex items-center gap-3">
  <div className="w-8 h-8 bg-gradient-to-br from-tier-700 to-tier-600 rounded-lg flex items-center justify-center">
    <Zap className="w-4 h-4 text-tier-100" strokeWidth={2} />
  </div>
  <span className="font-semibold text-tier-100">PROMETHEAN</span>
</div>
```

### Loading States
```typescript
// Loading spinner
<Loader2 className="h-4 w-4 animate-spin" />

// Loading dots animation
<MoreHorizontal className="h-4 w-4 animate-pulse" />
```

## Performance Considerations

- Icons are tree-shakeable - only import what you use
- Use consistent icons to improve caching
- Consider icon sprites for very large applications
- SVG icons scale perfectly at all sizes

## Alternative Icon Libraries

If Lucide doesn't have a needed icon:

### Heroicons
```bash
npm install @heroicons/react
```

### React Icons  
```bash
npm install react-icons
```

### Radix Icons
```bash
npm install @radix-ui/react-icons
```

Use these sparingly and ensure visual consistency with the primary Lucide icons. 