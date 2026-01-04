const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// Manually read .env.local
try {
    const envConfig = fs.readFileSync(path.resolve(process.cwd(), '.env.local'), 'utf8');
    envConfig.split('\n').forEach(line => {
        const [key, value] = line.split('=');
        if (key && value) {
            process.env[key.trim()] = value.trim();
        }
    });
} catch (e) {
    console.error('Could not read .env.local');
}

const pool = new Pool({
    connectionString: "postgresql://neondb_owner:npg_yX0DEgozGeF6@ep-solitary-bread-ae4v0ky7-pooler.c-2.us-east-2.aws.neon.tech/alma?sslmode=require",
});

async function inspect() {
    const client = await pool.connect();
    try {
        console.log('--- call_logs columns ---');
        const res1 = await client.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'call_logs';
    `);
        console.log(res1.rows);

        console.log('\n--- sms_messages columns ---');
        const res2 = await client.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'sms_messages';
    `);
        console.log(res2.rows);

    } catch (err) {
        console.error(err);
    } finally {
        client.release();
        pool.end();
    }
}

inspect();
