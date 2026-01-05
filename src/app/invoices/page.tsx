'use client'

import { useState, useEffect } from 'react'
import { DashboardShell } from '@/components/DashboardShell'
import { Receipt, TrendingUp, TrendingDown, DollarSign, Calendar, Building2, Loader2 } from 'lucide-react'
import { motion } from 'framer-motion'

interface Invoice {
    id: number
    invoice_number: string | null
    vendor_name: string | null
    invoice_date: string | null
    total_amount: number | null
    currency: string
    category: string | null
    invoice_type: string
    created_at: string
}

interface Analytics {
    totalRevenue: number
    totalExpenses: number
    invoiceCount: number
    recentInvoices: Invoice[]
    expensesByCategory: { category: string; total: number }[]
    monthlyTrend: { month: string; expenses: number; revenue: number }[]
}

export default function InvoicesPage() {
    const [analytics, setAnalytics] = useState<Analytics | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        loadAnalytics()
    }, [])

    const loadAnalytics = async () => {
        try {
            const response = await fetch('/api/invoices/analytics')
            const data = await response.json()
            if (data.success) {
                setAnalytics(data.analytics)
            }
        } catch (error) {
            console.error('Failed to load analytics:', error)
        } finally {
            setLoading(false)
        }
    }

    const formatCurrency = (amount: number, currency = 'CAD') => {
        return new Intl.NumberFormat('en-CA', {
            style: 'currency',
            currency: currency
        }).format(amount)
    }

    if (loading) {
        return (
            <DashboardShell>
                <div className="flex items-center justify-center h-screen">
                    <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
                </div>
            </DashboardShell>
        )
    }

    const stats = analytics || {
        totalRevenue: 0,
        totalExpenses: 0,
        invoiceCount: 0,
        recentInvoices: [],
        expensesByCategory: [],
        monthlyTrend: []
    }

    return (
        <DashboardShell>
            <div className="min-h-screen bg-gray-50/50 p-6">
                <div className="max-w-7xl mx-auto space-y-6">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Invoice Analytics</h1>
                            <p className="text-gray-500 text-sm">Track your revenue and expenses</p>
                        </div>
                    </div>

                    {/* Summary Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white rounded-2xl border border-gray-200 p-6"
                        >
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
                                    <TrendingUp className="w-5 h-5 text-green-600" />
                                </div>
                                <span className="text-gray-500 text-sm">Revenue</span>
                            </div>
                            <p className="text-2xl font-bold text-gray-900">
                                {formatCurrency(stats.totalRevenue)}
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="bg-white rounded-2xl border border-gray-200 p-6"
                        >
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center">
                                    <TrendingDown className="w-5 h-5 text-red-600" />
                                </div>
                                <span className="text-gray-500 text-sm">Expenses</span>
                            </div>
                            <p className="text-2xl font-bold text-gray-900">
                                {formatCurrency(stats.totalExpenses)}
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="bg-white rounded-2xl border border-gray-200 p-6"
                        >
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                                    <Receipt className="w-5 h-5 text-blue-600" />
                                </div>
                                <span className="text-gray-500 text-sm">Total Invoices</span>
                            </div>
                            <p className="text-2xl font-bold text-gray-900">
                                {stats.invoiceCount}
                            </p>
                        </motion.div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Expenses by Category */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="bg-white rounded-2xl border border-gray-200 p-6"
                        >
                            <h3 className="font-semibold text-gray-900 mb-4">Expenses by Category</h3>
                            {stats.expensesByCategory.length === 0 ? (
                                <p className="text-gray-400 text-sm">No expense data yet</p>
                            ) : (
                                <div className="space-y-3">
                                    {stats.expensesByCategory.map((item, idx) => (
                                        <div key={idx} className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="w-3 h-3 rounded-full bg-gray-300"
                                                    style={{ backgroundColor: getCategoryColor(idx) }} />
                                                <span className="text-sm text-gray-700">{item.category || 'Other'}</span>
                                            </div>
                                            <span className="text-sm font-medium">{formatCurrency(item.total)}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </motion.div>

                        {/* Recent Invoices */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="bg-white rounded-2xl border border-gray-200 p-6"
                        >
                            <h3 className="font-semibold text-gray-900 mb-4">Recent Invoices</h3>
                            {stats.recentInvoices.length === 0 ? (
                                <p className="text-gray-400 text-sm">No invoices yet. Upload one in Chat!</p>
                            ) : (
                                <div className="space-y-3">
                                    {stats.recentInvoices.map((invoice) => (
                                        <div key={invoice.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${invoice.invoice_type === 'revenue' ? 'bg-green-100' : 'bg-red-100'
                                                    }`}>
                                                    {invoice.invoice_type === 'revenue' ? (
                                                        <TrendingUp className="w-5 h-5 text-green-600" />
                                                    ) : (
                                                        <TrendingDown className="w-5 h-5 text-red-600" />
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-gray-900">
                                                        {invoice.vendor_name || 'Unknown Vendor'}
                                                    </p>
                                                    <p className="text-xs text-gray-500">
                                                        {invoice.invoice_date || new Date(invoice.created_at).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            </div>
                                            <span className={`text-sm font-semibold ${invoice.invoice_type === 'revenue' ? 'text-green-600' : 'text-red-600'
                                                }`}>
                                                {invoice.invoice_type === 'revenue' ? '+' : '-'}
                                                {formatCurrency(invoice.total_amount || 0, invoice.currency)}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </motion.div>
                    </div>
                </div>
            </div>
        </DashboardShell>
    )
}

function getCategoryColor(index: number): string {
    const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16']
    return colors[index % colors.length]
}
