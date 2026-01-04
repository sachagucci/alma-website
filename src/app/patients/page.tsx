import { Sidebar } from '@/components/Sidebar'
import { getPatients } from './actions'
import Link from 'next/link'
import { User, Search, Clock } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

export const dynamic = 'force-dynamic'

export default async function PatientsPage({ searchParams }: { searchParams: { q?: string } }) {
    const query = (await searchParams)?.q || ''
    const patients = await getPatients(query)

    return (
        <div className="min-h-screen flex bg-[#FAFAFA]">
            <Sidebar />

            <main className="flex-1 md:pl-20 lg:pl-64">
                <div className="max-w-7xl mx-auto px-6 py-10">

                    <div className="flex justify-between items-center mb-12">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Patients</h1>
                            <p className="text-gray-500 mt-1 font-medium">Search and manage patient history.</p>
                        </div>
                    </div>

                    <div className="glass-card rounded-[2rem] p-8 mb-8">
                        <form className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                name="q"
                                defaultValue={query}
                                placeholder="Search by phone number..."
                                className="w-full pl-12 pr-4 py-4 bg-gray-50 rounded-xl border-none outline-none focus:ring-2 focus:ring-black/5 transition-all"
                            />
                        </form>
                    </div>

                    <div className="grid gap-4">
                        {patients.map((p: any) => (
                            <Link key={p.patient_phone} href={`/patients/${encodeURIComponent(p.patient_phone)}`}>
                                <div className="glass-card p-6 rounded-2xl hover:shadow-lg transition-all flex items-center justify-between group">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 group-hover:bg-black group-hover:text-white transition-colors">
                                            <User className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-gray-900">{p.patient_phone}</h3>
                                            <p className="text-sm text-gray-500 line-clamp-1 max-w-md">{p.last_summary || "No recent summary"}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-400">
                                        <Clock className="w-4 h-4" />
                                        {p.last_activity && formatDistanceToNow(new Date(p.last_activity), { addSuffix: true })}
                                    </div>
                                </div>
                            </Link>
                        ))}
                        {patients.length === 0 && (
                            <div className="text-center py-20 text-gray-400">
                                No patients found.
                            </div>
                        )}
                    </div>

                </div>
            </main>
        </div>
    )
}
