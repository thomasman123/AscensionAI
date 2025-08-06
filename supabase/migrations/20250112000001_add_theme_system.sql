-- Add theme system to support visual customization without affecting content
-- Themes can be applied to any template without modification

-- Create themes table
CREATE TABLE public.themes (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  description text,
  is_default boolean DEFAULT false,
  is_public boolean DEFAULT false,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Theme configuration stored as JSONB for flexibility
  config jsonb NOT NULL DEFAULT '{}'::jsonb,
  
  -- Preview and metadata
  preview_url text,
  tags text[] DEFAULT '{}',
  
  -- Timestamps
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Add theme support to funnels
ALTER TABLE public.saved_funnels 
ADD COLUMN theme_id uuid REFERENCES public.themes(id) ON DELETE SET NULL,
ADD COLUMN theme_overrides jsonb DEFAULT '{}'::jsonb;

-- Create default themes
INSERT INTO public.themes (name, description, is_default, is_public, config) VALUES
('Clean Light', 'Clean and minimal light theme', true, true, '{
  "colors": {
    "primary": "#3b82f6",
    "secondary": "#1e40af",
    "accent": "#059669",
    "background": {
      "main": "#ffffff",
      "alt": "#f8fafc",
      "overlay": "rgba(255, 255, 255, 0.95)"
    },
    "text": {
      "primary": "#1e293b",
      "secondary": "#475569",
      "muted": "#94a3b8",
      "inverse": "#f8fafc"
    },
    "border": "rgba(148, 163, 184, 0.3)",
    "shadow": "rgba(0, 0, 0, 0.1)"
  },
  "typography": {
    "fonts": {
      "heading": "\"Inter\", -apple-system, sans-serif",
      "body": "\"Inter\", -apple-system, sans-serif",
      "accent": "\"Space Grotesk\", sans-serif"
    },
    "sizes": {
      "hero": {"desktop": "clamp(3rem, 5vw, 4.5rem)", "mobile": "2.25rem"},
      "h1": {"desktop": "3rem", "mobile": "2rem"},
      "h2": {"desktop": "2.25rem", "mobile": "1.75rem"},
      "h3": {"desktop": "1.875rem", "mobile": "1.5rem"},
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
    "section": {"desktop": "5rem", "mobile": "3rem"},
    "element": {"desktop": "2rem", "mobile": "1.5rem"},
    "tight": "0.5rem",
    "normal": "1rem",
    "loose": "2rem"
  },
  "animations": {
    "entrances": {
      "fadeIn": "fadeIn 0.6s ease-out",
      "slideUp": "slideUp 0.8s ease-out",
      "scaleIn": "scaleIn 0.5s ease-out"
    },
    "hover": {
      "lift": "translateY(-4px)",
      "glow": "0 10px 30px rgba(59, 130, 246, 0.3)",
      "scale": "scale(1.05)"
    },
    "transitions": {
      "fast": "150ms",
      "normal": "300ms",
      "slow": "500ms",
      "easing": "cubic-bezier(0.4, 0, 0.2, 1)"
    }
  },
  "borders": {
    "radius": {
      "none": "0",
      "small": "0.375rem",
      "medium": "0.75rem",
      "large": "1rem",
      "full": "9999px"
    },
    "width": "1px"
  },
  "shadows": {
    "none": "none",
    "small": "0 1px 3px rgba(0, 0, 0, 0.1)",
    "medium": "0 4px 6px rgba(0, 0, 0, 0.1)",
    "large": "0 10px 25px rgba(0, 0, 0, 0.1)",
    "glow": "0 0 20px rgba(59, 130, 246, 0.2)"
  },
  "effects": {
    "blur": "20px",
    "opacity": 0.95
  }
}'),

('Dark Mode', 'Modern dark theme', true, true, '{
  "colors": {
    "primary": "#3b82f6",
    "secondary": "#1e40af",
    "accent": "#10b981",
    "background": {
      "main": "#0f172a",
      "alt": "#1e293b",
      "overlay": "rgba(15, 23, 42, 0.9)"
    },
    "text": {
      "primary": "#f8fafc",
      "secondary": "#cbd5e1",
      "muted": "#64748b",
      "inverse": "#1e293b"
    },
    "border": "rgba(148, 163, 184, 0.2)",
    "shadow": "rgba(0, 0, 0, 0.5)"
  },
  "typography": {
    "fonts": {
      "heading": "\"Inter\", -apple-system, sans-serif",
      "body": "\"Inter\", -apple-system, sans-serif",
      "accent": "\"Space Grotesk\", sans-serif"
    },
    "sizes": {
      "hero": {"desktop": "clamp(3rem, 5vw, 4.5rem)", "mobile": "2.25rem"},
      "h1": {"desktop": "3rem", "mobile": "2rem"},
      "h2": {"desktop": "2.25rem", "mobile": "1.75rem"},
      "h3": {"desktop": "1.875rem", "mobile": "1.5rem"},
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
    "section": {"desktop": "5rem", "mobile": "3rem"},
    "element": {"desktop": "2rem", "mobile": "1.5rem"},
    "tight": "0.5rem",
    "normal": "1rem",
    "loose": "2rem"
  },
  "animations": {
    "entrances": {
      "fadeIn": "fadeIn 0.6s ease-out",
      "slideUp": "slideUp 0.8s ease-out",
      "scaleIn": "scaleIn 0.5s ease-out"
    },
    "hover": {
      "lift": "translateY(-4px)",
      "glow": "0 10px 30px rgba(59, 130, 246, 0.5)",
      "scale": "scale(1.05)"
    },
    "transitions": {
      "fast": "150ms",
      "normal": "300ms",
      "slow": "500ms",
      "easing": "cubic-bezier(0.4, 0, 0.2, 1)"
    }
  },
  "borders": {
    "radius": {
      "none": "0",
      "small": "0.375rem",
      "medium": "0.75rem",
      "large": "1rem",
      "full": "9999px"
    },
    "width": "1px"
  },
  "shadows": {
    "none": "none",
    "small": "0 1px 3px rgba(0, 0, 0, 0.3)",
    "medium": "0 4px 6px rgba(0, 0, 0, 0.4)",
    "large": "0 10px 25px rgba(0, 0, 0, 0.5)",
    "glow": "0 0 20px rgba(59, 130, 246, 0.4)"
  },
  "effects": {
    "blur": "20px",
    "opacity": 0.95
  }
}');

-- Add indexes for performance
CREATE INDEX idx_themes_user_id ON public.themes(user_id);
CREATE INDEX idx_themes_is_public ON public.themes(is_public);
CREATE INDEX idx_saved_funnels_theme_id ON public.saved_funnels(theme_id);

-- Add RLS policies
ALTER TABLE public.themes ENABLE ROW LEVEL SECURITY;

-- Public themes are viewable by everyone
CREATE POLICY "Public themes are viewable by everyone" ON public.themes
  FOR SELECT USING (is_public = true);

-- Users can view their own themes
CREATE POLICY "Users can view own themes" ON public.themes
  FOR SELECT USING (auth.uid() = user_id);

-- Users can create their own themes
CREATE POLICY "Users can create own themes" ON public.themes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own themes
CREATE POLICY "Users can update own themes" ON public.themes
  FOR UPDATE USING (auth.uid() = user_id);

-- Users can delete their own themes
CREATE POLICY "Users can delete own themes" ON public.themes
  FOR DELETE USING (auth.uid() = user_id);

-- Add comment
COMMENT ON TABLE public.themes IS 'Stores visual themes that can be applied to any funnel template';
COMMENT ON COLUMN public.saved_funnels.theme_id IS 'References the theme to apply to this funnel';
COMMENT ON COLUMN public.saved_funnels.theme_overrides IS 'Allows specific overrides to the selected theme'; 