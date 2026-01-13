import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import pool from '@/lib/db'

async function getClientIdFromSession(): Promise<string | null> {
    const cookieStore = await cookies()
    const clientId = cookieStore.get('alma_client_id')?.value
    return clientId || null
}

export async function GET(request: NextRequest) {
    try {
        const clientId = await getClientIdFromSession()
        if (!clientId) {
            return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
        }

        const client = await pool.connect()
        try {
            const result = await client.query(
                `SELECT id, title, created_at, updated_at 
                 FROM user_chats 
                 WHERE client_id = $1 
                 ORDER BY updated_at DESC 
                 LIMIT 50`,
                [clientId]
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
        const clientId = await getClientIdFromSession()
        if (!clientId) {
            return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
        }

        const { title, messages } = await request.json()

        const client = await pool.connect()
        try {
            const result = await client.query(
                `INSERT INTO user_chats (client_id, title, messages) 
                 VALUES ($1, $2, $3) 
                 RETURNING id, title, created_at, updated_at`,
                [clientId, title || 'New Chat', JSON.stringify(messages || [])]
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
