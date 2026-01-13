import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import pool from '@/lib/db'

async function getClientIdFromSession(): Promise<string | null> {
    const cookieStore = await cookies()
    const clientId = cookieStore.get('alma_client_id')?.value
    return clientId || null
}

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const clientId = await getClientIdFromSession()
        if (!clientId) {
            return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
        }

        const { id } = await params

        const client = await pool.connect()
        try {
            const result = await client.query(
                `SELECT * FROM user_chats WHERE id = $1 AND client_id = $2`,
                [id, clientId]
            )

            if (result.rows.length === 0) {
                return NextResponse.json({ error: 'Chat not found' }, { status: 404 })
            }

            return NextResponse.json({ chat: result.rows[0] })
        } finally {
            client.release()
        }
    } catch (error: any) {
        console.error('Fetch chat error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const clientId = await getClientIdFromSession()
        if (!clientId) {
            return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
        }

        const { id } = await params
        const { messages, title } = await request.json()

        const client = await pool.connect()
        try {
            // Build dynamic update query
            let query = 'UPDATE user_chats SET updated_at = NOW()'
            const values: any[] = []
            let valIdx = 1

            if (messages) {
                query += `, messages = $${valIdx++}`
                values.push(JSON.stringify(messages))
            }
            if (title) {
                query += `, title = $${valIdx++}`
                values.push(title)
            }

            query += ` WHERE id = $${valIdx++} AND client_id = $${valIdx++} RETURNING *`
            values.push(id, clientId)

            const result = await client.query(query, values)

            if (result.rows.length === 0) {
                return NextResponse.json({ error: 'Chat not found' }, { status: 404 })
            }

            return NextResponse.json({ chat: result.rows[0] })
        } finally {
            client.release()
        }
    } catch (error: any) {
        console.error('Update chat error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const clientId = await getClientIdFromSession()
        if (!clientId) {
            return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
        }

        const { id } = await params

        const client = await pool.connect()
        try {
            const result = await client.query(
                `DELETE FROM user_chats WHERE id = $1 AND client_id = $2 RETURNING id`,
                [id, clientId]
            )

            if (result.rows.length === 0) {
                return NextResponse.json({ error: 'Chat not found' }, { status: 404 })
            }

            return NextResponse.json({ success: true })
        } finally {
            client.release()
        }
    } catch (error: any) {
        console.error('Delete chat error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
