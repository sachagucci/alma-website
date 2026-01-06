'use client'

import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion'
import { useState, useRef, useEffect } from 'react'
import { ArrowRight, Play, X, Phone } from 'lucide-react'
import Link from 'next/link'
import { useLanguage } from '@/hooks/useLanguage'

type Language = 'fr' | 'en'

// Contact Modal Component
function ContactModal({ isOpen, onClose, lang }: { isOpen: boolean; onClose: () => void; lang: Language }) {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const { t } = useLanguage() // Use the hook directly in the modal
  const contactTranslations = t.contact // Access the contact specific translations

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Contact request:", email)
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
            className="fixed inset-0 z-[60] bg-black/30 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.98, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: 10 }}
            transition={{ duration: 0.2 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[70] w-full max-w-md p-8 bg-white rounded-2xl shadow-xl"
          >
            <button
              onClick={onClose}
              className="absolute right-4 top-4 p-2 text-stone-400 hover:text-stone-600 rounded-full hover:bg-stone-50 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-6">
              <div className="w-12 h-12 rounded-xl bg-stone-100 flex items-center justify-center mb-4">
                <Phone className="w-5 h-5 text-stone-600" />
              </div>
              <h3 className="text-xl font-semibold text-stone-900 mb-2">{contactTranslations.title}</h3>
              <p className="text-stone-500 text-sm">{contactTranslations.description}</p>
            </div>

            {submitted ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-stone-50 text-stone-700 rounded-xl text-center text-sm"
              >
                {contactTranslations.success}
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={contactTranslations.placeholder}
                  className="w-full px-4 py-3 rounded-xl bg-stone-50 border border-stone-200 text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-200 focus:border-stone-300 transition-all text-sm"
                />
                <button
                  type="submit"
                  className="w-full py-3 bg-stone-900 text-white font-medium rounded-xl hover:bg-stone-800 transition-all text-sm"
                >
                  {contactTranslations.submit}
                </button>
              </form>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

// Video Placeholder Component
function VideoPlaceholder({ hint }: { hint: string }) {
  const [isPlaying, setIsPlaying] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="relative w-full max-w-3xl mx-auto aspect-[16/9] rounded-2xl overflow-hidden shadow-lg group bg-stone-900"
    >
      {isPlaying ? (
        <iframe
          src="https://www.youtube.com/embed/Th8JoIan4dg?autoplay=1&rel=0"
          title="Alma Demo"
          className="w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      ) : (
        <button
          onClick={() => setIsPlaying(true)}
          className="block w-full h-full relative cursor-pointer"
        >
          {/* Thumbnail */}
          <img
            src="https://img.youtube.com/vi/Th8JoIan4dg/maxresdefault.jpg"
            alt="Video Thumbnail"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />

          {/* Soft dark overlay for better text contrast */}
          <div className="absolute inset-0 bg-stone-900/40 group-hover:bg-stone-900/30 transition-colors duration-300" />

          {/* Play button */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30 mb-4 group-hover:bg-white/30 transition-all shadow-lg"
            >
              <Play className="w-6 h-6 text-white fill-white ml-0.5" />
            </motion.div>
            <p className="text-white font-medium text-shadow-sm group-hover:text-white/90 transition-colors">{hint}</p>
          </div>
        </button>
      )}
    </motion.div>
  )
}

// Feature Card Component
function FeatureCard({ title, desc, delay }: { title: string; desc: string; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className="p-8"
    >
      <h3 className="text-lg font-semibold text-stone-900 mb-3">
        {title}
      </h3>
      <p className="text-stone-500 leading-relaxed text-sm">{desc}</p>
    </motion.div>
  )
}

// Logo Component for Social Proof
function PartnerLogo({ name }: { name: string }) {
  return (
    <div className="flex items-center justify-center h-12 px-6 opacity-40 hover:opacity-70 transition-opacity duration-300">
      <span className="text-sm font-medium text-stone-600 tracking-wide">{name}</span>
    </div>
  )
}

// Agent Selector Button (left side)
function AgentButton({
  name,
  isSelected,
  onClick
}: {
  name: string
  isSelected: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-6 py-5 rounded-2xl transition-all duration-300 ${isSelected
        ? 'bg-stone-900 text-white shadow-lg'
        : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
        }`}
    >
      <span className="text-xl font-semibold">{name}</span>
    </button>
  )
}

// Agent Detail Panel (right side)
function AgentDetailPanel({
  name,
  title,
  subtitle,
  points
}: {
  name: string
  title: string
  subtitle: string
  points: string[]
}) {
  return (
    <motion.div
      key={name}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="h-[320px] p-8 rounded-2xl bg-gradient-to-br from-stone-50 to-stone-100/50 border border-stone-200/50"
    >
      <div className="mb-4">
        <h3 className="text-3xl font-bold text-stone-900 mb-1">{name}</h3>
        <p className="text-stone-500 font-medium">{title}</p>
      </div>

      <p className="text-stone-700 mb-5 text-sm">{subtitle}</p>

      <div className="flex flex-wrap gap-2">
        {points.map((point, i) => (
          <motion.span
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            whileHover={{ scale: 1.02 }}
            className="inline-block px-4 py-2 rounded-full bg-white border border-stone-200 text-sm text-stone-600 cursor-default transition-all duration-300 hover:bg-gradient-to-r hover:from-amber-300 hover:via-orange-400 hover:to-red-400 hover:border-transparent hover:text-white hover:shadow-md"
          >
            {point}
          </motion.span>
        ))}
      </div>
    </motion.div>
  )
}

// Hero Section Component
function HeroSection({ t }: { t: any }) {
  const heroRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  })
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])
  const heroY = useTransform(scrollYProgress, [0, 0.5], [0, -50])

  return (
    <section ref={heroRef} className="pt-28 pb-16 px-6">
      <motion.div
        style={{ opacity: heroOpacity, y: heroY }}
        className="max-w-5xl mx-auto"
      >
        {/* Tagline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-3xl md:text-4xl lg:text-[2.75rem] font-semibold tracking-tight leading-[1.2] mb-4 text-stone-900">
            <span className="block">{t.hero.tagline}</span>
            <span className="block">{t.hero.tagline2}</span>
            <span className="block bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 bg-clip-text text-transparent">{t.hero.tagline3}</span>
          </h1>
          <p className="text-stone-500 text-base max-w-2xl mx-auto">{t.hero.subheadline}</p>
        </motion.div>

        {/* Video Placeholder */}
        <div className="mb-8">
          <VideoPlaceholder hint={t.hero.videoHint} />
        </div>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3"
        >
          <Link
            href="/contact"
            className="h-12 px-6 flex items-center justify-center bg-stone-900 text-white font-medium rounded-xl hover:bg-stone-800 transition-all text-sm"
          >
            {t.hero.ctaPrimary}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
          <Link
            href="/onboarding"
            className="h-12 px-6 flex items-center justify-center text-stone-600 font-medium rounded-xl border border-stone-200 hover:border-stone-300 hover:text-stone-900 transition-all text-sm"
          >
            {t.hero.ctaSecondary}
          </Link>
        </motion.div>
      </motion.div>
    </section>
  )
}

// Main Page Component
export default function AlmaLandingPage() {
  const { lang, setLang, t, mounted } = useLanguage()
  const [isPlaying, setIsPlaying] = useState(false)
  const [isContactOpen, setIsContactOpen] = useState(false)
  const [openAgent, setOpenAgent] = useState<'mia' | 'leo' | 'eva' | null>('mia')

  if (!mounted) return null // Prevent hydration mismatch

  return (
    <div className="min-h-screen bg-white text-stone-900 font-sans">
      <ContactModal isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} lang={lang} />

      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-stone-100">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between relative">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-stone-900 rounded-lg flex items-center justify-center">
              <span className="text-white font-semibold text-sm">A</span>
            </div>
            <span className="text-lg font-medium tracking-tight">Alma</span>
          </div>

          {/* Center: Phone Number (Absolute) */}
          <a
            href="tel:+14385009000"
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-sm text-stone-500 hover:text-stone-900 transition-colors hidden md:flex items-center gap-2 whitespace-nowrap z-10"
          >
            <span className="hidden lg:inline">{t.nav.callUs}:</span>
            <span className="font-medium">+1 438 500 9000</span>
          </a>

          {/* Right: Language & CTAs */}
          <div className="flex items-center gap-3 relative z-20 bg-white/50 backdrop-blur-sm rounded-full pl-2">
            {/* Language Toggle */}
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

            <Link
              href="/login"
              className="text-sm text-stone-500 hover:text-stone-900 transition-colors hidden sm:block"
            >
              {t.nav.signIn}
            </Link>
            <Link
              href="/contact"
              className="px-4 py-2 bg-stone-900 text-white text-sm font-medium rounded-lg hover:bg-stone-800 transition-colors"
            >
              {t.nav.demo}
            </Link>
          </div>
        </div>
      </nav>

      <main>
        {/* Hero Section */}
        <HeroSection t={t} />

        {/* "Bâti par des gens d'ici" Section */}
        <section className="py-12 px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl mx-auto text-center"
          >
            <h2 className="text-2xl md:text-3xl font-semibold tracking-tight mb-3 text-stone-900">
              {t.local.title}
            </h2>
            <p className="text-sm text-stone-500 mb-4">
              {t.local.subtitle}
            </p>
            <p className="text-stone-500 leading-relaxed text-sm">
              {t.local.description}
            </p>
          </motion.div>
        </section>

        {/* Agents Section */}
        <section className="py-12 px-6 bg-stone-50/50">
          <div className="max-w-5xl mx-auto">
            {/* Section Title */}
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-bold text-stone-900 text-center mb-8"
            >
              {t.agents.sectionTitle}
            </motion.h2>

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Left: Agent Buttons */}
              <div className="space-y-3">
                <AgentButton
                  name={t.agents.mia.name}
                  isSelected={openAgent === 'mia'}
                  onClick={() => setOpenAgent('mia')}
                />
                <AgentButton
                  name={t.agents.leo.name}
                  isSelected={openAgent === 'leo'}
                  onClick={() => setOpenAgent('leo')}
                />
                <AgentButton
                  name={t.agents.eva.name}
                  isSelected={openAgent === 'eva'}
                  onClick={() => setOpenAgent('eva')}
                />
              </div>

              {/* Right: Detail Panel */}
              <div className="md:col-span-2 min-h-[320px]">
                <AnimatePresence mode="wait">
                  {openAgent === 'mia' && (
                    <AgentDetailPanel
                      name={t.agents.mia.name}
                      title={t.agents.mia.title}
                      subtitle={t.agents.mia.subtitle}
                      points={t.agents.mia.points}
                    />
                  )}
                  {openAgent === 'leo' && (
                    <AgentDetailPanel
                      name={t.agents.leo.name}
                      title={t.agents.leo.title}
                      subtitle={t.agents.leo.subtitle}
                      points={t.agents.leo.points}
                    />
                  )}
                  {openAgent === 'eva' && (
                    <AgentDetailPanel
                      name={t.agents.eva.name}
                      title={t.agents.eva.title}
                      subtitle={t.agents.eva.subtitle}
                      points={t.agents.eva.points}
                    />
                  )}
                  {!openAgent && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="h-full flex items-center justify-center p-8 rounded-2xl bg-gradient-to-br from-stone-50 to-stone-100/50 border border-stone-200/50 border-dashed"
                    >
                      <p className="text-stone-400 text-center">
                        {lang === 'fr' ? 'Cliquez sur un nom pour en savoir plus' : 'Click a name to learn more'}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Banner */}
        <section className="py-12 px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <div className="bg-gradient-to-r from-amber-300 via-orange-400 to-red-400 backdrop-blur-sm rounded-2xl px-8 py-10 text-center shadow-lg border border-orange-300/50">
              <h2 className="text-2xl font-semibold text-white mb-6">
                {t.cta.title}
              </h2>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link
                  href="/contact"
                  className="h-12 px-6 flex items-center justify-center bg-white text-orange-600 font-medium rounded-xl hover:bg-orange-50 transition-all text-sm shadow-md"
                >
                  {t.hero.ctaPrimary}
                </Link>
                <Link
                  href="/onboarding"
                  className="h-12 px-6 flex items-center justify-center text-white font-medium rounded-xl border border-white/40 hover:bg-white/20 transition-all text-sm"
                >
                  {t.hero.ctaSecondary}
                </Link>
              </div>
            </div>
          </motion.div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-10 px-6 border-t border-stone-100">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-stone-500">
            {/* Logo & Tagline */}
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-stone-900 rounded flex items-center justify-center">
                <span className="text-white font-medium text-xs">A</span>
              </div>
              <span className="text-stone-900 font-medium">Alma</span>
              <span className="text-stone-400">·</span>
              <span className="text-stone-400">{t.footer.tagline}</span>
            </div>

            {/* Contact & Copyright */}
            <div className="text-center md:text-right text-xs">
              <a href="tel:+14385009000" className="text-stone-500 hover:text-stone-700 transition-colors">+1 438 500 9000</a>
              <span className="text-stone-300 mx-2">·</span>
              <span className="text-stone-500">{t.footer.email}</span>
              <span className="text-stone-300 mx-2">·</span>
              <span className="text-stone-400">{t.footer.copyright}</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
