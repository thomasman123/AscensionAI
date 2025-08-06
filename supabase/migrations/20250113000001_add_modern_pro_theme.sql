-- Add the "Modern Pro" theme - A sleek, professional design with modern effects
INSERT INTO public.themes (name, description, is_default, is_public, config) VALUES
('Modern Pro', 'Sleek professional design with gradients, glass morphism, and modern typography', false, true, '{
  "colors": {
    "primary": "#6366F1",
    "secondary": "#4F46E5",
    "accent": "#10B981",
    "background": {
      "main": "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      "alt": "rgba(255, 255, 255, 0.08)",
      "overlay": "rgba(30, 41, 59, 0.85)"
    },
    "text": {
      "primary": "#F9FAFB",
      "secondary": "#E5E7EB",
      "muted": "#9CA3AF",
      "inverse": "#111827"
    },
    "border": "rgba(255, 255, 255, 0.1)",
    "shadow": "rgba(0, 0, 0, 0.25)"
  },
  "typography": {
    "fonts": {
      "heading": "\"Poppins\", -apple-system, sans-serif",
      "body": "\"Outfit\", -apple-system, sans-serif",
      "accent": "\"JetBrains Mono\", monospace"
    },
    "sizes": {
      "hero": {"desktop": "clamp(4rem, 7vw, 6rem)", "mobile": "3rem"},
      "h1": {"desktop": "4rem", "mobile": "2.5rem"},
      "h2": {"desktop": "3rem", "mobile": "2rem"},
      "h3": {"desktop": "2.25rem", "mobile": "1.75rem"},
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
      "tight": 1.2,
      "normal": 1.6,
      "relaxed": 1.8
    }
  },
  "spacing": {
    "section": {"desktop": "7rem", "mobile": "4.5rem"},
    "element": {"desktop": "3.5rem", "mobile": "2.5rem"},
    "tight": "1rem",
    "normal": "2rem",
    "loose": "4rem"
  },
  "animations": {
    "entrances": {
      "fadeIn": "fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
      "slideUp": "slideUp 0.7s cubic-bezier(0.16, 1, 0.3, 1)",
      "scaleIn": "scaleIn 0.5s cubic-bezier(0.16, 1, 0.3, 1)"
    },
    "hover": {
      "lift": "translateY(-4px) scale(1.01)",
      "glow": "0 20px 40px rgba(99, 102, 241, 0.3)",
      "scale": "scale(1.05)"
    },
    "transitions": {
      "fast": "150ms",
      "normal": "250ms",
      "slow": "400ms",
      "easing": "cubic-bezier(0.16, 1, 0.3, 1)"
    }
  },
  "borders": {
    "radius": {
      "none": "0",
      "small": "0.75rem",
      "medium": "1rem",
      "large": "1.5rem",
      "full": "9999px"
    },
    "width": "1px"
  },
  "shadows": {
    "none": "none",
    "small": "0 4px 6px rgba(0, 0, 0, 0.1)",
    "medium": "0 10px 25px rgba(0, 0, 0, 0.15)",
    "large": "0 20px 50px rgba(0, 0, 0, 0.2)",
    "glow": "0 0 30px rgba(99, 102, 241, 0.4)"
  },
  "effects": {
    "blur": "20px",
    "opacity": 0.95
  }
}');

-- Add the "Luxury Dark" theme - Premium dark theme with gold accents
INSERT INTO public.themes (name, description, is_default, is_public, config) VALUES
('Luxury Dark', 'Premium dark theme with gold accents and elegant typography', false, true, '{
  "colors": {
    "primary": "#FFD700",
    "secondary": "#FFA500",
    "accent": "#FF6B6B",
    "background": {
      "main": "#0A0A0A",
      "alt": "#1A1A1A",
      "overlay": "rgba(0, 0, 0, 0.9)"
    },
    "text": {
      "primary": "#FFFFFF",
      "secondary": "#E0E0E0",
      "muted": "#A0A0A0",
      "inverse": "#0A0A0A"
    },
    "border": "rgba(255, 215, 0, 0.2)",
    "shadow": "rgba(255, 215, 0, 0.1)"
  },
  "typography": {
    "fonts": {
      "heading": "\"Bebas Neue\", sans-serif",
      "body": "\"Montserrat\", -apple-system, sans-serif",
      "accent": "\"Oswald\", sans-serif"
    },
    "sizes": {
      "hero": {"desktop": "clamp(4.5rem, 8vw, 7rem)", "mobile": "3.5rem"},
      "h1": {"desktop": "4.5rem", "mobile": "2.75rem"},
      "h2": {"desktop": "3.5rem", "mobile": "2.25rem"},
      "h3": {"desktop": "2.5rem", "mobile": "1.875rem"},
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
      "tight": 1.1,
      "normal": 1.5,
      "relaxed": 1.7
    }
  },
  "spacing": {
    "section": {"desktop": "8rem", "mobile": "5rem"},
    "element": {"desktop": "4rem", "mobile": "2.5rem"},
    "tight": "1.25rem",
    "normal": "2.5rem",
    "loose": "5rem"
  },
  "animations": {
    "entrances": {
      "fadeIn": "fadeIn 0.8s ease-out",
      "slideUp": "slideUp 0.8s ease-out",
      "scaleIn": "scaleIn 0.6s ease-out"
    },
    "hover": {
      "lift": "translateY(-6px)",
      "glow": "0 15px 40px rgba(255, 215, 0, 0.3), inset 0 0 20px rgba(255, 215, 0, 0.1)",
      "scale": "scale(1.08)"
    },
    "transitions": {
      "fast": "200ms",
      "normal": "350ms",
      "slow": "600ms",
      "easing": "ease-out"
    }
  },
  "borders": {
    "radius": {
      "none": "0",
      "small": "0.5rem",
      "medium": "1rem",
      "large": "2rem",
      "full": "9999px"
    },
    "width": "2px"
  },
  "shadows": {
    "none": "none",
    "small": "0 2px 8px rgba(255, 215, 0, 0.1)",
    "medium": "0 8px 24px rgba(255, 215, 0, 0.15)",
    "large": "0 16px 48px rgba(255, 215, 0, 0.2)",
    "glow": "0 0 40px rgba(255, 215, 0, 0.5)"
  },
  "effects": {
    "blur": "24px",
    "opacity": 0.97
  }
}');

-- Add the "Tech Startup" theme - Modern tech-focused design
INSERT INTO public.themes (name, description, is_default, is_public, config) VALUES
('Tech Startup', 'Modern tech-focused design with neon accents and futuristic feel', false, true, '{
  "colors": {
    "primary": "#00D9FF",
    "secondary": "#7B61FF",
    "accent": "#FF0080",
    "background": {
      "main": "linear-gradient(180deg, #0F0C29 0%, #302B63 50%, #24243e 100%)",
      "alt": "rgba(123, 97, 255, 0.05)",
      "overlay": "rgba(15, 12, 41, 0.95)"
    },
    "text": {
      "primary": "#FFFFFF",
      "secondary": "#B8B8D1",
      "muted": "#6B6B8C",
      "inverse": "#0F0C29"
    },
    "border": "rgba(0, 217, 255, 0.3)",
    "shadow": "rgba(123, 97, 255, 0.2)"
  },
  "typography": {
    "fonts": {
      "heading": "\"Orbitron\", sans-serif",
      "body": "\"Exo 2\", -apple-system, sans-serif",
      "accent": "\"Share Tech Mono\", monospace"
    },
    "sizes": {
      "hero": {"desktop": "clamp(3.5rem, 7vw, 6rem)", "mobile": "2.75rem"},
      "h1": {"desktop": "3.75rem", "mobile": "2.5rem"},
      "h2": {"desktop": "2.75rem", "mobile": "2rem"},
      "h3": {"desktop": "2rem", "mobile": "1.625rem"},
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
      "tight": 1.25,
      "normal": 1.65,
      "relaxed": 1.9
    }
  },
  "spacing": {
    "section": {"desktop": "6.5rem", "mobile": "4rem"},
    "element": {"desktop": "3.25rem", "mobile": "2.25rem"},
    "tight": "1rem",
    "normal": "2rem",
    "loose": "3.5rem"
  },
  "animations": {
    "entrances": {
      "fadeIn": "fadeIn 0.5s cubic-bezier(0.23, 1, 0.32, 1)",
      "slideUp": "slideUp 0.6s cubic-bezier(0.23, 1, 0.32, 1)",
      "scaleIn": "scaleIn 0.4s cubic-bezier(0.23, 1, 0.32, 1)"
    },
    "hover": {
      "lift": "translateY(-3px) rotateX(5deg)",
      "glow": "0 10px 30px rgba(0, 217, 255, 0.4), 0 0 60px rgba(123, 97, 255, 0.2)",
      "scale": "scale(1.03) rotateZ(0.5deg)"
    },
    "transitions": {
      "fast": "180ms",
      "normal": "280ms",
      "slow": "450ms",
      "easing": "cubic-bezier(0.23, 1, 0.32, 1)"
    }
  },
  "borders": {
    "radius": {
      "none": "0",
      "small": "0.625rem",
      "medium": "1.25rem",
      "large": "2rem",
      "full": "9999px"
    },
    "width": "1.5px"
  },
  "shadows": {
    "none": "none",
    "small": "0 4px 12px rgba(0, 217, 255, 0.1)",
    "medium": "0 12px 32px rgba(0, 217, 255, 0.15)",
    "large": "0 24px 64px rgba(0, 217, 255, 0.2)",
    "glow": "0 0 50px rgba(0, 217, 255, 0.5), inset 0 0 30px rgba(123, 97, 255, 0.2)"
  },
  "effects": {
    "blur": "25px",
    "opacity": 0.96
  }
}');

-- Note: Add these font imports to your styles/globals.css:
-- @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&family=Outfit:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700&display=swap');
-- @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Montserrat:wght@300;400;500;600;700&family=Oswald:wght@400;500;600;700&display=swap');
-- @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700&family=Exo+2:wght@300;400;500;600;700&family=Share+Tech+Mono&display=swap'); 