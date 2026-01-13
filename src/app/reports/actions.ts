'use server'

import pool from '@/lib/db'

import { cookies } from 'next/headers'

export async function getMonthlyReportData() {
    const client = await pool.connect()
    try {
        const cookieStore = await cookies()
        const clientIdStr = cookieStore.get('alma_client_id')?.value

        if (!clientIdStr) return { executiveSummary: null, efficiencyTrend: [], smsGrowth: [], retention: [] }

        // Use stable client_id for data queries

        // 1. Executive Summary
        const execSummaryQuery = `
        SELECT 
            TO_CHAR(start_time, 'Month YYYY') AS report_month,
            COUNT(*) AS total_calls,
            ROUND(SUM(duration_seconds) / 60.0, 1) AS total_minutes,
            TO_CHAR((AVG(duration_seconds) || ' seconds')::interval, 'MI:SS') AS avg_call_duration,
            ROUND(100.0 * SUM(CASE WHEN appointment_booked = TRUE THEN 1 ELSE 0 END) / COUNT(*), 1) || '%' AS booking_success_rate
        FROM call_logs
        WHERE start_time >= DATE_TRUNC('month', CURRENT_DATE) AND clinic_id = $1::text
        GROUP BY report_month
    `

        // 2. Week-Over-Week Efficiency Trend
        const efficiencyQuery = `
        SELECT 
            DATE_TRUNC('week', start_time)::date AS week_commencing,
            COUNT(*) AS weekly_call_volume,
            ROUND(AVG(duration_seconds), 1) AS avg_seconds_per_call,
            ROUND(100.0 * SUM(CASE WHEN callback_urgency = 'urgent' THEN 1 ELSE 0 END) / COUNT(*), 1) AS urgent_escalation_pct
        FROM call_logs
        WHERE start_time >= CURRENT_DATE - INTERVAL '1 month' AND clinic_id = $1::text
        GROUP BY 1
        ORDER BY 1 DESC
    `

        // 3. SMS Engagement & Growth Report
        const smsGrowthQuery = `
        SELECT 
            DATE_TRUNC('week', created_at)::date AS week,
            COUNT(*) AS new_sms_threads,
            (SELECT COUNT(*) 
             FROM sms_messages m 
             JOIN sms_conversations c2 ON m.conversation_id = c2.conversation_id
             WHERE DATE_TRUNC('week', m.created_at) = DATE_TRUNC('week', c.created_at)
             AND c2.clinic_id = $1::text
            ) AS total_messages_sent
        FROM sms_conversations c
        WHERE created_at >= CURRENT_DATE - INTERVAL '1 month' AND clinic_id = $1::text
        GROUP BY week
        ORDER BY week DESC
    `

        // 4. Patient Retention (Repeat Callers)
        const retentionQuery = `
        WITH caller_stats AS (
            SELECT caller_phone, COUNT(*) as call_count
            FROM call_logs
            WHERE start_time >= CURRENT_DATE - INTERVAL '1 month' AND clinic_id = $1::text
            GROUP BY caller_phone
        )
        SELECT 
            CASE 
                WHEN call_count = 1 THEN 'New Caller'
                WHEN call_count BETWEEN 2 AND 4 THEN 'Regular'
                ELSE 'Frequent Caller'
            END AS caller_type,
            COUNT(*) AS patient_count
        FROM caller_stats
        GROUP BY caller_type
    `

        const [execRes, efficiencyRes, smsRes, retentionRes] = await Promise.all([
            client.query(execSummaryQuery, [clientIdStr]),
            client.query(efficiencyQuery, [clientIdStr]),
            client.query(smsGrowthQuery, [clientIdStr]),
            client.query(retentionQuery, [clientIdStr])
        ])

        return {
            executiveSummary: execRes.rows[0], // Current month only
            efficiencyTrend: efficiencyRes.rows.map((r: any) => ({
                week: new Date(r.week_commencing).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                volume: parseInt(r.weekly_call_volume),
                avgSeconds: parseFloat(r.avg_seconds_per_call),
                urgentPct: parseFloat(r.urgent_escalation_pct)
            })).reverse(), // Reverse to show trend left-to-right
            smsGrowth: smsRes.rows.map((r: any) => ({
                week: new Date(r.week).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                newThreads: parseInt(r.new_sms_threads),
                totalMessages: parseInt(r.total_messages_sent)
            })).reverse(),
            retention: retentionRes.rows.map((r: any) => ({
                name: r.caller_type,
                value: parseInt(r.patient_count)
            }))
        }

    } catch (err) {
        console.error("Error fetching report data:", err)
        return {
            executiveSummary: null,
            efficiencyTrend: [],
            smsGrowth: [],
            retention: []
        }
    } finally {
        client.release()
    }
}
