-- Add the "Sage" theme - A sophisticated, minimalist design with calm confidence
INSERT INTO public.themes (name, description, is_default, is_public, config) VALUES
('Sage', 'Sophisticated minimalist design with calm confidence and warmth', false, true, '{
  "colors": {
    "primary": "#D2691E",
    "secondary": "#8B4513",
    "accent": "#FF6347",
    "background": {
      "main": "#FAF9F6",
      "alt": "#F5F4F0",
      "overlay": "rgba(255, 255, 255, 0.95)"
    },
    "text": {
      "primary": "#2C2C2C",
      "secondary": "#5A5A5A",
      "muted": "#8B8B8B",
      "inverse": "#FAF9F6"
    },
    "border": "rgba(44, 44, 44, 0.1)",
    "shadow": "rgba(0, 0, 0, 0.05)"
  },
  "typography": {
    "fonts": {
      "heading": "\"Playfair Display\", Georgia, serif",
      "body": "\"Inter\", -apple-system, sans-serif",
      "accent": "\"Space Grotesk\", sans-serif"
    },
    "sizes": {
      "hero": {"desktop": "clamp(3.5rem, 6vw, 5rem)", "mobile": "2.5rem"},
      "h1": {"desktop": "3.5rem", "mobile": "2.25rem"},
      "h2": {"desktop": "2.5rem", "mobile": "1.875rem"},
      "h3": {"desktop": "2rem", "mobile": "1.5rem"},
      "body": {"desktop": "1.125rem", "mobile": "1rem"},
      "small": {"desktop": "0.875rem", "mobile": "0.875rem"}
    },
    "weights": {
      "light": 300,
      "regular": 400,
      "medium": 500,
      "semibold": 600,
      "bold": 700
    },
    "lineHeights": {
      "tight": 1.3,
      "normal": 1.7,
      "relaxed": 2.0
    }
  },
  "spacing": {
    "section": {"desktop": "6rem", "mobile": "4rem"},
    "element": {"desktop": "3rem", "mobile": "2rem"},
    "tight": "0.75rem",
    "normal": "1.5rem",
    "loose": "3rem"
  },
  "animations": {
    "entrances": {
      "fadeIn": "fadeIn 0.5s ease-in-out",
      "slideUp": "slideUp 0.5s ease-in-out",
      "scaleIn": "scaleIn 0.3s ease-in-out"
    },
    "hover": {
      "lift": "translateY(-2px)",
      "glow": "0 8px 20px rgba(210, 105, 30, 0.15)",
      "scale": "scale(1.02)"
    },
    "transitions": {
      "fast": "200ms",
      "normal": "300ms",
      "slow": "500ms",
      "easing": "cubic-bezier(0.4, 0, 0.2, 1)"
    }
  },
  "borders": {
    "radius": {
      "none": "0",
      "small": "0.5rem",
      "medium": "0.75rem",
      "large": "1rem",
      "full": "9999px"
    },
    "width": "1px"
  },
  "shadows": {
    "none": "none",
    "small": "0 2px 4px rgba(0, 0, 0, 0.05)",
    "medium": "0 4px 12px rgba(0, 0, 0, 0.08)",
    "large": "0 8px 24px rgba(0, 0, 0, 0.12)",
    "glow": "0 0 16px rgba(210, 105, 30, 0.1)"
  },
  "effects": {
    "blur": "16px",
    "opacity": 0.98
  }
}');

-- Add font import for Playfair Display to the global CSS
-- Note: You'll need to add this import to your styles/globals.css:
-- @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&display=swap'); 