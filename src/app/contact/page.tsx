'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import Link from 'next/link'

type Language = 'fr' | 'en'

const translations = {
    fr: {
        title: "Parler à Sacha",
        subtitle: "Découvrez comment Alma peut simplifier votre quotidien.",
        support: "Besoin d'aide? Écrivez à",
        testimonial: {
            quote: "Alma a transformé notre façon de gérer les appels patients. Avec notre agent IA, nous avons réduit les absences et fluidifié la planification. Plus de sérénité pour l'équipe clinique.",
            name: "Dr. Sophie Martin",
            role: "Directrice, Clinique Sainte‑Marie"
        },
        form: {
            firstName: "Prénom",
            lastName: "Nom",
            email: "Courriel",
            phone: "Téléphone",
            companySize: "Combien d'employés dans votre clinique?",
            companySizeOptions: ["1-5", "6-15", "16-50", "50+"],
            trade: "Quel est votre domaine clinique?",
            tradeOptions: ["Médecine générale", "Dentisterie", "Physiothérapie", "Psychologie", "Clinique multidisciplinaire", "Autre"],
            howFound: "Comment avez-vous entendu parler de nous?",
            howFoundOptions: ["Recherche Google", "Bouche-à-oreille", "Réseaux sociaux", "Association professionnelle", "Autre"],
            message: "Décrivez brièvement vos besoins",
            messagePlaceholder: "Ex: Nous recevons 50+ appels/semaine et avons du mal à gérer les rendez‑vous...",
            submit: "Envoyer",
            success: "Merci! Nous vous répondrons sous 24 heures."
        }
    },
    en: {
        title: "Talk to Sacha",
        subtitle: "See how Alma can simplify your day.",
        support: "Need support? Email",
        testimonial: {
            quote: "Alma transformed how we manage patient calls. With our AI agent, we've reduced no‑shows and streamlined scheduling. More peace of mind for the clinical team.",
            name: "Dr. Sophie Martin",
            role: "Director, Sainte‑Marie Clinic"
        },
        form: {
            firstName: "First Name",
            lastName: "Last Name",
            email: "Email",
            phone: "Phone",
            companySize: "How many employees at your clinic?",
            companySizeOptions: ["1-5", "6-15", "16-50", "50+"],
            trade: "What's your clinical specialty?",
            tradeOptions: ["General Practice", "Dentistry", "Physiotherapy", "Psychology", "Multidisciplinary Clinic", "Other"],
            howFound: "How did you hear about us?",
            howFoundOptions: ["Google Search", "Word of mouth", "Social media", "Professional association", "Other"],
            message: "Briefly describe your needs",
            messagePlaceholder: "E.g., We receive 50+ calls/week and struggle to manage scheduling...",
            submit: "Submit",
            success: "Thanks! We'll get back to you within 24 hours."
        }
    }
}

export default function ContactPage() {
    const [lang, setLang] = useState<Language>('fr')
    const [submitted, setSubmitted] = useState(false)
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        companySize: '',
        trade: '',
        howFound: '',
        message: ''
    })
    const t = translations[lang]

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        console.log("Contact form:", formData)
        setSubmitted(true)
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
    }

    return (
        <div className="min-h-screen bg-white font-sans">
            {/* Navigation */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-stone-100">
                <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2.5">
                        <div className="w-8 h-8 bg-stone-900 rounded-lg flex items-center justify-center">
                            <span className="text-white font-semibold text-sm">A</span>
                        </div>
                        <span className="text-lg font-medium tracking-tight text-stone-900">Alma</span>
                    </Link>

                    <div className="flex items-center gap-3">
                        <div className="flex bg-stone-100 rounded-full p-0.5">
                            {(['fr', 'en'] as const).map((l) => (
                                <button
                                    key={l}
                                    onClick={() => setLang(l)}
                                    className={`px-2.5 py-1 rounded-full text-xs font-medium transition-all ${lang === l
                                        ? 'bg-white text-stone-900 shadow-sm'
                                        : 'text-stone-500 hover:text-stone-700'
                                        }`}
                                >
                                    {l.toUpperCase()}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="pt-14 min-h-screen flex">
                {/* Left Panel - Hero */}
                <div className="hidden lg:flex lg:w-[35%] bg-gradient-to-br from-stone-100 via-stone-50 to-white p-12 flex-col justify-between relative overflow-hidden">
                    {/* Subtle decorative element */}
                    <div className="absolute top-0 right-0 w-96 h-96 bg-stone-200/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

                    <div className="relative z-10 pt-16">
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-4xl md:text-5xl font-semibold text-stone-900 tracking-tight mb-4"
                        >
                            {t.title}
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-stone-500 text-lg mb-4"
                        >
                            {t.subtitle}
                        </motion.p>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-stone-400 text-sm"
                        >
                            {t.support} <a href="mailto:info@alma.quebec" className="text-stone-600 hover:text-stone-900 transition-colors">info@alma.quebec</a>
                        </motion.p>
                    </div>

                    {/* Testimonial Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="relative z-10 bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-stone-100"
                    >
                        <p className="text-stone-600 text-sm leading-relaxed mb-4">
                            "{t.testimonial.quote}"
                        </p>
                        <div>
                            <p className="text-stone-900 font-medium text-sm">{t.testimonial.name}</p>
                            <p className="text-stone-400 text-xs">{t.testimonial.role}</p>
                        </div>
                    </motion.div>
                </div>

                {/* Right Panel - Form */}
                <div className="w-full lg:w-[65%] p-8 lg:p-12 flex items-center justify-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="w-full max-w-2xl"
                    >
                        {/* Mobile title */}
                        <div className="lg:hidden mb-8">
                            <h1 className="text-2xl font-semibold text-stone-900 tracking-tight mb-2">
                                {t.title}
                            </h1>
                            <p className="text-stone-500 text-sm">{t.subtitle}</p>
                        </div>

                        {submitted ? (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="text-center py-16"
                            >
                                <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <svg className="w-8 h-8 text-stone-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <p className="text-stone-600">{t.form.success}</p>
                                <Link href="/" className="inline-block mt-6 text-sm text-stone-500 hover:text-stone-900 transition-colors">
                                    ← {lang === 'fr' ? 'Retour à l\'accueil' : 'Back to home'}
                                </Link>
                            </motion.div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-5">
                                {/* Name Row */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs text-stone-500 mb-1.5">{t.form.firstName}</label>
                                        <input
                                            type="text"
                                            name="firstName"
                                            required
                                            value={formData.firstName}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2.5 rounded-lg bg-stone-50 border border-stone-200 text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-stone-200 focus:border-stone-300 transition-all"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs text-stone-500 mb-1.5">{t.form.lastName}</label>
                                        <input
                                            type="text"
                                            name="lastName"
                                            required
                                            value={formData.lastName}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2.5 rounded-lg bg-stone-50 border border-stone-200 text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-stone-200 focus:border-stone-300 transition-all"
                                        />
                                    </div>
                                </div>

                                {/* Email */}
                                <div>
                                    <label className="block text-xs text-stone-500 mb-1.5">{t.form.email}</label>
                                    <input
                                        type="email"
                                        name="email"
                                        required
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2.5 rounded-lg bg-stone-50 border border-stone-200 text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-stone-200 focus:border-stone-300 transition-all"
                                    />
                                </div>

                                {/* Phone */}
                                <div>
                                    <label className="block text-xs text-stone-500 mb-1.5">{t.form.phone}</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2.5 rounded-lg bg-stone-50 border border-stone-200 text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-stone-200 focus:border-stone-300 transition-all"
                                    />
                                </div>

                                {/* Company Size */}
                                <div>
                                    <label className="block text-xs text-stone-500 mb-1.5">{t.form.companySize}</label>
                                    <select
                                        name="companySize"
                                        required
                                        value={formData.companySize}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2.5 rounded-lg bg-stone-50 border border-stone-200 text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-stone-200 focus:border-stone-300 transition-all appearance-none cursor-pointer"
                                    >
                                        <option value=""></option>
                                        {t.form.companySizeOptions.map(opt => (
                                            <option key={opt} value={opt}>{opt}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Trade */}
                                <div>
                                    <label className="block text-xs text-stone-500 mb-1.5">{t.form.trade}</label>
                                    <select
                                        name="trade"
                                        required
                                        value={formData.trade}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2.5 rounded-lg bg-stone-50 border border-stone-200 text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-stone-200 focus:border-stone-300 transition-all appearance-none cursor-pointer"
                                    >
                                        <option value=""></option>
                                        {t.form.tradeOptions.map(opt => (
                                            <option key={opt} value={opt}>{opt}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* How Found */}
                                <div>
                                    <label className="block text-xs text-stone-500 mb-1.5">{t.form.howFound}</label>
                                    <select
                                        name="howFound"
                                        value={formData.howFound}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2.5 rounded-lg bg-stone-50 border border-stone-200 text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-stone-200 focus:border-stone-300 transition-all appearance-none cursor-pointer"
                                    >
                                        <option value=""></option>
                                        {t.form.howFoundOptions.map(opt => (
                                            <option key={opt} value={opt}>{opt}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Message */}
                                <div>
                                    <label className="block text-xs text-stone-500 mb-1.5">{t.form.message}</label>
                                    <textarea
                                        name="message"
                                        rows={3}
                                        value={formData.message}
                                        onChange={handleChange}
                                        placeholder={t.form.messagePlaceholder}
                                        className="w-full px-3 py-2.5 rounded-lg bg-stone-50 border border-stone-200 text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-stone-200 focus:border-stone-300 transition-all resize-none placeholder:text-stone-400"
                                    />
                                </div>

                                {/* Submit */}
                                <button
                                    type="submit"
                                    className="w-full py-3 bg-stone-900 text-white font-medium rounded-xl hover:bg-stone-800 transition-all text-sm"
                                >
                                    {t.form.submit}
                                </button>
                            </form>
                        )}
                    </motion.div>
                </div>
            </main>
        </div>
    )
}
