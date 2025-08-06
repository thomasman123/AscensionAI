-- Fix font sizes for existing funnels
-- Run this if your font sizes aren't showing up on the live page

-- This adds default textSizes to any funnel that's missing them
UPDATE public.saved_funnels
SET data = jsonb_set(
  COALESCE(data, '{}'),
  '{customization,textSizes}',
  COALESCE(
    data->'customization'->'textSizes',
    jsonb_build_object(
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
    )
  )
)
WHERE data->'customization'->'textSizes' IS NULL;

-- Also ensure logoSize and buttonSizes are set
UPDATE public.saved_funnels
SET data = jsonb_set(
  COALESCE(data, '{}'),
  '{customization,logoSize}',
  COALESCE(
    data->'customization'->'logoSize',
    jsonb_build_object('desktop', 48, 'mobile', 36)
  )
)
WHERE data->'customization'->'logoSize' IS NULL;

UPDATE public.saved_funnels
SET data = jsonb_set(
  COALESCE(data, '{}'),
  '{customization,buttonSizes}',
  COALESCE(
    data->'customization'->'buttonSizes',
    jsonb_build_object(
      'desktop', jsonb_build_object('ctaText', 100),
      'mobile', jsonb_build_object('ctaText', 100)
    )
  )
)
WHERE data->'customization'->'buttonSizes' IS NULL; 