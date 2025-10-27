-- Add source tracking columns to properties table
ALTER TABLE properties 
  ADD COLUMN IF NOT EXISTS source_platform text DEFAULT 'manual',
  ADD COLUMN IF NOT EXISTS source_url text,
  ADD COLUMN IF NOT EXISTS source_contact_name text,
  ADD COLUMN IF NOT EXISTS source_contact_phone text,
  ADD COLUMN IF NOT EXISTS source_contact_email text,
  ADD COLUMN IF NOT EXISTS source_instagram_handle text,
  ADD COLUMN IF NOT EXISTS source_scraped_at timestamptz DEFAULT now();

-- Create index for duplicate detection
CREATE INDEX IF NOT EXISTS idx_properties_source_url ON properties(source_url) WHERE source_url IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_properties_location_price ON properties(location, price);

-- Create scraping jobs table for tracking imports
CREATE TABLE IF NOT EXISTS scraping_jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  status text NOT NULL DEFAULT 'pending',
  platform text NOT NULL DEFAULT 'instagram',
  properties_found integer DEFAULT 0,
  properties_added integer DEFAULT 0,
  properties_updated integer DEFAULT 0,
  properties_skipped integer DEFAULT 0,
  error_message text,
  started_at timestamptz,
  completed_at timestamptz,
  triggered_by uuid,
  import_data jsonb
);

-- Enable RLS on scraping_jobs
ALTER TABLE scraping_jobs ENABLE ROW LEVEL SECURITY;

-- Admins can view scraping jobs
CREATE POLICY "Admins can view scraping jobs"
  ON scraping_jobs FOR SELECT
  USING (has_role(auth.uid(), 'admin'));

-- Admins can insert scraping jobs
CREATE POLICY "Admins can insert scraping jobs"
  ON scraping_jobs FOR INSERT
  WITH CHECK (has_role(auth.uid(), 'admin'));

-- Admins can update scraping jobs
CREATE POLICY "Admins can update scraping jobs"
  ON scraping_jobs FOR UPDATE
  USING (has_role(auth.uid(), 'admin'));

-- Create public view that excludes source information
CREATE OR REPLACE VIEW public_properties AS
  SELECT 
    id, title, description, location, price, bedrooms, bathrooms, 
    area, status, created_at, updated_at, property_type, listing_type, 
    land_size, roi_potential, amenities, features, rental_duration, rental_terms, owner_id
  FROM properties
  WHERE status = 'available';

-- Grant access to public view
GRANT SELECT ON public_properties TO anon, authenticated;