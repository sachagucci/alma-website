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

        // Update using stable client_id
        await client.query(
            `UPDATE call_logs SET callback_required = FALSE WHERE call_id = $1 AND clinic_id = $2::text`,
            [callId, clientIdStr]
        )
        revalidatePath('/calls')
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

        // Use stable client_id for data queries

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
            client.query(urgentCallsQuery, [clientIdStr]),
            client.query(recentMessagesQuery, [clientIdStr])
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
