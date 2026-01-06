import { Sidebar } from '@/components/Sidebar'
import { getClientDetails } from '../actions'
import { Phone, MessageSquare, ArrowLeft, Clock, FileText } from 'lucide-react'
import Link from 'next/link'
import { format } from 'date-fns'

export const dynamic = 'force-dynamic'

export default async function PatientDetailPage({ params }: { params: { id: string } }) {
    const { id } = await params
    const decodedId = decodeURIComponent(id)
    const timeline = await getClientDetails(decodedId)

    return (
        <div className="min-h-screen flex bg-[#FAFAFA]">
            <Sidebar />

            <main className="flex-1 md:pl-20 lg:pl-64">
                <div className="max-w-5xl mx-auto px-6 py-10">

                    <div className="mb-8">
                        <Link href="/clients" className="inline-flex items-center gap-2 text-gray-500 hover:text-black mb-6 transition-colors font-medium">
                            <ArrowLeft className="w-4 h-4" /> Back to Clients
                        </Link>
                        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">{decodedId}</h1>
                        <p className="text-gray-500 mt-1 font-medium">Client History • {timeline.length} Interactions</p>
                    </div>

                    <div className="space-y-8">
                        {timeline.map((item: any) => (
                            <div key={item.id} className="relative pl-8">
                                {/* Timeline Line */}
                                <div className="absolute left-[11px] top-8 bottom-[-32px] w-px bg-gray-200 last:hidden"></div>

                                {/* Icon Bubble */}
                                <div className={`absolute left-0 top-0 w-6 h-6 rounded-full border-4 border-white shadow-sm flex items-center justify-center z-10 ${item.source === 'call' ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600'
                                    }`}>
                                    {item.source === 'call' ? <Phone className="w-3 h-3" /> : <MessageSquare className="w-3 h-3" />}
                                </div>

                                {/* Content Card */}
                                <div className="glass-card p-6 rounded-2xl">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <span className={`text-xs font-bold uppercase tracking-wider px-2 py-1 rounded-md ${item.source === 'call' ? 'bg-purple-50 text-purple-700' : 'bg-blue-50 text-blue-700'
                                                }`}>
                                                {item.source === 'call' ? 'Phone Call' : 'SMS Message'}
                                            </span>
                                            <span className="text-xs text-gray-400 ml-3">
                                                {format(new Date(item.created_at), 'MMMM d, yyyy • h:mm a')}
                                            </span>
                                        </div>
                                        {item.duration_seconds && (
                                            <div className="flex items-center gap-1 text-xs text-gray-500 font-medium">
                                                <Clock className="w-3 h-3" />
                                                {Math.round(item.duration_seconds / 60)}m {item.duration_seconds % 60}s
                                            </div>
                                        )}
                                    </div>

                                    {item.source === 'call' ? (
                                        <div>
                                            <p className="text-gray-900 font-medium mb-4">{item.content || "No summary available."}</p>

                                            {item.transcript && (
                                                <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                                                    <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                                                        <FileText className="w-3 h-3" /> Transcript Snapshot
                                                    </div>
                                                    {/* Render simplified transcript if JSON, otherwise text */}
                                                    {/* Assuming simple structure for demo, otherwise parse JSONB */}
                                                    <div className="text-sm text-gray-600 space-y-2 font-mono">
                                                        {JSON.stringify(item.transcript).slice(0, 200)}...
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <p className="text-gray-800">{item.content}</p>
                                    )}
                                </div>
                            </div>
                        ))}
                        {timeline.length === 0 && (
                            <div className="text-center py-20 text-gray-400">
                                No history found for this client.
                            </div>
                        )}
                    </div>

                </div>
            </main>
        </div>
    )
}
