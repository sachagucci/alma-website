'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { X } from 'lucide-react'
import Link from 'next/link'
import { LanguageProvider, useLanguage } from '@/contexts/LanguageContext'

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

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value)
}

function formatNumber(value: number): string {
  return new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(value)
}

type Scenario = 'conservative' | 'projected' | 'optimistic'

const REDUCTION_RATES: Record<Scenario, number> = {
  conservative: 0.30,
  projected: 0.40,
  optimistic: 0.50,
}

const OPERATING_WEEKS = 46
const APPOINTMENT_HOURS = 0.5

function Slider({ label, value, min, max, step, onChange, formatValue }: {
  label: string
  value: number
  min: number
  max: number
  step: number
  onChange: (v: number) => void
  formatValue: (v: number) => string
}) {
  const percentage = ((value - min) / (max - min)) * 100

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-stone-700">{label}</span>
        <input
          type="number"
          value={value}
          min={min}
          step={step}
          onChange={(e) => {
            const v = Number(e.target.value)
            if (!isNaN(v) && v >= min) onChange(v)
          }}
          className="text-sm font-semibold text-stone-900 bg-stone-100 px-3 py-1 rounded-lg w-24 text-right border-0 focus:ring-1 focus:ring-stone-300 focus:outline-none"
        />
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={Math.min(value, max)}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-2 rounded-full appearance-none cursor-pointer slider-input"
        style={{
          background: `linear-gradient(to right, #f97316 0%, #f59e0b ${Math.min(percentage, 100)}%, #e7e5e4 ${Math.min(percentage, 100)}%, #e7e5e4 100%)`,
        }}
      />
    </div>
  )
}

function ContactModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const { t } = useLanguage()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)

    const FORM_URL = 'https://docs.google.com/forms/d/e/1FAIpQLSdWiULvkdR5G6VVJ8E_Lm02AiL8xWpGgYfg3PYIEij3VIC4lw/formResponse'
    const formData = new FormData()
    formData.append('entry.667944917', email)

    try {
      await fetch(FORM_URL, { method: 'POST', mode: 'no-cors', body: formData })
    } catch (error) {
      console.error('Form submission error:', error)
    }

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
          <div className="p-4 bg-stone-50 text-stone-600 rounded-lg text-center text-sm">
            {t.contact.success}
          </div>
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
            <button
              type="submit"
              className="w-full py-3 bg-stone-900 text-white font-medium rounded-lg hover:bg-black text-sm"
            >
              {t.contact.submit}
            </button>
          </form>
        )}
      </motion.div>
    </>
  )
}

function CalculatorContent() {
  const { lang, setLang, t, mounted } = useLanguage()
  const tc = t.calculator
  const [isContactOpen, setIsContactOpen] = useState(false)

  const [doctors, setDoctors] = useState(3)
  const [visitsPerYear, setVisitsPerYear] = useState(5000)
  const [noShowRate, setNoShowRate] = useState(8)
  const [costPerNoShow, setCostPerNoShow] = useState(195)
  const [scenario, setScenario] = useState<Scenario>('projected')

  if (!mounted) return null

  const reductionRate = REDUCTION_RATES[scenario]

  // Calculations — Without Mia
  const totalAnnualVisits = doctors * visitsPerYear
  const totalNoShows = Math.round(totalAnnualVisits * (noShowRate / 100))
  const annualRevenueLost = totalNoShows * costPerNoShow
  const wastedHours = totalNoShows * APPOINTMENT_HOURS

  // Calculations — With Mia
  const noShowsPrevented = Math.round(totalNoShows * reductionRate)
  const revenueRecovered = noShowsPrevented * costPerNoShow
  const hoursReclaimed = noShowsPrevented * APPOINTMENT_HOURS

  return (
    <div className="min-h-screen text-stone-900" style={{ background: '#FAF9F7' }}>
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-stone-100">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center">
            <img src="/images/logo_alma-noir_2.png" alt="Alma" className="h-16" />
          </Link>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setLang(lang === 'fr' ? 'en' : 'fr')}
              className="px-3 py-1.5 text-sm text-stone-600 hover:text-stone-900"
            >
              {lang === 'fr' ? 'EN' : 'FR'}
            </button>
            <div className="p-[2px] rounded-lg bg-gradient-to-br from-orange-500/35 via-amber-500/35 to-orange-400/35">
              <button
                onClick={() => setIsContactOpen(true)}
                className="px-5 py-2.5 text-sm bg-white text-stone-900 rounded-[6px] hover:bg-stone-50 transition-colors font-medium w-full"
              >
                {t.nav.demo}
              </button>
            </div>
          </div>
        </div>
      </nav>

      <ContactModal isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />

      <main className="pt-24 pb-8 px-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <FadeIn>
            <h1 className="text-3xl md:text-4xl font-light tracking-tight text-center mb-3">
              {tc.title}{' '}
              <span className="bg-gradient-to-r from-orange-500 via-amber-500 to-orange-400 bg-clip-text text-transparent">
                {tc.titleHighlight}
              </span>
            </h1>
            <p className="text-stone-500 text-center mb-8 max-w-2xl mx-auto text-sm leading-relaxed">
              {tc.subtitle}
            </p>
          </FadeIn>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Left: Inputs */}
            <FadeIn delay={0.1}>
              <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm">
                <h3 className="text-base font-medium text-stone-900 mb-6">{tc.inputsTitle}</h3>
                <div className="space-y-6">
                  <Slider
                    label={tc.doctors}
                    value={doctors}
                    min={1}
                    max={50}
                    step={1}
                    onChange={setDoctors}
                    formatValue={(v) => String(v)}
                  />
                  <Slider
                    label={tc.visitsPerYear}
                    value={visitsPerYear}
                    min={2000}
                    max={8000}
                    step={100}
                    onChange={setVisitsPerYear}
                    formatValue={(v) => formatNumber(v)}
                  />
                  <Slider
                    label={tc.noShowRate}
                    value={noShowRate}
                    min={5}
                    max={25}
                    step={1}
                    onChange={setNoShowRate}
                    formatValue={(v) => `${v}%`}
                  />
                  <Slider
                    label={tc.costPerNoShow}
                    value={costPerNoShow}
                    min={100}
                    max={500}
                    step={5}
                    onChange={setCostPerNoShow}
                    formatValue={(v) => formatCurrency(v)}
                  />
                </div>

                {/* Scenario Toggle — inline */}
                <div className="mt-6 pt-6 border-t border-stone-100">
                  <p className="text-sm font-medium text-stone-700 mb-3">{tc.scenarioLabel}</p>
                  <div className="grid grid-cols-3 gap-2">
                    {(['conservative', 'projected', 'optimistic'] as Scenario[]).map((s) => (
                      <button
                        key={s}
                        onClick={() => setScenario(s)}
                        className={`px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                          scenario === s
                            ? ''
                            : 'bg-stone-50 text-stone-600 hover:bg-stone-100 border border-transparent'
                        }`}
                        style={scenario === s ? {
                          background: 'linear-gradient(#fff, #fff) padding-box, linear-gradient(135deg, rgba(249,115,22,0.5), rgba(245,158,11,0.5), rgba(251,146,60,0.5)) border-box',
                          border: '1px solid transparent',
                        } : {}}
                      >
                        <div className={scenario === s ? 'text-stone-900' : ''}>{tc[s]}</div>
                        <div className={`text-xs mt-0.5 ${scenario === s ? 'text-orange-600' : 'text-stone-400'}`}>
                          {Math.round(REDUCTION_RATES[s] * 100)}%
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Assumptions as footnotes */}
                <div className="mt-5 pt-4 border-t border-stone-100 text-xs text-stone-400">
                  <p>* {tc.operatingWeeks}: {OPERATING_WEEKS}{tc.perYear}</p>
                </div>
              </div>
            </FadeIn>

            {/* Right: Results */}
            <FadeIn delay={0.2}>
              <div className="space-y-6">
                {/* Without Mia */}
                <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm">
                  <h3 className="text-base font-medium mb-5 text-stone-500">{tc.withoutMia}</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-stone-500 text-sm">{tc.totalAnnualVisits}</span>
                      <span className="text-stone-900 font-medium">{formatNumber(totalAnnualVisits)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-stone-500 text-sm">{tc.totalNoShows}</span>
                      <span className="text-stone-900 font-medium">{formatNumber(totalNoShows)}</span>
                    </div>
                    <div className="h-px bg-stone-100" />
                    <div className="flex justify-between items-center">
                      <span className="text-stone-700 font-medium text-sm">{tc.annualRevenueLost}</span>
                      <span className="text-xl font-semibold text-red-500">{formatCurrency(annualRevenueLost)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-stone-500 text-sm">{tc.wastedHours} <span className="text-stone-400">({tc.assumingMin})</span></span>
                      <span className="text-stone-900 font-medium">{formatNumber(wastedHours)} hrs</span>
                    </div>
                  </div>
                </div>

                {/* With Mia */}
                <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm">
                  <h3 className="text-base font-medium mb-5 text-stone-500">{tc.withMia}</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-stone-500 text-sm">{tc.noShowsPrevented}</span>
                      <span className="text-stone-900 font-medium">{formatNumber(noShowsPrevented)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-stone-500 text-sm">{tc.hoursReclaimed}</span>
                      <span className="text-stone-900 font-medium">{formatNumber(hoursReclaimed)} hrs</span>
                    </div>
                    <div className="h-px bg-stone-100" />
                    <div className="flex justify-between items-center">
                      <span className="text-stone-700 font-medium text-sm">{tc.revenueRecovered}</span>
                      <motion.span
                        key={revenueRecovered}
                        initial={{ scale: 1.05 }}
                        animate={{ scale: 1 }}
                        className="text-2xl font-semibold bg-gradient-to-r from-orange-500 via-amber-500 to-orange-400 bg-clip-text text-transparent"
                      >
                        {formatCurrency(revenueRecovered)}
                      </motion.span>
                    </div>
                  </div>
                </div>

                {/* CTA */}
                <div className="text-center pt-2">
                  <p className="text-stone-500 text-sm mb-4">{tc.ctaTitle}</p>
                  <button
                    onClick={() => setIsContactOpen(true)}
                    className="group relative px-8 py-4 rounded-2xl text-stone-900 font-medium transition-all duration-300 flex items-center justify-center gap-2 backdrop-blur-2xl overflow-hidden hover:scale-[1.02] active:scale-[0.98] mx-auto"
                    style={{
                      background: 'linear-gradient(180deg, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0.35) 50%, rgba(255,255,255,0.45) 100%)',
                      boxShadow: '0 0.5px 0 0 rgba(255,255,255,0.9) inset, 0 -0.5px 0 0 rgba(0,0,0,0.05) inset, 0 2px 8px rgba(0,0,0,0.1), 0 10px 28px rgba(0,0,0,0.1)',
                      border: '0.5px solid rgba(255,255,255,0.6)',
                    }}
                  >
                    <span className="relative z-10">{tc.ctaButton}</span>
                    <div className="absolute inset-x-0 top-0 h-[50%] rounded-t-2xl pointer-events-none" style={{
                      background: 'linear-gradient(180deg, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0) 100%)',
                    }} />
                  </button>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-stone-200">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-stone-600 text-sm">{t.footer.tagline}</p>
            <div className="flex items-center gap-6 text-sm text-stone-500">
              <span>{t.footer.address}</span>
            </div>
          </div>
          <p className="text-center text-stone-400 text-xs mt-6">{t.footer.copyright}</p>
        </div>
      </footer>

      {/* Slider custom styles */}
      <style jsx global>{`
        .slider-input::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: white;
          border: 2px solid #f97316;
          cursor: pointer;
          box-shadow: 0 1px 4px rgba(0,0,0,0.15);
          transition: transform 0.15s ease;
        }
        .slider-input::-webkit-slider-thumb:hover {
          transform: scale(1.15);
        }
        .slider-input::-webkit-slider-thumb:active {
          transform: scale(0.95);
        }
        .slider-input::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: white;
          border: 2px solid #f97316;
          cursor: pointer;
          box-shadow: 0 1px 4px rgba(0,0,0,0.15);
        }
        input[type="number"]::-webkit-inner-spin-button,
        input[type="number"]::-webkit-outer-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        input[type="number"] {
          -moz-appearance: textfield;
        }
      `}</style>
    </div>
  )
}

export default function CalculatorPage() {
  return (
    <LanguageProvider>
      <CalculatorContent />
    </LanguageProvider>
  )
}
