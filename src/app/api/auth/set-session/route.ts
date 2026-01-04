import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
    try {
        const { clientId } = await request.json()

        if (!clientId) {
            return NextResponse.json({ error: 'Missing clientId' }, { status: 400 })
        }

        const cookieStore = await cookies()

        cookieStore.set('alma_auth', 'true', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 24 * 7, // 7 days
            path: '/',
        })

        cookieStore.set('alma_client_id', String(clientId), {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 24 * 7,
            path: '/',
        })

        console.log('Session cookies set for clientId:', clientId)

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Error setting session cookies:', error)
        return NextResponse.json({ error: 'Failed to set cookies' }, { status: 500 })
    }
}
