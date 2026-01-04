const { Pool } = require('pg');
require('dotenv').config({ path: '.env.local' });

const pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });

async function fixPK() {
    const client = await pool.connect();
    try {
        // Check current constraints
        const constraints = await client.query(`
            SELECT con.conname, con.contype
            FROM pg_constraint con
            JOIN pg_class rel ON rel.oid = con.conrelid
            WHERE rel.relname = 'agent_configurations'
        `);
        console.log('Current constraints:', constraints.rows);
        
        // Drop the primary key constraint
        console.log('Dropping primary key constraint...');
        try {
            await client.query('ALTER TABLE agent_configurations DROP CONSTRAINT IF EXISTS agent_configurations_pkey CASCADE');
            console.log('Dropped agent_configurations_pkey');
        } catch (e) {
            console.log('Error dropping pkey:', e.message);
        }
        
        // Make sure id column exists
        await client.query('ALTER TABLE agent_configurations ADD COLUMN IF NOT EXISTS id SERIAL');
        
        // List columns now
        const cols = await client.query(`
            SELECT column_name, data_type FROM information_schema.columns 
            WHERE table_name = 'agent_configurations'
        `);
        console.log('Columns:', cols.rows);
        
        console.log('Done!');
    } catch (err) {
        console.error('Error:', err);
    } finally {
        client.release();
        pool.end();
    }
}
fixPK();
