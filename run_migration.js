const { Pool } = require('pg');
const fs = require('fs');
require('dotenv').config({ path: '.env.local' });

const pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });

async function migrate() {
    const client = await pool.connect();
    try {
        // Add is_active columns
        console.log('Adding is_active to agent_configurations...');
        await client.query('ALTER TABLE agent_configurations ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE');
        
        console.log('Adding is_active to company_knowledge...');
        await client.query('ALTER TABLE company_knowledge ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE');
        
        // Set existing rows to active
        console.log('Setting existing rows to active...');
        await client.query('UPDATE agent_configurations SET is_active = TRUE WHERE is_active IS NULL');
        await client.query('UPDATE company_knowledge SET is_active = TRUE WHERE is_active IS NULL');
        
        // Add id column if not exists
        console.log('Adding id column to agent_configurations...');
        await client.query('ALTER TABLE agent_configurations ADD COLUMN IF NOT EXISTS id SERIAL');
        
        // Drop the clinic_id primary key constraint
        console.log('Removing clinic_id primary key constraint...');
        try {
            await client.query('ALTER TABLE agent_configurations DROP CONSTRAINT IF EXISTS agent_configurations_pkey');
        } catch (e) {
            console.log('No constraint to drop or error:', e.message);
        }
        
        // Create indexes
        console.log('Creating indexes...');
        await client.query('CREATE INDEX IF NOT EXISTS idx_agent_config_company_active ON agent_configurations(company_id, is_active)');
        await client.query('CREATE INDEX IF NOT EXISTS idx_company_knowledge_active ON company_knowledge(company_id, is_active)');
        
        console.log('Migration complete!');
    } catch (err) {
        console.error('Migration error:', err);
    } finally {
        client.release();
        pool.end();
    }
}
migrate();
