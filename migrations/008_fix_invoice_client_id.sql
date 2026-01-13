-- Migration 008: Fix client_invoices to use stable client_id
-- Rename company_id to client_id to use stable identifier (clients.id)

-- Step 1: Rename the column
ALTER TABLE client_invoices 
RENAME COLUMN company_id TO client_id;

-- Step 2: Drop old index
DROP INDEX IF EXISTS idx_client_invoices_company_id;

-- Step 3: Create new index on client_id
CREATE INDEX IF NOT EXISTS idx_client_invoices_client_id 
ON client_invoices(client_id);

-- Step 4: Update any existing data to use client_id from companies table
-- This converts company.id to the stable clients.id
UPDATE client_invoices ci
SET client_id = c.client_id
FROM companies c
WHERE ci.client_id = c.id;
