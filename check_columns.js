
const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

async function checkColumns() {
    const client = await pool.connect();
    try {
        const res = await client.query(`
      SELECT column_name, table_name
      FROM information_schema.columns 
      WHERE table_name IN ('sms_conversations', 'sms_messages');
    `);
        console.log('Columns:', res.rows);
    } catch (err) {
        console.error(err);
    } finally {
        client.release();
        pool.end();
    }
}

checkColumns();
