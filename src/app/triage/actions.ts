'use server'

import pool from '@/lib/db'
import { revalidatePath } from 'next/cache'

import { cookies } from 'next/headers'

export async function resolveCallbackAction(callId: string) {
    const client = await pool.connect()
    try {
        const cookieStore = await cookies()
        const clientIdStr = cookieStore.get('alma_client_id')?.value

        if (!clientIdStr) return

        // Get Company ID
        const companyRes = await client.query('SELECT id FROM companies WHERE client_id = $1', [clientIdStr])
        if (companyRes.rows.length === 0) return

        const companyId = companyRes.rows[0].id

        await client.query(
            `UPDATE call_logs SET callback_required = FALSE WHERE call_id = $1 AND clinic_id = $2::text`,
            [callId, companyId]
        )
        revalidatePath('/triage')
    } catch (err) {
        console.error('Error resolving callback:', err)
    } finally {
        client.release()
    }
}

export async function getTriageData() {
    const client = await pool.connect()
    try {
        const cookieStore = await cookies()
        const clientIdStr = cookieStore.get('alma_client_id')?.value

        if (!clientIdStr) return { urgentCalls: [], recentMessages: [] }

        // Get Company ID
        const companyRes = await client.query('SELECT id FROM companies WHERE client_id = $1', [clientIdStr])
        if (companyRes.rows.length === 0) return { urgentCalls: [], recentMessages: [] }

        const companyId = companyRes.rows[0].id

        const urgentCallsQuery = `
        SELECT * FROM call_logs 
        WHERE callback_required = TRUE AND callback_urgency = 'urgent' AND clinic_id = $1::text
        ORDER BY start_time ASC
    `
        // Join with conversations to check clinic_id
        const recentMessagesQuery = `
        SELECT m.* FROM sms_messages m
        JOIN sms_conversations c ON m.conversation_id = c.conversation_id
        WHERE c.clinic_id = $1::text
        ORDER BY m.created_at DESC 
        LIMIT 20
    `

        const [urgentCallsRes, recentMessagesRes] = await Promise.all([
            client.query(urgentCallsQuery, [companyId]),
            client.query(recentMessagesQuery, [companyId])
        ])

        return {
            urgentCalls: urgentCallsRes.rows,
            recentMessages: recentMessagesRes.rows
        }
    } catch (err) {
        console.error("Error fetching triage data:", err)
        return { urgentCalls: [], recentMessages: [] }
    } finally {
        client.release()
    }
}
