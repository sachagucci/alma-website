const { Pool } = require('pg');
require('dotenv').config({ path: '.env.local' });

const pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });

async function addColumn() {
    const client = await pool.connect();
    try {
        // Check existing columns
        const cols = await client.query(`
            SELECT column_name FROM information_schema.columns 
            WHERE table_name = 'companies'
            ORDER BY ordinal_position
        `);
        console.log('Existing columns:', cols.rows.map(r => r.column_name));
        
        // Add company_size if missing
        console.log('Adding company_size column...');
        await client.query('ALTER TABLE companies ADD COLUMN IF NOT EXISTS company_size VARCHAR(50)');
        
        // Add service_type if missing
        console.log('Adding service_type column...');
        await client.query('ALTER TABLE companies ADD COLUMN IF NOT EXISTS service_type VARCHAR(100)');
        
        console.log('Columns added!');
    } catch (err) {
        console.error('Error:', err);
    } finally {
        client.release();
        pool.end();
    }
}
addColumn();
