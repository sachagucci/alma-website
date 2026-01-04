const { Pool } = require('pg');
require('dotenv').config({ path: '.env.local' });

const pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });

async function addHistory() {
    const client = await pool.connect();
    try {
        // Create companies_history table
        console.log('Creating companies_history table...');
        await client.query(`
            CREATE TABLE IF NOT EXISTS companies_history (
                id SERIAL PRIMARY KEY,
                company_id INTEGER NOT NULL,
                name VARCHAR(255),
                description TEXT,
                service_type VARCHAR(100),
                company_size VARCHAR(50),
                language VARCHAR(50),
                personality VARCHAR(50),
                temperature REAL,
                changed_at TIMESTAMP DEFAULT NOW(),
                changed_by INTEGER
            )
        `);
        
        console.log('Creating index on companies_history...');
        await client.query('CREATE INDEX IF NOT EXISTS idx_companies_history_company ON companies_history(company_id)');
        
        console.log('History table created!');
    } catch (err) {
        console.error('Error:', err);
    } finally {
        client.release();
        pool.end();
    }
}
addHistory();
