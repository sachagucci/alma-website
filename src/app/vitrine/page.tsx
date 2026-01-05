'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'
import {
    ArrowRight,
    Play,
    Check,
    Zap,
    Globe,
    Shield,
    MessageSquare,
    Phone,
    BarChart3,
    Users
} from 'lucide-react'
import Link from 'next/link'

// --- VISUAL COMPONENT: DEMO CALL SIMULATOR ---
function DemoCall() {
    const [step, setStep] = useState(0)

    useEffect(() => {
        const timer = setInterval(() => {
            setStep((prev) => (prev + 1) % 4)
        }, 2500)
        return () => clearInterval(timer)
    }, [])

    const messages = [
        { role: 'ai', text: "Alma Health context: Hello, calling to schedule a follow-up." },
        { role: 'user', text: "Hi, I need to see Dr. Chen next week." },
        { role: 'ai', text: "I have an opening Tuesday at 10am. Does that work?" },
        { role: 'user', text: "Yes, that's perfect." },
    ]

    return (
        <div className="relative w-full max-w-md mx-auto aspect-[9/16] md:aspect-square bg-black rounded-[2.5rem] border-[8px] border-neutral-800 overflow-hidden shadow-2xl">
            {/* Dynamic Background */}
            <div className="absolute inset-0 bg-neutral-900">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-blue-500/20 blur-[100px] animate-pulse" />
            </div>

            {/* Interface */}
            <div className="relative h-full flex flex-col p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                            <Phone className="w-4 h-4 text-white fill-white" />
                        </div>
                        <div>
                            <p className="text-white font-semibold text-sm">Alma AI</p>
                            <p className="text-blue-400 text-xs font-medium">00:4{step}</p>
                        </div>
                    </div>
                    <div className="flex gap-1">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="w-1 h-1 rounded-full bg-neutral-600" />
                        ))}
                    </div>
                </div>

                {/* Waveform Visualization */}
                <div className="flex-1 flex items-center justify-center gap-1.5 min-h-[100px]">
                    {[...Array(12)].map((_, i) => (
                        <motion.div
                            key={i}
                            animate={{
                                height: [20, Math.random() * 60 + 20, 20],
                                opacity: [0.5, 1, 0.5]
                            }}
                            transition={{
                                duration: 1.5,
                                repeat: Infinity,
                                delay: i * 0.1,
                                ease: "easeInOut"
                            }}
                            className="w-1.5 bg-blue-500 rounded-full"
                        />
                    ))}
                </div>

                {/* Live Transcript */}
                <div className="mt-8 space-y-3">
                    {messages.map((msg, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{
                                opacity: i <= step ? 1 : 0,
                                y: i <= step ? 0 : 10
                            }}
                            className={`p-3 rounded-2xl text-xs leading-relaxed max-w-[85%] ${msg.role === 'ai'
                                    ? 'bg-neutral-800/80 text-gray-200 self-start mr-auto rounded-tl-sm'
                                    : 'bg-blue-600 text-white self-end ml-auto rounded-tr-sm'
                                }`}
                        >
                            {msg.text}
                        </motion.div>
                    ))}
                </div>

                {/* Footer Actions */}
                <div className="mt-8 grid grid-cols-2 gap-3">
                    <div className="h-10 rounded-full bg-neutral-800/50 flex items-center justify-center border border-white/5">
                        <span className="text-[10px] text-gray-400 font-medium">View Patient</span>
                    </div>
                    <div className="h-10 rounded-full bg-blue-500/20 flex items-center justify-center border border-blue-500/30">
                        <span className="text-[10px] text-blue-300 font-medium">Book Appointment</span>
                    </div>
                </div>
            </div>
        </div>
    )
}


// --- MAIN PAGE COMPONENT ---
export default function VitrinePage() {
    const containerRef = useRef<HTMLDivElement>(null)
    const { scrollYProgress } = useScroll({ container: containerRef })

    const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0])
    const heroScale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95])

    return (
        <div
            ref={containerRef}
            className="h-screen overflow-y-auto bg-black text-white font-sans selection:bg-blue-900/50 selection:text-blue-200 scroll-smooth"
        >
            {/* Navigation */}
            <nav className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 backdrop-blur-md border-b border-white/5 bg-black/50">
                <div className="max-w-[1400px] mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                            <span className="text-black font-bold text-sm">A</span>
                        </div>
                        <span className="text-lg font-semibold tracking-tight">Alma</span>
                    </div>

                    <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-400">
                        <a href="#features" className="hover:text-white transition-colors">Product</a>
                        <a href="#solutions" className="hover:text-white transition-colors">Solutions</a>
                        <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
                    </div>

                    <div className="flex items-center gap-4">
                        <Link href="/login" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">
                            Sign In
                        </Link>
                        <a
                            href="#pricing"
                            className="px-4 py-2 bg-white text-black text-sm font-semibold rounded-lg hover:bg-gray-200 transition-colors"
                        >
                            Get Started
                        </a>
                    </div>
                </div>
            </nav>

            <main className="relative pt-32 pb-20 overflow-hidden">
                {/* Hero Background Effects */}
                <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-[800px] h-[800px] bg-blue-900/20 rounded-full blur-[128px] pointer-events-none" />
                <div className="absolute top-0 left-0 -translate-y-1/4 -translate-x-1/4 w-[600px] h-[600px] bg-indigo-900/10 rounded-full blur-[128px] pointer-events-none" />

                {/* HERO SECTION */}
                <motion.section
                    style={{ opacity: heroOpacity, scale: heroScale }}
                    className="max-w-[1400px] mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center mb-32"
                >
                    <div className="text-left flex flex-col items-start">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="inline-flex items-center gap-2 mb-8 px-3 py-1 rounded-full border border-blue-900/30 bg-blue-900/10 text-blue-400 text-xs font-semibold tracking-wide uppercase"
                        >
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                            v2.0 Now Available
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            className="text-6xl md:text-7xl lg:text-8xl font-bold tracking-tighter leading-[0.95] mb-8 text-white"
                        >
                            The AI
                            <br />
                            <span className="text-gray-500">Receptionist.</span>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="text-xl text-gray-400 max-w-lg leading-relaxed mb-10"
                        >
                            Automate phone calls, scheduling, and patient intake with a voice AI that feels completely human.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                            className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
                        >
                            <Link
                                href="/onboarding"
                                className="h-12 px-8 flex items-center justify-center bg-white text-black font-semibold rounded-lg hover:bg-gray-100 transition-colors"
                            >
                                Deploy Agent
                                <ArrowRight className="w-4 h-4 ml-2" />
                            </Link>
                            <button className="h-12 px-8 flex items-center justify-center border border-white/10 text-white font-medium rounded-lg hover:bg-white/5 transition-colors">
                                <Play className="w-4 h-4 mr-2 fill-white" />
                                Listen to Samples
                            </button>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.6 }}
                            className="mt-12 flex items-center gap-4 text-sm text-gray-500"
                        >
                            <div className="flex -space-x-2">
                                {[1, 2, 3, 4].map((i) => (
                                    <div key={i} className="w-8 h-8 rounded-full border-2 border-black bg-neutral-800" />
                                ))}
                            </div>
                            <div>
                                <span className="text-white font-semibold">2,000+</span> clinics
                            </div>
                        </motion.div>
                    </div>

                    {/* Hero Visual */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.7 }}
                        className="relative hidden lg:block"
                    >
                        <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/20 to-purple-500/20 blur-[100px] pointer-events-none" />
                        <DemoCall />
                    </motion.div>
                </motion.section>

                {/* LOGO CLOUD */}
                <section className="border-y border-white/5 bg-white/[0.02] py-12 mb-32">
                    <div className="max-w-[1400px] mx-auto px-6">
                        <p className="text-center text-sm text-gray-500 mb-8 font-medium">TRUSTED BY MODERN PRACTICES</p>
                        <div className="flex flex-wrap justify-center gap-12 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                            {/* Placeholder Logos imitating tech/clinic brands */}
                            {['Cleveland Clinic', 'One Medical', 'Cedar', 'Oscar', 'Maven'].map((brand) => (
                                <span key={brand} className="text-xl font-bold font-mono text-white/40">{brand}</span>
                            ))}
                        </div>
                    </div>
                </section>

                {/* BENTO GRID FEATURES */}
                <section id="features" className="max-w-[1400px] mx-auto px-6 mb-32">
                    <div className="text-center mb-20 max-w-2xl mx-auto">
                        <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">Build your remote<br />front desk.</h2>
                        <p className="text-lg text-gray-400">Everything you need to automate patient communication, fully integrated with your EMR.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-auto md:h-[600px]">
                        {/* Large Left Card */}
                        <div className="md:col-span-2 relative p-8 rounded-3xl bg-neutral-900/50 border border-white/10 overflow-hidden group">
                            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-900/10 blur-[80px] group-hover:bg-blue-900/20 transition-all duration-500" />

                            <div className="relative z-10 h-full flex flex-col justify-between">
                                <div>
                                    <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center mb-6">
                                        <Zap className="w-6 h-6 text-blue-400" />
                                    </div>
                                    <h3 className="text-2xl font-bold mb-2">Instant Triage</h3>
                                    <p className="text-gray-400 max-w-sm">AI analyzes urgency in real-time. Emergency calls are routed to staff immediately, while routine bookings are handled automatically.</p>
                                </div>

                                {/* Fake UI Preview */}
                                <div className="mt-8 bg-black/40 rounded-xl border border-white/5 p-4 backdrop-blur-sm translate-y-4 group-hover:translate-y-2 transition-transform duration-500">
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center gap-2">
                                            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                                            <span className="text-xs font-mono text-red-400">URGENT</span>
                                        </div>
                                        <span className="text-xs text-gray-500">Now</span>
                                    </div>
                                    <p className="text-sm text-gray-300">"My chest hurts and I feel dizzy..."</p>
                                </div>
                            </div>
                        </div>

                        {/* Right Column Stack */}
                        <div className="flex flex-col gap-6">
                            <div className="flex-1 p-8 rounded-3xl bg-neutral-900/50 border border-white/10 hover:border-white/20 transition-colors group">
                                <Globe className="w-8 h-8 text-indigo-400 mb-4" />
                                <h3 className="text-xl font-bold mb-2">Multilingual</h3>
                                <p className="text-sm text-gray-400">Fluent in English, French, and Spanish. Auto-detects caller language.</p>
                            </div>
                            <div className="flex-1 p-8 rounded-3xl bg-neutral-900/50 border border-white/10 hover:border-white/20 transition-colors group">
                                <Shield className="w-8 h-8 text-green-400 mb-4" />
                                <h3 className="text-xl font-bold mb-2">HIPAA Compliant</h3>
                                <p className="text-sm text-gray-400">Enterprise-grade encryption and data handling standards built-in.</p>
                            </div>
                        </div>
                    </div>

                    {/* Second Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
                        {['EMR Sync', 'SMS Follow-up', 'Analytics', '24/7 Service'].map((feat, i) => (
                            <div key={i} className="p-6 rounded-3xl bg-neutral-900/30 border border-white/5 hover:bg-neutral-900/50 transition-colors">
                                <h4 className="font-bold text-lg mb-1">{feat}</h4>
                                <p className="text-xs text-gray-500">Automated and seamless.</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* CTA BANNER */}
                <section className="max-w-[1400px] mx-auto px-6 mb-20">
                    <div className="relative rounded-[2.5rem] bg-gradient-to-b from-blue-900 to-black border border-white/10 p-12 md:p-24 text-center overflow-hidden">
                        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20" />
                        <div className="relative z-10">
                            <h2 className="text-4xl md:text-6xl font-bold tracking-tighter mb-8">Ready to modernize?</h2>
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                                <Link href="/onboarding" className="h-14 px-8 flex items-center justify-center bg-white text-black font-bold rounded-xl hover:scale-105 transition-transform">
                                    Start Free Trial
                                </Link>
                                <button className="h-14 px-8 flex items-center justify-center bg-white/10 text-white font-bold rounded-xl hover:bg-white/20 transition-colors backdrop-blur-md">
                                    Book Demo
                                </button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* FOOTER */}
                <footer className="border-t border-white/10 bg-black pt-16 pb-8">
                    <div className="max-w-[1400px] mx-auto px-6">
                        <div className="grid md:grid-cols-4 gap-12 mb-16">
                            <div>
                                <div className="flex items-center gap-2 mb-6">
                                    <div className="w-6 h-6 bg-white rounded flex items-center justify-center">
                                        <span className="text-black font-bold text-xs">A</span>
                                    </div>
                                    <span className="font-bold">Alma</span>
                                </div>
                                <p className="text-gray-500 text-sm">
                                    The operating system for modern clinics.
                                </p>
                            </div>

                            {[
                                { h: 'Product', l: ['Features', 'Pricing', 'Ch angelog', 'Docs'] },
                                { h: 'Company', l: ['About', 'Blog', 'Careers', 'Contact'] },
                                { h: 'Legal', l: ['Privacy', 'Terms', 'HIPAA', 'Security'] }
                            ].map((col, i) => (
                                <div key={i}>
                                    <h4 className="font-semibold mb-4 text-sm">{col.h}</h4>
                                    <ul className="space-y-3 text-sm text-gray-500">
                                        {col.l.map(l => (
                                            <li key={l}><a href="#" className="hover:text-white transition-colors">{l}</a></li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                        <div className="flex justify-between items-center pt-8 border-t border-white/10 text-xs text-gray-600">
                            <p>© 2026 Alma Health Inc.</p>
                            <div className="flex gap-4">
                                <span>Twitter</span>
                                <span>LinkedIn</span>
                                <span>GitHub</span>
                            </div>
                        </div>
                    </div>
                </footer>

            </main>
        </div>
    )
}
