# Spacing & Layout System

The Promethean design system uses a consistent spacing scale and layout patterns for visual harmony.

## Spacing Scale

### CSS Custom Properties
```css
:root {
  --spacing-xs: 0.25rem;  /* 4px */
  --spacing-sm: 0.5rem;   /* 8px */
  --spacing-md: 1rem;     /* 16px */
  --spacing-lg: 1.5rem;   /* 24px */
  --spacing-xl: 2rem;     /* 32px */
}
```

### Tailwind CSS Scale
The design system follows Tailwind's spacing scale for consistency:

| Token | Value | Pixels | Usage |
|-------|-------|--------|-------|
| `1` | 0.25rem | 4px | Small gaps, borders |
| `2` | 0.5rem | 8px | Tight spacing |
| `3` | 0.75rem | 12px | Form element spacing |
| `4` | 1rem | 16px | Default spacing |
| `6` | 1.5rem | 24px | Comfortable spacing |
| `8` | 2rem | 32px | Large spacing |
| `12` | 3rem | 48px | Section spacing |
| `16` | 4rem | 64px | Major section gaps |

## Border Radius

### CSS Custom Properties
```css
:root {
  --radius-xs: 0.125rem;  /* 2px */
  --radius-sm: 0.25rem;   /* 4px */
  --radius-md: 0.375rem;  /* 6px */
  --radius-lg: 0.5rem;    /* 8px */
  --radius: var(--radius-md); /* Default radius */
}
```

### Usage Guidelines
- **xs (2px)**: Small elements, badges, indicators
- **sm (4px)**: Buttons, form inputs, small cards
- **md (6px)**: Default for most components, cards, modals
- **lg (8px)**: Large cards, containers, panels

## Layout Dimensions

### Key Layout Variables
```css
:root {
  --sidebar-width: 280px;
  --sidebar-collapsed-width: 72px;
  --header-height: 64px;
}
```

### Container Patterns
```css
/* Standard container */
.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;
}

/* Main content area */
.main-content {
  min-height: calc(100vh - var(--header-height));
  padding: 1.5rem;
}

/* Card container */
.card-container {
  padding: 1rem;
  border-radius: var(--radius-md);
  background: hsl(var(--tier-800));
}
```

## Component Spacing Patterns

### Card Spacing
```css
/* Card header */
.card-header {
  padding: 1rem; /* 16px */
  border-bottom: 1px solid hsl(var(--tier-700));
}

/* Card content */
.card-content {
  padding: 1rem; /* 16px */
}

/* Card footer */
.card-footer {
  padding: 1rem; /* 16px */
  padding-top: 0;
}
```

### Form Spacing
```css
/* Form groups */
.form-group {
  margin-bottom: 1.5rem; /* 24px */
}

/* Label spacing */
.form-label {
  margin-bottom: 0.5rem; /* 8px */
}

/* Input spacing */
.form-input {
  padding: 0.5rem 0.75rem; /* 8px 12px */
}
```

### Button Spacing
```css
/* Button sizes */
.btn-sm {
  padding: 0.5rem 0.75rem; /* 8px 12px */
  height: 2rem; /* 32px */
}

.btn-default {
  padding: 0.5rem 1rem; /* 8px 16px */
  height: 2.25rem; /* 36px */
}

.btn-lg {
  padding: 0.625rem 2rem; /* 10px 32px */
  height: 2.5rem; /* 40px */
}
```

## Grid Systems

### Dashboard Grid
```css
/* Dashboard widget grid */
.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem; /* 24px */
  padding: 1.5rem; /* 24px */
}

/* KPI cards grid */
.kpi-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem; /* 16px */
}
```

### Responsive Breakpoints
```css
/* Mobile first approach */
@media (min-width: 640px) {
  .container { padding: 0 1.5rem; }
}

@media (min-width: 768px) {
  .container { padding: 0 2rem; }
  .main-content { padding: 2rem; }
}

@media (min-width: 1024px) {
  .dashboard-grid {
    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
    gap: 2rem;
  }
}
```

## Layout Patterns

### Sidebar Layout
```css
.app-layout {
  display: grid;
  grid-template-columns: var(--sidebar-width) 1fr;
  grid-template-rows: var(--header-height) 1fr;
  height: 100vh;
}

.sidebar {
  grid-row: 1 / -1;
  background: hsl(var(--tier-950));
}

.header {
  grid-column: 2;
  background: hsl(var(--tier-900));
  border-bottom: 1px solid hsl(var(--tier-800));
}

.main {
  grid-column: 2;
  background: hsl(var(--tier-900));
  overflow: auto;
}
```

### Card Layout
```css
.card {
  background: hsl(var(--tier-800));
  border: 1px solid hsl(var(--tier-700));
  border-radius: var(--radius-md);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.card-elevated {
  box-shadow: 
    0 4px 8px rgba(0, 0, 0, 0.4),
    0 2px 4px rgba(0, 0, 0, 0.2);
}
```

## Stack Patterns

### Vertical Stack
```css
.stack-sm > * + * { margin-top: 0.5rem; }   /* 8px gaps */
.stack-md > * + * { margin-top: 1rem; }     /* 16px gaps */
.stack-lg > * + * { margin-top: 1.5rem; }   /* 24px gaps */
.stack-xl > * + * { margin-top: 2rem; }     /* 32px gaps */
```

### Horizontal Stack
```css
.hstack-sm { gap: 0.5rem; }   /* 8px gaps */
.hstack-md { gap: 1rem; }     /* 16px gaps */
.hstack-lg { gap: 1.5rem; }   /* 24px gaps */
.hstack-xl { gap: 2rem; }     /* 32px gaps */
```

## Spacing Guidelines

### Content Spacing
- **Tight relationships**: 8px (0.5rem)
- **Related content**: 16px (1rem)
- **Section separation**: 24px (1.5rem)
- **Major sections**: 32px (2rem) or more

### Interactive Elements
- **Minimum touch target**: 44px × 44px
- **Button padding**: 8px-16px horizontal, 8px-12px vertical
- **Form field spacing**: 16px-24px between fields
- **Modal margins**: 24px minimum from viewport edges

### Visual Hierarchy
- **Primary content**: Largest spacing around key elements
- **Secondary content**: Medium spacing for supporting content
- **Tertiary content**: Tight spacing for dense information

## Responsive Spacing

### Mobile Considerations
- Reduce padding by 25-50% on smaller screens
- Maintain minimum touch targets (44px)
- Stack horizontal layouts vertically when needed
- Increase line height for better readability

### Example Responsive Classes
```css
.p-responsive {
  padding: 0.75rem; /* Mobile */
}

@media (min-width: 768px) {
  .p-responsive {
    padding: 1.5rem; /* Tablet+ */
  }
}

@media (min-width: 1024px) {
  .p-responsive {
    padding: 2rem; /* Desktop */
  }
}
``` 