import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import pool from '@/lib/db'

// Get stable client ID from session
async function getClientIdFromSession(): Promise<string | null> {
    const cookieStore = await cookies()
    const clientId = cookieStore.get('alma_client_id')?.value
    return clientId || null
}

export async function POST(request: NextRequest) {
    try {
        const clientId = await getClientIdFromSession()
        if (!clientId) {
            return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
        }

        const { invoiceData } = await request.json()
        if (!invoiceData) {
            return NextResponse.json({ error: 'No invoice data provided' }, { status: 400 })
        }

        const client = await pool.connect()
        try {
            const result = await client.query(
                `INSERT INTO client_invoices 
                 (client_id, invoice_number, vendor_name, invoice_date, due_date, 
                  subtotal, tax_amount, total_amount, currency, category, invoice_type, line_items)
                 VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
                 RETURNING *`,
                [
                    clientId,
                    invoiceData.invoice_number,
                    invoiceData.vendor_name,
                    invoiceData.invoice_date || null,
                    invoiceData.due_date || null,
                    invoiceData.subtotal,
                    invoiceData.tax_amount,
                    invoiceData.total_amount,
                    invoiceData.currency || 'CAD',
                    invoiceData.category || 'Other',
                    invoiceData.invoice_type || 'expense',
                    JSON.stringify(invoiceData.line_items || [])
                ]
            )

            return NextResponse.json({
                success: true,
                invoice: result.rows[0]
            })

        } finally {
            client.release()
        }

    } catch (error: any) {
        console.error('Invoice save error:', error)
        return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 })
    }
}
