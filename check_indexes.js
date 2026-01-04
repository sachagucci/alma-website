const { Pool } = require('pg');
require('dotenv').config({ path: '.env.local' });

const pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });

async function check() {
    const client = await pool.connect();
    try {
        // Check indexes
        const indexes = await client.query(`
            SELECT indexname, indexdef FROM pg_indexes 
            WHERE tablename = 'agent_configurations'
        `);
        console.log('Indexes:', indexes.rows);
        
        // Drop any unique indexes on clinic_id
        for (const idx of indexes.rows) {
            if (idx.indexdef.includes('UNIQUE') && idx.indexdef.includes('clinic_id')) {
                console.log('Dropping unique index:', idx.indexname);
                await client.query(`DROP INDEX IF EXISTS ${idx.indexname}`);
            }
        }
        
        console.log('Done!');
    } finally {
        client.release();
        pool.end();
    }
}
check();
