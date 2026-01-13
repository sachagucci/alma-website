import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import pool from '@/lib/db'

// Get stable client ID from session
async function getClientIdFromSession(): Promise<string | null> {
    const cookieStore = await cookies()
    const clientId = cookieStore.get('alma_client_id')?.value
    return clientId || null
}

export async function GET() {
    try {
        const clientId = await getClientIdFromSession()
        if (!clientId) {
            return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
        }

        const client = await pool.connect()
        try {
            // Get total revenue
            const revenueResult = await client.query(
                `SELECT COALESCE(SUM(total_amount), 0) as total 
                 FROM client_invoices 
                 WHERE client_id = $1 AND invoice_type = 'revenue'`,
                [clientId]
            )

            // Get total expenses
            const expensesResult = await client.query(
                `SELECT COALESCE(SUM(total_amount), 0) as total 
                 FROM client_invoices 
                 WHERE client_id = $1 AND invoice_type = 'expense'`,
                [clientId]
            )

            // Get invoice count
            const countResult = await client.query(
                `SELECT COUNT(*) as count FROM client_invoices WHERE client_id = $1`,
                [clientId]
            )

            // Get recent invoices
            const recentResult = await client.query(
                `SELECT id, invoice_number, vendor_name, invoice_date, total_amount, 
                        currency, category, invoice_type, created_at
                 FROM client_invoices 
                 WHERE client_id = $1 
                 ORDER BY created_at DESC 
                 LIMIT 10`,
                [clientId]
            )

            // Get expenses by category
            const categoryResult = await client.query(
                `SELECT category, COALESCE(SUM(total_amount), 0) as total
                 FROM client_invoices 
                 WHERE client_id = $1 AND invoice_type = 'expense'
                 GROUP BY category
                 ORDER BY total DESC`,
                [clientId]
            )

            // Get monthly trend (last 6 months)
            const trendResult = await client.query(
                `SELECT 
                    TO_CHAR(invoice_date, 'YYYY-MM') as month,
                    COALESCE(SUM(CASE WHEN invoice_type = 'expense' THEN total_amount ELSE 0 END), 0) as expenses,
                    COALESCE(SUM(CASE WHEN invoice_type = 'revenue' THEN total_amount ELSE 0 END), 0) as revenue
                 FROM client_invoices 
                 WHERE client_id = $1 AND invoice_date IS NOT NULL
                 GROUP BY TO_CHAR(invoice_date, 'YYYY-MM')
                 ORDER BY month DESC
                 LIMIT 6`,
                [clientId]
            )

            return NextResponse.json({
                success: true,
                analytics: {
                    totalRevenue: parseFloat(revenueResult.rows[0].total) || 0,
                    totalExpenses: parseFloat(expensesResult.rows[0].total) || 0,
                    invoiceCount: parseInt(countResult.rows[0].count) || 0,
                    recentInvoices: recentResult.rows,
                    expensesByCategory: categoryResult.rows.map(row => ({
                        category: row.category,
                        total: parseFloat(row.total)
                    })),
                    monthlyTrend: trendResult.rows.map(row => ({
                        month: row.month,
                        expenses: parseFloat(row.expenses),
                        revenue: parseFloat(row.revenue)
                    }))
                }
            })

        } finally {
            client.release()
        }

    } catch (error: any) {
        console.error('Analytics error:', error)
        return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 })
    }
}
