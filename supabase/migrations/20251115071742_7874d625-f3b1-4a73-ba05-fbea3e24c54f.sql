-- Add import metadata fields to properties table
ALTER TABLE properties 
ADD COLUMN IF NOT EXISTS duplicate_of uuid REFERENCES properties(id),
ADD COLUMN IF NOT EXISTS duplicate_confidence numeric,
ADD COLUMN IF NOT EXISTS created_by uuid,
ADD COLUMN IF NOT EXISTS import_job_id uuid REFERENCES scraping_jobs(id),
ADD COLUMN IF NOT EXISTS raw_source_data jsonb;

-- Add K2-Think tracking to scraping_jobs
ALTER TABLE scraping_jobs
ADD COLUMN IF NOT EXISTS k2_calls integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS nlp_calls integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS duplicates_found integer DEFAULT 0;

-- Create indexes for faster duplicate detection
CREATE INDEX IF NOT EXISTS idx_properties_source_url ON properties(source_url);
CREATE INDEX IF NOT EXISTS idx_properties_contact_phone ON properties(source_contact_phone);
CREATE INDEX IF NOT EXISTS idx_properties_location ON properties USING gin(to_tsvector('english', location));