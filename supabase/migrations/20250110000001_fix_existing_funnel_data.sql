-- Fix existing funnel data by rebuilding the data column from individual columns
-- This will restore customization that was lost when case studies were saved

UPDATE public.saved_funnels
SET data = jsonb_build_object(
  'customization', jsonb_build_object(
    'heading', COALESCE(headline, ''),
    'subheading', COALESCE(subheadline, ''),
    'heroText', COALESCE(hero_text, ''),
    'ctaText', COALESCE(cta_text, 'Get Started Now'),
    'caseStudiesHeading', COALESCE(case_studies_heading, 'Success Stories'),
    'caseStudiesSubtext', COALESCE(case_studies_subtext, 'See what others have achieved'),
    'bookingHeading', COALESCE(booking_heading, 'Book Your Strategy Call'),
    'offerDescription', COALESCE(offer_description, ''),
    'guaranteeText', COALESCE(guarantee_text, ''),
    'logoUrl', COALESCE(logo_url, ''),
    'footerText', '© 2024 Your Business. All rights reserved.',
    'metaTitle', COALESCE(meta_title, ''),
    'metaDescription', COALESCE(meta_description, ''),
    'metaKeywords', COALESCE(meta_keywords, ''),
    'themeMode', COALESCE(theme_mode, 'light'),
    'funnelTheme', COALESCE(theme_mode, 'light'),
    'pixelCodes', jsonb_build_object(
      'facebook', COALESCE(facebook_pixel_code, ''),
      'google', COALESCE(google_analytics_code, ''),
      'custom', COALESCE(custom_tracking_code, '')
    ),
    'media', jsonb_build_object(
      'vslType', COALESCE(vsl_type::text, 'none'),
      'vslUrl', COALESCE(vsl_url, ''),
      'vslTitle', COALESCE(vsl_title, ''),
      'calendarEmbedCode', COALESCE(calendar_embed_code, ''),
      'calendarTitle', COALESCE(calendar_title, 'Book Your Call')
    ),
    'colors', jsonb_build_object(
      'primary', COALESCE(primary_color, '#3b82f6'),
      'secondary', COALESCE(secondary_color, '#1e40af'),
      'accent', COALESCE(accent_color, '#059669'),
      'background', COALESCE(background_color, '#FFFFFF'),
      'text', COALESCE(text_color, '#1F2937')
    ),
    'textSizes', COALESCE(data->'customization'->'textSizes', jsonb_build_object(
      'desktop', jsonb_build_object(
        'heading', 48,
        'subheading', 24,
        'caseStudiesHeading', 36,
        'bookingHeading', 48
      ),
      'mobile', jsonb_build_object(
        'heading', 36,
        'subheading', 20,
        'caseStudiesHeading', 28,
        'bookingHeading', 36
      )
    )),
    'logoSize', COALESCE(data->'customization'->'logoSize', jsonb_build_object(
      'desktop', 48,
      'mobile', 36
    )),
    'buttonSizes', COALESCE(data->'customization'->'buttonSizes', jsonb_build_object(
      'desktop', jsonb_build_object('ctaText', 100),
      'mobile', jsonb_build_object('ctaText', 100)
    )),
    'sectionSpacing', COALESCE(data->'customization'->'sectionSpacing', '{}'::jsonb),
    'universalSpacers', COALESCE(data->'customization'->'universalSpacers', '{}'::jsonb)
  ),
  'templateId', template_id,
  'offerData', COALESCE(data->'offerData', '{}'::jsonb),
  'caseStudies', COALESCE(data->'caseStudies', '[]'::jsonb),
  'media', jsonb_build_object(
    'vslType', COALESCE(vsl_type::text, 'none'),
    'vslUrl', COALESCE(vsl_url, ''),
    'vslTitle', COALESCE(vsl_title, ''),
    'calendarEmbedCode', COALESCE(calendar_embed_code, ''),
    'calendarTitle', COALESCE(calendar_title, 'Book Your Call'),
    'logoUrl', COALESCE(logo_url, '')
  )
)
WHERE 
  -- Only update if customization seems to be missing or incomplete
  (data IS NULL OR 
   data->'customization' IS NULL OR
   data->'customization'->>'heading' = '' OR
   data->'customization'->>'heading' IS NULL)
  AND 
  -- And we have actual content in the individual columns
  (headline IS NOT NULL AND headline != '');

-- Update timestamp
UPDATE public.saved_funnels 
SET updated_at = timezone('utc'::text, now())
WHERE 
  (data IS NULL OR 
   data->'customization' IS NULL OR
   data->'customization'->>'heading' = '' OR
   data->'customization'->>'heading' IS NULL)
  AND 
  (headline IS NOT NULL AND headline != '');

-- Add comment for documentation
COMMENT ON TABLE public.saved_funnels IS 'Restored customization data from individual columns to fix data loss issue'; 