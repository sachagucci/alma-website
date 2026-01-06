'use client'

import { LayoutDashboard, Users, Activity, PhoneIncoming, Settings, FileText, LogOut, Check } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { logoutAction } from '@/app/actions'
import { useLanguage } from '@/hooks/useLanguage'

export function Sidebar() {
    const pathname = usePathname()
    const { t, mounted } = useLanguage()

    if (!mounted) return null

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
                    <Link href="/dashboard" className={`flex items-center gap-3 p-3 rounded-xl font-medium transition-all ${isActive('/dashboard')}`}>
                        <LayoutDashboard className="w-5 h-5" />
                        <span className="hidden lg:block">{t.nav.overview}</span>
                    </Link>
                    <Link href="/calls" className={`flex items-center gap-3 p-3 rounded-xl font-medium transition-all ${isActive('/calls')}`}>
                        <PhoneIncoming className="w-5 h-5" />
                        <span className="hidden lg:block">{t.nav.callLog}</span>
                    </Link>
                    <Link href="/clients" className={`flex items-center gap-3 p-3 rounded-xl font-medium transition-all ${isActive('/clients')}`}>
                        <Users className="w-5 h-5" />
                        <span className="hidden lg:block">{t.nav.clients}</span>
                    </Link>
                    <Link href="/analytics" className={`flex items-center gap-4 px-4 py-3 rounded-2xl transition-all ${isActive('/analytics')}`}>
                        <Activity className="w-5 h-5" />
                        <span className="font-semibold hidden lg:block">{t.nav.analytics}</span>
                    </Link>
                    <Link href="/reports" className={`flex items-center gap-4 px-4 py-3 rounded-2xl transition-all ${isActive('/reports')}`}>
                        <FileText className="w-5 h-5" />
                        <span className="font-semibold hidden lg:block">{t.nav.reports}</span>
                    </Link>
                    <Link href="/chat" className={`flex items-center gap-3 p-3 rounded-xl font-medium transition-all ${isActive('/chat')}`}>
                        <Check className="w-5 h-5" />
                        <span className="hidden lg:block">{t.nav.chat}</span>
                    </Link>
                </nav>
            </div>

            <div className="px-0 lg:px-8 flex flex-col items-center lg:items-start">
                <form action={logoutAction} className="w-full">
                    <button type="submit" className="flex items-center gap-3 p-3 rounded-xl text-gray-500 hover:text-red-600 hover:bg-red-50 transition-all w-full justify-center lg:justify-start">
                        <LogOut className="w-5 h-5" />
                        <span className="hidden lg:block">{t.nav.signOut}</span>
                    </button>
                </form>
            </div>
        </aside>
    )
}
