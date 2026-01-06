'use client'

import { DashboardShell } from '@/components/DashboardShell'
import { getAnalyticsData } from './actions'
import { useEffect, useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts'
import { motion } from 'framer-motion'

// Recharts colors
const COLORS = ['#111827', '#4B5563', '#9CA3AF', '#D1D5DB'];

export default function AnalyticsPage() {
    const [data, setData] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        getAnalyticsData().then(res => {
            setData(res)
            setLoading(false)
        })
    }, [])

    if (loading) {
        return (
            <DashboardShell>
                <main className="flex-1 flex items-center justify-center h-screen">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
                </main>
            </DashboardShell>
        )
    }

    const { deflection, peakHours, financials } = data

    return (
        <DashboardShell>
            <div className="max-w-7xl mx-auto px-6 py-10">

                <header className="mb-12">
                    <h1 className="text-2xl font-bold text-gray-900">Clinic Health</h1>
                    <p className="text-gray-500 mt-1 font-medium">Performance metrics and ROI analysis.</p>
                </header>

                {/* KPI Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white rounded-2xl border border-gray-200 p-6 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center text-gray-600">

                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500">Estimated Savings</p>
                            <h3 className="text-2xl font-bold text-gray-900">${financials.savings.toFixed(2)}</h3>
                            <p className="text-xs text-gray-600 font-semibold">+98% increase</p>
                        </div>
                    </div>
                    <div className="bg-white rounded-2xl border border-gray-200 p-6 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-black flex items-center justify-center text-white">

                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500">Total Calls Handled</p>
                            <h3 className="text-2xl font-bold text-gray-900">{financials.totalCalls}</h3>
                        </div>
                    </div>
                    <div className="bg-white rounded-2xl border border-gray-200 p-6 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center text-gray-600">

                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500">AI Cost (Est.)</p>
                            <h3 className="text-2xl font-bold text-gray-900">${financials.aiCost.toFixed(2)}</h3>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                    {/* Deflection Rate Chart */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-2xl border border-gray-200 p-8"
                    >
                        <div className="mb-6">
                            <h3 className="text-lg font-bold text-gray-900">AI Deflection Rate</h3>
                            <p className="text-sm text-gray-400">Calls handled vs. Esculated</p>
                        </div>
                        <div className="h-64 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={deflection}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {deflection.map((entry: any, index: number) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </motion.div>

                    {/* Peak Hours Heatmap (Bar Chart) */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-white rounded-2xl border border-gray-200 p-8"
                    >
                        <div className="mb-6">
                            <h3 className="text-lg font-bold text-gray-900">Peak Call Hours</h3>
                            <p className="text-sm text-gray-400">Call volume by hour of day</p>
                        </div>
                        <div className="h-64 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={peakHours}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                    <XAxis
                                        dataKey="label"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#9CA3AF', fontSize: 10 }}
                                        interval={3}
                                    />
                                    <YAxis
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#9CA3AF', fontSize: 10 }}
                                    />
                                    <Tooltip
                                        cursor={{ fill: '#F3F4F6' }}
                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    />
                                    <Bar dataKey="count" fill="#111827" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </motion.div>

                </div>
            </div>
        </DashboardShell>
    )
}
