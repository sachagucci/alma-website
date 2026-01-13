'use server'

import pool from '@/lib/db'

import { cookies } from 'next/headers'

export async function getAnalyticsData() {
    const client = await pool.connect()
    try {
        const cookieStore = await cookies()
        const clientIdStr = cookieStore.get('alma_client_id')?.value

        if (!clientIdStr) return { deflection: [], peakHours: [], financials: { humanCost: 0, aiCost: 0, savings: 0, totalCalls: 0 } }

        // Use stable client_id for data queries

        // 1. Deflection Rate
        // call_status options: ['completed', 'dropped', 'transferred', 'emergency']
        // 'transferred' = Escalated. Others = Handled (mostly).
        const deflectionQuery = `
        SELECT 
            CASE 
                WHEN call_status = 'transferred' THEN 'Escalated' 
                ELSE 'AI Handled' 
            END as status,
            COUNT(*) as count
        FROM call_logs
        WHERE clinic_id = $1::text
        GROUP BY 1
    `

        // 2. Peak Hours
        const peakHoursQuery = `
        SELECT 
            EXTRACT(HOUR FROM start_time) as hour, 
            COUNT(*) as count
        FROM call_logs
        WHERE clinic_id = $1::text
        GROUP BY 1
        ORDER BY 1
    `

        // 3. Cost Savings
        const costQuery = `
        SELECT 
            COUNT(*) as total_calls, 
            SUM(tokens_used) as total_tokens
        FROM call_logs
        WHERE clinic_id = $1::text
    `

        const [deflectionRes, peakHoursRes, costRes] = await Promise.all([
            client.query(deflectionQuery, [clientIdStr]),
            client.query(peakHoursQuery, [clientIdStr]),
            client.query(costQuery, [clientIdStr])
        ])

        // Process Peak Hours (Fill missing hours 0-23)
        const hoursMap = new Map()
        peakHoursRes.rows.forEach((r: any) => hoursMap.set(parseInt(r.hour), parseInt(r.count)))
        const peakHoursData = Array.from({ length: 24 }, (_, i) => ({
            hour: i,
            count: hoursMap.get(i) || 0,
            label: `${i}:00`
        }))

        // Calculate Savings
        const HUMAN_COST_PER_CALL = 5.00
        const TOKEN_COST_PER_1K = 0.002 // Approx generic LLM cost

        const totalCalls = parseInt(costRes.rows[0].total_calls || '0')
        const totalTokens = parseInt(costRes.rows[0].total_tokens || '0')

        const humanCost = totalCalls * HUMAN_COST_PER_CALL
        const aiCost = (totalTokens / 1000) * TOKEN_COST_PER_1K
        const savings = humanCost - aiCost

        return {
            deflection: deflectionRes.rows.map((r: any) => ({ name: r.status, value: parseInt(r.count) })),
            peakHours: peakHoursData,
            financials: {
                humanCost,
                aiCost,
                savings,
                totalCalls
            }
        }

    } catch (err) {
        console.error("Error fetching analytics:", err)
        return {
            deflection: [],
            peakHours: [],
            financials: { humanCost: 0, aiCost: 0, savings: 0, totalCalls: 0 }
        }
    } finally {
        client.release()
    }
}
