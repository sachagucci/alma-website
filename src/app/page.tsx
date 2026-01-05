'use client'

import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'
import {
  ArrowRight,
  Play,
  Zap,
  Globe,
  Shield,
  Phone,
  X
} from 'lucide-react'
import Link from 'next/link'

type Language = 'en' | 'fr'

const translations = {
  en: {
    nav: {
      product: "Product",
      solutions: "Solutions",
      pricing: "Pricing",
      signIn: "Sign In",
      getStarted: "Get Started"
    },
    hero: {
      badge: "Now available",
      title1: "Meet Mia,",
      title2: "The AI Receptionist.",
      subtitle: "Automate phone calls, scheduling, and patient intake with a voice AI that feels completely human.",
      deploy: "Hire Mia now",
      contactSales: "Contact Sales",
      clinics: "Become an innovator and gain your market"
    },
    contactModal: {
      title: "Contact Sales",
      description: "Enter your email to get a personalized demo.",
      placeholder: "name@company.com",
      submit: "Submit",
      success: "Thanks! We'll be in touch."
    },
    socialProof: "Join the Future of Healthcare",
    demo: {
      title: "Mia",
      viewPatient: "View Patient",
      bookAppointment: "Book Appointment",
      messages: [
        { role: 'ai', text: "Alma Health context: Hello, calling to schedule a follow-up." },
        { role: 'user', text: "Hi, I need to see Dr. Chen next week." },
        { role: 'ai', text: "I have an opening Tuesday at 10am. Does that work?" },
        { role: 'user', text: "Yes, that's perfect." },
      ]
    },
    features: {
      title: "Build your remote\nfront desk.",
      subtitle: "Everything you need to automate patient communication, fully integrated with your EMR.",
      triage: {
        title: "Instant Triage",
        desc: "AI analyzes urgency in real-time. Emergency calls are routed to staff immediately, while routine bookings are handled automatically.",
        urgent: "URGENT",
        now: "Now",
        msg: "\"My chest hurts and I feel dizzy...\""
      },
      multilingual: {
        title: "Multilingual",
        desc: "Fluent in English, French, and Spanish. Auto-detects caller language."
      },
      hipaa: {
        title: "HIPAA Compliant",
        desc: "Enterprise-grade encryption and data handling standards built-in."
      },
      list: ['EMR Sync', 'SMS Follow-up', 'Analytics', '24/7 Service'],
      listDesc: "Automated and seamless."
    },
    cta: {
      title: "Ready to modernize?",
      trial: "Start Free Trial",
      demo: "Book Demo"
    },
    footer: {
      tagline: "The operating system for modern clinics.",
      product: "Product",
      company: "Company",
      legal: "Legal",
      links: {
        features: "Features",
        pricing: "Pricing",
        changelog: "Changelog",
        docs: "Docs",
        about: "About",
        blog: "Blog",
        careers: "Careers",
        contact: "Contact",
        privacy: "Privacy",
        terms: "Terms",
        security: "Security"
      }
    }
  },
  fr: {
    nav: {
      product: "Produit",
      solutions: "Solutions",
      pricing: "Tarifs",
      signIn: "Connexion",
      getStarted: "Commencer"
    },
    hero: {
      badge: "Maintenant disponible",
      title1: "Rencontrez Mia,",
      title2: "votre réceptionniste IA.",
      subtitle: "Automatisez les appels, la prise de rendez-vous et l'admission des patients avec une IA vocale parfaitement humaine.",
      deploy: "Embauchez Mia maintenant",
      contactSales: "Contacter les ventes",
      clinics: "Devenez un innovateur et gagnez votre marché"
    },
    contactModal: {
      title: "Contacter les ventes",
      description: "Entrez votre email pour obtenir une démo personnalisée.",
      placeholder: "nom@entreprise.com",
      submit: "Envoyer",
      success: "Merci ! Nous vous recontacterons."
    },
    socialProof: "Rejoignez le futur de la santé",
    demo: {
      title: "Mia",
      viewPatient: "Voir Patient",
      bookAppointment: "Prendre RDV",
      messages: [
        { role: 'ai', text: "Contexte Alma: Bonjour, j'appelle pour le suivi." },
        { role: 'user', text: "Bonjour, je dois voir Dr. Chen la semaine prochaine." },
        { role: 'ai', text: "J'ai une dispo mardi à 10h. Ça vous va ?" },
        { role: 'user', text: "Oui, c'est parfait." },
      ]
    },
    features: {
      title: "Votre secrétariat\nà distance.",
      subtitle: "Tout ce dont vous avez besoin pour automatiser la communication patient, intégré à votre DME.",
      triage: {
        title: "Triage Instantané",
        desc: "L'IA analyse l'urgence en temps réel. Les urgences sont transmises au personnel, les RDV de routine sont gérés automatiquement.",
        urgent: "URGENT",
        now: "Maintenant",
        msg: "\"J'ai mal à la poitrine et je me sens étourdi...\""
      },
      multilingual: {
        title: "Multilingue",
        desc: "Parle anglais, français et espagnol. Détecte automatiquement la langue."
      },
      hipaa: {
        title: "Conforme LPRPDE", // Using Canadian equivalent broadly or HIPAA for brand recog
        desc: "Cryptage de niveau entreprise et normes de traitement des données intégrés."
      },
      list: ['Synchro DME', 'Suivi SMS', 'Analytiques', 'Service 24/7'],
      listDesc: "Automatisé et fluide."
    },
    cta: {
      title: "Prêt à moderniser ?",
      trial: "Essai Gratuit",
      demo: "Réserver une Démo"
    },
    footer: {
      tagline: "Le système d'exploitation des cliniques modernes.",
      product: "Produit",
      company: "Entreprise",
      legal: "Légal",
      links: {
        features: "Fonctionnalités",
        pricing: "Tarifs",
        changelog: "Changelog",
        docs: "Docs",
        about: "À propos",
        blog: "Blog",
        careers: "Carrières",
        contact: "Contact",
        privacy: "Confidentialité",
        terms: "Conditions",
        security: "Sécurité"
      }
    }
  }
}

// --- SUB-COMPONENT: CONTACT SALES MODAL ---
function ContactModal({ isOpen, onClose, lang }: { isOpen: boolean; onClose: () => void; lang: Language }) {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const t = translations[lang].contactModal

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically send the email to your backend
    console.log("Contact Sales Email:", email)
    setSubmitted(true)
    setTimeout(() => {
      setSubmitted(false)
      setEmail('')
      onClose()
    }, 2000)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[60] bg-black/20 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[70] w-full max-w-md p-6 bg-white rounded-2xl shadow-2xl border border-gray-100"
          >
            <button
              onClick={onClose}
              className="absolute right-4 top-4 p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="mb-6">
              <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center mb-4">
                <Zap className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{t.title}</h3>
              <p className="text-sm text-gray-500">{t.description}</p>
            </div>

            {submitted ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-green-50 text-green-700 rounded-xl text-center font-medium text-sm"
              >
                {t.success}
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t.placeholder}
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-sm"
                />
                <button
                  type="submit"
                  className="w-full py-3 bg-black text-white font-bold rounded-xl hover:bg-gray-800 transition-all active:scale-[0.98]"
                >
                  {t.submit}
                </button>
              </form>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

// --- VISUAL COMPONENT: DEMO CALL SIMULATOR ---
function DemoCall({ lang }: { lang: Language }) {
  const [step, setStep] = useState(0)
  const t = translations[lang].demo

  useEffect(() => {
    const timer = setInterval(() => {
      setStep((prev) => (prev + 1) % 4)
    }, 2500)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="relative w-full max-w-md mx-auto aspect-[9/16] md:aspect-square bg-white rounded-[2.5rem] border border-gray-200 overflow-hidden shadow-2xl">
      {/* Dynamic Background */}
      <div className="absolute inset-0 bg-gray-50/50">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-blue-100/50 blur-[100px] animate-pulse" />
      </div>

      {/* Interface */}
      <div className="relative h-full flex flex-col p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center shadow-md shadow-blue-200">
              <Phone className="w-4 h-4 text-white fill-white" />
            </div>
            <div>
              <p className="text-gray-900 font-semibold text-sm">{t.title}</p>
              <p className="text-blue-600 text-xs font-medium">00:4{step}</p>
            </div>
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
          <AnimatePresence mode='wait'>
            {t.messages.map((msg, i) => (
              <motion.div
                key={`${lang}-${i}`} // Force re-render on lang change
                initial={{ opacity: 0, y: 10 }}
                animate={{
                  opacity: i <= step ? 1 : 0,
                  y: i <= step ? 0 : 10
                }}
                className={`p-3 rounded-2xl text-xs leading-relaxed max-w-[85%] shadow-sm ${msg.role === 'ai'
                  ? 'bg-white border border-gray-100 text-gray-700 self-start mr-auto rounded-tl-sm'
                  : 'bg-blue-600 text-white self-end ml-auto rounded-tr-sm'
                  }`}
              >
                {msg.text}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Footer Actions */}
        <div className="mt-8 grid grid-cols-2 gap-3">
          <div className="h-10 rounded-full bg-white flex items-center justify-center border border-gray-200 shadow-sm">
            <span className="text-[10px] text-gray-500 font-medium">{t.viewPatient}</span>
          </div>
          <div className="h-10 rounded-full bg-blue-50 flex items-center justify-center border border-blue-100">
            <span className="text-[10px] text-blue-600 font-medium">{t.bookAppointment}</span>
          </div>
        </div>
      </div>
    </div>
  )
}


// --- MAIN PAGE COMPONENT ---
export default function VitrinePage() {
  const [lang, setLang] = useState<Language>('en')
  const [isContactOpen, setIsContactOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ container: containerRef })
  const t = translations[lang]

  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0])
  const heroScale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95])

  return (
    <div
      ref={containerRef}
      className="h-screen overflow-y-auto bg-white text-gray-900 font-sans scroll-smooth"
    >
      <ContactModal isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} lang={lang} />

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 backdrop-blur-md border-b border-gray-100 bg-white/80">
        <div className="max-w-[1400px] mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center shadow-lg shadow-black/20">
              <span className="text-white font-bold text-sm">A</span>
            </div>
            <span className="text-lg font-semibold tracking-tight text-gray-900">Alma</span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-500">
          </div>

          <div className="flex items-center gap-4">
            {/* Language Toggler */}
            <div className="flex bg-gray-100 rounded-full p-1">
              {(['en', 'fr'] as const).map((l) => (
                <button
                  key={l}
                  onClick={() => setLang(l)}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${lang === l
                    ? 'bg-white text-black shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                    }`}
                >
                  {l.toUpperCase()}
                </button>
              ))}
            </div>

            <Link href="/login" className="text-sm font-medium text-gray-500 hover:text-black transition-colors">
              {t.nav.signIn}
            </Link>
            <Link
              href="/onboarding"
              className="px-4 py-2 bg-black text-white text-sm font-semibold rounded-lg hover:bg-gray-800 transition-colors shadow-lg shadow-black/20"
            >
              {t.nav.getStarted}
            </Link>
          </div>
        </div>
      </nav>

      <main className="relative pt-32 pb-20 overflow-hidden">
        {/* Hero Background Effects - Subtle Light Mode */}
        <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-[800px] h-[800px] bg-blue-500/5 rounded-full blur-[128px] pointer-events-none" />
        <div className="absolute top-0 left-0 -translate-y-1/4 -translate-x-1/4 w-[600px] h-[600px] bg-purple-500/5 rounded-full blur-[128px] pointer-events-none" />

        {/* HERO SECTION */}
        <motion.section
          style={{ opacity: heroOpacity, scale: heroScale }}
          className="max-w-[1400px] mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center mb-32"
        >
          <div className="text-left flex flex-col items-start">
            <motion.div
              key={lang} // Animate on lang switch
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 mb-8 px-3 py-1 rounded-full border border-blue-100 bg-blue-50 text-blue-600 text-xs font-semibold tracking-wide uppercase"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
              {t.hero.badge}
            </motion.div>

            <motion.h1
              key={`h1-${lang}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tighter leading-[0.95] mb-8 text-gray-900"
            >
              {t.hero.title1}
              <br />
              <span className="bg-gradient-to-r from-blue-700 via-indigo-600 to-purple-600 bg-clip-text text-transparent">{t.hero.title2}</span>
            </motion.h1>

            <motion.p
              key={`p-${lang}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-xl text-gray-500 max-w-lg leading-relaxed mb-10"
            >
              {t.hero.subtitle}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
            >
              <Link
                href="/onboarding"
                className="h-12 px-8 flex items-center justify-center bg-black text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors shadow-lg shadow-black/20"
              >
                {t.hero.deploy}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>

              <button
                onClick={() => setIsContactOpen(true)}
                className="h-12 px-8 flex items-center justify-center bg-white text-gray-900 border border-gray-200 font-semibold rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-colors shadow-sm"
              >
                {t.hero.contactSales}
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
                  <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-gray-200" />
                ))}
              </div>
              <div>
                <span className="text-gray-900 font-semibold">{t.hero.clinics}</span>
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
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-100/50 to-purple-100/50 blur-[100px] pointer-events-none" />
            <DemoCall lang={lang} />
          </motion.div>
        </motion.section>

        {/* LOGO CLOUD */}
        <section className="border-y border-gray-100 bg-gray-50/50 py-12 mb-32">
          <div className="max-w-[1400px] mx-auto px-6">
            <p className="text-center text-sm text-gray-500 mb-8 font-medium">{t.socialProof}</p>
            <div className="flex flex-wrap justify-center gap-12 opacity-40 hover:opacity-100 transition-all duration-500">
              {['Cleveland Clinic', 'One Medical', 'Cedar', 'Oscar', 'Maven'].map((brand) => (
                <span key={brand} className="text-xl font-bold font-mono text-gray-900">{brand}</span>
              ))}
            </div>
          </div>
        </section>

        {/* BENTO GRID FEATURES */}
        <section id="features" className="max-w-[1400px] mx-auto px-6 mb-32">
          <div className="text-center mb-20 max-w-2xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 text-gray-900 whitespace-pre-line">
              {t.features.title}
            </h2>
            <p className="text-lg text-gray-500">{t.features.subtitle}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-auto md:h-[600px]">
            {/* Large Left Card */}
            <div className="md:col-span-2 relative p-8 rounded-3xl bg-gray-50 border border-gray-100 overflow-hidden group hover:border-blue-200/50 transition-colors">
              <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-500/5 blur-[80px] group-hover:bg-blue-500/10 transition-all duration-500" />

              <div className="relative z-10 h-full flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center mb-6">
                    <Zap className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2 text-gray-900">{t.features.triage.title}</h3>
                  <p className="text-gray-500 max-w-sm">{t.features.triage.desc}</p>
                </div>

                {/* Fake UI Preview */}
                <div className="mt-8 bg-white rounded-xl border border-gray-100 p-4 shadow-lg shadow-gray-200/50 translate-y-4 group-hover:translate-y-2 transition-transform duration-500">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                      <span className="text-xs font-mono text-red-500 font-medium">{t.features.triage.urgent}</span>
                    </div>
                    <span className="text-xs text-gray-400">{t.features.triage.now}</span>
                  </div>
                  <p className="text-sm text-gray-600">{t.features.triage.msg}</p>
                </div>
              </div>
            </div>

            {/* Right Column Stack */}
            <div className="flex flex-col gap-6">
              <div className="flex-1 p-8 rounded-3xl bg-gray-50 border border-gray-100 hover:border-gray-200 transition-colors group">
                <Globe className="w-8 h-8 text-indigo-500 mb-4" />
                <h3 className="text-xl font-bold mb-2 text-gray-900">{t.features.multilingual.title}</h3>
                <p className="text-sm text-gray-500">{t.features.multilingual.desc}</p>
              </div>
              <div className="flex-1 p-8 rounded-3xl bg-gray-50 border border-gray-100 hover:border-gray-200 transition-colors group">
                <Shield className="w-8 h-8 text-green-500 mb-4" />
                <h3 className="text-xl font-bold mb-2 text-gray-900">{t.features.hipaa.title}</h3>
                <p className="text-sm text-gray-500">{t.features.hipaa.desc}</p>
              </div>
            </div>
          </div>

          {/* Second Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
            {t.features.list.map((feat, i) => (
              <div key={i} className="p-6 rounded-3xl bg-white border border-gray-100 hover:shadow-md transition-all">
                <h4 className="font-bold text-lg mb-1 text-gray-900">{feat}</h4>
                <p className="text-xs text-gray-500">{t.features.listDesc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA BANNER */}
        <section className="max-w-[1400px] mx-auto px-6 mb-20">
          <div className="relative rounded-[2.5rem] bg-gray-900 p-12 md:p-24 text-center overflow-hidden shadow-2xl shadow-gray-900/20">
            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
            <div className="relative z-10">
              <h2 className="text-4xl md:text-6xl font-bold tracking-tighter mb-8 text-white">{t.cta.title}</h2>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/onboarding" className="h-14 px-8 flex items-center justify-center bg-white text-black font-bold rounded-xl hover:scale-105 transition-transform">
                  {t.cta.trial}
                </Link>
                <button className="h-14 px-8 flex items-center justify-center bg-white/10 text-white font-bold rounded-xl hover:bg-white/20 transition-colors backdrop-blur-md border border-white/10">
                  {t.cta.demo}
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="border-t border-gray-100 bg-gray-50 pt-16 pb-8">
          <div className="max-w-[1400px] mx-auto px-6">
            <div className="flex justify-center items-center text-xs text-gray-500">
              <p>© 2026 Alma Health Inc.</p>
            </div>
          </div>
        </footer>

      </main>
    </div>
  )
}
