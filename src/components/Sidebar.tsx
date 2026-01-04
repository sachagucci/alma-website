'use client'

import { LayoutDashboard, Users, Activity, PhoneIncoming, Settings, FileText, LogOut } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { logoutAction } from '@/app/actions'

export function Sidebar() {
    const pathname = usePathname()

    const isActive = (path: string) => {
        return pathname === path ? 'bg-gray-100 text-black' : 'text-gray-500 hover:text-black hover:bg-gray-50'
    }

    return (
        <aside className="w-20 lg:w-64 fixed h-full glass border-r border-gray-200/50 z-20 hidden md:flex flex-col justify-between py-8">
            <div className="flex flex-col items-center lg:items-start px-0 lg:px-8">
                <div className="flex items-center gap-3 mb-12">
                    <div className="w-10 h-10 bg-black text-white rounded-xl flex items-center justify-center font-bold text-xl shadow-lg shadow-black/20">
                        A
                    </div>
                    <span className="font-bold text-xl tracking-tight hidden lg:block">Alma</span>
                </div>

                <nav className="space-y-2 w-full">
                    <Link href="/" className={`flex items-center gap-3 p-3 rounded-xl font-medium transition-all ${isActive('/')}`}>
                        <span className="hidden lg:block">Overview</span>
                    </Link>
                    <Link href="/triage" className={`flex items-center gap-3 p-3 rounded-xl font-medium transition-all ${isActive('/triage')}`}>
                        <span className="hidden lg:block">Triage</span>
                    </Link>
                    <Link href="/patients" className={`flex items-center gap-3 p-3 rounded-xl font-medium transition-all ${isActive('/patients')}`}>
                        <span className="hidden lg:block">Patients</span>
                    </Link>
                    <Link href="/analytics" className={`flex items-center gap-4 px-4 py-3 rounded-2xl transition-all ${isActive('/analytics')}`}>
                        <span className="font-semibold hidden lg:block">Analytics</span>
                    </Link>
                    <Link href="/reports" className={`flex items-center gap-4 px-4 py-3 rounded-2xl transition-all ${isActive('/reports')}`}>
                        <span className="font-semibold hidden lg:block">Reports</span>
                    </Link>
                </nav>
            </div>

            <div className="px-0 lg:px-8 flex flex-col items-center lg:items-start">
                <form action={logoutAction} className="w-full">
                    <button type="submit" className="flex items-center gap-3 p-3 rounded-xl text-gray-500 hover:text-red-600 hover:bg-red-50 transition-all w-full justify-center lg:justify-start">
                        <LogOut className="w-5 h-5" />
                        <span className="hidden lg:block">Sign Out</span>
                    </button>
                </form>
            </div>
        </aside>
    )
}
