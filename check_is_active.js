const { Pool } = require('pg');
require('dotenv').config({ path: '.env.local' });

const pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });

async function check() {
    const client = await pool.connect();
    try {
        // Check agent_configurations columns
        const agentCols = await client.query(`
            SELECT column_name FROM information_schema.columns 
            WHERE table_name = 'agent_configurations' AND column_name = 'is_active'
        `);
        console.log('agent_configurations has is_active:', agentCols.rows.length > 0);
        
        // Check company_knowledge columns
        const knowledgeCols = await client.query(`
            SELECT column_name FROM information_schema.columns 
            WHERE table_name = 'company_knowledge' AND column_name = 'is_active'
        `);
        console.log('company_knowledge has is_active:', knowledgeCols.rows.length > 0);
        
        // Check prompt_modules columns
        const promptCols = await client.query(`
            SELECT column_name FROM information_schema.columns 
            WHERE table_name = 'prompt_modules' AND column_name = 'is_active'
        `);
        console.log('prompt_modules has is_active:', promptCols.rows.length > 0);
    } finally {
        client.release();
        pool.end();
    }
}
check();
