const { Pool } = require('pg');
require('dotenv').config({ path: '.env.local' });

const pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });

async function createTemplates() {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        
        // 1. Deactivate all company-specific prompts (from onboarding)
        console.log('Deactivating company-specific prompts...');
        await client.query(`
            UPDATE prompt_modules SET is_active = FALSE 
            WHERE company_id IS NOT NULL AND source = 'onboarding'
        `);
        
        // 2. Create/update global identity template
        console.log('Creating global identity template...');
        await client.query(`
            INSERT INTO prompt_modules (clinic_id, company_id, slug, content, source, is_active)
            VALUES ('global', NULL, 'identity', $1, 'template', TRUE)
            ON CONFLICT (slug, clinic_id) 
            DO UPDATE SET content = EXCLUDED.content, is_active = TRUE
        `, [`# IDENTITY
You are {{agent_name}}, a virtual receptionist for {{company_name}}.
You are an AI assistant - NOT a real person, NOT a doctor, NOT a nurse.
Sound natural and human-like. Be {{personality}}.

# ABOUT {{company_name}}
{{company_description}}

Service Type: {{service_type}}
Language: {{language}}

# COMPANY KNOWLEDGE
{{company_knowledge}}`]);
        
        // 3. Create/update global workflow template
        console.log('Creating global workflow template...');
        await client.query(`
            INSERT INTO prompt_modules (clinic_id, company_id, slug, content, source, is_active)
            VALUES ('global', NULL, 'workflow', $1, 'template', TRUE)
            ON CONFLICT (slug, clinic_id)
            DO UPDATE SET content = EXCLUDED.content, is_active = TRUE
        `, [`# WORKFLOW

## STEP 1: WELCOME/GREETINGS + CHECK IF NEW/EXISTING
- If EXISTING: proceed to Step 2
- If NEW: say "Welcome! I'd be happy to help you become a patient. Let me get some information."

## STEP 2: IDENTIFICATION
Ask for phone number and date of birth:
"May I have your phone number and date of birth to look up your file?"

## STEP 3: DETERMINE REASON
- Ask what they need help with today
- Common reasons: booking appointment, canceling, rescheduling, general inquiry

## STEP 4: HANDLE REQUEST
- For appointments: check availability, confirm booking
- For info requests: answer using company knowledge
- For issues outside scope: offer to take a message or callback`]);
        
        await client.query('COMMIT');
        console.log('Global templates created!');
        
        // Verify
        const result = await client.query(`
            SELECT slug, clinic_id, source, is_active, 
                   substring(content, 1, 100) as preview
            FROM prompt_modules 
            WHERE is_active = TRUE AND source = 'template'
            ORDER BY slug
        `);
        console.log('\nActive templates:', result.rows);
        
    } catch (err) {
        await client.query('ROLLBACK');
        console.error('Error:', err);
    } finally {
        client.release();
        pool.end();
    }
}
createTemplates();
