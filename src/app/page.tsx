'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { ArrowRight, Play, X, Star, Check } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { useLanguage } from '@/hooks/useLanguage'

type Language = 'fr' | 'en'

// Minimalist Contact Modal
function ContactModal({ isOpen, onClose, lang }: { isOpen: boolean; onClose: () => void; lang: Language }) {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const { t } = useLanguage()
  const contactTranslations = t.contact

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
            className="fixed inset-0 z-[60] bg-white/80 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.98 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[70] w-full max-w-sm p-8 bg-white border border-stone-100 shadow-2xl rounded-2xl"
          >
            <button
              onClick={onClose}
              className="absolute right-4 top-4 p-2 text-stone-400 hover:text-stone-900 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-8">
              <h3 className="text-xl font-medium tracking-tight text-stone-900 mb-2">{contactTranslations.title}</h3>
              <p className="text-stone-500 text-sm leading-relaxed">{contactTranslations.description}</p>
            </div>

            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-4 bg-stone-50 text-stone-600 rounded-lg text-center text-sm"
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
                  className="w-full px-4 py-3 bg-stone-50 border-0 rounded-lg text-stone-900 placeholder:text-stone-400 focus:ring-1 focus:ring-stone-900 transition-all text-sm"
                />
                <button
                  type="submit"
                  className="w-full py-3 bg-stone-900 text-white font-medium rounded-lg hover:bg-black transition-all text-sm"
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

// Minimal Video Placeholder
function VideoPlaceholder({ hint, title, thumbnailAlt }: { hint: string; title?: string; thumbnailAlt?: string }) {
  const [isPlaying, setIsPlaying] = useState(false)

  return (
    <div className="relative w-full aspect-[16/9] rounded-xl overflow-hidden bg-stone-50 group">
      {isPlaying ? (
        <iframe
          src="https://www.youtube.com/embed/Th8JoIan4dg?autoplay=1&rel=0"
          title={title || 'Alma Demo'}
          className="w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      ) : (
        <button
          onClick={() => setIsPlaying(true)}
          className="block w-full h-full relative cursor-pointer"
        >
          <img
            src="https://img.youtube.com/vi/Th8JoIan4dg/maxresdefault.jpg"
            alt={thumbnailAlt || 'Video Thumbnail'}
            className="absolute inset-0 w-full h-full object-cover opacity-90 transition-opacity group-hover:opacity-100"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-white/90 backdrop-blur flex items-center justify-center shadow-lg transition-transform group-hover:scale-105">
              <Play className="w-6 h-6 text-stone-900 fill-stone-900 ml-1" />
            </div>
          </div>
        </button>
      )}
    </div>
  )
}

// Hero Section
function HeroSection({ t }: { t: any }) {
  const [showContactModal, setShowContactModal] = useState(false)

  return (
    <>
      <ContactModal isOpen={showContactModal} onClose={() => setShowContactModal(false)} lang="fr" />
      <section className="relative pt-24 pb-12 lg:pt-28 lg:pb-16 px-6 md:px-8 max-w-6xl mx-auto overflow-hidden">
        {/* Subtle gradient glow background */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-gradient-to-br from-orange-200/30 via-amber-100/20 to-transparent rounded-full blur-3xl" />
        </div>

        <div className="max-w-3xl mx-auto text-center">
          {/* Authority Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-50 border border-orange-200/60 text-orange-600 text-sm font-medium mb-6">
              <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
              {t.hero.badge}
            </span>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tighter text-stone-900 mb-4 leading-[1.1]"
          >
            {t.hero.tagline}
            <span className="block bg-gradient-to-r from-orange-500 via-amber-500 to-orange-400 bg-clip-text text-transparent">
              {t.hero.tagline2}
            </span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="text-base md:text-lg text-stone-500 font-light leading-relaxed max-w-xl mx-auto mb-8"
          >
            {t.hero.subheadline}
          </motion.p>

          {/* Dual CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col sm:flex-row gap-3 justify-center mb-10"
          >
            <button
              className="px-6 py-3 bg-stone-900 text-white font-medium rounded-lg hover:bg-black transition-all shadow-lg shadow-stone-900/20 flex items-center justify-center gap-2"
            >
              <Play className="w-4 h-4" />
              {t.hero.ctaPrimary}
            </button>
            <button
              onClick={() => setShowContactModal(true)}
              className="px-6 py-3 border border-stone-300 text-stone-700 font-medium rounded-lg hover:border-stone-400 hover:bg-stone-50 transition-all flex items-center justify-center gap-2"
            >
              {t.hero.ctaSecondary}
              <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>

          {/* Video */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="rounded-xl overflow-hidden shadow-xl shadow-stone-200/50 max-w-2xl mx-auto"
          >
            <VideoPlaceholder hint={t.hero.videoHint} title={t.hero.videoTitle} thumbnailAlt={t.hero.videoThumbnailAlt} />
          </motion.div>
        </div>
      </section>
    </>
  )
}

// Text Highlighter Component
function Highlight({ text }: { text: string }) {
  if (!text) return null
  const parts = text.split('*')
  return (
    <>
      {parts.map((part, i) =>
        i % 2 === 1 ? (
          <span key={i} className="font-medium text-stone-900">
            {part}
          </span>
        ) : (
          part
        )
      )}
    </>
  )
}

// Comparison Section (Traditional vs Alma)
function ComparisonSection({ t }: { t: any }) {
  const { comparison } = t

  return (
    <section className="py-20 px-6 md:px-8 bg-stone-50">
      <div className="max-w-5xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-semibold text-center text-stone-900 mb-12 tracking-tight"
        >
          {comparison.title}
        </motion.h2>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Traditional */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl p-8 border border-stone-200"
          >
            <h3 className="text-lg font-semibold text-stone-500 mb-6 flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-stone-300" />
              {comparison.traditional.title}
            </h3>
            <ul className="space-y-4">
              {comparison.traditional.items.map((item: string, i: number) => (
                <li key={i} className="flex items-start gap-3 text-stone-600">
                  <X className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Alma */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl p-8 border border-orange-200/60 shadow-lg shadow-orange-100/50"
          >
            <h3 className="text-lg font-semibold text-orange-600 mb-6 flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-orange-500 animate-pulse" />
              {comparison.alma.title}
            </h3>
            <ul className="space-y-4">
              {comparison.alma.items.map((item: string, i: number) => (
                <li key={i} className="flex items-start gap-3 text-stone-700">
                  <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="font-medium">{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

// Stats Section (Metric Cards)
function StatsSection({ t }: { t: any }) {
  const { stats } = t

  const statItems = [
    { ...stats.canadians, accent: 'from-orange-500 to-amber-500' },
    { ...stats.reduction, accent: 'from-green-500 to-emerald-500' },
    { ...stats.availability, accent: 'from-blue-500 to-cyan-500' },
    { ...stats.appointments, accent: 'from-purple-500 to-pink-500' },
  ]

  return (
    <section className="py-20 px-6 md:px-8 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {statItems.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center p-6 rounded-2xl bg-stone-50 border border-stone-100"
            >
              <span className={`text-4xl md:text-5xl font-bold bg-gradient-to-r ${stat.accent} bg-clip-text text-transparent`}>
                {stat.value}
              </span>
              <p className="text-sm text-stone-500 mt-2 leading-tight">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// Founders Section
function FoundersSection({ t }: { t: any }) {
  const { mission } = t

  return (
    <section className="py-24 px-6 md:px-8 bg-white">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-sm font-medium text-stone-500 uppercase tracking-widest mb-4 block">
            {mission.foundersLabel}
          </span>
          <h2 className="text-4xl md:text-5xl font-semibold tracking-tight mb-3">
            <span className="bg-gradient-to-r from-orange-500 via-amber-500 to-orange-400 bg-clip-text text-transparent">
              {mission.foundersHeadline}
            </span>
          </h2>
          <p className="text-xl text-stone-600">
            {mission.founders}
          </p>
        </motion.div>

        {/* Two-column layout: Photo + Story */}
        <div className="grid lg:grid-cols-2 gap-12 items-start mb-12">
          {/* Photo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative aspect-[4/5] w-full max-w-md mx-auto rounded-2xl overflow-hidden border border-stone-200 shadow-sm"
          >
            <Image
              src="/images/founders.png"
              alt="Sacha & Mathéo"
              fill
              className="object-cover"
              unoptimized
            />
          </motion.div>

          {/* Story + Health Scare */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <p className="text-lg text-stone-600 leading-relaxed">
              <Highlight text={mission.storyIntro} />
            </p>

            {mission.healthScare && (
              <p className="text-lg text-stone-600 leading-relaxed">
                {mission.healthScare}
              </p>
            )}
          </motion.div>
        </div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid md:grid-cols-2 gap-6 mb-12"
        >
          <div className="bg-stone-50 rounded-2xl p-8 border border-stone-200">
            <span className="block text-4xl font-semibold mb-3 bg-gradient-to-r from-stone-800 to-stone-600 bg-clip-text text-transparent">
              {mission.stats.crisis.highlight}
            </span>
            <p className="text-sm text-stone-500 leading-relaxed">{mission.stats.crisis.text}</p>
          </div>
          <div className="bg-stone-50 rounded-2xl p-8 border border-stone-200">
            <span className="block text-4xl font-semibold mb-3 bg-gradient-to-r from-stone-800 to-stone-600 bg-clip-text text-transparent">
              {mission.stats.burnout.highlight}
            </span>
            <p className="text-sm text-stone-500 leading-relaxed">{mission.stats.burnout.text}</p>
          </div>
        </motion.div>

        {/* Conclusion */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto"
        >
          <p className="text-2xl font-semibold text-stone-900 mb-3">
            <Highlight text={mission.conclusion} />
          </p>
          <p className="text-lg text-stone-500 leading-relaxed">
            {mission.description}
          </p>
        </motion.div>
      </div>
    </section>
  )
}

// Product / Mia Section (Clean Feature Cards)
function ProductSection({ t }: { t: any }) {
  const { mia } = t

  return (
    <section className="py-24 px-6 md:px-8 bg-stone-50 relative overflow-hidden">
      {/* Subtle gradient background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-t from-orange-100/30 via-amber-50/20 to-transparent rounded-full blur-3xl" />
      </div>

      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-sm font-medium text-stone-500 uppercase tracking-widest mb-4 block">
            {mia.role}
          </span>
          <h2 className="text-4xl md:text-5xl font-semibold tracking-tight mb-4">
            <span className="bg-gradient-to-r from-orange-500 via-amber-500 to-orange-400 bg-clip-text text-transparent">
              {mia.headline}
            </span>
          </h2>
          <p className="text-lg text-stone-500 max-w-2xl mx-auto">
            {mia.subheadline}
          </p>
        </motion.div>

        {/* Feature Cards Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {mia.features?.map((feature: any, i: number) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-2xl p-8 border border-stone-200 shadow-sm hover:shadow-lg transition-all duration-300"
            >
              <h3 className="text-xl font-semibold mb-3 bg-gradient-to-r from-stone-800 to-stone-600 bg-clip-text text-transparent">
                {feature.title}
              </h3>
              <p className="text-stone-500 leading-relaxed text-sm">{feature.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Security Card - Same formatting as feature cards */}
        {mia.security && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-2xl p-8 border border-stone-200 shadow-sm"
          >
            <h3 className="text-xl font-semibold mb-3 bg-gradient-to-r from-stone-800 to-stone-600 bg-clip-text text-transparent">
              {mia.security.title}
            </h3>
            <p className="text-stone-500 leading-relaxed text-sm">{mia.security.desc}</p>
          </motion.div>
        )}
      </div>
    </section>
  )
}

// Main Page
export default function AlmaLandingPage() {
  const { lang, setLang, t, mounted } = useLanguage()
  const [isContactOpen, setIsContactOpen] = useState(false)

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-white text-stone-900 font-sans selection:bg-stone-900 selection:text-white">
      <ContactModal isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} lang={lang} />

      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-stone-100 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="text-xl font-semibold tracking-tight">Alma</Link>

          <div className="flex items-center gap-6">
            {/* Language Toggle */}
            <div className="flex items-center gap-1 text-xs font-medium text-stone-400">
              <button onClick={() => setLang('fr')} className={lang === 'fr' ? 'text-stone-900' : 'hover:text-stone-600'}>FR</button>
              <span>/</span>
              <button onClick={() => setLang('en')} className={lang === 'en' ? 'text-stone-900' : 'hover:text-stone-600'}>EN</button>
            </div>

            <Link href="/login" className="text-sm font-medium text-stone-500 hover:text-stone-900 transition-colors hidden sm:block">
              {t.nav.signIn}
            </Link>
            <button
              onClick={() => setIsContactOpen(true)}
              className="px-6 py-2.5 bg-stone-900 text-white text-sm font-medium rounded-full hover:opacity-90 transition-opacity"
            >
              {t.nav.demo}
            </button>
          </div>
        </div>
      </nav>

      <main>
        <HeroSection t={t} />
        <ComparisonSection t={t} />
        <ProductSection t={t} />
        <FoundersSection t={t} />

        {/* CTA Footer */}
        <section className="py-32 px-6 text-center">
          <h2 className="text-3xl md:text-5xl font-light text-stone-900 mb-10 tracking-tight">{t.cta.title}</h2>
          <button
            onClick={() => setIsContactOpen(true)}
            className="group h-14 px-10 inline-flex items-center justify-center bg-stone-900 text-white font-medium rounded-full hover:scale-105 transition-all duration-300"
          >
            {t.hero.ctaPrimary}
            <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
          </button>
          <div className="mt-16 flex flex-col md:flex-row items-center justify-center gap-8 text-sm text-stone-400">
            <span>{t.footer.copyright}</span>
            <span className="hidden md:inline">•</span>
            <span>{t.footer.address}</span>
            <span className="hidden md:inline">•</span>
            <a href={`mailto:${t.footer.email}`} className="hover:text-stone-900 transition-colors">{t.footer.email}</a>
          </div>
        </section>
      </main>
    </div>
  )
}
