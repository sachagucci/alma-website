'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { logoutAction } from '@/app/actions'
import { useLanguage } from '@/hooks/useLanguage'

const agents = [
    {
        key: 'mia',
        label: 'Mia',
        items: [
            { href: '/dashboard', labelKey: 'missionControl', iconKey: 'Mission Control' },
            { href: '/calls', labelKey: 'journalLog', iconKey: 'Journal Log' },
            { href: '/clients', labelKey: 'clients', iconKey: 'Clients' },
        ]
    },
    {
        key: 'leo',
        label: 'Leo',
        items: [
            { href: '/chat', labelKey: 'chat', iconKey: 'Chat' }
        ]
    },
    {
        key: 'eva',
        label: 'Eva',
        items: [
            { href: '/invoices', labelKey: 'invoices', iconKey: 'Invoices' },
            { href: '/analytics', labelKey: 'analytics', iconKey: 'Analytics' },
            { href: '/reports', labelKey: 'reports', iconKey: 'Reports' },
        ]
    }
]

export function DashboardShell({ children }: { children: React.ReactNode }) {
    const [isCollapsed, setIsCollapsed] = useState(false)
    const pathname = usePathname()
    const { t, mounted } = useLanguage()

    if (!mounted) return null

    const isActive = (path: string) => {
        return pathname === path ? 'bg-black/5 text-black font-semibold' : 'text-gray-500 hover:text-black hover:bg-black/5'
    }

    const toggleSidebar = () => setIsCollapsed(!isCollapsed)

    const getAgentIcon = (key: string, label: string) => {
        if (isCollapsed) {
            return (
                <div className="w-8 h-8 rounded-full bg-gradient-to-b from-amber-300 via-orange-400 to-red-400 shadow-sm flex items-center justify-center text-white font-bold text-xs ring-2 ring-white">
                    {label.charAt(0)}
                </div>
            )
        }
        return (
            <div className="w-1.5 h-5 rounded-full bg-gradient-to-b from-amber-300 via-orange-400 to-red-400 shadow-sm" />
        )
    }

    return (
        <div className="min-h-screen bg-[#FAFAFA]">
            {/* SIDEBAR */}
            <aside
                className={`fixed h-full glass border-r border-gray-200/30 z-20 hidden md:flex flex-col justify-between py-6 transition-all duration-300 ease-in-out ${isCollapsed ? 'w-20' : 'w-64'
                    }`}
            >
                <div className="flex flex-col h-full">
                    {/* Header / Toggle */}
                    <div className={`px-5 mb-8 flex items-center justify-between ${isCollapsed ? 'flex-col gap-4' : ''}`}>
                        {/* Logo */}
                        <div className={`flex items-center gap-3 transition-all duration-200 ${isCollapsed ? 'justify-center' : ''}`}>
                            <div className="w-8 h-8 bg-black rounded-xl flex items-center justify-center shadow-sm">
                                <span className="text-white text-sm font-bold">A</span>
                            </div>
                            <span className={`font-semibold text-lg tracking-tight text-gray-900 transition-opacity duration-200 ${isCollapsed ? 'hidden' : 'block'}`}>
                                Alma
                            </span>
                        </div>

                        {/* Collapse Toggle */}
                        <button
                            onClick={toggleSidebar}
                            className={`p-1.5 rounded-lg hover:bg-black/5 text-gray-400 hover:text-black transition-all ${isCollapsed ? 'mt-2' : ''}`}
                        >
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ transform: isCollapsed ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                                <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>
                    </div>

                    {/* Nav */}
                    <div className="flex-1 overflow-y-auto px-3 space-y-8">
                        {agents.map((agent) => (
                            <div key={agent.key} className="space-y-2">
                                {/* Agent Header */}
                                <div className={`flex items-center gap-3 px-3 pb-1 ${isCollapsed ? 'justify-center' : ''}`}>
                                    {getAgentIcon(agent.key, agent.label)}
                                    {!isCollapsed && (
                                        // @ts-ignore
                                        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{t.nav[agent.key]}</span>
                                    )}
                                </div>

                                <div className="space-y-0.5">
                                    {agent.items.map((item) => (
                                        <NavItem
                                            key={item.href}
                                            href={item.href}
                                            // @ts-ignore
                                            label={t.nav[item.labelKey]}
                                            iconKey={item.iconKey}
                                            active={isActive(item.href)}
                                            collapsed={isCollapsed}
                                        />
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Footer */}
                    <div className="px-3 mt-auto space-y-1">
                        <div className="h-px bg-gray-200/50 mx-2 mb-4"></div>
                        <NavItem href="/settings" label={t.nav.settings} iconKey="Settings" active={isActive('/settings')} collapsed={isCollapsed} />

                        <form action={logoutAction} className="w-full">
                            <button
                                type="submit"
                                className={`flex items-center gap-2.5 p-2.5 rounded-lg text-gray-500 hover:text-red-600 hover:bg-red-50/50 transition-all w-full ${isCollapsed ? 'justify-center' : 'justify-start'
                                    }`}
                            >
                                {isCollapsed ? (
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                                        <polyline points="16 17 21 12 16 7"></polyline>
                                        <line x1="21" y1="12" x2="9" y2="12"></line>
                                    </svg>
                                ) : (
                                    <>
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                                            <polyline points="16 17 21 12 16 7"></polyline>
                                            <line x1="21" y1="12" x2="9" y2="12"></line>
                                        </svg>
                                        <span className="text-sm font-medium">{t.nav.signOut}</span>
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            </aside>

            {/* MAIN CONTENT */}
            <main
                className={`flex-1 transition-all duration-300 ease-in-out ${isCollapsed ? 'md:pl-20' : 'md:pl-64'
                    }`}
            >
                {children}
            </main>
        </div>
    )
}

function NavItem({ href, label, iconKey, active, collapsed }: { href: string, label: string, iconKey: string, active: string, collapsed: boolean }) {
    // Icon map for collapsed state
    const icons: { [key: string]: React.ReactElement } = {
        'Mission Control': <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>,
        'Journal Log': <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>,
        'Clients': <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>,
        'Chat': <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>,
        'Invoices': <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z"></path><path d="M14 2v6h6"></path><line x1="8" y1="13" x2="16" y2="13"></line><line x1="8" y1="17" x2="16" y2="17"></line></svg>,
        'Analytics': <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>,
        'Reports': <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>,
        'Settings': <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>,
    }

    return (
        <Link
            href={href}
            className={`flex items-center gap-2.5 p-2.5 rounded-lg transition-all ${active} ${collapsed ? 'justify-center' : ''}`}
            title={collapsed ? label : undefined}
        >
            {collapsed ? (
                <div className="text-current">
                    {icons[iconKey]}
                </div>
            ) : (
                <span className="text-sm font-medium">{label}</span>
            )}
        </Link>
    )
}
