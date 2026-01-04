
-- 1. Create company_knowledge table for OCR text
CREATE TABLE IF NOT EXISTS company_knowledge (
    id SERIAL PRIMARY KEY,
    company_id INTEGER REFERENCES companies(id),
    raw_text TEXT,
    file_name VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Update agent_configurations
-- Add company_id and link it to company. 
-- We keep clinic_id for now if legacy code uses it, but company_id is the new standard.
ALTER TABLE agent_configurations 
ADD COLUMN IF NOT EXISTS company_id INTEGER REFERENCES companies(id);

-- 3. Update prompt_modules
ALTER TABLE prompt_modules 
ADD COLUMN IF NOT EXISTS company_id INTEGER REFERENCES companies(id),
ADD COLUMN IF NOT EXISTS generated_from_doc BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS source VARCHAR(50) DEFAULT 'manual'; -- 'ocr' or 'manual'

-- 4. Indexing for performance
CREATE INDEX IF NOT EXISTS idx_company_knowledge_company_id ON company_knowledge(company_id);
CREATE INDEX IF NOT EXISTS idx_agent_config_company_id ON agent_configurations(company_id);
CREATE INDEX IF NOT EXISTS idx_prompt_modules_company_id ON prompt_modules(company_id);
