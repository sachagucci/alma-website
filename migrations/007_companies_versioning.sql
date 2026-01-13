-- Migration 007: Add versioning to companies table
-- Implement insert-new/deactivate-old pattern for company updates

-- Add is_active column (default TRUE for existing rows)
ALTER TABLE companies 
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;

-- Add updated_at column to track when changes occur
ALTER TABLE companies 
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Set existing rows to active
UPDATE companies SET is_active = TRUE WHERE is_active IS NULL;

-- Create index for fast lookups of active companies
CREATE INDEX IF NOT EXISTS idx_companies_active 
ON companies(client_id, is_active);

-- Create index for updated_at for historical queries
CREATE INDEX IF NOT EXISTS idx_companies_updated_at 
ON companies(updated_at DESC);
