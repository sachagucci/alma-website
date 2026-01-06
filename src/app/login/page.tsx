'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { loginAction } from '../actions'
import { motion } from 'framer-motion'
import { Loader2, ArrowRight } from 'lucide-react'
import { useLanguage } from '@/hooks/useLanguage'

export default function LoginPage() {
    const router = useRouter()
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)
    const { t, mounted } = useLanguage()

    if (!mounted) return null

    async function handleSubmit(formData: FormData) {
        setLoading(true)
        setError(null)
        const result = await loginAction(formData)
        if (result?.error) {
            setError(result.error)
            setLoading(false)
        } else if (result?.success) {
            // Client-side redirect ensures cookies are set
            router.push('/dashboard')
        }
    }

    return (
        <div className="min-h-screen flex bg-white font-sans">
            {/* Visual Side */}
            <div className="hidden lg:flex flex-col justify-between w-1/2 bg-black p-12 text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-[linear-gradient(to_bottom_right,#111111,#000000)] z-0"></div>
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-900/20 rounded-full blur-[128px] pointer-events-none"></div>

                <div className="relative z-10">
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mb-8">
                        <span className="text-black font-bold text-2xl">A</span>
                    </div>
                    <h1 className="text-6xl font-bold tracking-tight mb-4">{t.login.heroTitle}</h1>
                    <p className="text-xl text-gray-400 max-w-md">{t.login.heroSubtitle}</p>
                </div>

                <div className="relative z-10">
                    <blockquote className="text-2xl font-medium tracking-tight mb-8">
                        {t.login.heroQuote}
                    </blockquote>
                </div>
            </div>

            {/* Form Side */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-[#FAFAFA]">
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="w-full max-w-sm"
                >
                    <div className="mb-10">
                        <h2 className="text-3xl font-bold text-gray-900 tracking-tight">{t.login.title}</h2>
                        <p className="text-gray-500 mt-2">{t.login.subtitle}</p>
                    </div>

                    <form action={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-900">{t.login.emailLabel}</label>
                            <input
                                name="email"
                                type="email"
                                required
                                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-black/5 focus:border-black outline-none transition-all placeholder:text-gray-400 group-hover:border-gray-300"
                                placeholder={t.login.emailPlaceholder}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-900">{t.login.passwordLabel}</label>
                            <input
                                name="password"
                                type="password"
                                required
                                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-black/5 focus:border-black outline-none transition-all placeholder:text-gray-400"
                                placeholder={t.login.passwordPlaceholder}
                            />
                        </div>

                        {error && (
                            <div className="p-4 bg-red-50 rounded-xl">
                                <p className="text-red-600 text-sm font-medium">{error}</p>
                                <a
                                    href="/onboarding"
                                    className="text-sm text-red-700 underline hover:text-red-800 mt-1 inline-block"
                                >
                                    New customer? Sign up here
                                </a>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-black text-white hover:bg-gray-900 py-3.5 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 group shadow-lg shadow-black/10"
                        >
                            {loading ? <Loader2 className="animate-spin h-5 w-5" /> : (
                                <>
                                    {t.login.submit} <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>

                        <p className="text-center text-sm text-gray-500">
                            {t.login.noAccount}{' '}
                            <a href="/onboarding" className="text-black font-semibold hover:underline">
                                {t.login.signUp}
                            </a>
                        </p>
                    </form>
                </motion.div>
            </div>
        </div>
    )
}
