-- Migration to ensure universal spacers are supported in funnel data
-- The existing jsonb 'data' column already supports storing universal spacers
-- This migration just documents the expected structure

-- Universal spacers are stored in the funnel.data column as:
-- data.customization.universalSpacers = {
--   "trigger-template-1_p1_after_header": { desktop: 48, mobile: 32 },
--   "trigger-template-1_p1_after_heading": { desktop: 24, mobile: 16 },
--   ... etc
-- }

-- No schema changes needed since we're using jsonb column 