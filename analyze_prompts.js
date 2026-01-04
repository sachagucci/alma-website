const { Pool } = require('pg');
require('dotenv').config({ path: '.env.local' });

const pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });

async function analyze() {
    const client = await pool.connect();
    try {
        // Get all prompt_modules
        const prompts = await client.query(`
            SELECT id, clinic_id, company_id, slug, content, generated_from_doc, source, is_active 
            FROM prompt_modules ORDER BY id
        `);
        console.log('Total prompt_modules:', prompts.rows.length);
        console.log('\n=== PROMPT MODULES ===');
        for (const p of prompts.rows) {
            console.log(`\n--- ID: ${p.id} | Slug: ${p.slug} | Source: ${p.source} | Active: ${p.is_active} ---`);
            console.log(`Clinic: ${p.clinic_id} | Company: ${p.company_id}`);
            console.log('Content:', (p.content || '').substring(0, 300) + (p.content?.length > 300 ? '...' : ''));
        }
        
        // Get unique slugs
        const slugs = await client.query('SELECT DISTINCT slug FROM prompt_modules WHERE is_active = TRUE');
        console.log('\n=== UNIQUE SLUGS ===');
        console.log(slugs.rows.map(r => r.slug));
        
    } finally {
        client.release();
        pool.end();
    }
}
analyze();
