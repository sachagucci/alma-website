'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Phone, MessageSquare, Calendar, Clock, ArrowRight, Check, Menu, X } from 'lucide-react'

export default function HomePage() {
    const [openFaq, setOpenFaq] = useState<number | null>(null)
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const [scrolled, setScrolled] = useState(false)

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20)
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const features = [
        {
            icon: <Phone className="w-6 h-6" />,
            title: 'AI Voice Agent',
            description: 'Intelligent phone handling that answers calls, books appointments, and triages patients 24/7.'
        },
        {
            icon: <MessageSquare className="w-6 h-6" />,
            title: 'SMS Conversations',
            description: 'Automated text messaging for appointment reminders, follow-ups, and patient communication.'
        },
        {
            icon: <Calendar className="w-6 h-6" />,
            title: 'Smart Scheduling',
            description: 'Seamlessly integrates with your EMR to book, reschedule, and manage appointments.'
        },
        {
            icon: <Clock className="w-6 h-6" />,
            title: 'Save Staff Hours',
            description: 'Reduce administrative burden by automating routine tasks and letting your team focus on care.'
        }
    ]

    const howItWorks = [
        { step: '01', title: 'Connect', description: 'Integrate Alma with your clinic phone system and EMR in minutes.' },
        { step: '02', title: 'Configure', description: 'Customize your AI agent\'s personality, knowledge base, and workflows.' },
        { step: '03', title: 'Go Live', description: 'Start handling calls and messages automatically, 24 hours a day.' }
    ]

    const testimonials = [
        {
            quote: "Alma has transformed how we handle patient calls. Our staff can now focus on in-person care instead of being tied to the phone.",
            author: "Dr. Sarah Chen",
            role: "Family Medicine Clinic"
        },
        {
            quote: "The AI understands context beautifully. It handles appointment booking, rescheduling, and even basic triage questions flawlessly.",
            author: "Marc Dubois",
            role: "Clinic Administrator"
        },
        {
            quote: "We've reduced missed calls by 90% and our patients love the quick response times, even after hours.",
            author: "Dr. Emily Thompson",
            role: "Pediatric Practice"
        }
    ]

    const faqs = [
        {
            question: 'How does Alma integrate with my existing phone system?',
            answer: 'Alma connects via SIP trunking or call forwarding. We support most major phone systems and can typically get you set up within a day.'
        },
        {
            question: 'Is patient data secure?',
            answer: 'Absolutely. Alma is fully HIPAA compliant. All data is encrypted in transit and at rest, and we never store sensitive patient information longer than necessary.'
        },
        {
            question: 'Can I customize what the AI says?',
            answer: 'Yes! You can configure the AI\'s personality, name, greetings, and even teach it specific protocols for your practice. The agent adapts to your clinic\'s unique needs.'
        },
        {
            question: 'What happens if the AI can\'t handle a call?',
            answer: 'Alma knows when to escalate. Complex or urgent cases are flagged for callback, and you can set up warm transfers to your staff for specific situations.'
        },
        {
            question: 'How much does Alma cost?',
            answer: 'We offer flexible pricing based on call volume. Contact us for a customized quote that fits your clinic\'s size and needs.'
        }
    ]

    return (
        <div className="min-h-screen bg-[#FAFAFA]">
            {/* NAVBAR */}
            <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'glass border-b border-gray-200/30' : ''}`}>
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        {/* Logo */}
                        <Link href="/home" className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                                <span className="text-white text-base font-bold">A</span>
                            </div>
                            <span className="font-semibold text-lg tracking-tight text-gray-900">Alma</span>
                        </Link>

                        {/* Desktop Nav */}
                        <div className="hidden md:flex items-center gap-8">
                            <a href="#features" className="text-sm text-gray-600 hover:text-black transition-colors">Features</a>
                            <a href="#how-it-works" className="text-sm text-gray-600 hover:text-black transition-colors">How it Works</a>
                            <a href="#testimonials" className="text-sm text-gray-600 hover:text-black transition-colors">Testimonials</a>
                            <a href="#faq" className="text-sm text-gray-600 hover:text-black transition-colors">FAQ</a>
                        </div>

                        {/* CTA + Mobile Menu */}
                        <div className="flex items-center gap-4">
                            <Link
                                href="/login"
                                className="hidden md:block text-sm font-medium text-gray-600 hover:text-black transition-colors"
                            >
                                Sign In
                            </Link>
                            <Link
                                href="#contact"
                                className="hidden md:flex items-center gap-2 bg-black text-white text-sm font-medium px-4 py-2 rounded-full hover:bg-gray-800 transition-colors"
                            >
                                Get Started
                                <ArrowRight className="w-4 h-4" />
                            </Link>

                            {/* Mobile Menu Button */}
                            <button
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                className="md:hidden p-2 rounded-lg hover:bg-black/5 transition-colors"
                            >
                                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>

                    {/* Mobile Menu */}
                    <AnimatePresence>
                        {mobileMenuOpen && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="md:hidden mt-4 pb-4 border-t border-gray-200/50 pt-4"
                            >
                                <div className="flex flex-col gap-4">
                                    <a href="#features" className="text-sm text-gray-600 hover:text-black">Features</a>
                                    <a href="#how-it-works" className="text-sm text-gray-600 hover:text-black">How it Works</a>
                                    <a href="#testimonials" className="text-sm text-gray-600 hover:text-black">Testimonials</a>
                                    <a href="#faq" className="text-sm text-gray-600 hover:text-black">FAQ</a>
                                    <Link href="/login" className="text-sm text-gray-600 hover:text-black">Sign In</Link>
                                    <Link
                                        href="#contact"
                                        className="flex items-center justify-center gap-2 bg-black text-white text-sm font-medium px-4 py-2 rounded-full"
                                    >
                                        Get Started
                                        <ArrowRight className="w-4 h-4" />
                                    </Link>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </nav>

            {/* HERO SECTION */}
            <section className="pt-32 pb-20 px-6">
                <div className="max-w-4xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <p className="text-sm font-medium text-gray-500 mb-4 uppercase tracking-wide">
                            The AI Receptionist for Healthcare
                        </p>
                        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 tracking-tight leading-[1.1] mb-6">
                            Your clinic never
                            <br />
                            <span className="bg-gradient-to-r from-gray-900 via-gray-600 to-gray-400 bg-clip-text text-transparent">
                                misses a call
                            </span>
                        </h1>
                        <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-10 leading-relaxed">
                            Alma is an AI-powered voice agent that handles patient calls, books appointments,
                            and manages communications — so your team can focus on care.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link
                                href="#contact"
                                className="flex items-center gap-2 bg-black text-white text-base font-medium px-6 py-3 rounded-full hover:bg-gray-800 transition-colors group"
                            >
                                Request a Demo
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <Link
                                href="#how-it-works"
                                className="flex items-center gap-2 text-base font-medium text-gray-600 hover:text-black transition-colors"
                            >
                                See How it Works
                            </Link>
                        </div>
                    </motion.div>
                </div>

                {/* Social Proof */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.6 }}
                    className="max-w-3xl mx-auto mt-16 text-center"
                >
                    <p className="text-sm text-gray-400 mb-6">Trusted by clinics across North America</p>
                    <div className="flex items-center justify-center gap-8 opacity-50">
                        {['Clinic A', 'Clinic B', 'Clinic C', 'Clinic D'].map((name) => (
                            <div key={name} className="text-lg font-semibold text-gray-400">{name}</div>
                        ))}
                    </div>
                </motion.div>
            </section>

            {/* FEATURES SECTION */}
            <section id="features" className="py-20 px-6">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight mb-4">
                            Everything your front desk needs
                        </h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Alma handles the repetitive tasks so your staff can focus on what matters most.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {features.map((feature, i) => (
                            <motion.div
                                key={feature.title}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1, duration: 0.5 }}
                                viewport={{ once: true }}
                                className="glass-card p-8 rounded-[2rem] hover:shadow-lg transition-shadow group"
                            >
                                <div className="w-12 h-12 bg-black/5 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-black/10 transition-colors">
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* HOW IT WORKS */}
            <section id="how-it-works" className="py-20 px-6 bg-white">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight mb-4">
                            Up and running in no time
                        </h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Getting started with Alma is simple. We'll have you live in less than a week.
                        </p>
                    </div>

                    <div className="space-y-8">
                        {howItWorks.map((item, i) => (
                            <motion.div
                                key={item.step}
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.15, duration: 0.5 }}
                                viewport={{ once: true }}
                                className="flex items-start gap-6"
                            >
                                <div className="w-16 h-16 bg-black text-white rounded-2xl flex items-center justify-center flex-shrink-0">
                                    <span className="text-xl font-bold">{item.step}</span>
                                </div>
                                <div className="pt-2">
                                    <h3 className="text-xl font-bold text-gray-900 mb-1">{item.title}</h3>
                                    <p className="text-gray-600">{item.description}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* TESTIMONIALS */}
            <section id="testimonials" className="py-20 px-6">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight mb-4">
                            Loved by healthcare teams
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {testimonials.map((testimonial, i) => (
                            <motion.div
                                key={testimonial.author}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1, duration: 0.5 }}
                                viewport={{ once: true }}
                                className="glass-card p-8 rounded-[2rem]"
                            >
                                <div className="mb-6">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <span key={star} className="text-black">★</span>
                                    ))}
                                </div>
                                <p className="text-gray-700 leading-relaxed mb-6">"{testimonial.quote}"</p>
                                <div>
                                    <p className="font-bold text-gray-900">{testimonial.author}</p>
                                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FAQ */}
            <section id="faq" className="py-20 px-6 bg-white">
                <div className="max-w-3xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight mb-4">
                            Frequently asked questions
                        </h2>
                    </div>

                    <div className="space-y-4">
                        {faqs.map((faq, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                viewport={{ once: true }}
                                className="glass-card rounded-2xl overflow-hidden"
                            >
                                <button
                                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                                    className="w-full flex items-center justify-between p-6 text-left"
                                >
                                    <span className="font-semibold text-gray-900">{faq.question}</span>
                                    <ChevronDown
                                        className={`w-5 h-5 text-gray-400 transition-transform ${openFaq === i ? 'rotate-180' : ''}`}
                                    />
                                </button>
                                <AnimatePresence>
                                    {openFaq === i && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.2 }}
                                            className="overflow-hidden"
                                        >
                                            <p className="px-6 pb-6 text-gray-600 leading-relaxed">{faq.answer}</p>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA SECTION */}
            <section id="contact" className="py-20 px-6">
                <div className="max-w-3xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="glass-card p-12 rounded-[2rem] text-center"
                    >
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight mb-4">
                            Ready to transform your clinic?
                        </h2>
                        <p className="text-lg text-gray-600 mb-8 max-w-xl mx-auto">
                            Join the clinics already using Alma to save hours every day and never miss a patient call again.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link
                                href="mailto:hello@alma.ai"
                                className="flex items-center gap-2 bg-black text-white text-base font-medium px-6 py-3 rounded-full hover:bg-gray-800 transition-colors group"
                            >
                                Contact Sales
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <Link
                                href="/login"
                                className="flex items-center gap-2 text-base font-medium text-gray-600 hover:text-black transition-colors border border-gray-200 px-6 py-3 rounded-full hover:border-gray-300"
                            >
                                Sign In to Dashboard
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* FOOTER */}
            <footer className="py-12 px-6 border-t border-gray-200/50">
                <div className="max-w-6xl mx-auto">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="flex items-center gap-2">
                            <div className="w-7 h-7 bg-black rounded-lg flex items-center justify-center">
                                <span className="text-white text-sm font-bold">A</span>
                            </div>
                            <span className="font-semibold text-base tracking-tight text-gray-900">Alma</span>
                        </div>

                        <div className="flex items-center gap-8">
                            <a href="#features" className="text-sm text-gray-500 hover:text-black transition-colors">Features</a>
                            <a href="#how-it-works" className="text-sm text-gray-500 hover:text-black transition-colors">How it Works</a>
                            <a href="#faq" className="text-sm text-gray-500 hover:text-black transition-colors">FAQ</a>
                            <Link href="/login" className="text-sm text-gray-500 hover:text-black transition-colors">Sign In</Link>
                        </div>

                        <p className="text-sm text-gray-400">
                            © 2026 Alma. All rights reserved.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    )
}
