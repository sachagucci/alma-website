
const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

async function checkUsers() {
    const client = await pool.connect();
    try {
        const res = await client.query('SELECT id, email, password_hash, created_at FROM clients ORDER BY created_at DESC');
        console.log('Registered Users:', res.rows);
    } catch (err) {
        console.error(err);
    } finally {
        client.release();
        pool.end();
    }
}

checkUsers();
