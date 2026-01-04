
const { Pool } = require('pg');

const pool = new Pool({
    connectionString: "postgresql://neondb_owner:npg_yX0DEgozGeF6@ep-solitary-bread-ae4v0ky7-pooler.c-2.us-east-2.aws.neon.tech/alma?sslmode=require",
});

async function inspect() {
    const client = await pool.connect();
    try {
        console.log('--- sms_conversations columns ---');
        const res = await client.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'sms_conversations';
    `);
        console.log(res.rows);
    } catch (err) {
        console.error(err);
    } finally {
        client.release();
        pool.end();
    }
}

inspect();
