'use client'

import { useRouter } from 'next/navigation'
import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, ArrowLeft, Upload, Check, Building2, User, Bot, FileText, X, Loader2 } from 'lucide-react'
import { completeOnboardingWithData } from './actions'

type Step = 1 | 2 | 3

interface PersonalInfo {
    firstName: string
    lastName: string
    email: string
    password: string
    phone: string
}

interface CompanyInfo {
    name: string
    serviceType: string
    size: string
    regions: string
    description: string
}

interface UploadedFile {
    name: string
    base64: string
    fileType: string
    status: 'uploading' | 'done' | 'error'
}

const serviceTypes = ['Medical Clinic', 'Dental Practice', 'Wellness Center', 'Legal Office', 'Other']
const companySizes = ['Solo', '2-10 employees', '11-50 employees', '50+ employees']
const languages = ['English', 'French']

const personalities = [
    {
        id: 'professional',
        title: 'Professional',
        description: 'Efficient, formal, and precise. Handles inquiries with clarity and professionalism.',
        icon: '💼'
    },
    {
        id: 'friendly',
        title: 'Friendly',
        description: 'Warm and conversational. Approachable while efficiently handling requests.',
        icon: '😊'
    },
    {
        id: 'empathetic',
        title: 'Empathetic',
        description: 'Caring and patient. Shows genuine concern and provides supportive interactions.',
        icon: '💝'
    }
]

export default function OnboardingPage() {
    const router = useRouter()
    const [step, setStep] = useState<Step>(1)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    // Step 1: Personal Info
    const [personalInfo, setPersonalInfo] = useState<PersonalInfo>({
        firstName: '', lastName: '', email: '', password: '', phone: ''
    })

    // Step 2: Company Info
    const [companyInfo, setCompanyInfo] = useState<CompanyInfo>({
        name: '', serviceType: '', size: '', regions: '', description: ''
    })
    const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
    const [isDragging, setIsDragging] = useState(false)

    // Step 3: Agent Settings
    const [language, setLanguage] = useState('English')
    const [personality, setPersonality] = useState<string>('friendly')

    // File upload handler
    const handleFileDrop = useCallback(async (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(false)

        const files = Array.from(e.dataTransfer.files)

        for (const file of files) {
            if (!file.type.includes('pdf') && !file.type.includes('image')) continue

            setUploadedFiles(prev => [...prev, { name: file.name, base64: '', fileType: file.type, status: 'uploading' }])

            const reader = new FileReader()
            reader.onload = async () => {
                const base64 = (reader.result as string).split(',')[1]
                setUploadedFiles(prev => prev.map(f =>
                    f.name === file.name
                        ? { ...f, base64, status: 'done' }
                        : f
                ))
            }
            reader.onerror = () => {
                setUploadedFiles(prev => prev.map(f =>
                    f.name === file.name
                        ? { ...f, status: 'error' }
                        : f
                ))
            }
            reader.readAsDataURL(file)
        }
    }, [])

    const handleStep1Submit = async () => {
        if (!personalInfo.firstName || !personalInfo.lastName || !personalInfo.email || !personalInfo.password || !personalInfo.phone) {
            setError('Please fill in all required fields')
            return
        }
        setError(null)
        setStep(2)
    }

    const handleStep2Submit = async () => {
        if (!companyInfo.name || !companyInfo.serviceType || !companyInfo.size) {
            setError('Please fill in all required fields')
            return
        }
        setError(null)
        setStep(3)
    }

    const handleStep3Submit = async () => {
        setLoading(true)
        setError(null)

        try {
            console.log('Submitting onboarding data...')

            const result = await completeOnboardingWithData({
                personalInfo,
                companyInfo,
                agentSettings: {
                    language,
                    personality: personality as 'professional' | 'friendly' | 'empathetic'
                },
                uploadedFiles: uploadedFiles.filter(f => f.status === 'done').map(f => ({
                    name: f.name,
                    base64: f.base64,
                    fileType: f.fileType
                }))
            })

            console.log('Onboarding result:', result)

            if (!result.success) {
                setError(result.error || 'Failed to complete setup')
                setLoading(false)
                return
            }

            // Success! Set cookies via API route then redirect to dashboard
            console.log('Onboarding successful! Setting cookies and redirecting...')

            // Set cookies via a simple API call
            const cookieRes = await fetch('/api/auth/set-session', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ clientId: result.clientId })
            })

            if (!cookieRes.ok) {
                console.error('Failed to set session cookies')
                // Still redirect to login as fallback
                router.push('/login')
                return
            }

            // Redirect to dashboard (overview)
            router.push('/dashboard')

        } catch (err) {
            console.error('Onboarding error:', err)
            setError('An unexpected error occurred. Please try again.')
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex bg-white font-sans">
            {/* Left Panel - Branding */}
            <div className="hidden lg:flex flex-col justify-between w-1/2 bg-black p-12 text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-[linear-gradient(to_bottom_right,#111111,#000000)] z-0"></div>
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-900/20 rounded-full blur-[128px] pointer-events-none"></div>

                <div className="relative z-10">
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mb-8">
                        <span className="text-black font-bold text-2xl">A</span>
                    </div>
                    <h1 className="text-5xl font-bold tracking-tight mb-4">Welcome to Alma</h1>
                    <p className="text-xl text-gray-400 max-w-md">Set up your intelligent AI receptionist in just a few steps.</p>
                </div>

                {/* Progress Steps */}
                <div className="relative z-10 space-y-4">
                    {[
                        { num: 1, label: 'Personal Info', icon: User },
                        { num: 2, label: 'Your Business', icon: Building2 },
                        { num: 3, label: 'Agent Setup', icon: Bot }
                    ].map(({ num, label, icon: Icon }) => (
                        <div key={num} className={`flex items-center gap-4 ${step >= num ? 'text-white' : 'text-gray-600'}`}>
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${step > num ? 'bg-green-500' : step === num ? 'bg-white text-black' : 'bg-gray-800'
                                }`}>
                                {step > num ? <Check className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                            </div>
                            <span className="font-medium">{label}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Right Panel - Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-[#FAFAFA]">
                <div className="w-full max-w-lg">
                    <AnimatePresence mode="wait">
                        {/* Step 1: Personal Info */}
                        {step === 1 && (
                            <motion.div
                                key="step1"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6"
                            >
                                <div>
                                    <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Create your account</h2>
                                    <p className="text-gray-500 mt-2">Let's start with your personal information</p>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <InputField
                                        label="First Name"
                                        value={personalInfo.firstName}
                                        onChange={e => setPersonalInfo(p => ({ ...p, firstName: e.target.value }))}
                                        required
                                    />
                                    <InputField
                                        label="Last Name"
                                        value={personalInfo.lastName}
                                        onChange={e => setPersonalInfo(p => ({ ...p, lastName: e.target.value }))}
                                        required
                                    />
                                </div>

                                <InputField
                                    label="Email Address"
                                    type="email"
                                    value={personalInfo.email}
                                    onChange={e => setPersonalInfo(p => ({ ...p, email: e.target.value }))}
                                    required
                                />

                                <InputField
                                    label="Password"
                                    type="password"
                                    value={personalInfo.password}
                                    onChange={e => setPersonalInfo(p => ({ ...p, password: e.target.value }))}
                                    required
                                />

                                <InputField
                                    label="Phone Number"
                                    type="tel"
                                    value={personalInfo.phone}
                                    onChange={e => setPersonalInfo(p => ({ ...p, phone: e.target.value }))}
                                    required
                                />

                                {error && <ErrorMessage message={error} />}

                                <SubmitButton loading={loading} onClick={handleStep1Submit}>
                                    Continue <ArrowRight className="w-4 h-4" />
                                </SubmitButton>

                                <p className="text-center text-sm text-gray-500">
                                    Already have an account?{' '}
                                    <a href="/login" className="text-black font-semibold hover:underline">Sign in</a>
                                </p>
                            </motion.div>
                        )}

                        {/* Step 2: Company Info */}
                        {step === 2 && (
                            <motion.div
                                key="step2"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6"
                            >
                                <div>
                                    <h2 className="text-3xl font-bold text-gray-900 tracking-tight">About your business</h2>
                                    <p className="text-gray-500 mt-2">Help us tailor Alma for your needs</p>
                                </div>

                                <InputField
                                    label="Company Name"
                                    value={companyInfo.name}
                                    onChange={e => setCompanyInfo(c => ({ ...c, name: e.target.value }))}
                                    required
                                />

                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-900">Service Type</label>
                                    <select
                                        value={companyInfo.serviceType}
                                        onChange={e => setCompanyInfo(c => ({ ...c, serviceType: e.target.value }))}
                                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-black/5 focus:border-black outline-none transition-all"
                                    >
                                        <option value="">Select a type...</option>
                                        {serviceTypes.map(t => <option key={t} value={t}>{t}</option>)}
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-900">Company Size</label>
                                    <div className="grid grid-cols-2 gap-2">
                                        {companySizes.map(size => (
                                            <button
                                                key={size}
                                                type="button"
                                                onClick={() => setCompanyInfo(c => ({ ...c, size }))}
                                                className={`px-4 py-3 rounded-xl border text-sm font-medium transition-all ${companyInfo.size === size
                                                    ? 'bg-black text-white border-black'
                                                    : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300'
                                                    }`}
                                            >
                                                {size}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <InputField
                                    label="Regions Served"
                                    placeholder="e.g., Montreal, Quebec City, Toronto"
                                    value={companyInfo.regions}
                                    onChange={e => setCompanyInfo(c => ({ ...c, regions: e.target.value }))}
                                />

                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-900">Tell us more about your business</label>
                                    <textarea
                                        value={companyInfo.description}
                                        onChange={e => setCompanyInfo(c => ({ ...c, description: e.target.value }))}
                                        rows={3}
                                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-black/5 focus:border-black outline-none transition-all resize-none"
                                        placeholder="What services do you offer? Who are your typical clients?"
                                    />
                                </div>

                                {/* Document Upload */}
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-900">Company Documents (Optional)</label>
                                    <p className="text-xs text-gray-500">Upload brochures, service guides, or any documents that describe your business</p>

                                    <input
                                        type="file"
                                        id="file-upload"
                                        multiple
                                        accept=".pdf,image/*"
                                        className="hidden"
                                        onChange={(e) => {
                                            const files = Array.from(e.target.files || [])
                                            for (const file of files) {
                                                if (!file.type.includes('pdf') && !file.type.includes('image')) continue

                                                setUploadedFiles(prev => [...prev, { name: file.name, base64: '', fileType: file.type, status: 'uploading' }])

                                                const reader = new FileReader()
                                                reader.onload = () => {
                                                    const base64 = (reader.result as string).split(',')[1]
                                                    setUploadedFiles(prev => prev.map(f =>
                                                        f.name === file.name
                                                            ? { ...f, base64, status: 'done' }
                                                            : f
                                                    ))
                                                }
                                                reader.onerror = () => {
                                                    setUploadedFiles(prev => prev.map(f =>
                                                        f.name === file.name
                                                            ? { ...f, status: 'error' }
                                                            : f
                                                    ))
                                                }
                                                reader.readAsDataURL(file)
                                            }
                                            e.target.value = ''
                                        }}
                                    />
                                    <div
                                        onDragOver={e => { e.preventDefault(); setIsDragging(true) }}
                                        onDragLeave={() => setIsDragging(false)}
                                        onDrop={handleFileDrop}
                                        onClick={() => document.getElementById('file-upload')?.click()}
                                        className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all cursor-pointer ${isDragging ? 'border-black bg-gray-50' : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                    >
                                        <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                                        <p className="text-sm text-gray-600">Drag & drop PDF or images here</p>
                                        <p className="text-xs text-gray-400 mt-1">or click to browse</p>
                                    </div>

                                    {uploadedFiles.length > 0 && (
                                        <div className="space-y-2 mt-3">
                                            {uploadedFiles.map(file => (
                                                <div key={file.name} className="flex items-center gap-3 p-3 bg-white rounded-xl border border-gray-100">
                                                    <FileText className="w-5 h-5 text-gray-400" />
                                                    <span className="text-sm text-gray-700 flex-1 truncate">{file.name}</span>
                                                    {file.status === 'uploading' && <Loader2 className="w-4 h-4 animate-spin text-gray-400" />}
                                                    {file.status === 'done' && <Check className="w-4 h-4 text-green-500" />}
                                                    {file.status === 'error' && <X className="w-4 h-4 text-red-500" />}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {error && <ErrorMessage message={error} />}

                                <div className="flex gap-3">
                                    <button
                                        onClick={() => setStep(1)}
                                        className="px-6 py-3.5 rounded-xl border border-gray-200 text-gray-600 font-semibold hover:bg-gray-50 transition-all flex items-center gap-2"
                                    >
                                        <ArrowLeft className="w-4 h-4" /> Back
                                    </button>
                                    <SubmitButton loading={loading} onClick={handleStep2Submit} className="flex-1">
                                        Continue <ArrowRight className="w-4 h-4" />
                                    </SubmitButton>
                                </div>
                            </motion.div>
                        )}

                        {/* Step 3: Agent Settings */}
                        {step === 3 && (
                            <motion.div
                                key="step3"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6"
                            >
                                <div>
                                    <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Customize your AI</h2>
                                    <p className="text-gray-500 mt-2">Choose how your receptionist should interact</p>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-900">Preferred Language</label>
                                    <select
                                        value={language}
                                        onChange={e => setLanguage(e.target.value)}
                                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-black/5 focus:border-black outline-none transition-all"
                                    >
                                        {languages.map(l => <option key={l} value={l}>{l}</option>)}
                                    </select>
                                </div>

                                <div className="space-y-3">
                                    <label className="text-sm font-semibold text-gray-900">Agent Personality</label>
                                    <div className="space-y-3">
                                        {personalities.map(p => (
                                            <button
                                                key={p.id}
                                                type="button"
                                                onClick={() => setPersonality(p.id)}
                                                className={`w-full p-4 rounded-2xl border text-left transition-all ${personality === p.id
                                                    ? 'bg-black text-white border-black'
                                                    : 'bg-white text-gray-900 border-gray-200 hover:border-gray-300'
                                                    }`}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <span className="text-2xl">{p.icon}</span>
                                                    <div>
                                                        <h4 className="font-semibold">{p.title}</h4>
                                                        <p className={`text-sm ${personality === p.id ? 'text-gray-300' : 'text-gray-500'}`}>
                                                            {p.description}
                                                        </p>
                                                    </div>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {error && <ErrorMessage message={error} />}

                                <div className="flex gap-3">
                                    <button
                                        onClick={() => setStep(2)}
                                        className="px-6 py-3.5 rounded-xl border border-gray-200 text-gray-600 font-semibold hover:bg-gray-50 transition-all flex items-center gap-2"
                                    >
                                        <ArrowLeft className="w-4 h-4" /> Back
                                    </button>
                                    <SubmitButton
                                        loading={loading}
                                        loadingText="Processing..."
                                        onClick={handleStep3Submit}
                                        className="flex-1"
                                    >
                                        Complete Setup <Check className="w-4 h-4" />
                                    </SubmitButton>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    )
}

// Reusable Components
function InputField({ label, type = 'text', ...props }: {
    label: string;
    type?: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    required?: boolean;
    placeholder?: string;
}) {
    return (
        <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-900">{label}</label>
            <input
                type={type}
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-black/5 focus:border-black outline-none transition-all placeholder:text-gray-400"
                {...props}
            />
        </div>
    )
}

function ErrorMessage({ message }: { message: string }) {
    return (
        <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg font-medium">
            {message}
        </div>
    )
}

function SubmitButton({
    loading,
    loadingText,
    onClick,
    children,
    className = ''
}: {
    loading: boolean;
    loadingText?: string;
    onClick: () => void;
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            disabled={loading}
            className={`bg-black text-white hover:bg-gray-900 py-3.5 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 group shadow-lg shadow-black/10 ${className}`}
        >
            {loading ? (
                <>
                    <Loader2 className="animate-spin h-5 w-5" />
                    {loadingText && <span>{loadingText}</span>}
                </>
            ) : children}
        </button>
    )
}
