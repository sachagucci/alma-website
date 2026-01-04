-- Migration 003: Add is_active columns for versioning strategy
-- Never delete/update directly - always create new rows and deactivate old ones

-- Add is_active to agent_configurations
ALTER TABLE agent_configurations 
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;

-- Add is_active to company_knowledge  
ALTER TABLE company_knowledge 
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;

-- Set existing rows to active
UPDATE agent_configurations SET is_active = TRUE WHERE is_active IS NULL;
UPDATE company_knowledge SET is_active = TRUE WHERE is_active IS NULL;

-- Drop the unique constraint on clinic_id so we can have multiple versions
ALTER TABLE agent_configurations 
DROP CONSTRAINT IF EXISTS agent_configurations_pkey;

-- Create a new primary key with auto-increment id
ALTER TABLE agent_configurations 
ADD COLUMN IF NOT EXISTS id SERIAL;

-- Make id the new primary key (only if it doesn't exist)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'agent_configurations_pkey'
    ) THEN
        ALTER TABLE agent_configurations ADD PRIMARY KEY (id);
    END IF;
END $$;

-- Create index for fast lookups
CREATE INDEX IF NOT EXISTS idx_agent_config_company_active 
ON agent_configurations(company_id, is_active);

CREATE INDEX IF NOT EXISTS idx_company_knowledge_active 
ON company_knowledge(company_id, is_active);
