-- Client Onboarding Schema for Alma (Simplified)
-- Run this migration to create the required tables

-- Client accounts (personal info)
CREATE TABLE IF NOT EXISTS clients (
  id SERIAL PRIMARY KEY,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Company information (includes agent config and uploaded documents)
CREATE TABLE IF NOT EXISTS companies (
  id SERIAL PRIMARY KEY,
  client_id INTEGER REFERENCES clients(id) ON DELETE CASCADE,
  -- Company info
  name VARCHAR(255) NOT NULL,
  service_type VARCHAR(100),
  size VARCHAR(50),
  regions TEXT,
  description TEXT,
  -- Agent configuration
  language VARCHAR(50) DEFAULT 'English',
  personality VARCHAR(50),
  temperature DECIMAL(2,1),
  prompt_module TEXT,
  -- OCR-extracted document text (combined from all uploaded docs)
  uploaded_documents JSONB DEFAULT '[]',  -- Array of {filename, extracted_text}
  created_at TIMESTAMP DEFAULT NOW()
);

-- Index for faster lookups
CREATE INDEX IF NOT EXISTS idx_clients_email ON clients(email);
CREATE INDEX IF NOT EXISTS idx_companies_client ON companies(client_id);
