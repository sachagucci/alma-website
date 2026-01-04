const { Pool } = require('pg');
require('dotenv').config({ path: '.env.local' });

const pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });

async function test() {
    const client = await pool.connect();
    try {
        // First, verify there's no pkey
        const pk = await client.query(`
            SELECT conname FROM pg_constraint 
            WHERE conrelid = 'agent_configurations'::regclass AND contype = 'p'
        `);
        console.log('Primary keys:', pk.rows);
        
        // Test insert
        console.log('Testing insert...');
        await client.query(`
            INSERT INTO agent_configurations (clinic_id, agent_name, company_id, model_name, temperature, voice_settings, is_active, created_at)
            VALUES ('1', 'Test Agent', 1, 'test-model', 0.5, '{"language_code": "en-US"}', TRUE, NOW())
        `);
        console.log('Insert succeeded!');
        
    } catch (err) {
        console.error('Error:', err.message);
    } finally {
        client.release();
        pool.end();
    }
}
test();
