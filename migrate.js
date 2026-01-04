
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function migrate() {
    const client = await pool.connect();
    try {
        const sqlPath = path.join(__dirname, 'migrations', '002_structural_updates.sql');
        const sql = fs.readFileSync(sqlPath, 'utf8');
        console.log('Running migration:', sqlPath);
        await client.query(sql);
        console.log('Migration completed successfully.');
    } catch (err) {
        console.error('Migration failed:', err);
    } finally {
        client.release();
        pool.end();
    }
}

migrate();
