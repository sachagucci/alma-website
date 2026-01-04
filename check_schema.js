const { Pool } = require('pg');
const DATABASE_URL = "postgresql://neondb_owner:npg_yX0DEgozGeF6@ep-solitary-bread-ae4v0ky7-pooler.c-2.us-east-2.aws.neon.tech/alma?sslmode=require";
const pool = new Pool({ connectionString: DATABASE_URL });

async function checkSchema() {
  const client = await pool.connect();
  try {
    console.log('=== agent_configurations columns ===');
    const ac = await client.query(`SELECT column_name, data_type, is_nullable FROM information_schema.columns WHERE table_name = 'agent_configurations' ORDER BY ordinal_position`);
    console.table(ac.rows);
    
    console.log('\n=== prompt_modules columns ===');
    const pm = await client.query(`SELECT column_name, data_type, is_nullable FROM information_schema.columns WHERE table_name = 'prompt_modules' ORDER BY ordinal_position`);
    console.table(pm.rows);
    
    console.log('\n=== company_knowledge columns ===');
    const ck = await client.query(`SELECT column_name, data_type, is_nullable FROM information_schema.columns WHERE table_name = 'company_knowledge' ORDER BY ordinal_position`);
    console.table(ck.rows);
  } finally {
    client.release();
    pool.end();
  }
}
checkSchema();
