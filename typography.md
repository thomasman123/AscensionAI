# Typography System

The Promethean design system uses a carefully crafted typography hierarchy with Inter and Space Grotesk fonts.

## Font Families

### Primary: Inter
- **Usage**: Body text, UI elements, buttons, forms, captions
- **Characteristics**: Excellent readability, optimized for screens, professional appearance
- **Font weights**: 300 (Light), 400 (Regular), 500 (Medium), 600 (Semibold), 700 (Bold)
- **Font features**: `'cv01', 'cv03', 'cv04', 'cv11'` for enhanced readability

### Secondary: Space Grotesk  
- **Usage**: Headings, display text, brand elements
- **Characteristics**: Modern geometric sans-serif, strong brand presence
- **Font weights**: 300-700
- **Font features**: `'ss01', 'ss02'` for stylistic alternatives

## CSS Implementation

```css
/* Import fonts */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&family=Space+Grotesk:wght@300;400;500;600;700&display=swap');

/* Font family classes */
.font-inter {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
  font-feature-settings: 'cv01', 'cv03', 'cv04', 'cv11';
}

/* Base body configuration */
body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  font-feature-settings: "ss02", "ss03", "ss04", "zero", "salt";
}

/* Headings use Space Grotesk */
h1, h2, h3, h4, h5, h6 {
  font-family: 'Space Grotesk', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  font-feature-settings: "ss01", "ss02";
}
```

## Typography Scale

### Display Typography
```css
.text-display {
  font-family: 'Inter';
  font-weight: 600; /* Semibold */
  font-size: 28px;
  letter-spacing: -0.25px;
  line-height: 1.2;
}
```
**Usage**: Hero sections, main page titles, key metrics

### Title Typography  
```css
.text-title {
  font-family: 'Inter';
  font-weight: 600; /* Semibold */
  font-size: 18px;
  line-height: 1.3;
}
```
**Usage**: Card titles, section headings, modal titles

### Body Typography
```css
.text-body {
  font-family: 'Inter';
  font-weight: 400; /* Regular */
  font-size: 14px;
  line-height: 20px; /* 1.43 */
}
```
**Usage**: Paragraph text, descriptions, general content

### Caption Typography
```css
.text-caption {
  font-family: 'Inter';
  font-weight: 400; /* Regular */
  font-size: 12px;
  line-height: 16px; /* 1.33 */
}
```
**Usage**: Small text, metadata, timestamps, hints

## Specialized Typography

### Number Typography
Optimized for displaying metrics and data:

```css
.text-number-large {
  font-family: 'Inter';
  font-weight: 700; /* Bold */
  font-size: 24px;
  letter-spacing: -0.02em;
}

.text-number-medium {
  font-family: 'Inter';
  font-weight: 600; /* Semibold */
  font-size: 16px;
  letter-spacing: -0.01em;
}

.text-number-small {
  font-family: 'Inter';
  font-weight: 600; /* Semibold */
  font-size: 14px;
}
```

### Label Typography  
For form labels and UI labels:

```css
.text-label-large {
  font-family: 'Inter';
  font-weight: 500; /* Medium */
  font-size: 16px;
}

.text-label-medium {
  font-family: 'Inter';
  font-weight: 500; /* Medium */
  font-size: 14px;
}

.text-label-small {
  font-family: 'Inter';
  font-weight: 400; /* Regular */
  font-size: 12px;
}
```

## Font Weight Guidelines

### Inter Font Weights
```css
.font-inter.font-light { font-weight: 300; }      /* Subtle text, decorative */
.font-inter.font-regular { font-weight: 400; }    /* Body text, descriptions */
.font-inter.font-medium { font-weight: 500; }     /* Labels, emphasis */
.font-inter.font-semibold { font-weight: 600; }   /* Headings, important text */
.font-inter.font-bold { font-weight: 700; }       /* Strong emphasis, numbers */
```

## Usage Guidelines

### Hierarchy Best Practices
1. **Use display text sparingly** - Only for main page titles and key metrics
2. **Title text for section headings** - Cards, modals, major sections
3. **Body text as default** - Most content should use body typography
4. **Caption for supporting info** - Metadata, timestamps, small details

### Color Pairing
- **Primary text**: `text-tier-50` (highest contrast)
- **Secondary text**: `text-tier-200` or `text-tier-300`
- **Muted text**: `text-tier-400` or `text-tier-500`
- **Disabled text**: `text-tier-600`

### Accessibility
- Maintain WCAG AA contrast ratios (4.5:1 minimum)
- Use font weights 400+ for small text (under 18px)
- Ensure sufficient line height for readability
- Test with different zoom levels (up to 200%)

## Examples

### Card Title
```html
<h3 class="text-title text-tier-100">Dashboard Overview</h3>
<p class="text-body text-tier-300">Last updated 2 minutes ago</p>
```

### KPI Display
```html
<div class="text-number-large text-tier-50">$124,590</div>
<div class="text-caption text-tier-400">Total Revenue</div>
```

### Form Label
```html
<label class="text-label-medium text-tier-200">Email Address</label>
<input class="text-body text-tier-100" placeholder="Enter your email" />
```

## Responsive Considerations

- Typography scales appropriately on smaller screens
- Maintain readability at all viewport sizes  
- Consider reducing font sizes slightly on mobile if needed
- Ensure touch targets remain accessible (minimum 44px) 