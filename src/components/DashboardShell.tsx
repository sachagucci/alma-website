'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { logoutAction } from '@/app/actions'

export function DashboardShell({ children }: { children: React.ReactNode }) {
    const [isCollapsed, setIsCollapsed] = useState(false)
    const pathname = usePathname()

    const isActive = (path: string) => {
        return pathname === path ? 'bg-black/5 text-black' : 'text-gray-400 hover:text-black hover:bg-black/5'
    }

    const toggleSidebar = () => setIsCollapsed(!isCollapsed)

    return (
        <div className="min-h-screen bg-[#FAFAFA]">
            {/* SIDEBAR */}
            <aside
                className={`fixed h-full glass border-r border-gray-200/30 z-20 hidden md:flex flex-col justify-between py-8 transition-all duration-300 ease-in-out ${isCollapsed ? 'w-16' : 'w-64'
                    }`}
            >
                <div className="flex flex-col">
                    {/* Header / Toggle */}
                    <div className="px-4 mb-12">
                        <div className="flex items-center justify-between">
                            {/* Logo - visible only when expanded */}
                            <div className={`flex items-center gap-2 transition-all duration-300 ${isCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100'}`}>
                                <div className="w-7 h-7 bg-black rounded-lg flex items-center justify-center">
                                    <span className="text-white text-sm font-bold">A</span>
                                </div>
                                <span className="font-semibold text-base tracking-tight text-gray-900">Alma</span>
                            </div>

                            {/* Collapse Toggle Button */}
                            <button
                                onClick={toggleSidebar}
                                className="p-1.5 rounded-lg hover:bg-black/5 text-gray-400 hover:text-black transition-all"
                                title={isCollapsed ? "Expand" : "Collapse"}
                            >
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="transition-transform duration-300" style={{ transform: isCollapsed ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                                    <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* Nav */}
                    <nav className="space-y-1 px-2">
                        <NavItem href="/" label="Overview" active={isActive('/')} collapsed={isCollapsed} />
                        <NavItem href="/triage" label="Triage" active={isActive('/triage')} collapsed={isCollapsed} />
                        <NavItem href="/patients" label="Patients" active={isActive('/patients')} collapsed={isCollapsed} />
                        <NavItem href="/analytics" label="Analytics" active={isActive('/analytics')} collapsed={isCollapsed} />
                        <NavItem href="/reports" label="Reports" active={isActive('/reports')} collapsed={isCollapsed} />
                        <NavItem href="/settings" label="Settings" active={isActive('/settings')} collapsed={isCollapsed} />
                    </nav>
                </div>

                {/* Footer */}
                <div className="px-2">
                    <form action={logoutAction} className="w-full">
                        <button
                            type="submit"
                            className={`flex items-center gap-2 p-2.5 rounded-lg text-gray-400 hover:text-black hover:bg-black/5 transition-all w-full ${isCollapsed ? 'justify-center' : 'justify-start'
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
                                    <span className="text-sm font-medium">Sign Out</span>
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </aside>

            {/* MAIN CONTENT */}
            <main
                className={`flex-1 transition-all duration-300 ease-in-out ${isCollapsed ? 'md:pl-16' : 'md:pl-64'
                    }`}
            >
                {children}
            </main>
        </div>
    )
}

function NavItem({ href, label, active, collapsed }: { href: string, label: string, active: string, collapsed: boolean }) {
    // Icon map for collapsed state
    const icons: { [key: string]: React.ReactElement } = {
        'Overview': <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>,
        'Triage': <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>,
        'Patients': <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>,
        'Analytics': <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>,
        'Reports': <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>,
        'Settings': <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>,
    }

    return (
        <Link
            href={href}
            className={`flex items-center gap-2.5 p-2.5 rounded-lg font-medium transition-all text-sm ${active} ${collapsed ? 'justify-center' : ''
                }`}
        >
            {collapsed ? (
                <div className="flex items-center justify-center">
                    {icons[label]}
                </div>
            ) : (
                <>
                    {icons[label]}
                    <span>{label}</span>
                </>
            )}
        </Link>
    )
}
