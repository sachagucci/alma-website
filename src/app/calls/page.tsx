import { DashboardShell } from '@/components/DashboardShell'
import { getTriageData, resolveCallbackAction } from './actions'
import { format } from 'date-fns'
import { RefreshControl } from '@/components/RefreshControl'

export const dynamic = 'force-dynamic'

export default async function TriagePage() {
    const { urgentCalls, recentMessages } = await getTriageData()

    return (
        <DashboardShell>
            <RefreshControl />
            <div className="max-w-7xl mx-auto px-6 py-10 h-screen flex flex-col">

                <header className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-900">Call Log</h1>
                    <p className="text-gray-500 mt-1 font-medium">Review incoming calls and service requests.</p>
                </header>

                <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-8 min-h-0">

                    {/* Urgent Callback Queue */}
                    <div className="flex flex-col h-full">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-black animate-pulse"></div>
                                Priority Callbacks
                                <span className="bg-black text-white text-xs px-2 py-0.5 rounded-full">
                                    {urgentCalls.length}
                                </span>
                            </h2>
                        </div>

                        <div className="bg-white rounded-2xl border border-gray-200 flex-1 overflow-y-auto p-2 space-y-2">
                            {urgentCalls.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-gray-400">
                                    <p>No priority callbacks required</p>
                                </div>
                            ) : (
                                urgentCalls.map((call: any) => (
                                    <div key={call.call_id} className="group p-4 rounded-3xl bg-gray-50 border border-gray-100 hover:border-gray-300 transition-all">
                                        <div className="flex justify-between items-start mb-2">
                                            <div className="flex items-center gap-2">
                                                <span className="font-semibold text-gray-900">
                                                    {call.summary || "Unknown Issue"}
                                                </span>
                                            </div>
                                            <span className="text-xs text-black font-bold whitespace-nowrap">
                                                {call.start_time ? format(new Date(call.start_time), 'h:mm a') : 'N/A'}
                                            </span>
                                        </div>
                                        <div className="pl-6">
                                            <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                                                Client reporting: {call.transcript ? "See transcript..." : "No details available."}
                                            </p>
                                            <form action={resolveCallbackAction.bind(null, call.call_id)}>
                                                <button className="text-xs font-semibold bg-white border border-gray-200 text-gray-700 px-3 py-1.5 rounded-lg hover:bg-gray-50 hover:text-black transition-colors w-full sm:w-auto">
                                                    Mark Resolved
                                                </button>
                                            </form>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Live Feed */}
                    <div className="flex flex-col h-full">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-bold text-gray-900">Live Feed</h2>
                            <span className="text-xs font-medium text-gray-400 flex items-center gap-1">
                                <div className="w-1.5 h-1.5 rounded-full bg-black"></div>
                                Live
                            </span>
                        </div>

                        <div className="bg-white rounded-2xl border border-gray-200 p-6 flex-1 overflow-y-auto">
                            <div className="relative border-l border-gray-100 ml-3 space-y-8">
                                {recentMessages.map((msg: any) => (
                                    <div key={msg.message_id} className="relative pl-8 group">
                                        <div className={`absolute -left-[5px] top-1 w-2.5 h-2.5 rounded-full border-2 border-white ring-1 ring-gray-100 ${msg.direction === 'inbound' ? 'bg-black' : 'bg-gray-300'
                                            }`}></div>

                                        <div className="flex items-center justify-between mb-1">
                                            <span className={`text-xs font-bold uppercase tracking-wider ${msg.direction === 'inbound' ? 'text-black' : 'text-gray-500'
                                                }`}>
                                                {msg.direction === 'inbound' ? 'Incoming SMS' : 'Outbound SMS'}
                                            </span>
                                            <span className="text-[10px] text-gray-400">
                                                {msg.created_at ? format(new Date(msg.created_at), 'h:mm a') : ''}
                                            </span>
                                        </div>

                                        <div className={`p-3 rounded-2xl text-sm ${msg.contains_phi
                                            ? 'bg-gray-100 border border-gray-200 text-gray-900'
                                            : 'bg-white border border-gray-100 text-gray-700'
                                            }`}>
                                            {msg.contains_phi && (
                                                <div className="flex items-center gap-1 text-[10px] uppercase font-bold text-black mb-1">
                                                    PHI Detected
                                                </div>
                                            )}
                                            {msg.body}
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
