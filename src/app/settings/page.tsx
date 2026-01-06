'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { DashboardShell } from '@/components/DashboardShell'
import { getAgentConfig, updateAgentConfig, getCompanyKnowledge, addCompanyKnowledge, deleteCompanyKnowledge, getCompanyInfo, updateCompanyInfo, getTrustedSources, updateTrustedSources } from './actions'
import { Loader2, Save, Upload, FileText, Trash2, Check, Bot, BookOpen, ArrowLeft, Building2, Link2, Plus } from 'lucide-react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useLanguage } from '@/hooks/useLanguage'

// Default agent names by personality - no longer needed as default
// but useful for logic
const getPersonalityDefaults = (t: any) => ({
    professional: { title: t.settings.agent.personalities.professional.title, description: t.settings.agent.personalities.professional.desc, defaultName: 'Leo' },
    friendly: { title: t.settings.agent.personalities.friendly.title, description: t.settings.agent.personalities.friendly.desc, defaultName: 'Mia' },
    empathetic: { title: t.settings.agent.personalities.empathetic.title, description: t.settings.agent.personalities.empathetic.desc, defaultName: 'Gab' }
})

const defaultAgentNames: Record<string, string> = {
    professional: 'Leo',
    friendly: 'Mia',
    empathetic: 'Gab'
}

const languages = ['French', 'English']

export default function SettingsPage() {
    const router = useRouter()
    const { t, lang: interfaceLang, setLang: setInterfaceLang, mounted } = useLanguage()
    const [activeTab, setActiveTab] = useState<'agent' | 'knowledge'>('agent')
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

    // Agent config state
    const [config, setConfig] = useState({
        companyName: '',
        language: 'English',
        personality: 'friendly',
        temperature: 0.6,
        agentName: ''
    })

    // Knowledge state
    const [documents, setDocuments] = useState<any[]>([])
    const [stagedFiles, setStagedFiles] = useState<{ name: string, base64: string, fileType: string }[]>([])
    const [uploading, setUploading] = useState(false)

    // Company info state
    const [companyInfo, setCompanyInfo] = useState({
        name: '',
        description: '',
        service_type: '',
        company_size: ''
    })
    const [savingCompany, setSavingCompany] = useState(false)

    // Trusted sources state
    const [trustedSources, setTrustedSources] = useState<string[]>([])
    const [newSourceUrl, setNewSourceUrl] = useState('')
    const [savingSources, setSavingSources] = useState(false)

    // Load initial data
    useEffect(() => {
        loadData()
    }, [])

    const loadData = async () => {
        setLoading(true)
        const [configRes, knowledgeRes, companyRes] = await Promise.all([
            getAgentConfig(),
            getCompanyKnowledge(),
            getCompanyInfo()
        ])

        if (configRes.success && configRes.config) {
            setConfig(configRes.config)
        }
        if (knowledgeRes.success && knowledgeRes.documents) {
            setDocuments(knowledgeRes.documents)
        }
        if (companyRes.success && companyRes.company) {
            setCompanyInfo(companyRes.company)
        }

        // Load trusted sources
        const sourcesRes = await getTrustedSources()
        if (sourcesRes.success && sourcesRes.sources) {
            setTrustedSources(sourcesRes.sources)
        }

        setLoading(false)
    }

    // Save agent config
    const handleSaveConfig = async () => {
        setSaving(true)
        setMessage(null)

        const result = await updateAgentConfig({
            language: config.language,
            personality: config.personality,
            agentName: config.agentName
        })

        if (result.success) {
            // @ts-ignore
            setMessage({ type: 'success', text: t.settings.messages.configSaved })
        } else {
            // @ts-ignore
            setMessage({ type: 'error', text: result.error || t.settings.messages.configError })
        }
        setSaving(false)
    }

    // Save company info
    const handleSaveCompanyInfo = async () => {
        setSavingCompany(true)
        setMessage(null)

        const result = await updateCompanyInfo({
            name: companyInfo.name,
            description: companyInfo.description,
            serviceType: companyInfo.service_type,
            companySize: companyInfo.company_size
        })

        if (result.success) {
            // @ts-ignore
            setMessage({ type: 'success', text: t.settings.messages.companySaved })
        } else {
            // @ts-ignore
            setMessage({ type: 'error', text: result.error || t.settings.messages.companyError })
        }
        setSavingCompany(false)
    }

    // Stage files for upload (doesn't start OCR yet)
    const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || [])
        if (files.length === 0) return

        for (const file of files) {
            const reader = new FileReader()
            reader.onload = () => {
                const base64 = (reader.result as string).split(',')[1]
                setStagedFiles(prev => [...prev, {
                    name: file.name,
                    base64,
                    fileType: file.type
                }])
            }
            reader.readAsDataURL(file)
        }
        e.target.value = ''
    }, [])

    // Remove staged file
    const removeStagedFile = (name: string) => {
        setStagedFiles(prev => prev.filter(f => f.name !== name))
    }

    // Upload all staged files with OCR
    const handleUploadFiles = async () => {
        if (stagedFiles.length === 0) return

        setUploading(true)
        setMessage(null)

        let successCount = 0
        for (const file of stagedFiles) {
            const result = await addCompanyKnowledge(file)
            if (result.success) {
                successCount++
            } else {
                setMessage({ type: 'error', text: `Failed to process ${file.name}: ${result.error}` })
            }
        }

        // Reload documents
        const knowledgeRes = await getCompanyKnowledge()
        if (knowledgeRes.success) {
            setDocuments(knowledgeRes.documents || [])
        }

        if (successCount > 0) {
            // @ts-ignore
            setMessage({ type: 'success', text: `${successCount} ${t.settings.messages.docUploaded}` })
        }

        setStagedFiles([])
        setUploading(false)
    }

    // Delete document
    const handleDeleteDocument = async (id: number) => {
        const result = await deleteCompanyKnowledge(id)
        if (result.success) {
            setDocuments(docs => docs.filter(d => d.id !== id))
            // @ts-ignore
            setMessage({ type: 'success', text: t.settings.messages.docDeleted })
        } else {
            // @ts-ignore
            setMessage({ type: 'error', text: result.error || t.settings.messages.docError })
        }
    }

    if (loading) {
        return (
            <DashboardShell>
                <div className="flex-1 flex items-center justify-center h-screen">
                    <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
                </div>
            </DashboardShell>
        )
    }

    if (!mounted) return null

    // Helper for personalities
    const currentPersonalities = [
        // @ts-ignore
        { id: 'professional', ...getPersonalityDefaults(t).professional, defaultName: 'Leo' },
        // @ts-ignore
        { id: 'friendly', ...getPersonalityDefaults(t).friendly, defaultName: 'Mia' },
        // @ts-ignore
        { id: 'empathetic', ...getPersonalityDefaults(t).empathetic, defaultName: 'Gab' }
    ]

    return (
        <DashboardShell>
            <div className="p-8 max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-8 flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div>
                        <Link href="/dashboard" className="text-gray-500 hover:text-black text-sm flex items-center gap-1 mb-4">
                            {/* @ts-ignore */}
                            <ArrowLeft className="w-4 h-4" /> {t.settings.back}
                        </Link>
                        {/* @ts-ignore */}
                        <h1 className="text-3xl font-bold text-gray-900">{t.settings.title}</h1>
                        {/* @ts-ignore */}
                        <p className="text-gray-500 mt-1">{t.settings.subtitle}</p>
                    </div>

                    <div className="flex items-center gap-2 bg-white border border-gray-200 p-1 rounded-xl shadow-sm">
                        <button
                            onClick={() => setInterfaceLang('fr')}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${interfaceLang === 'fr'
                                ? 'bg-black text-white shadow-sm'
                                : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                                }`}
                        >
                            Français
                        </button>
                        <button
                            onClick={() => setInterfaceLang('en')}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${interfaceLang === 'en'
                                ? 'bg-black text-white shadow-sm'
                                : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                                }`}
                        >
                            English
                        </button>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-2 mb-6">
                    <button
                        onClick={() => setActiveTab('agent')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${activeTab === 'agent'
                            ? 'bg-black text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                    >
                        {/* @ts-ignore */}
                        <Bot className="w-4 h-4" /> {t.settings.tabs.agent}
                    </button>
                    <button
                        onClick={() => setActiveTab('knowledge')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${activeTab === 'knowledge'
                            ? 'bg-black text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                    >
                        <BookOpen className="w-4 h-4" /> {t.settings.tabs.knowledge}
                    </button>
                </div>

                {/* Message */}
                {message && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`p-4 rounded-lg mb-6 ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                            }`}
                    >
                        {message.text}
                    </motion.div>
                )}

                {/* Agent Configuration Tab */}
                {activeTab === 'agent' && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="bg-white rounded-2xl border border-gray-200 p-6 space-y-6"
                    >


                        {/* Agent Name */}
                        <div className="space-y-2">
                            {/* @ts-ignore */}
                            <label className="text-sm font-semibold text-gray-900">{t.settings.agent.name}</label>
                            <input
                                type="text"
                                value={config.agentName}
                                onChange={e => setConfig(c => ({ ...c, agentName: e.target.value }))}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black/5 focus:border-black outline-none"
                                // @ts-ignore
                                placeholder={`${t.settings.agent.namePlaceholder}${defaultAgentNames[config.personality] || 'Mia'}`}
                            />
                            <p className="text-xs text-gray-500">
                                {/* @ts-ignore */}
                                {t.settings.agent.nameHint}
                            </p>
                        </div>

                        {/* Language */}
                        <div className="space-y-2">
                            {/* @ts-ignore */}
                            <label className="text-sm font-semibold text-gray-900">{t.settings.agent.language}</label>
                            <select
                                value={config.language}
                                onChange={e => setConfig(c => ({ ...c, language: e.target.value }))}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black/5 focus:border-black outline-none"
                            >
                                {languages.map(l => <option key={l} value={l}>{l}</option>)}
                            </select>
                        </div>

                        {/* Personality */}
                        <div className="space-y-3">
                            {/* @ts-ignore */}
                            <label className="text-sm font-semibold text-gray-900">{t.settings.agent.personality}</label>
                            <div className="grid grid-cols-3 gap-3">
                                {currentPersonalities.map(p => (
                                    <button
                                        key={p.id}
                                        onClick={() => setConfig(c => ({
                                            ...c,
                                            personality: p.id,
                                            agentName: p.defaultName
                                        }))}
                                        className={`p-4 rounded-xl border text-left transition-all ${config.personality === p.id
                                            ? 'bg-black text-white border-black'
                                            : 'bg-gray-50 text-gray-900 border-gray-200 hover:border-gray-300'
                                            }`}
                                    >
                                        <p className="font-semibold">{p.title}</p>
                                        <p className={`text-xs ${config.personality === p.id ? 'text-gray-300' : 'text-gray-500'}`}>
                                            {p.description}
                                        </p>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Save Button */}
                        <button
                            onClick={handleSaveConfig}
                            disabled={saving}
                            className="w-full bg-black text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-gray-900 transition-all disabled:opacity-50"
                        >
                            {/* @ts-ignore */}
                            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                            {/* @ts-ignore */}
                            {saving ? t.settings.agent.saving : t.settings.agent.save}
                        </button>
                    </motion.div>
                )}

                {/* Knowledge Tab */}
                {activeTab === 'knowledge' && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="space-y-6"
                    >
                        {/* Company Info Section */}
                        <div className="bg-white rounded-2xl border border-gray-200 p-6">
                            <div className="flex items-center gap-2 mb-4">
                                <Building2 className="w-5 h-5 text-gray-700" />
                                {/* @ts-ignore */}
                                <h3 className="font-semibold text-gray-900">{t.settings.knowledge.companyInfo}</h3>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-4">
                                {/* Business Name */}
                                <div className="col-span-2">
                                    {/* @ts-ignore */}
                                    <label className="text-sm font-medium text-gray-700 mb-1 block">{t.settings.knowledge.businessName}</label>
                                    <input
                                        type="text"
                                        value={companyInfo.name || ''}
                                        onChange={e => setCompanyInfo(c => ({ ...c, name: e.target.value }))}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black/5 focus:border-black outline-none"
                                        placeholder="Your business name"
                                    />
                                </div>

                                {/* Service Type */}
                                <div>
                                    {/* @ts-ignore */}
                                    <label className="text-sm font-medium text-gray-700 mb-1 block">{t.settings.knowledge.serviceType}</label>
                                    <select
                                        value={companyInfo.service_type || ''}
                                        onChange={e => setCompanyInfo(c => ({ ...c, service_type: e.target.value }))}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black/5 focus:border-black outline-none"
                                    >
                                        <option value="">Select type</option>
                                        <option value="Medical Clinic">Medical Clinic</option>
                                        <option value="Dental Practice">Dental Practice</option>
                                        <option value="Wellness Center">Wellness Center</option>
                                        <option value="Legal Office">Legal Office</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>

                                {/* Company Size */}
                                <div>
                                    {/* @ts-ignore */}
                                    <label className="text-sm font-medium text-gray-700 mb-1 block">{t.settings.knowledge.companySize}</label>
                                    <select
                                        value={companyInfo.company_size || ''}
                                        onChange={e => setCompanyInfo(c => ({ ...c, company_size: e.target.value }))}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black/5 focus:border-black outline-none"
                                    >
                                        <option value="">Select size</option>
                                        <option value="Solo">Solo</option>
                                        <option value="2-10 employees">2-10 employees</option>
                                        <option value="11-50 employees">11-50 employees</option>
                                        <option value="50+ employees">50+ employees</option>
                                    </select>
                                </div>

                                {/* Description */}
                                <div className="col-span-2">
                                    {/* @ts-ignore */}
                                    <label className="text-sm font-medium text-gray-700 mb-1 block">{t.settings.knowledge.description}</label>
                                    <textarea
                                        value={companyInfo.description || ''}
                                        onChange={e => setCompanyInfo(c => ({ ...c, description: e.target.value }))}
                                        rows={3}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black/5 focus:border-black outline-none resize-none"
                                        // @ts-ignore
                                        placeholder={t.settings.knowledge.descriptionPlaceholder}
                                    />
                                </div>
                            </div>

                            <button
                                onClick={handleSaveCompanyInfo}
                                disabled={savingCompany}
                                className="w-full bg-black text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-gray-900 transition-all disabled:opacity-50"
                            >
                                {savingCompany ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                {/* @ts-ignore */}
                                {t.settings.knowledge.saveCompany}
                            </button>
                        </div>

                        {/* Upload Section */}
                        <div className="bg-white rounded-2xl border border-gray-200 p-6">
                            {/* @ts-ignore */}
                            <h3 className="font-semibold text-gray-900 mb-4">{t.settings.knowledge.uploadTitle}</h3>

                            {/* File selector */}
                            <label className="block mb-4">
                                <input
                                    type="file"
                                    accept=".pdf,image/*"
                                    multiple
                                    onChange={handleFileSelect}
                                    className="hidden"
                                    disabled={uploading}
                                />
                                <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center cursor-pointer hover:border-gray-300 transition-all">
                                    <Upload className="w-6 h-6 mx-auto text-gray-400 mb-2" />
                                    {/* @ts-ignore */}
                                    <p className="text-sm text-gray-600">{t.settings.knowledge.clickToSelect}</p>
                                </div>
                            </label>

                            {/* Staged files list */}
                            {stagedFiles.length > 0 && (
                                <div className="space-y-2 mb-4">
                                    {/* @ts-ignore */}
                                    <p className="text-sm font-medium text-gray-700">{t.settings.knowledge.readyToUpload}</p>
                                    {stagedFiles.map(file => (
                                        <div key={file.name} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                                            <div className="flex items-center gap-2">
                                                <FileText className="w-4 h-4 text-gray-400" />
                                                <span className="text-sm text-gray-700">{file.name}</span>
                                            </div>
                                            <button
                                                onClick={() => removeStagedFile(file.name)}
                                                className="text-gray-400 hover:text-red-500"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Upload button */}
                            <button
                                onClick={handleUploadFiles}
                                disabled={stagedFiles.length === 0 || uploading}
                                className="w-full bg-black text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-gray-900 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {uploading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        <Upload className="w-4 h-4" />
                                        {/* @ts-ignore */}
                                        {t.settings.knowledge.uploadProcess} ({stagedFiles.length})
                                    </>
                                )}
                            </button>
                        </div>

                        {/* Trusted Sources Section */}
                        <div className="bg-white rounded-2xl border border-gray-200 p-6">
                            <div className="flex items-center gap-2 mb-4">
                                <Link2 className="w-5 h-5 text-gray-700" />
                                {/* @ts-ignore */}
                                <h3 className="font-semibold text-gray-900">{t.settings.knowledge.trustedSources}</h3>
                            </div>
                            <p className="text-sm text-gray-500 mb-4">
                                {/* @ts-ignore */}
                                {t.settings.knowledge.trustedSourcesDesc}
                            </p>

                            {/* Add new URL */}
                            <div className="flex gap-2 mb-4">
                                <input
                                    type="url"
                                    value={newSourceUrl}
                                    onChange={(e) => setNewSourceUrl(e.target.value)}
                                    placeholder="https://example.com/resource"
                                    className="flex-1 px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black/5 focus:border-black outline-none text-sm"
                                />
                                <button
                                    onClick={async () => {
                                        if (!newSourceUrl.trim()) return
                                        try {
                                            new URL(newSourceUrl) // Validate URL
                                            const newSources = [...trustedSources, newSourceUrl.trim()]
                                            setSavingSources(true)
                                            const result = await updateTrustedSources(newSources)
                                            if (result.success) {
                                                setTrustedSources(result.sources || newSources)
                                                setNewSourceUrl('')
                                                // @ts-ignore
                                                setMessage({ type: 'success', text: t.settings.messages.sourceAdded })
                                            } else {
                                                // @ts-ignore
                                                setMessage({ type: 'error', text: result.error || t.settings.messages.sourceError })
                                            }
                                            setSavingSources(false)
                                        } catch {
                                            // @ts-ignore
                                            setMessage({ type: 'error', text: t.settings.messages.validUrl })
                                        }
                                    }}
                                    disabled={savingSources || !newSourceUrl.trim()}
                                    className="px-4 py-2 bg-black text-white rounded-xl font-medium flex items-center gap-2 hover:bg-gray-800 transition-all disabled:opacity-50"
                                >
                                    <Plus className="w-4 h-4" />
                                    {/* @ts-ignore */}
                                    {t.settings.knowledge.addSource}
                                </button>
                            </div>

                            {/* Sources list - no delete button, just display */}
                            {trustedSources.length === 0 ? (
                                // @ts-ignore
                                <p className="text-gray-400 text-sm">{t.settings.knowledge.noSources}</p>
                            ) : (
                                <div className="space-y-2">
                                    {trustedSources.map((url, idx) => (
                                        <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                                            <div className="flex items-center gap-3 min-w-0">
                                                <Link2 className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                                <a
                                                    href={url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-sm text-blue-600 hover:underline truncate"
                                                >
                                                    {url}
                                                </a>
                                            </div>
                                            <button
                                                onClick={async () => {
                                                    const newSources = trustedSources.filter((_, i) => i !== idx)
                                                    setSavingSources(true)
                                                    const result = await updateTrustedSources(newSources)
                                                    if (result.success) {
                                                        setTrustedSources(result.sources || newSources)
                                                        // @ts-ignore
                                                        setMessage({ type: 'success', text: t.settings.messages.sourceRemoved })
                                                    }
                                                    setSavingSources(false)
                                                }}
                                                className="p-2 text-gray-400 hover:text-red-500 transition-all flex-shrink-0"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Documents List - at the bottom */}
                        <div className="bg-white rounded-2xl border border-gray-200 p-6">
                            {/* @ts-ignore */}
                            <h3 className="font-semibold text-gray-900 mb-4">{t.settings.knowledge.documents}</h3>
                            {documents.filter(doc => doc.file_name !== '_trusted_sources').length === 0 ? (
                                // @ts-ignore
                                <p className="text-gray-500 text-sm">{t.settings.knowledge.noDocs}</p>
                            ) : (
                                <div className="space-y-2">
                                    {documents.filter(doc => doc.file_name !== '_trusted_sources').map(doc => (
                                        <div key={doc.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                                            <div className="flex items-center gap-3">
                                                <FileText className="w-5 h-5 text-gray-400" />
                                                <div>
                                                    <p className="text-sm font-medium text-gray-900">{doc.file_name}</p>
                                                    <p className="text-xs text-gray-500">
                                                        {new Date(doc.created_at).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => handleDeleteDocument(doc.id)}
                                                className="p-2 text-gray-400 hover:text-red-500 transition-all"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </div>
        </DashboardShell>
    )
}
