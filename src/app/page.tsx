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
  return (
    <section className="pt-42 pb-32 lg:pt-52 lg:pb-40 px-6 md:px-8 max-w-7xl mx-auto">
      <div className="max-w-4xl mx-auto text-center">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="text-6xl md:text-8xl lg:text-9xl font-semibold tracking-tighter text-stone-900 mb-12 leading-[0.95]"
        >
          {t.hero.tagline} <span className="text-stone-300 block">{t.hero.tagline2}</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="text-xl md:text-2xl text-stone-500 font-light leading-relaxed max-w-2xl mx-auto mb-20 md:mb-28"
        >
          {t.hero.subheadline}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="rounded-2xl overflow-hidden shadow-2xl shadow-stone-200/50"
        >
          <VideoPlaceholder hint={t.hero.videoHint} title={t.hero.videoTitle} thumbnailAlt={t.hero.videoThumbnailAlt} />
        </motion.div>
      </div>
    </section>
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

// Founders Section (Narrative & Minimalist)
function FoundersSection({ t }: { t: any }) {
  const { mission } = t

  return (
    <section className="py-32 px-6 md:px-8 relative bg-white flex flex-col justify-center">
      <div className="max-w-7xl mx-auto w-full">

        {/* Header Block - Centered Top */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl mx-auto text-center mb-20"
        >
          <p className="text-sm font-semibold tracking-widest uppercase text-stone-500 mb-6 flex items-center justify-center gap-3">
            <span className="w-8 h-px bg-stone-300"></span>
            {mission.foundersLabel}
            <span className="w-8 h-px bg-stone-300"></span>
          </p>
          <p className="text-3xl md:text-5xl font-light text-stone-900 leading-[1.15] tracking-tight">
            <Highlight text={mission.founders} />
          </p>
        </motion.div>


        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* Left: Image (Centered in column) */}
          <div className="flex justify-center lg:justify-end w-full">
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
              className="relative aspect-[4/5] w-full max-w-md rounded-lg overflow-hidden grayscale hover:grayscale-0 transition-all duration-700 ease-out bg-stone-100 shadow-xl shadow-stone-200/50"
            >
              <Image
                src="/images/founders.png"
                alt="Sacha & Mathéo"
                fill
                className="object-cover"
                unoptimized
              />
            </motion.div>
          </div>

          {/* Right: Narrative (Vertically Centered) */}
          <div className="flex flex-col justify-center space-y-10 max-w-lg mx-auto lg:mx-0">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="space-y-10"
            >
              <p className="text-lg md:text-xl text-stone-600 leading-relaxed">
                <Highlight text={mission.storyIntro} />
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 border-t border-b border-stone-100 py-8">
                <div>
                  <span className="block text-4xl py-1 font-medium text-stone-900 mb-2">{mission.stats.crisis.highlight}</span>
                  <p className="text-sm text-stone-500 leading-relaxed">{mission.stats.crisis.text}</p>
                </div>
                <div>
                  <span className="block text-4xl py-1 font-medium text-stone-900 mb-2">{mission.stats.burnout.highlight}</span>
                  <p className="text-sm text-stone-500 leading-relaxed">{mission.stats.burnout.text}</p>
                </div>
              </div>

              <div>
                <p className="text-2xl font-light text-stone-900 leading-tight mb-2">
                  <Highlight text={mission.conclusion} />
                </p>
                <p className="text-lg text-stone-500 leading-relaxed">
                  {mission.description}
                </p>
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  )
}

// Product / Mia Section (Dark & Schema-Based)
function ProductSection({ t }: { t: any }) {
  const { layer1, layer2, layer3 } = t.mia

  const SchemaRow = ({ title, steps, delay }: { title: string, steps: any[], delay: number }) => (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay }}
      className="mb-20 last:mb-0"
    >
      <h3 className="text-xl md:text-2xl font-light text-stone-400 mb-8 border-l-2 border-green-500/50 pl-4">{title}</h3>

      {/* Scrollable container for mobile */}
      <div className="relative overflow-x-auto pb-8 -mx-6 px-6 md:overflow-visible md:pb-0 md:px-0">
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4 min-w-[700px] md:min-w-0">

          {steps.map((step: any, i: number) => {
            const isHub = step.title.includes("Aiguillage")
            return (
              <div key={i} className="flex-1 flex items-center relative">
                {/* Connector Logic for Hub */}
                {isHub && (
                  <>
                    {/* Left Input Arrow */}
                    <div className="hidden md:block absolute -left-3 top-1/2 -translate-y-1/2 z-10 text-stone-600">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M13 7L18 12L13 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    </div>
                    {/* Right Input Arrow (Actually from right neighbor) -> We need arrows pointing IN to the hub. 
                         So arrow on Left side pointing Right. Arrow on Right side pointing Left.
                     */}
                    <div className="hidden md:block absolute -right-3 top-1/2 -translate-y-1/2 z-10 text-stone-600 rotate-180">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M13 7L18 12L13 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    </div>
                  </>
                )}

                <div className={`flex-1 p-6 rounded-2xl border min-h-[140px] flex flex-col justify-center relative group transition-all duration-500 
                  ${isHub ? 'bg-white/[0.08] border-green-500/30 shadow-[0_0_30px_rgba(74,222,128,0.1)]' : 'bg-white/[0.03] border-white/10 hover:bg-white/[0.05]'}`}>

                    {isHub && (
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white/[0.03] px-2 text-[10px] text-stone-200 uppercase tracking-widest border border-white/10 rounded-full">
                        {t.mia?.hubLabel || 'Hub'}
                      </div>
                    )}

                    <h4 className={`text-base font-medium mb-2 ${isHub ? 'text-stone-200' : 'text-stone-200'}`}>{step.title}</h4>
                  <p className="text-xs text-stone-400 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            )
          })}

        </div>
      </div>
    </motion.div>
  )

  return (
    <section className="py-32 px-6 md:px-8 bg-[#0a0a0a] text-white relative isolate overflow-hidden">
      <div className="max-w-7xl mx-auto w-full relative z-10">

        <div className="mb-24 md:mb-32">
          <span className="inline-flex items-center gap-3 py-2 px-4 rounded-full bg-white/5 text-stone-300 text-xs font-medium tracking-widest uppercase mb-8 border border-white/5">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse shadow-[0_0_10px_rgba(74,222,128,0.5)]" />
            {t.mia.role}
          </span>
          <h2 className="text-6xl md:text-8xl font-semibold text-white tracking-tighter leading-[0.9]">
            {t.mia.headline}
          </h2>
          <p className="text-xl text-stone-400 mt-6 max-w-2xl font-light">{t.mia.subheadline}</p>
        </div>

        {/* Layer 1: Interaction */}
        <div className="relative">
          <SchemaRow title={layer1.title} steps={layer1.steps} delay={0.2} />
        </div>

        {/* Spacer for Connector */}
        <div className="h-20" />

        {/* Layer 2: The Brain */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mb-20 relative"
        >
          {/* Animated Flow Connector from Hub Décisionnel up to Action & EMR (wider) */}
          <div className="absolute left-1/2 top-0 transform -translate-x-1/2 w-[2px] bg-gradient-to-t from-stone-800 to-transparent overflow-hidden flex items-center justify-center" style={{ top: '40px', height: '140px', transform: 'translate(-50%, -120px) translateX(12px)' }}>
            <motion.div
              initial={{ y: 100, opacity: 1 }}
              animate={{ y: -100, opacity: 1 }}
              transition={{ duration: 1.5, repeat: Infinity, repeatType: "loop", ease: "linear" }}
                  className="w-2 h-4 bg-green-500 rounded-full shadow-[0_0_8px_rgba(74,222,128,0.8)]"
            />
          </div>

          {/* Mirrored Flow Connector from Hub Décisionnel down (symmetric) */}
          <div className="absolute left-1/2 top-0 transform -translate-x-1/2 w-[2px] bg-gradient-to-b from-stone-800 to-transparent overflow-hidden flex items-center justify-center" style={{ top: '40px', height: '140px', transform: 'translate(-50%, -120px) translateX(-12px)' }}>
            <motion.div
              initial={{ y: -100, opacity: 1 }}
              animate={{ y: 100, opacity: 1 }}
              transition={{ duration: 1.5, repeat: Infinity, repeatType: "loop", ease: "linear" }}
                  className="w-2 h-4 bg-green-500 rounded-full shadow-[0_0_8px_rgba(74,222,128,0.8)]"
            />
          </div>

          <h3 className="text-xl md:text-2xl font-light text-stone-400 mb-8 border-l-2 border-green-500/50 pl-4">{layer2.title}</h3>

          {/* Decision Hub Container with nested analyses */}
          {layer2.decision && (
            <div className="relative overflow-x-auto pb-8 -mx-6 px-6 md:overflow-visible md:pb-0 md:px-0">
              <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 min-h-[140px] flex flex-col justify-center relative group transition-all duration-500">
                {/* Hub Décisionnel Badge */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#0a0a0a] px-3 py-1 text-[10px] text-white uppercase tracking-widest border border-white/10 rounded-full">
                  Hub Décisionnel
                </div>

                {/* Decision Title and Description */}
                <div className="mb-6 text-center">
                  <h4 className="text-lg font-medium text-white mb-2">{layer2.decision.title}</h4>
                  <p className="text-sm text-stone-400 leading-relaxed max-w-2xl mx-auto">{layer2.decision.desc}</p>
                </div>

                {/* Nested Analyses */}
                {layer2.analyses && (
                  <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4 min-w-0">
                    {layer2.analyses.map((analysis: any, i: number) => (
                      <div key={i} className="flex-1">
                        <div className="p-6 rounded-xl bg-white/[0.03] border border-white/10 min-h-[120px] flex flex-col justify-center transition-all duration-500 hover:bg-white/[0.05]">
                          <h4 className="text-base font-medium text-stone-200 mb-2">{analysis.title}</h4>
                          <p className="text-xs text-stone-400 leading-relaxed">{analysis.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </motion.div>

        {/* Layer 3: Safety Foundation */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-24 pt-12 border-t border-white/10"
        >
          <div className="flex flex-col lg:flex-row gap-12 items-start">
            <div className="lg:w-1/3">
              <h3 className="text-xl md:text-2xl font-light text-stone-400 mb-4 border-l-2 border-green-500/50 pl-4">{layer3.title}</h3>
              <p className="text-stone-500 max-w-sm">{layer3.description}</p>
            </div>

            <div className="lg:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
              {layer3.features.map((feature: any, i: number) => (
                <div key={i} className="p-6 rounded-2xl bg-white/[0.03] border border-white/5 flex gap-4 items-start">
                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center shrink-0 text-stone-300">
                    {i === 0 ? <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                      : <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                  </div>
                  <div>
                    <h4 className="text-white font-medium mb-1">{feature.title}</h4>
                    <p className="text-sm text-stone-500 leading-relaxed">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

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
