# Component Patterns

This folder contains reusable component patterns and examples from the Promethean design system.

## Component Philosophy

The Promethean design system follows these principles:

1. **Composability**: Components are designed to work together seamlessly
2. **Accessibility**: All components follow WCAG guidelines
3. **Consistency**: Unified visual language across all components
4. **Performance**: Optimized for fast rendering and minimal bundle size
5. **Flexibility**: Components accept customization without breaking design principles

## Component Categories

### Foundation Components
- **Button**: Primary interaction elements with multiple variants
- **Card**: Content containers with elevation and spacing
- **Input**: Form inputs with consistent styling
- **Typography**: Text components following the type scale

### Layout Components  
- **Sidebar**: Collapsible navigation with smooth animations
- **Header**: Top navigation with breadcrumbs and filters
- **Grid**: Responsive grid systems for content organization
- **Container**: Content wrappers with responsive padding

### Data Display
- **KPI Card**: Metric display with trends and visual hierarchy
- **Table**: Data tables with sorting and filtering
- **Chart**: Various chart types for data visualization
- **Badge**: Status indicators and labels

### Interaction Components
- **Modal**: Overlay dialogs with backdrop and animations
- **Dropdown**: Menu overlays with proper positioning
- **Tooltip**: Contextual information on hover
- **Popover**: Rich content overlays

### Feedback Components
- **Toast**: Temporary notification messages
- **Alert**: Persistent status messages
- **Loading**: Progress indicators and skeletons
- **Empty State**: Placeholder content for empty data

## Component Structure

Each component follows this structure:

```
component-name/
├── index.ts              # Exports
├── component-name.tsx    # Main component
├── component-name.stories.tsx # Storybook stories (if applicable)
├── component-name.test.tsx    # Unit tests (if applicable)
└── README.md            # Component documentation
```

## Usage Guidelines

### Import Pattern
```typescript
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
```

### Customization Pattern
```typescript
// Using className for customization
<Button className="w-full bg-purple-600 hover:bg-purple-700">
  Custom Button
</Button>

// Using the cn() utility for conditional classes
<Card className={cn(
  "default-styles",
  isActive && "active-styles",
  className
)}>
  Content
</Card>
```

### Variant Pattern
```typescript
// Components use class-variance-authority for variants
const buttonVariants = cva(
  "base-classes",
  {
    variants: {
      variant: {
        default: "default-styles",
        destructive: "destructive-styles",
        outline: "outline-styles",
      },
      size: {
        default: "default-size",
        sm: "small-size",
        lg: "large-size",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)
```

## Component Examples

### Basic Card
```typescript
<Card className="p-6">
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
  </CardHeader>
  <CardContent>
    <p className="text-body text-tier-300">Card content goes here.</p>
  </CardContent>
</Card>
```

### KPI Display
```typescript
<KPICard
  title="Total Revenue"
  metric="$124,590"
  trend={{
    direction: "up",
    value: "+12.5%"
  }}
  subtitle="vs last month"
/>
```

### Interactive Button
```typescript
<Button
  variant="default"
  size="lg"
  onClick={() => console.log('clicked')}
  className="animate-scale-in"
>
  Get Started
</Button>
```

## Accessibility Features

All components include:

- **Keyboard navigation**: Full keyboard support where applicable
- **Screen reader support**: Proper ARIA labels and descriptions
- **Focus management**: Clear focus indicators and logical tab order
- **Color contrast**: WCAG AA compliant color combinations
- **Reduced motion**: Respects user motion preferences

## Performance Considerations

- **Lazy loading**: Components load only when needed
- **Bundle splitting**: Components can be imported individually
- **Tree shaking**: Unused code is eliminated in production
- **Memoization**: Expensive operations are cached

## Customization Guidelines

### Do's
- Use the `cn()` utility for combining classes
- Respect the design tokens (colors, spacing, typography)
- Extend components through composition
- Use CSS custom properties for theming

### Don'ts
- Don't override core design tokens directly
- Don't break accessibility features
- Don't introduce inconsistent patterns
- Don't ignore responsive design principles

## Contributing Components

When adding new components:

1. Follow the established naming conventions
2. Include proper TypeScript types
3. Add comprehensive documentation
4. Ensure accessibility compliance
5. Test across different screen sizes
6. Include usage examples

## Component Checklist

- [ ] Follows design system colors and spacing
- [ ] Includes proper TypeScript types
- [ ] Has responsive design considerations
- [ ] Implements accessibility features
- [ ] Uses consistent naming conventions
- [ ] Includes usage documentation
- [ ] Tested with keyboard navigation
- [ ] Tested with screen readers
- [ ] Optimized for performance
- [ ] Compatible with theming system 