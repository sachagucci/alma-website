'use client'

import { useRouter } from 'next/navigation'
import { DashboardShell } from '@/components/DashboardShell'
import { getDashboardStats } from './actions'
import { useEffect, useState } from 'react'
import { ArrowUpRight, ArrowDownRight, Users, Activity, DollarSign, Phone, MessageSquare, AlertTriangle, Clock, Calendar, MessageCircle, ChevronLeft, ChevronRight } from 'lucide-react'
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from 'recharts'
import { formatDistanceToNow, format, subDays, addDays, startOfDay, isToday } from 'date-fns'
import { RefreshControl } from '@/components/RefreshControl'
import { motion } from 'framer-motion'

export default function DashboardPage() {
  const router = useRouter()
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      const dateStr = format(selectedDate, 'yyyy-MM-dd')
      const result = await getDashboardStats(dateStr)
      if (!result) {
        // Handle auth failure / null data
        router.push('/login')
      } else {
        setData(result)
      }
      setLoading(false)
    }
    fetchData()
  }, [selectedDate, router])

  console.log('Dashboard Render: loading=', loading, 'data=', data)

  if (loading) {
    return (
      <DashboardShell>
        <div className="flex-1 flex items-center justify-center h-screen">
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-12 w-12 bg-gray-200 rounded-full mb-4"></div>
            <div className="h-4 w-32 bg-gray-200 rounded"></div>
            <p className="text-gray-400 text-sm mt-4">Loading Dashboard...</p>
          </div>
        </div>
      </DashboardShell>
    )
  }

  if (!data) {
    return (
      <DashboardShell>
        <div className="flex-1 flex items-center justify-center h-screen">
          <div className="text-center">
            <h2 className="text-xl font-bold mb-2">Authentication Required</h2>
            <p className="text-gray-500 mb-4">Redirecting you to login...</p>
            <div className="animate-spin h-6 w-6 border-2 border-black border-t-transparent rounded-full mx-auto"></div>
          </div>
        </div>
      </DashboardShell>
    )
  }

  const { kpi, actionCenter, productivity, feed } = data

  return (
    <DashboardShell>
      <RefreshControl />
      <div className="max-w-[1600px] mx-auto px-6 py-8">

        <header className="mb-8 flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Mission Control</h1>
            <p className="text-gray-500 mt-1 font-medium">Live clinic performance cockpit.</p>
          </div>
          <div className="text-right text-sm text-gray-400">
            <p>Live Data</p>
          </div>
        </header>

        {/* 1. PULSE HEADER (UPDATED KPIs) */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">

          {/* Total Calls */}
          <div className="glass-card p-6 rounded-[2rem] hover:shadow-md transition-shadow cursor-pointer group flex flex-col justify-between h-32 relative overflow-hidden">
            <div className="flex items-center gap-2 mb-2 z-10">
              <p className="text-sm text-gray-500 font-semibold uppercase tracking-wide">Total Calls</p>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 z-10">{kpi.totalCalls}</h3>
          </div>

          {/* Total SMS */}
          <div className="glass-card p-6 rounded-[2rem] hover:shadow-md transition-shadow cursor-pointer group flex flex-col justify-between h-32 relative overflow-hidden">
            <div className="flex items-center gap-2 mb-2 z-10">
              <p className="text-sm text-gray-500 font-semibold uppercase tracking-wide">Total SMS</p>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 z-10">{kpi.totalSms}</h3>
          </div>

          {/* Total Conversations */}
          <div className="glass-card p-6 rounded-[2rem] hover:shadow-md transition-shadow cursor-pointer group flex flex-col justify-between h-32 relative overflow-hidden">
            <div className="flex items-center gap-2 mb-2 z-10">
              <p className="text-sm text-gray-500 font-semibold uppercase tracking-wide">Active Threads</p>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 z-10">{kpi.totalConversations}</h3>
          </div>

          {/* Total Minutes */}
          <div className="glass-card p-6 rounded-[2rem] hover:shadow-md transition-shadow cursor-pointer group flex flex-col justify-between h-32 relative overflow-hidden">
            <div className="flex items-center gap-2 mb-2 z-10">
              <p className="text-sm text-gray-500 font-semibold uppercase tracking-wide">AI Talk Time</p>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 z-10">{kpi.totalMinutes}m</h3>
          </div>

        </section>

        {/* MAIN GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* 2. ACTION CENTER (Left - 3 Cols) */}
          <div className="lg:col-span-3 flex flex-col gap-6 h-[500px]">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">Action Center</h2>
              <span className="bg-black text-white text-xs font-bold px-2 py-1 rounded-full">{actionCenter.length}</span>
            </div>

            <div className="glass-card rounded-[2rem] flex-1 overflow-hidden flex flex-col">
              <div className="overflow-y-auto p-2 space-y-1 flex-1">
                {actionCenter.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-gray-400">
                    <p className="text-xs">All clear.</p>
                  </div>
                ) : (
                  actionCenter.map((action: any) => (
                    <ActionCard key={action.call_id} action={action} />
                  ))
                )}
              </div>
            </div>
          </div>

          {/* 3. PRODUCTIVITY MAP (Center - 6 Cols) */}
          <div className="lg:col-span-6 flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">Productivity Map</h2>

              {/* Date Navigation */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setSelectedDate(prev => subDays(prev, 1))}
                  className="p-1.5 rounded-lg hover:bg-black/5 text-gray-400 hover:text-black transition-all"
                  title="Previous day"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                <span className="text-sm font-medium text-gray-900 min-w-[120px] text-center">
                  {isToday(selectedDate) ? 'Today' : format(selectedDate, 'MMM d, yyyy')}
                </span>

                <button
                  onClick={() => setSelectedDate(prev => addDays(prev, 1))}
                  disabled={isToday(selectedDate)}
                  className={`p-1.5 rounded-lg transition-all ${isToday(selectedDate)
                    ? 'text-gray-200 cursor-not-allowed'
                    : 'hover:bg-black/5 text-gray-400 hover:text-black'
                    }`}
                  title="Next day"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="glass-card p-6 rounded-[2rem]">
              <div className="flex justify-between items-center mb-6">
                <p className="text-sm text-gray-500 font-medium">
                  {format(selectedDate, 'EEEE, MMMM d, yyyy')}
                </p>
                <div className="flex gap-2">
                  <span className="w-2 h-2 rounded-full bg-black"></span>
                  <span className="text-xs text-gray-400">Calls</span>
                </div>
              </div>
              <div className="h-48 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={productivity.hourly}>
                    <XAxis
                      dataKey="label"
                      stroke="#9CA3AF"
                      fontSize={10}
                      tickLine={false}
                      axisLine={{ stroke: '#E5E7EB' }}
                      interval={1}
                      angle={0}
                      tick={{ fill: '#6B7280' }}
                    />
                    <Tooltip
                      cursor={{ fill: 'transparent' }}
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    />
                    <Bar dataKey="count" fill="#111827" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="glass-card p-6 rounded-[2rem] flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm text-gray-500 font-medium">Conversion Funnel</p>
                <h4 className="text-2xl font-bold text-gray-900">42%</h4>
                <p className="text-xs text-gray-400">Booking Rate</p>
              </div>
              <div className="flex gap-1 items-end h-24">
                {productivity.funnel.map((step: any) => (
                  <div key={step.stage} className="flex flex-col items-center gap-2 group">
                    <div
                      className="w-12 bg-indigo-100 rounded-t-lg transition-all group-hover:bg-indigo-500"
                      style={{ height: `${step.value}%`, backgroundColor: step.fill }}
                    ></div>
                    <span className="text-[10px] text-gray-400 font-medium">{step.stage}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 4. RECENT ACTIVITY (Updated Feed) */}
          <div className="lg:col-span-3 flex flex-col gap-6">
            <h2 className="text-lg font-bold text-gray-900">Recent Activity</h2>

            <div className="glass-card p-0 rounded-[2rem] overflow-hidden">
              <div className="max-h-[500px] overflow-y-auto p-6 space-y-6">
                {feed.map((item: any, idx: number) => (
                  <div key={idx} className="flex gap-4 relative">
                    <div className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 ${item.type === 'call' ? 'bg-black' : 'bg-gray-400'
                      }`}></div>
                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-xs font-bold text-gray-900">
                          {stripEmojis(item.contact || "Unknown")}
                        </span>
                        <span className="text-[10px] text-gray-400 font-medium">
                          {formatDistanceToNow(new Date(item.activity_time), { addSuffix: true })}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 leading-snug line-clamp-3">
                        {stripEmojis(item.details || (item.type === 'call' ? "Call handled" : "Conversation updated"))}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>

      </div>
    </DashboardShell>
  )
}

function ActionCard({ action }: { action: any }) {
  const [expanded, setExpanded] = useState(false)

  // Urgency Logic
  const isUrgent = action.callback_urgency === 'urgent'
  const isSentiment = action.type === 'sentiment'

  // Color mapping
  const badgeClass = isUrgent
    ? 'text-white bg-black'
    : isSentiment
      ? 'text-gray-900 bg-gray-200'
      : 'text-gray-600 bg-gray-100'

  return (
    <motion.div
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      className={`p-3 rounded-2xl hover:bg-gray-50/50 transition-all cursor-pointer border-b border-gray-100 last:border-0`}
      onClick={() => setExpanded(!expanded)}
    >
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-3">
          <div className={`text-[10px] font-bold uppercase px-2 py-1 rounded-full ${badgeClass}`}>
            {action.callback_urgency?.toUpperCase() || "ALERT"}
          </div>
          <span className="font-bold text-gray-900 font-mono text-sm">
            {stripEmojis(action.caller_phone || "Unknown")}
          </span>
        </div>
        <span className="text-[10px] text-gray-400 whitespace-nowrap ml-2">
          {formatDistanceToNow(new Date(action.created_at), { addSuffix: true })}
        </span>
      </div>

      {expanded && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          className="mt-2 pl-2 border-l-2 border-gray-100 ml-1"
        >
          <p className="text-xs text-gray-600 leading-relaxed font-medium">
            {stripEmojis(action.details || "No details provided.")}
          </p>
          <div className="mt-1 flex justify-end">
            {/* No text needed, just space */}
          </div>
        </motion.div>
      )}
    </motion.div>
  )
}

function stripEmojis(str: string) {
  if (!str) return ""
  return str.replace(/[\u{1F300}-\u{1F9FF}]|[\u{1F600}-\u{1F64F}]|[\u{1F680}-\u{1F6FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu, '');
}
