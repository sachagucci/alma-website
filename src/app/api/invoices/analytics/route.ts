import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import pool from '@/lib/db'

// Get company ID from session
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

export async function GET() {
    try {
        const companyId = await getCompanyIdFromSession()
        if (!companyId) {
            return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
        }

        const client = await pool.connect()
        try {
            // Get total revenue
            const revenueResult = await client.query(
                `SELECT COALESCE(SUM(total_amount), 0) as total 
                 FROM client_invoices 
                 WHERE company_id = $1 AND invoice_type = 'revenue'`,
                [companyId]
            )

            // Get total expenses
            const expensesResult = await client.query(
                `SELECT COALESCE(SUM(total_amount), 0) as total 
                 FROM client_invoices 
                 WHERE company_id = $1 AND invoice_type = 'expense'`,
                [companyId]
            )

            // Get invoice count
            const countResult = await client.query(
                `SELECT COUNT(*) as count FROM client_invoices WHERE company_id = $1`,
                [companyId]
            )

            // Get recent invoices
            const recentResult = await client.query(
                `SELECT id, invoice_number, vendor_name, invoice_date, total_amount, 
                        currency, category, invoice_type, created_at
                 FROM client_invoices 
                 WHERE company_id = $1 
                 ORDER BY created_at DESC 
                 LIMIT 10`,
                [companyId]
            )

            // Get expenses by category
            const categoryResult = await client.query(
                `SELECT category, COALESCE(SUM(total_amount), 0) as total
                 FROM client_invoices 
                 WHERE company_id = $1 AND invoice_type = 'expense'
                 GROUP BY category
                 ORDER BY total DESC`,
                [companyId]
            )

            // Get monthly trend (last 6 months)
            const trendResult = await client.query(
                `SELECT 
                    TO_CHAR(invoice_date, 'YYYY-MM') as month,
                    COALESCE(SUM(CASE WHEN invoice_type = 'expense' THEN total_amount ELSE 0 END), 0) as expenses,
                    COALESCE(SUM(CASE WHEN invoice_type = 'revenue' THEN total_amount ELSE 0 END), 0) as revenue
                 FROM client_invoices 
                 WHERE company_id = $1 AND invoice_date IS NOT NULL
                 GROUP BY TO_CHAR(invoice_date, 'YYYY-MM')
                 ORDER BY month DESC
                 LIMIT 6`,
                [companyId]
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
