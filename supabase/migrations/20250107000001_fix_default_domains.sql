-- Migration to fix default domain format
-- Convert old subdomain format to path-based format to resolve DNS/SSL issues

-- Update funnels that have the old subdomain format
UPDATE public.saved_funnels 
SET domain = CASE 
  WHEN domain LIKE '%.ascension-ai-sm36.vercel.app' AND domain != 'ascension-ai-sm36.vercel.app' 
  THEN 'ascension-ai-sm36.vercel.app/funnel/' || REPLACE(domain, '.ascension-ai-sm36.vercel.app', '')
  ELSE domain
END
WHERE domain LIKE '%.ascension-ai-sm36.vercel.app' 
  AND domain != 'ascension-ai-sm36.vercel.app'; 