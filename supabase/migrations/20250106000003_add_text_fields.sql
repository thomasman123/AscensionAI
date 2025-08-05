-- Add additional text fields for template customization
ALTER TABLE public.saved_funnels 
ADD COLUMN case_studies_heading text DEFAULT 'Success Stories',
ADD COLUMN case_studies_subtext text DEFAULT 'See what others have achieved',
ADD COLUMN booking_heading text DEFAULT 'Book Your Strategy Call';

-- Add comments for documentation
COMMENT ON COLUMN public.saved_funnels.case_studies_heading IS 'Heading for the case studies section';
COMMENT ON COLUMN public.saved_funnels.case_studies_subtext IS 'Subtext for the case studies section';
COMMENT ON COLUMN public.saved_funnels.booking_heading IS 'Heading for the booking page/section'; 