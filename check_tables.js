
const { Pool } = require('pg');
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function checkColumns() {
    const client = await pool.connect();
    try {
        const res = await client.query(`
      SELECT table_name, column_name 
      FROM information_schema.columns 
      WHERE table_name IN ('agent_configurations', 'prompt_modules')
      ORDER BY table_name, ordinal_position;
    `);
        console.log('Columns:', res.rows);
    } finally {
        client.release();
        pool.end();
    }
}
checkColumns();
