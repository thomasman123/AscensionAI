# Design System Examples

This folder contains complete, real-world examples of how to implement the Promethean design system in various scenarios.

## Available Examples

### Dashboard Layout (`dashboard-layout.tsx`)
A complete dashboard implementation showcasing:
- **Collapsible sidebar** with hover expansion
- **Navigation patterns** with active states and badges
- **Header with breadcrumbs** and action buttons
- **KPI card grid** with metrics and trends
- **Content cards** with charts and activity feeds
- **Responsive design** that works on all screen sizes

### Usage
```typescript
import { DashboardLayout } from './examples/dashboard-layout'

function App() {
  return <DashboardLayout />
}
```

## Example Features

### Layout Patterns
- **Grid-based layouts** using CSS Grid
- **Responsive design** with mobile-first approach
- **Proper spacing** following the design system scale
- **Consistent elevation** with cards and panels

### Component Integration
- **Button variants** for different actions
- **Card compositions** for content organization
- **Icon usage** with proper sizing and colors
- **Typography hierarchy** throughout the interface

### Interactive Elements
- **Hover effects** with smooth transitions
- **Focus states** for accessibility
- **Loading states** and empty states
- **Navigation feedback** with active indicators

### Color Application
- **Tier system** properly applied
- **Brand colors** for primary actions
- **Status colors** for feedback
- **Proper contrast** for readability

## Implementation Guidelines

### 1. Start with Layout
```typescript
// Define the main layout structure
<div className="min-h-screen bg-tier-900 text-tier-50">
  <div className="grid grid-cols-[auto_1fr] grid-rows-[auto_1fr] h-screen">
    <Sidebar />
    <Header />
    <Main />
  </div>
</div>
```

### 2. Apply Typography
```typescript
// Use the typography scale consistently
<h1 className="text-display text-tier-50">Main Title</h1>
<h2 className="text-title text-tier-100">Section Title</h2>
<p className="text-body text-tier-300">Body content</p>
<span className="text-caption text-tier-400">Supporting text</span>
```

### 3. Implement Spacing
```typescript
// Use consistent spacing throughout
<div className="space-y-6">        {/* Section spacing */}
  <div className="space-y-4">      {/* Related content */}
    <div className="space-y-2">    {/* Tight relationships */}
      {/* Content */}
    </div>
  </div>
</div>
```

## Best Practices Demonstrated

### 1. Accessibility
- Proper ARIA labels and roles
- Keyboard navigation support
- Focus management
- Screen reader friendly markup

### 2. Performance
- Efficient CSS transitions
- Minimal re-renders
- Optimized component structure
- Proper event handling

### 3. Maintainability
- Consistent naming conventions
- Reusable component patterns
- Clear separation of concerns
- Well-documented code

### 4. Responsiveness
- Mobile-first design approach
- Flexible grid systems
- Adaptive component behavior
- Touch-friendly interactions 