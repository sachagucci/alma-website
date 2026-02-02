'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { ArrowRight, X, Play, Clock, Shield } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { useLanguage } from '@/hooks/useLanguage'

// Fade-in animation wrapper with scroll fade
function FadeIn({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// Video Component (YC video, medium size)
function VideoEmbed({ hint }: { hint: string }) {
  const [isPlaying, setIsPlaying] = useState(false)
  const videoId = 'hAKf6JWSCL4'

  return (
    <div className="max-w-4xl mx-auto">
      <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-stone-100 group cursor-pointer shadow-lg" onClick={() => setIsPlaying(true)}>
        {isPlaying ? (
          <iframe
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
            title="Alma Demo"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 w-full h-full"
          />
        ) : (
          <>
            <Image
              src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`}
              alt="Video thumbnail"
              fill
              className="object-cover"
              unoptimized
            />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-white/95 flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                <Play className="w-6 h-6 text-stone-900 ml-1" fill="currentColor" />
              </div>
              <span className="mt-3 text-white text-sm font-medium">{hint}</span>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

// Contact Modal
function ContactModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const { t } = useLanguage()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => {
      setSubmitted(false)
      setEmail('')
      onClose()
    }, 2000)
  }

  if (!isOpen) return null

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-[60] bg-white/80 backdrop-blur-sm"
      />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[70] w-full max-w-sm p-8 bg-white border border-stone-200 shadow-2xl rounded-2xl"
      >
        <button onClick={onClose} className="absolute right-4 top-4 p-2 text-stone-400 hover:text-stone-900">
          <X className="w-5 h-5" />
        </button>
        <h3 className="text-xl font-medium text-stone-900 mb-2">{t.contact.title}</h3>
        <p className="text-stone-500 text-sm mb-6">{t.contact.description}</p>
        {submitted ? (
          <div className="p-4 bg-stone-50 text-stone-600 rounded-lg text-center text-sm">{t.contact.success}</div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t.contact.placeholder}
              className="w-full px-4 py-3 bg-stone-50 border-0 rounded-lg text-stone-900 placeholder:text-stone-400 focus:ring-1 focus:ring-stone-900 text-sm"
            />
            <button type="submit" className="w-full py-3 bg-stone-900 text-white font-medium rounded-lg hover:bg-black text-sm">
              {t.contact.submit}
            </button>
          </form>
        )}
      </motion.div>
    </>
  )
}

// Navigation (no sign in button)
function Navigation({ onContactClick }: { onContactClick: () => void }) {
  const { lang, setLang, t } = useLanguage()

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-stone-100">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="text-xl font-medium text-stone-900">
          Alma
        </Link>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setLang(lang === 'fr' ? 'en' : 'fr')}
            className="px-3 py-1.5 text-sm text-stone-600 hover:text-stone-900"
          >
            {lang === 'fr' ? 'EN' : 'FR'}
          </button>
          <button
            onClick={onContactClick}
            className="px-5 py-2.5 text-sm bg-stone-900 text-white rounded-lg hover:bg-black transition-colors"
          >
            {t.nav.demo}
          </button>
        </div>
      </div>
    </nav>
  )
}

// Hero Section with Video
function HeroSection({ onContactClick }: { onContactClick: () => void }) {
  const { t } = useLanguage()

  return (
    <section className="pt-28 pb-16 px-6">
      <div className="max-w-5xl mx-auto">
        <FadeIn>
          <h1 className="text-4xl md:text-5xl font-light tracking-tight text-center mb-6">
            <span className="bg-gradient-to-r from-orange-500 via-amber-500 to-orange-400 bg-clip-text text-transparent">
              {t.hero.title}
            </span>
          </h1>
        </FadeIn>

        <FadeIn delay={0.1}>
          <p className="text-stone-500 text-center mb-10 max-w-3xl mx-auto leading-relaxed">
            {t.hero.subtitle}
          </p>
        </FadeIn>

        <FadeIn delay={0.2}>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-14">
            <button className="px-8 py-4 bg-stone-900 text-white font-medium rounded-xl hover:bg-black transition-colors flex items-center justify-center gap-2">
              {t.hero.ctaPrimary}
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={onContactClick}
              className="px-8 py-4 border border-stone-300 text-stone-700 font-medium rounded-xl hover:border-stone-400 transition-colors"
            >
              {t.hero.ctaSecondary}
            </button>
          </div>
        </FadeIn>

        <FadeIn delay={0.3}>
          <VideoEmbed hint={t.hero.videoHint} />
        </FadeIn>
      </div>
    </section>
  )
}

// Comparison Section (Perfectly.so style)
function ComparisonSection() {
  const { t } = useLanguage()

  return (
    <section className="py-24 px-6 bg-stone-50">
      <div className="max-w-6xl mx-auto">
        {/* Badge */}
        <FadeIn>
          <div className="flex justify-center mb-8">
            <span className="px-4 py-2 bg-stone-200/50 text-stone-600 text-sm font-medium rounded-full border border-stone-200">
              Why choose us
            </span>
          </div>
        </FadeIn>

        {/* Title */}
        <FadeIn>
          <div className="text-center mb-4">
            <h2 className="text-4xl md:text-5xl font-light tracking-tight">
              Clinic operations in the{' '}
              <span className="bg-gradient-to-r from-orange-500 via-amber-500 to-orange-400 bg-clip-text text-transparent">
                AI Age
              </span>.
            </h2>
          </div>
        </FadeIn>

        {/* Subtitle */}
        <FadeIn delay={0.1}>
          <p className="text-stone-500 text-center mb-16 max-w-2xl mx-auto">
            {t.comparison.intro}
          </p>
        </FadeIn>

        {/* Two-card comparison */}
        <div className="grid md:grid-cols-2 gap-8 items-stretch">
          {/* Left card - Dark */}
          <FadeIn delay={0.2}>
            <div className="bg-gradient-to-br from-stone-900 to-stone-800 rounded-3xl p-10 text-white h-full flex flex-col">
              <h3 className="text-3xl md:text-4xl font-light mb-10">{t.comparison.traditional.title}</h3>
              <div className="space-y-6 flex-1">
                {t.comparison.traditional.items.map((item: any, i: number) => (
                  <div key={i} className="flex items-start gap-4">
                    <span className="text-white/60 mt-1 text-lg">✕</span>
                    <p className="text-white/90 text-base leading-relaxed">
                      <span className="font-medium text-white">{item.highlight}</span> {item.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>

          {/* Right card - Orange gradient */}
          <FadeIn delay={0.3}>
            <div className="bg-gradient-to-br from-orange-500 via-amber-500 to-rose-500 rounded-3xl p-10 text-white h-full flex flex-col">
              <h3 className="text-3xl md:text-4xl font-light mb-10">{t.comparison.alma.title}</h3>
              <div className="space-y-6 flex-1">
                {t.comparison.alma.items.map((item: any, i: number) => (
                  <div key={i} className="flex items-start gap-4">
                    <span className="text-white mt-1 text-lg">✓</span>
                    <p className="text-white/95 text-base leading-relaxed">
                      <span className="font-medium text-white">{item.highlight}</span> {item.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  )
}

// Mia Section (Carousel style)
function MiaSection() {
  const { t } = useLanguage()
  const [activeIndex, setActiveIndex] = useState(0)
  const features = t.mia.features

  const goNext = () => {
    setActiveIndex((prev) => (prev + 1) % features.length)
  }

  const goPrev = () => {
    setActiveIndex((prev) => (prev - 1 + features.length) % features.length)
  }

  // Get positions: center, left, right, hidden
  const getPosition = (index: number) => {
    const diff = (index - activeIndex + features.length) % features.length
    if (diff === 0) return 'center'
    if (diff === 1) return 'right'
    if (diff === features.length - 1) return 'left'
    return 'hidden'
  }

  return (
    <section className="py-24 px-6 overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <FadeIn>
          <div className="text-center mb-16">
            <div className="flex justify-center mb-8">
              <span className="px-4 py-2 bg-stone-200/50 text-stone-600 text-sm font-medium rounded-full border border-stone-200">
                {t.mia.role}
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-light tracking-tight mb-4">
              <span className="bg-gradient-to-r from-orange-500 via-amber-500 to-orange-400 bg-clip-text text-transparent">
                {t.mia.headline}
              </span>
            </h2>
            <p className="text-stone-500 max-w-2xl mx-auto">
              {t.mia.subheadline}
            </p>
          </div>
        </FadeIn>

        {/* Carousel */}
        <div className="relative h-[400px] flex items-center justify-center">
          {/* Navigation arrows */}
          <button
            onClick={goPrev}
            className="absolute left-4 md:left-8 z-20 w-12 h-12 rounded-full bg-white shadow-lg border border-stone-200 flex items-center justify-center hover:bg-stone-50 transition-colors"
          >
            <svg className="w-5 h-5 text-stone-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={goNext}
            className="absolute right-4 md:right-8 z-20 w-12 h-12 rounded-full bg-white shadow-lg border border-stone-200 flex items-center justify-center hover:bg-stone-50 transition-colors"
          >
            <svg className="w-5 h-5 text-stone-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Cards */}
          <div className="relative w-full max-w-lg mx-auto h-full">
            {features.map((feature: any, index: number) => {
              const position = getPosition(index)

              return (
                <motion.div
                  key={index}
                  animate={{
                    x: position === 'center' ? 0 : position === 'left' ? -180 : position === 'right' ? 180 : 0,
                    scale: position === 'center' ? 1 : 0.85,
                    opacity: position === 'hidden' ? 0 : 1,
                    zIndex: position === 'center' ? 10 : 1,
                  }}
                  transition={{ duration: 0.5, ease: 'easeInOut' }}
                  className={`absolute inset-0 rounded-3xl p-10 flex flex-col justify-between
                    ${position === 'center'
                      ? 'bg-gradient-to-br from-orange-500 via-amber-500 to-rose-500 text-white shadow-2xl'
                      : 'bg-white border border-stone-200 shadow-lg'
                    }`}
                  style={{
                    filter: position === 'center' ? 'none' : 'blur(2px)',
                  }}
                >
                  <div>
                    <h3 className={`text-2xl md:text-3xl font-light mb-4 ${position === 'center' ? 'text-white' : 'text-stone-300'}`}>
                      {feature.title}
                    </h3>
                    <p className={`text-lg leading-relaxed ${position === 'center' ? 'text-white/90' : 'text-stone-200'}`}>
                      {feature.desc}
                    </p>
                  </div>
                  {position === 'center' && (
                    <div className="flex items-center gap-2 mt-6">
                      <div className="w-3 h-3 rounded-full bg-white/80 animate-pulse" />
                      <span className="text-white/80 text-sm">Active</span>
                    </div>
                  )}
                </motion.div>
              )
            })}
          </div>
        </div>

        {/* Dots indicator */}
        <div className="flex justify-center gap-2 mt-8">
          {features.map((_: any, index: number) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`w-2 h-2 rounded-full transition-all ${index === activeIndex
                ? 'bg-orange-500 w-6'
                : 'bg-stone-300 hover:bg-stone-400'
                }`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

// Thousand Receptionists Section (Perfectly.so style)
function ThousandReceptionistsSection() {
  const { t } = useLanguage()
  const [activeStep, setActiveStep] = useState(0) // Start with Predictive Analysis

  return (
    <section className="py-24 px-6 bg-stone-50">
      <div className="max-w-6xl mx-auto">
        {/* Badge */}
        <FadeIn>
          <div className="flex justify-center mb-8">
            <span className="px-4 py-2 bg-stone-200/50 text-stone-600 text-sm font-medium rounded-full border border-stone-200">
              Our Process
            </span>
          </div>
        </FadeIn>

        {/* Title */}
        <FadeIn>
          <div className="text-center mb-4">
            <h2 className="text-4xl md:text-5xl font-light tracking-tight">
              A{' '}
              <span className="bg-gradient-to-r from-orange-500 via-amber-500 to-orange-400 bg-clip-text text-transparent">
                thousand receptionists
              </span>, in your palm.
            </h2>
          </div>
        </FadeIn>

        {/* Subtitle */}
        <FadeIn delay={0.1}>
          <p className="text-stone-500 text-center mb-16 max-w-xl mx-auto">
            {t.thousandReceptionists.subtitle}
          </p>
        </FadeIn>

        {/* Main content: Steps on left, Image + description on right */}
        <FadeIn delay={0.2}>
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            {/* Left: Vertical step list */}
            <div className="space-y-4">
              {t.thousandReceptionists.steps.map((step: any, i: number) => (
                <button
                  key={i}
                  onClick={() => setActiveStep(i)}
                  className={`w-full text-left px-6 py-5 rounded-xl transition-all duration-300 ${activeStep === i
                    ? 'bg-white border border-stone-200 shadow-sm'
                    : 'bg-transparent hover:bg-white/50'
                    }`}
                >
                  <span className="text-3xl md:text-4xl font-light text-stone-400 tracking-tight">
                    {step.title}
                    <sup className="text-sm ml-2 text-stone-400">{step.number}</sup>
                  </span>
                </button>
              ))}
            </div>

            {/* Right: Image + description */}
            <div>
              {/* Image */}
              <div className="relative mb-6">
                <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-lg">
                  <Image
                    src="/images/process-abstract.jpg"
                    alt="Mia AI Receptionist"
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
              </div>

              {/* Active step description */}
              <motion.div
                key={activeStep}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <h3 className="text-xl font-semibold text-stone-900 mb-2">
                  {t.thousandReceptionists.steps[activeStep].title}
                </h3>
                <p className="text-stone-600 leading-relaxed">
                  {t.thousandReceptionists.steps[activeStep].description}
                </p>
              </motion.div>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  )
}

// How It Works Section (Interactive Timeline)
function HowItWorksSection() {
  const { t } = useLanguage()
  const [activeStep, setActiveStep] = useState(0)

  return (
    <section className="py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <FadeIn>
          <h2 className="text-4xl md:text-5xl font-semibold text-stone-900 text-center mb-16">
            {t.howItWorks.title}
          </h2>
        </FadeIn>

        <FadeIn delay={0.1}>
          <div className="grid md:grid-cols-2 gap-12 items-start">
            {/* Timeline Navigation */}
            <div className="space-y-2">
              {t.howItWorks.steps.map((step: any, i: number) => (
                <button
                  key={i}
                  onClick={() => setActiveStep(i)}
                  className={`w-full text-left p-5 rounded-xl transition-all duration-300 ${activeStep === i
                    ? 'bg-gradient-to-r from-orange-500/90 to-amber-500/90 text-white shadow-lg backdrop-blur-sm'
                    : 'bg-stone-50 text-stone-600 hover:bg-stone-100'
                    }`}
                >
                  <div className="flex items-center gap-4">
                    <span className={`text-sm font-semibold px-3 py-1 rounded-full ${activeStep === i
                      ? 'bg-white/20 text-white'
                      : 'bg-stone-200 text-stone-600'
                      }`}>
                      {step.time}
                    </span>
                    <span className="font-medium">{step.title}</span>
                  </div>
                </button>
              ))}
            </div>

            {/* Active Step Content */}
            <div className="bg-stone-50 rounded-2xl p-8 border border-stone-200 min-h-[280px]">
              <motion.div
                key={activeStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                <span className="inline-block text-sm font-semibold px-4 py-2 rounded-full bg-orange-100 text-orange-600 mb-6">
                  {t.howItWorks.steps[activeStep].time}
                </span>
                <h3 className="text-2xl font-semibold text-stone-900 mb-4">
                  {t.howItWorks.steps[activeStep].title}
                </h3>
                <p className="text-stone-600 leading-relaxed text-lg">
                  {t.howItWorks.steps[activeStep].desc}
                </p>
              </motion.div>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  )
}

// Mission/Founders Section (smaller image)
function MissionSection() {
  const { t } = useLanguage()

  return (
    <section className="py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <FadeIn>
          <h2 className="text-4xl md:text-5xl font-light text-stone-900 text-center mb-16">
            {t.mission.title}{' '}
            <span className="bg-gradient-to-r from-orange-500 via-amber-500 to-orange-400 bg-clip-text text-transparent">
              {t.mission.titleCare}
            </span>
          </h2>
        </FadeIn>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Photo (smaller) */}
          <FadeIn delay={0.1}>
            <div className="relative max-w-sm mx-auto lg:mx-0">
              <div className="aspect-[4/5] relative rounded-2xl overflow-hidden border border-stone-200 shadow-sm">
                <Image
                  src="/images/founders.png"
                  alt="Sacha & Mathéo"
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
              <div className="flex justify-between mt-4 px-2 text-sm text-stone-600">
                <span>{t.mission.sachaName}</span>
                <span>{t.mission.matheoName}</span>
              </div>
            </div>
          </FadeIn>

          {/* Quote */}
          <FadeIn delay={0.2}>
            <div className="space-y-6">
              <blockquote className="text-stone-600 leading-relaxed whitespace-pre-line text-base">
                {t.mission.quote}
              </blockquote>
              <p className="text-stone-900 font-medium">{t.mission.attribution}</p>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  )
}

// Impact Section (white background, lower in page, smaller asterisk)
function ImpactSection() {
  const { t } = useLanguage()

  return (
    <section className="py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <FadeIn>
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-light text-stone-900 mb-2">{t.impact.title}</h2>
            <p className="text-stone-500 text-xs">{t.impact.asterisk}</p>
          </div>
        </FadeIn>

        <div className="grid md:grid-cols-3 gap-8 items-stretch">
          {t.impact.stats.map((stat: any, i: number) => (
            <FadeIn key={i} delay={i * 0.1}>
              <div className="text-center p-8 bg-stone-50 rounded-2xl border border-stone-200 h-full flex flex-col justify-center">
                <span className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent whitespace-nowrap">
                  {stat.value}
                </span>
                <p className="text-stone-600 mt-3 text-sm">{stat.label}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  )
}

// CTA Section
function CTASection({ onContactClick }: { onContactClick: () => void }) {
  const { t } = useLanguage()

  return (
    <section className="py-24 px-6 bg-white">
      <div className="max-w-3xl mx-auto text-center">
        <FadeIn>
          <h2 className="text-4xl md:text-5xl font-light text-center mb-12">
            <span className="bg-gradient-to-r from-orange-500 via-amber-500 to-orange-400 bg-clip-text text-transparent">
              {t.cta.title}
            </span>
          </h2>
        </FadeIn>

        <FadeIn delay={0.1}>
          <div className="flex justify-center">
            <button className="px-8 py-4 bg-gradient-to-r from-orange-500 via-amber-500 to-orange-400 text-white font-medium rounded-xl hover:shadow-lg transition-all flex items-center justify-center gap-2">
              {t.cta.primary}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </FadeIn>
      </div>
    </section>
  )
}

// Footer
function Footer() {
  const { t } = useLanguage()

  return (
    <footer className="py-12 px-6 border-t border-stone-200">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-stone-600">{t.footer.tagline}</p>
          <div className="flex items-center gap-6 text-sm text-stone-500">
            <span>{t.footer.address}</span>
            <a href={`mailto:${t.footer.email}`} className="hover:text-stone-900">{t.footer.email}</a>
          </div>
        </div>
        <p className="text-center text-stone-400 text-sm mt-8">{t.footer.copyright}</p>
      </div>
    </footer>
  )
}

// Main Page
export default function AlmaLandingPage() {
  const { mounted } = useLanguage()
  const [isContactOpen, setIsContactOpen] = useState(false)

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-white text-stone-900">
      <Navigation onContactClick={() => setIsContactOpen(true)} />
      <ContactModal isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />

      <main>
        <HeroSection onContactClick={() => setIsContactOpen(true)} />
        <MiaSection />
        <ThousandReceptionistsSection />
        <ComparisonSection />
        <MissionSection />
        <CTASection onContactClick={() => setIsContactOpen(true)} />
      </main>

      <Footer />
    </div>
  )
}
