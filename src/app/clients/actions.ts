'use server'

import pool from '@/lib/db'

import { cookies } from 'next/headers'

export async function getClients(query: string = '') {
    const client = await pool.connect()
    try {
        const cookieStore = await cookies()
        const clientIdStr = cookieStore.get('alma_client_id')?.value

        if (!clientIdStr) return []

        // Get Company ID
        const companyRes = await client.query('SELECT id FROM companies WHERE client_id = $1', [clientIdStr])
        if (companyRes.rows.length === 0) return []

        const companyId = companyRes.rows[0].id

        // Simple search by phone for now
        // Grouping by patient_phone to get unique patients
        const sql = `
      SELECT patient_phone, 
             MAX(created_at) as last_activity, 
             COUNT(*) as interaction_count,
             MAX(last_summary) as last_summary
      FROM sms_conversations
      WHERE patient_phone ILIKE $1 AND clinic_id = $2::text
      GROUP BY patient_phone
      ORDER BY last_activity DESC
      LIMIT 50
    `
        const res = await client.query(sql, [`%${query}%`, companyId])
        return res.rows
    } catch (err) {
        console.error('Error fetching patients:', err)
        return []
    } finally {
        client.release()
    }
}

export async function getClientDetails(phone: string) {
    const client = await pool.connect()
    try {
        const cookieStore = await cookies()
        const clientIdStr = cookieStore.get('alma_client_id')?.value

        if (!clientIdStr) return []

        // Get Company ID
        const companyRes = await client.query('SELECT id FROM companies WHERE client_id = $1', [clientIdStr])
        if (companyRes.rows.length === 0) return []

        const companyId = companyRes.rows[0].id

        // Decode phone if it was URL encoded
        const decodedPhone = decodeURIComponent(phone)

        // 1. Get all SMS
        const smsQuery = `
            SELECT 
                message_id as id, 
                created_at, 
                direction as type, 
                body as content, 
                'sms' as source,
                NULL as duration_seconds,
                NULL as transcript
            FROM sms_messages 
            WHERE conversation_id IN (SELECT conversation_id FROM sms_conversations WHERE patient_phone = $1 AND clinic_id = $2::text)
        `

        // 2. Get all Calls
        const callQuery = `
            SELECT 
                call_id as id, 
                start_time as created_at, 
                'inbound' as type, 
                summary as content, 
                'call' as source,
                duration_seconds,
                transcript
            FROM call_logs 
            WHERE caller_phone = $1 AND clinic_id = $2::text
        `

        // Combine and order
        const [smsRes, callRes] = await Promise.all([
            client.query(smsQuery, [decodedPhone, companyId]),
            client.query(callQuery, [decodedPhone, companyId])
        ])

        const timeline = [...smsRes.rows, ...callRes.rows].sort((a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        )

        return timeline
    } catch (err) {
        console.error('Error fetching patient details:', err)
        return []
    } finally {
        client.release()
    }
}
