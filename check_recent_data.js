const { Pool } = require('pg');

const DATABASE_URL = "postgresql://neondb_owner:npg_yX0DEgozGeF6@ep-solitary-bread-ae4v0ky7-pooler.c-2.us-east-2.aws.neon.tech/alma?sslmode=require";

const pool = new Pool({
    connectionString: DATABASE_URL,
});

async function checkRecentData() {
    const client = await pool.connect();
    try {
        console.log('--- Recent Clients ---');
        const clients = await client.query('SELECT id, first_name, email, created_at FROM clients ORDER BY created_at DESC LIMIT 3');
        console.table(clients.rows);

        console.log('--- Recent Companies ---');
        const companies = await client.query('SELECT id, name, created_at FROM companies ORDER BY created_at DESC LIMIT 3');
        console.table(companies.rows);

        if (companies.rows.length > 0) {
            const companyId = companies.rows[0].id;
            console.log(`\nChecking data for Company ID: ${companyId}`);

            console.log('\n--- Agent Configurations ---');
            const agents = await client.query('SELECT id, company_id, model_name, temperature FROM agent_configurations WHERE company_id = $1', [companyId]);
            console.table(agents.rows);

            console.log('\n--- Prompt Modules ---');
            const prompts = await client.query('SELECT id, module_type, source, SUBSTRING(content, 1, 50) as content_preview FROM prompt_modules WHERE company_id = $1', [companyId]);
            console.table(prompts.rows);

            console.log('\n--- Company Knowledge ---');
            const knowledge = await client.query('SELECT id, file_name, created_at FROM company_knowledge WHERE company_id = $1', [companyId]);
            console.table(knowledge.rows);
        }

    } catch (err) {
        console.error('Error:', err);
    } finally {
        client.release();
        pool.end();
    }
}

checkRecentData();
