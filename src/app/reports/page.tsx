'use client'

import { DashboardShell } from '@/components/DashboardShell'
import { getMonthlyReportData } from './actions'
import { useEffect, useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, Legend } from 'recharts'
import { Calendar, Clock, TrendingUp, Users, MessageSquare } from 'lucide-react'

export default function ReportsPage() {
    const [data, setData] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        getMonthlyReportData().then(res => {
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

    const { executiveSummary, efficiencyTrend, smsGrowth, retention } = data
    const RETENTION_COLORS = ['#111827', '#4B5563', '#9CA3AF'] // Black, DkGray, LtGray

    return (
        <DashboardShell>
            <div className="max-w-[1600px] mx-auto px-6 py-8">

                <header className="mb-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black text-white text-xs font-bold uppercase tracking-wide mb-3">
                        Monthly Review
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">AI Performance Report</h1>
                    <p className="text-gray-500 mt-1 font-medium">{executiveSummary?.report_month || "Current Month"}</p>
                </header>

                {/* 1. EXECUTIVE SUMMARY */}
                {executiveSummary && (
                    <section className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                        <div className="glass-card p-6 rounded-[2rem]">
                            <p className="text-sm text-gray-500 font-medium mb-2">Total Calls</p>
                            <h3 className="text-3xl font-bold text-gray-900">{executiveSummary.total_calls}</h3>
                            <div className="mt-4 h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                                <div className="h-full bg-black w-full rounded-full"></div>
                            </div>
                        </div>
                        <div className="glass-card p-6 rounded-[2rem]">
                            <p className="text-sm text-gray-500 font-medium mb-2">Total Minutes</p>
                            <h3 className="text-3xl font-bold text-gray-900">{executiveSummary.total_minutes}</h3>
                            <p className="text-xs text-gray-600 mt-2 font-bold">+5% vs last month</p>
                        </div>
                        <div className="glass-card p-6 rounded-[2rem]">
                            <p className="text-sm text-gray-500 font-medium mb-2">Avg Duration</p>
                            <h3 className="text-3xl font-bold text-gray-900">{executiveSummary.avg_call_duration}</h3>
                            <div className="flex items-center gap-1 mt-2 text-xs text-gray-400">
                                MM:SS
                            </div>
                        </div>
                        <div className="glass-card p-6 rounded-[2rem]">
                            <p className="text-sm text-gray-500 font-medium mb-2">Booking Success</p>
                            <h3 className="text-3xl font-bold text-gray-900">{executiveSummary.booking_success_rate}</h3>
                            <p className="text-xs text-gray-400 mt-2">Conversion Rate</p>
                        </div>
                    </section>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">

                    {/* 2. EFFICIENCY TREND */}
                    <div className="glass-card p-8 rounded-[2rem]">
                        <div className="flex justify-between items-center mb-8">
                            <div>
                                <h3 className="text-lg font-bold text-gray-900">Efficiency Trend</h3>
                                <p className="text-sm text-gray-500">Weekly Call Volume vs Avg Duration</p>
                            </div>
                        </div>
                        <div className="h-64 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={efficiencyTrend}>
                                    <XAxis dataKey="week" stroke="#9CA3AF" fontSize={10} tickLine={false} axisLine={false} />
                                    <YAxis yAxisId="left" stroke="#9CA3AF" fontSize={10} tickLine={false} axisLine={false} />
                                    <YAxis yAxisId="right" orientation="right" stroke="#9CA3AF" fontSize={10} tickLine={false} axisLine={false} />
                                    <Tooltip contentStyle={{ borderRadius: '12px', border: 'none' }} />
                                    <Legend />
                                    <Line yAxisId="left" type="monotone" dataKey="volume" stroke="#E5E7EB" strokeWidth={2} dot={{ r: 4 }} name="Volume" />
                                    <Line yAxisId="right" type="monotone" dataKey="avgSeconds" stroke="#111827" strokeWidth={2} dot={{ r: 4 }} name="Avg Secs" />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* 4. RETENTION */}
                    <div className="glass-card p-8 rounded-[2rem]">
                        <div className="flex justify-between items-center mb-8">
                            <div>
                                <h3 className="text-lg font-bold text-gray-900">Patient Retention</h3>
                                <p className="text-sm text-gray-500">Caller Loyalty Breakdown</p>
                            </div>
                        </div>
                        <div className="h-64 w-full flex items-center justify-center">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={retention}
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {retention.map((entry: any, index: number) => (
                                            <Cell key={`cell-${index}`} fill={RETENTION_COLORS[index % RETENTION_COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend verticalAlign="bottom" height={36} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                </div>

                {/* 3. SMS GROWTH */}
                <div className="glass-card p-8 rounded-[2rem]">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h3 className="text-lg font-bold text-gray-900">SMS Engagement</h3>
                            <p className="text-sm text-gray-500">New Threads vs Total Messages</p>
                        </div>
                    </div>
                    <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={smsGrowth}>
                                <XAxis dataKey="week" stroke="#9CA3AF" fontSize={10} tickLine={false} axisLine={false} />
                                <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '12px', border: 'none' }} />
                                <Legend />
                                <Bar dataKey="newThreads" fill="#111827" radius={[4, 4, 0, 0]} name="New Threads" />
                                <Bar dataKey="totalMessages" fill="#9CA3AF" radius={[4, 4, 0, 0]} name="Total Messages" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </DashboardShell>
    )
}
