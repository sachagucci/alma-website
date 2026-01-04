
const { Pool } = require('pg');
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function checkColumns() {
    const client = await pool.connect();
    try {
        const res = await client.query(`
      SELECT table_name, column_name, data_type
      FROM information_schema.columns 
      WHERE table_name IN ('call_logs', 'sms_conversations')
      ORDER BY table_name, ordinal_position;
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
