-- Migration 009: Fix user_chats to use stable client_id
-- Rename company_id to client_id to use stable identifier

-- Step 1: Rename the column
ALTER TABLE user_chats 
RENAME COLUMN company_id TO client_id;

-- Step 2: Update existing data to use client_id from companies table
-- This converts company.id to the stable clients.id
UPDATE user_chats uc
SET client_id = c.client_id
FROM companies c
WHERE uc.client_id = c.id;

-- Step 3: Create index on client_id for faster queries
CREATE INDEX IF NOT EXISTS idx_user_chats_client_id 
ON user_chats(client_id);
