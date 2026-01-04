'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import pool from '@/lib/db'

export async function loginAction(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  if (!email || !password) {
    return { error: 'Please provide both email and password' }
  }

  const client = await pool.connect()
  let shouldRedirect = false

  try {
    // 1. Find user by email
    const result = await client.query(
      'SELECT id, password_hash FROM clients WHERE email = $1',
      [email]
    )

    if (result.rows.length === 0) {
      return { error: 'Invalid credentials' }
    }

    const user = result.rows[0]

    // 2. Check password (using simple base64 as used in onboarding)
    // In production, this should be bcrypt
    const providedHash = Buffer.from(password).toString('base64')

    if (providedHash !== user.password_hash) {
      return { error: 'Invalid credentials' }
    }

    // 3. Success - Set auth cookie
    const cookieStore = await cookies()
    cookieStore.set('alma_auth', 'true', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    })
    cookieStore.set('alma_client_id', String(user.id), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    })

    return { success: true }

  } catch (error) {
    console.error('Login error:', error)
    return { error: 'Failed to login' }
  } finally {
    client.release()
  }
}

export async function logoutAction() {
  const cookieStore = await cookies()
  cookieStore.delete('alma_auth')
  cookieStore.delete('alma_client_id')
  redirect('/login')
}

export async function getDashboardStats(dateStr?: string) {
  const client = await pool.connect()
  try {
    const cookieStore = await cookies()
    const clientIdStr = cookieStore.get('alma_client_id')?.value

    if (!clientIdStr) {
      console.error('No client ID found in cookies')
      return null
    }

    // Get Company ID from Client ID
    const companyRes = await client.query('SELECT id FROM companies WHERE client_id = $1', [clientIdStr])

    if (companyRes.rows.length === 0) {
      console.warn('No company found for client:', clientIdStr)
      // meaningful empty state
      return {
        kpi: { totalCalls: 0, totalSms: 0, totalConversations: 0, totalMinutes: 0 },
        productivity: { hourly: Array(24).fill(0).map((_, i) => ({ hour: i, count: 0, label: `${i.toString().padStart(2, '0')}:00` })), funnel: [] },
        feed: [],
        actionCenter: []
      }
    }

    const companyId = companyRes.rows[0].id
    console.log('Dashboard: Fetching stats for Company ID:', companyId)

    // Use provided date or default to today
    const targetDate = dateStr || new Date().toISOString().split('T')[0]

    // 1. KPI Tiles (Pulse)
    const kpiQuery = `
      SELECT 
        (SELECT COUNT(*) FROM call_logs WHERE clinic_id = $1::text) AS total_calls,
        (SELECT COUNT(*) FROM sms_messages m JOIN sms_conversations c ON m.conversation_id = c.conversation_id WHERE c.clinic_id = $1::text) AS total_sms_messages,
        (SELECT COUNT(*) FROM sms_conversations WHERE clinic_id = $1::text) AS total_conversations,
        (SELECT ROUND(SUM(duration_seconds) / 60.0, 1) FROM call_logs WHERE clinic_id = $1::text) AS total_minutes_on_call
    `

    // 2. Hourly Call Volume for specific date
    const hourlyQuery = `
        SELECT 
            EXTRACT(HOUR FROM start_time) AS call_hour, 
            COUNT(*) AS call_count
        FROM call_logs
        WHERE DATE(start_time) = $2 AND clinic_id = $1::text
        GROUP BY call_hour
        ORDER BY call_hour ASC
    `

    // 3. Unified Feed (Calls + Conversations)
    // Union of recent calls and recent conversation updates
    const feedQuery = `
        (
            SELECT 
                'call' AS type,
                start_time AS activity_time,
                caller_phone AS contact,
                summary AS details
            FROM call_logs
            WHERE clinic_id = $1::text
            ORDER BY start_time DESC
            LIMIT 5
        )
        UNION ALL
        (
            SELECT 
                'sms' AS type,
                updated_at AS activity_time,
                patient_phone AS contact,
                last_summary AS details
            FROM sms_conversations
            WHERE clinic_id = $1::text
            ORDER BY updated_at DESC
            LIMIT 5
        )
        ORDER BY activity_time DESC
        LIMIT 10
    `

    // 4. Action Center (Callback Queue + Anomalies)
    const actionQuery = `
      SELECT 
        call_id, 
        'callback' as type, 
        caller_phone,
        callback_urgency,
        callback_reason as details,
        start_time as created_at,
        CASE callback_urgency 
            WHEN 'urgent' THEN 1 
            WHEN 'moderate' THEN 2 
            ELSE 3 
        END as urgency_rank
      FROM call_logs 
      WHERE callback_required = TRUE AND clinic_id = $1::text
      
      UNION ALL
      
      SELECT 
        call_id, 
        'sentiment' as type, 
        caller_phone,
        'high' as callback_urgency, -- sentiment issues are high priority
        summary as details,
        start_time as created_at,
        2 as urgency_rank -- Place sentiment after urgent callbacks
      FROM call_logs
      WHERE (summary ILIKE '%angry%' OR summary ILIKE '%upset%' OR summary ILIKE '%frustrated%') 
      AND (callback_required = FALSE OR callback_required IS NULL) -- Avoid duplicates if already in callback queue
      AND clinic_id = $1::text
      
      ORDER BY urgency_rank ASC, created_at DESC
      LIMIT 10
    `

    const [kpiRes, hourlyRes, feedRes, actionRes] = await Promise.all([
      client.query(kpiQuery, [companyId]),
      client.query(hourlyQuery, [companyId, targetDate]),
      client.query(feedQuery, [companyId]),
      client.query(actionQuery, [companyId])
    ])

    const kpi = kpiRes.rows[0]

    // Process Hourly
    const hoursMap = new Map()
    hourlyRes.rows.forEach((r: any) => hoursMap.set(parseInt(r.call_hour), parseInt(r.call_count)))
    const hourlyData = Array.from({ length: 24 }, (_, i) => ({
      hour: i,
      count: hoursMap.get(i) || 0,
      label: `${i.toString().padStart(2, '0')}:00`
    }))

    return {
      kpi: {
        totalCalls: parseInt(kpi.total_calls || '0'),
        totalSms: parseInt(kpi.total_sms_messages || '0'),
        totalConversations: parseInt(kpi.total_conversations || '0'),
        totalMinutes: parseFloat(kpi.total_minutes_on_call || '0')
      },
      productivity: {
        hourly: hourlyData,
        // Keeping the funnel visualization as it's static/mocked for now but visually requested
        funnel: [
          { stage: 'Incoming', value: 100, fill: '#1F2937' },
          { stage: 'Identified', value: 80, fill: '#374151' },
          { stage: 'Availability', value: 60, fill: '#6B7280' },
          { stage: 'Booked', value: 40, fill: '#9CA3AF' }
        ]
      },
      feed: feedRes.rows,
      actionCenter: actionRes.rows
    }

  } catch (err) {
    console.error("CRITICAL DASHBOARD ERROR:", err)
    return null
  } finally {
    client.release()
  }
}
