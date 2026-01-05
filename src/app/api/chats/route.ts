import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import pool from '@/lib/db'

async function getCompanyIdFromSession(): Promise<number | null> {
    const cookieStore = await cookies()
    const clientId = cookieStore.get('alma_client_id')?.value
    if (!clientId) return null

    const client = await pool.connect()
    try {
        const result = await client.query(
            'SELECT id FROM companies WHERE client_id = $1',
            [clientId]
        )
        return result.rows[0]?.id || null
    } finally {
        client.release()
    }
}

export async function GET(request: NextRequest) {
    try {
        const companyId = await getCompanyIdFromSession()
        if (!companyId) {
            return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
        }

        const client = await pool.connect()
        try {
            const result = await client.query(
                `SELECT id, title, created_at, updated_at 
                 FROM user_chats 
                 WHERE company_id = $1 
                 ORDER BY updated_at DESC 
                 LIMIT 50`,
                [companyId]
            )
            return NextResponse.json({ chats: result.rows })
        } finally {
            client.release()
        }
    } catch (error: any) {
        console.error('Fetch chats error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

export async function POST(request: NextRequest) {
    try {
        const companyId = await getCompanyIdFromSession()
        if (!companyId) {
            return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
        }

        const { title, messages } = await request.json()

        const client = await pool.connect()
        try {
            const result = await client.query(
                `INSERT INTO user_chats (company_id, title, messages) 
                 VALUES ($1, $2, $3) 
                 RETURNING id, title, created_at, updated_at`,
                [companyId, title || 'New Chat', JSON.stringify(messages || [])]
            )
            return NextResponse.json({ chat: result.rows[0] })
        } finally {
            client.release()
        }
    } catch (error: any) {
        console.error('Create chat error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
