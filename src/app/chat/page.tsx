'use client'

import { useState, useRef, useEffect } from 'react'
import { DashboardShell } from '@/components/DashboardShell'
import ReactMarkdown from 'react-markdown'
import { Send, Loader2, MessageCircle, Bot, User, Paperclip, Camera, Receipt, X, CheckCircle, Edit2, Save } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLanguage } from '@/hooks/useLanguage'
import { getCompanyInfo } from '@/app/settings/actions'

type ChatMode = 'chat' | 'invoice'

interface InvoiceData {
    invoice_number?: string
    vendor_name?: string
    invoice_date?: string
    due_date?: string
    subtotal?: number
    tax_amount?: number
    total_amount?: number
    currency?: string
    category?: string
    invoice_type?: string
    line_items?: any[]
}

interface Message {
    role: 'user' | 'assistant'
    content: string
    type?: 'text' | 'invoice-card' | 'invoice-approval'
    invoiceData?: InvoiceData
    saved?: boolean
}

import { Plus, Clock, Trash2, MessageSquare } from 'lucide-react'

interface ChatSession {
    id: number
    title: string
    updated_at: string
}

export default function ChatPage() {
    const [messages, setMessages] = useState<Message[]>([])
    const [chatId, setChatId] = useState<number | null>(null)
    const [chats, setChats] = useState<ChatSession[]>([])
    const [input, setInput] = useState('')
    const [loading, setLoading] = useState(false)
    const [mode, setMode] = useState<ChatMode>('chat')
    const [processingInvoice, setProcessingInvoice] = useState(false)
    const [processingDocument, setProcessingDocument] = useState(false)
    const [documentContext, setDocumentContext] = useState<string | null>(null)
    const [documentFilename, setDocumentFilename] = useState<string | null>(null)
    const messagesEndRef = useRef<HTMLDivElement>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const videoRef = useRef<HTMLVideoElement>(null)
    const [showCamera, setShowCamera] = useState(false)
    const [stream, setStream] = useState<MediaStream | null>(null)
    const { t, mounted } = useLanguage()
    const [companyName, setCompanyName] = useState<string>('')

    useEffect(() => {
        getCompanyInfo().then(res => {
            if (res.success && res.company?.name) {
                setCompanyName(res.company.name)
            }
        })
    }, [])





    // ... (keep existing useEffects and functions)

    // ... (inside render)



    const fetchChats = async () => {
        try {
            const res = await fetch('/api/chats')
            if (res.ok) {
                const data = await res.json()
                setChats(data.chats || [])
            }
        } catch (e) {
            console.error('Failed to load chats', e)
        }
    }

    const deleteChat = async (id: number, e: React.MouseEvent) => {
        e.stopPropagation()
        if (!confirm('Are you sure you want to delete this chat?')) return

        try {
            const res = await fetch(`/api/chats/${id}`, {
                method: 'DELETE'
            })
            if (res.ok) {
                setChats(chats.filter(c => c.id !== id))
                if (chatId === id) {
                    startNewChat()
                }
            }
        } catch (e) {
            console.error('Failed to delete chat', e)
        }
    }

    const loadChat = async (id: number) => {
        try {
            const res = await fetch(`/api/chats/${id}`)
            if (res.ok) {
                const data = await res.json()
                if (data.chat) {
                    setChatId(data.chat.id)
                    setMessages(data.chat.messages || [])
                    setDocumentContext(null) // Reset context when switching
                    setDocumentFilename(null)
                }
            }
        } catch (e) {
            console.error('Failed to load chat', e)
        }
    }

    const startNewChat = (newMode?: ChatMode) => {
        setChatId(null)
        setMessages([])
        setDocumentContext(null)
        setDocumentFilename(null)
        // If specific mode requested, switch to it. Otherwise default to 'chat'
        if (newMode) {
            setMode(newMode)
        } else {
            setMode('chat')
        }
    }

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    useEffect(() => {
        return () => {
            if (stream) {
                stream.getTracks().forEach(track => track.stop())
            }
        }
    }, [stream])

    const saveCurrentChat = async (currentMessages: Message[]) => {
        // Determine title from first message if new
        const title = currentMessages.length > 0 ? currentMessages[0].content.slice(0, 50) : 'New Chat'

        try {
            if (chatId) {
                // Update existing
                await fetch(`/api/chats/${chatId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ messages: currentMessages })
                })
            } else {
                // Create new
                const res = await fetch('/api/chats', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        title,
                        messages: currentMessages
                    })
                })
                if (res.ok) {
                    const data = await res.json()
                    setChatId(data.chat.id)
                    fetchChats() // Refresh list
                }
            }
        } catch (e) {
            console.error('Failed to save chat', e)
        }
    }

    // Load recent chats on mount
    useEffect(() => {
        fetchChats()
    }, [])

    // Auto-save chat when messages change
    useEffect(() => {
        if (messages.length > 0) {
            saveCurrentChat(messages)
        }
    }, [messages])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!input.trim() || loading) return

        const userMessage: Message = { role: 'user', content: input.trim() }
        const updatedMessages = [...messages, userMessage]
        setMessages(updatedMessages)
        setInput('')
        setLoading(true)

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    messages: updatedMessages.map(m => ({
                        role: m.role,
                        content: m.content
                    })),
                    mode: mode,
                    documentContext: documentContext // Pass extracted text
                })
            })

            const data = await response.json()

            if (response.ok) {
                const assistantMsg = { role: 'assistant' as const, content: data.message }
                const finalMessages = [...updatedMessages, assistantMsg]
                setMessages(finalMessages)
            } else {
                setMessages(prev => [...prev, { role: 'assistant', content: `Error: ${data.error}` }])
            }
        } catch (error) {
            setMessages(prev => [...prev, { role: 'assistant', content: 'Failed to connect to the server.' }])
        } finally {
            setLoading(false)
        }
    }

    const handleFileUpload = async (file: File) => {
        if (!file) return

        // Route based on mode
        if (mode === 'invoice') {
            // Invoice processing mode
            setProcessingInvoice(true)
            setMessages(prev => [...prev, {
                role: 'user',
                content: `📎 Uploading invoice: ${file.name}`
            }])

            try {
                const reader = new FileReader()
                reader.onload = async (e) => {
                    const base64 = e.target?.result as string

                    const response = await fetch('/api/invoice/extract', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ image: base64 })
                    })

                    const data = await response.json()

                    if (response.ok && data.success) {
                        setMessages(prev => [...prev, {
                            role: 'assistant',
                            content: '',
                            type: 'invoice-approval',
                            invoiceData: data.extracted,
                            saved: false
                        }])
                    } else {
                        setMessages(prev => [...prev, {
                            role: 'assistant',
                            content: `Failed to process invoice: ${data.error || 'Unknown error'}`
                        }])
                    }
                    setProcessingInvoice(false)
                }
                reader.readAsDataURL(file)
            } catch (error) {
                setMessages(prev => [...prev, {
                    role: 'assistant',
                    content: 'Failed to upload invoice.'
                }])
                setProcessingInvoice(false)
            }
        } else {
            // Chat mode - document discussion
            setProcessingDocument(true)
            setMessages(prev => [...prev, {
                role: 'user',
                content: `📄 Uploading document: ${file.name}`
            }])

            try {
                const reader = new FileReader()
                reader.onload = async (e) => {
                    const base64 = e.target?.result as string

                    const response = await fetch('/api/document/extract', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ image: base64, filename: file.name })
                    })

                    const data = await response.json()

                    if (response.ok && data.success) {
                        // Store document context for discussion
                        setDocumentContext(data.text)
                        setDocumentFilename(file.name)

                        setMessages(prev => [...prev, {
                            role: 'assistant',
                            content: `📄 **Document loaded: ${file.name}**\n\nI've analyzed the document and held it in memory. You can now ask me to summarize it or answer any questions about its content.`
                        }])
                    } else {
                        setMessages(prev => [...prev, {
                            role: 'assistant',
                            content: `Failed to process document: ${data.error || 'Unknown error'}`
                        }])
                    }
                    setProcessingDocument(false)
                }
                reader.readAsDataURL(file)
            } catch (error) {
                setMessages(prev => [...prev, {
                    role: 'assistant',
                    content: 'Failed to upload document.'
                }])
                setProcessingDocument(false)
            }
        }
    }

    const startCamera = async () => {
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'environment' }
            })
            setStream(mediaStream)
            setShowCamera(true)
            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream
            }
        } catch (error) {
            console.error('Camera error:', error)
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: 'Unable to access camera. Please check permissions.'
            }])
        }
    }

    const capturePhoto = () => {
        if (!videoRef.current) return

        const canvas = document.createElement('canvas')
        canvas.width = videoRef.current.videoWidth
        canvas.height = videoRef.current.videoHeight
        const ctx = canvas.getContext('2d')
        if (ctx) {
            ctx.drawImage(videoRef.current, 0, 0)
            const base64 = canvas.toDataURL('image/jpeg', 0.8)

            if (stream) {
                stream.getTracks().forEach(track => track.stop())
            }
            setShowCamera(false)
            setStream(null)

            processBase64Image(base64, 'camera-capture.jpg')
        }
    }

    const closeCamera = () => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop())
        }
        setShowCamera(false)
        setStream(null)
    }

    const processBase64Image = async (base64: string, filename: string) => {
        if (mode === 'invoice') {
            setProcessingInvoice(true)
            setMessages(prev => [...prev, {
                role: 'user',
                content: `📷 Processing invoice from ${filename}`
            }])

            try {
                const response = await fetch('/api/invoice/extract', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ image: base64 })
                })

                const data = await response.json()

                if (response.ok && data.success) {
                    setMessages(prev => [...prev, {
                        role: 'assistant',
                        content: '',
                        type: 'invoice-approval',
                        invoiceData: data.extracted,
                        saved: false
                    }])
                } else {
                    setMessages(prev => [...prev, {
                        role: 'assistant',
                        content: `Failed to process invoice: ${data.error || 'Unknown error'}`
                    }])
                }
            } catch (error) {
                setMessages(prev => [...prev, {
                    role: 'assistant',
                    content: 'Failed to process invoice.'
                }])
            } finally {
                setProcessingInvoice(false)
            }
        } else {
            // Chat mode - document
            setProcessingDocument(true)
            setMessages(prev => [...prev, {
                role: 'user',
                content: `📷 Processing document from ${filename}`
            }])

            try {
                const response = await fetch('/api/document/extract', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ image: base64, filename })
                })

                const data = await response.json()

                if (response.ok && data.success) {
                    setDocumentContext(data.text)
                    setDocumentFilename(filename)

                    setMessages(prev => [...prev, {
                        role: 'assistant',
                        content: `📄 **Document loaded: ${filename}**\n\nI've analyzed the document and held it in memory. You can now ask me to summarize it or answer any questions about its content.`
                    }])
                } else {
                    setMessages(prev => [...prev, {
                        role: 'assistant',
                        content: `Failed to process document: ${data.error || 'Unknown error'}`
                    }])
                }
            } catch (error) {
                setMessages(prev => [...prev, {
                    role: 'assistant',
                    content: 'Failed to process document.'
                }])
            } finally {
                setProcessingDocument(false)
            }
        }
    }

    // Editable Invoice Approval Card
    const InvoiceApprovalCard = ({ data, messageIndex, saved }: { data: InvoiceData, messageIndex: number, saved: boolean }) => {
        const [editMode, setEditMode] = useState(false)
        const [formData, setFormData] = useState<InvoiceData>(data)
        const [saving, setSaving] = useState(false)
        const [showRejectFeedback, setShowRejectFeedback] = useState(false)
        const [rejectFeedback, setRejectFeedback] = useState('')

        const handleReject = () => {
            // Update message to show rejection with feedback
            setMessages(prev => prev.map((msg, idx) =>
                idx === messageIndex
                    ? {
                        ...msg,
                        type: 'text' as const,
                        content: `❌ Invoice rejected. Feedback: "${rejectFeedback || 'No feedback provided'}"`
                    }
                    : msg
            ))
            // Add a follow-up message
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: 'Got it, I\'ve discarded that invoice. You can upload another one or try again.'
            }])
        }

        const handleSave = async () => {
            setSaving(true)
            try {
                const response = await fetch('/api/invoice/save', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ invoiceData: formData })
                })

                const result = await response.json()
                if (result.success) {
                    // Update message to show saved state
                    setMessages(prev => prev.map((msg, idx) =>
                        idx === messageIndex
                            ? { ...msg, invoiceData: formData, saved: true, type: 'invoice-card' as const }
                            : msg
                    ))
                }
            } catch (error) {
                console.error('Save error:', error)
            } finally {
                setSaving(false)
            }
        }

        const categories = ['Office Supplies', 'Software', 'Travel', 'Meals', 'Professional Services', 'Utilities', 'Equipment', 'Other']

        if (saved) {
            return (
                <div className="bg-white border border-green-200 rounded-xl p-4 max-w-md shadow-sm">
                    <div className="flex items-center gap-2 mb-3">
                        <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-gray-900">Invoice Saved!</p>
                            <p className="text-xs text-gray-500">{formData.vendor_name}</p>
                        </div>
                    </div>
                    <div className="text-lg font-bold text-gray-900">
                        {formData.currency || 'CAD'} ${formData.total_amount?.toFixed(2) || '0.00'}
                    </div>
                </div>
            )
        }

        return (
            <div className="bg-white border border-amber-200 rounded-xl p-4 max-w-lg shadow-sm">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center">
                            <Receipt className="w-4 h-4 text-amber-600" />
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-gray-900">Review Invoice</p>
                            <p className="text-xs text-gray-500">Please verify the extracted data</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setEditMode(!editMode)}
                        className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                    >
                        <Edit2 className="w-4 h-4" />
                    </button>
                </div>

                <div className="space-y-3">
                    {/* Vendor */}
                    <div>
                        <label className="text-xs text-gray-500 block mb-1">Vendor</label>
                        {editMode ? (
                            <input
                                type="text"
                                value={formData.vendor_name || ''}
                                onChange={(e) => setFormData({ ...formData, vendor_name: e.target.value })}
                                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg"
                            />
                        ) : (
                            <p className="text-sm font-medium">{formData.vendor_name || 'Unknown'}</p>
                        )}
                    </div>

                    {/* Invoice Number & Date Row */}
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="text-xs text-gray-500 block mb-1">Invoice #</label>
                            {editMode ? (
                                <input
                                    type="text"
                                    value={formData.invoice_number || ''}
                                    onChange={(e) => setFormData({ ...formData, invoice_number: e.target.value })}
                                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg"
                                />
                            ) : (
                                <p className="text-sm">{formData.invoice_number || '-'}</p>
                            )}
                        </div>
                        <div>
                            <label className="text-xs text-gray-500 block mb-1">Date</label>
                            {editMode ? (
                                <input
                                    type="date"
                                    value={formData.invoice_date || ''}
                                    onChange={(e) => setFormData({ ...formData, invoice_date: e.target.value })}
                                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg"
                                />
                            ) : (
                                <p className="text-sm">{formData.invoice_date || '-'}</p>
                            )}
                        </div>
                    </div>

                    {/* Amount & Category Row */}
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="text-xs text-gray-500 block mb-1">Total Amount</label>
                            {editMode ? (
                                <input
                                    type="number"
                                    step="0.01"
                                    value={formData.total_amount || ''}
                                    onChange={(e) => setFormData({ ...formData, total_amount: parseFloat(e.target.value) })}
                                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg"
                                />
                            ) : (
                                <p className="text-sm font-bold">${formData.total_amount?.toFixed(2) || '0.00'}</p>
                            )}
                        </div>
                        <div>
                            <label className="text-xs text-gray-500 block mb-1">Category</label>
                            {editMode ? (
                                <select
                                    value={formData.category || 'Other'}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg"
                                >
                                    {categories.map(cat => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                            ) : (
                                <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                                    {formData.category || 'Other'}
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Type selector */}
                    <div>
                        <label className="text-xs text-gray-500 block mb-1">Type</label>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setFormData({ ...formData, invoice_type: 'expense' })}
                                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${formData.invoice_type === 'expense'
                                    ? 'bg-red-100 text-red-700 border border-red-200'
                                    : 'bg-gray-50 text-gray-500 border border-gray-200 hover:bg-gray-100'
                                    }`}
                            >
                                Expense
                            </button>
                            <button
                                onClick={() => setFormData({ ...formData, invoice_type: 'revenue' })}
                                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${formData.invoice_type === 'revenue'
                                    ? 'bg-green-100 text-green-700 border border-green-200'
                                    : 'bg-gray-50 text-gray-500 border border-gray-200 hover:bg-gray-100'
                                    }`}
                            >
                                Revenue
                            </button>
                        </div>
                    </div>
                </div>

                {/* Reject feedback input */}
                {showRejectFeedback && (
                    <div className="mt-3 space-y-2">
                        <textarea
                            value={rejectFeedback}
                            onChange={(e) => setRejectFeedback(e.target.value)}
                            placeholder="What's incorrect about this extraction?"
                            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg resize-none"
                            rows={2}
                        />
                        <button
                            onClick={handleReject}
                            className="w-full py-2 bg-red-50 text-red-700 rounded-lg text-sm font-medium hover:bg-red-100 transition-all"
                        >
                            Submit Feedback & Discard
                        </button>
                    </div>
                )}

                {/* Action buttons */}
                <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
                    <button
                        onClick={() => setShowRejectFeedback(!showRejectFeedback)}
                        className="px-4 py-2.5 bg-gray-100 text-gray-600 rounded-xl font-medium hover:bg-gray-200 transition-all"
                    >
                        {showRejectFeedback ? 'Cancel' : 'Reject'}
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="flex-1 py-2.5 bg-black text-white rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-gray-800 transition-all disabled:opacity-50"
                    >
                        {saving ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            <CheckCircle className="w-4 h-4" />
                        )}
                        Approve & Save
                    </button>
                </div>
            </div>
        )
    }

    // Simple saved invoice card
    const InvoiceCard = ({ data }: { data: InvoiceData }) => (
        <div className="bg-white border border-green-200 rounded-xl p-4 max-w-md shadow-sm">
            <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                </div>
                <div>
                    <p className="text-sm font-semibold text-gray-900">Invoice Saved</p>
                    <p className="text-xs text-gray-500">{data.invoice_type === 'revenue' ? 'Revenue' : 'Expense'}</p>
                </div>
            </div>
            <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                    <span className="text-gray-500">Vendor</span>
                    <span className="font-medium">{data.vendor_name || 'Unknown'}</span>
                </div>
                <div className="flex justify-between border-t border-gray-100 pt-2">
                    <span className="text-gray-500">Total</span>
                    <span className="font-bold text-lg">{data.currency || 'CAD'} ${data.total_amount?.toFixed(2) || '0.00'}</span>
                </div>
            </div>
        </div>
    )

    if (!mounted) return null

    return (
        <DashboardShell>
            <div className="flex h-screen overflow-hidden">
                {/* Sidebar */}
                <div className="w-72 bg-gray-50 border-r border-gray-200 flex flex-col flex-shrink-0">
                    <div className="p-4 border-b border-gray-200">
                        <button onClick={() => startNewChat('chat')} className="w-full flex items-center justify-center gap-2 bg-black text-white py-2.5 px-4 rounded-xl hover:bg-gray-800 transition-all shadow-sm font-medium text-sm">
                            <Plus className="w-4 h-4" />
                            {t.chat.newChat}
                        </button>
                    </div>
                    <div className="flex-1 overflow-y-auto p-3">
                        <div className="space-y-1">
                            {chats.map(chat => (
                                <div
                                    key={chat.id}
                                    onClick={() => loadChat(chat.id)}
                                    className={`w-full text-left px-3 py-3 rounded-lg text-sm transition-all flex items-center gap-3 group cursor-pointer ${chatId === chat.id ? 'bg-white shadow-sm border border-gray-200 text-gray-900' : 'hover:bg-gray-200/50 text-gray-600'
                                        }`}
                                >
                                    <MessageSquare className={`w-4 h-4 flex-shrink-0 ${chatId === chat.id ? 'text-black' : 'text-gray-400 group-hover:text-gray-500'}`} />
                                    <div className="flex-1 min-w-0">
                                        <div className="font-medium truncate">{chat.title || 'Untitled Chat'}</div>
                                        <div className="text-xs text-gray-400 mt-0.5">
                                            {new Date(chat.updated_at).toLocaleDateString()}
                                        </div>
                                    </div>
                                    <button
                                        onClick={(e) => deleteChat(chat.id, e)}
                                        className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                                        title="Delete chat"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                            {chats.length === 0 && (
                                <div className="text-center py-8 text-xs text-gray-400">
                                    {/* @ts-ignore */}
                                    {t.chat.noRecentChats}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 flex flex-col min-w-0 h-full relative bg-white/50">
                    {/* Header with Mode Selector */}
                    <div className="border-b border-gray-200/50 bg-white/50 backdrop-blur-sm px-6 py-4">
                        <div className="max-w-4xl mx-auto">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-black flex items-center justify-center">
                                        <MessageCircle className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <h1 className="text-lg font-bold text-gray-900">{t.chat.leo}</h1>
                                    </div>
                                </div>

                                <div className="flex bg-gray-100 rounded-xl p-1">
                                    <button
                                        onClick={() => startNewChat('chat')}
                                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${mode === 'chat'
                                            ? 'bg-black text-white shadow-sm'
                                            : 'text-gray-500 hover:text-gray-700'
                                            }`}
                                    >
                                        <MessageCircle className="w-4 h-4" />
                                        {t.chat.chatMode}
                                    </button>
                                    <button
                                        onClick={() => startNewChat('invoice')}
                                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${mode === 'invoice'
                                            ? 'bg-black text-white shadow-sm'
                                            : 'text-gray-500 hover:text-gray-700'
                                            }`}
                                    >
                                        <Receipt className="w-4 h-4" />
                                        {t.chat.invoiceMode}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Camera Modal */}
                    {showCamera && (
                        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
                            <div className="bg-white rounded-2xl overflow-hidden max-w-lg w-full">
                                <div className="relative">
                                    <video
                                        ref={videoRef}
                                        autoPlay
                                        playsInline
                                        className="w-full aspect-[4/3] object-cover bg-black"
                                    />
                                    <button
                                        onClick={closeCamera}
                                        className="absolute top-3 right-3 p-2 bg-black/50 rounded-full text-white hover:bg-black/70"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>
                                <div className="p-4 flex justify-center">
                                    <button
                                        onClick={capturePhoto}
                                        className="px-6 py-3 bg-black text-white rounded-xl font-medium flex items-center gap-2"
                                    >
                                        <Camera className="w-5 h-5" />
                                        Capture Invoice
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto px-6 py-6">
                        <div className="max-w-4xl mx-auto space-y-4">
                            {messages.length === 0 && (
                                <div className="text-center py-20">
                                    <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-4">
                                        {mode === 'invoice' ? (
                                            <Receipt className="w-8 h-8 text-gray-400" />
                                        ) : (
                                            <Bot className="w-8 h-8 text-gray-400" />
                                        )}
                                    </div>
                                    <h2 className="text-xl font-semibold text-gray-900 mb-2">
                                        {mode === 'invoice' ? t.chat.processInvoice : t.chat.startConversation}
                                    </h2>
                                    <p className="text-gray-500 text-sm">
                                        {mode === 'invoice'
                                            ? t.chat.invoiceHint
                                            // @ts-ignore
                                            : (<>{t.chat.chatHint}{companyName || (mounted && t.logo === 'fr' ? 'votre entreprise' : 'your company')}.</>)}
                                    </p>
                                </div>
                            )}

                            <AnimatePresence initial={false}>
                                {messages.map((message, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                    >
                                        {message.role === 'assistant' && (
                                            <div className="w-8 h-8 rounded-lg bg-black flex items-center justify-center flex-shrink-0">
                                                <Bot className="w-4 h-4 text-white" />
                                            </div>
                                        )}

                                        {message.type === 'invoice-approval' ? (
                                            <InvoiceApprovalCard
                                                data={message.invoiceData!}
                                                messageIndex={index}
                                                saved={message.saved || false}
                                            />
                                        ) : message.type === 'invoice-card' ? (
                                            <InvoiceCard data={message.invoiceData!} />
                                        ) : (
                                            <div
                                                className={`max-w-[70%] px-4 py-3 rounded-2xl ${message.role === 'user'
                                                    ? 'bg-black text-white rounded-tr-sm'
                                                    : 'bg-gray-100 text-gray-900 rounded-tl-sm'
                                                    }`}
                                            >
                                                <div className={`text-sm ${message.role === 'user' ? 'text-white' : 'text-gray-900'}`}>
                                                    <ReactMarkdown
                                                        components={{
                                                            p: ({ node, ...props }) => <p className="leading-relaxed mb-2 last:mb-0" {...props} />,
                                                            ul: ({ node, ...props }) => <ul className="list-disc pl-4 mb-2" {...props} />,
                                                            ol: ({ node, ...props }) => <ol className="list-decimal pl-4 mb-2" {...props} />,
                                                            li: ({ node, ...props }) => <li className="mb-1" {...props} />,
                                                            strong: ({ node, ...props }) => <strong className="font-bold" {...props} />,
                                                        }}
                                                    >
                                                        {message.content}
                                                    </ReactMarkdown>
                                                </div>
                                            </div>
                                        )}

                                        {message.role === 'user' && (
                                            <div className="w-8 h-8 rounded-lg bg-gray-200 flex items-center justify-center flex-shrink-0">
                                                <User className="w-4 h-4 text-gray-600" />
                                            </div>
                                        )}
                                    </motion.div>
                                ))}
                            </AnimatePresence>

                            {(loading || processingInvoice || processingDocument) && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="flex gap-3"
                                >
                                    <div className="w-8 h-8 rounded-lg bg-black flex items-center justify-center flex-shrink-0">
                                        <Bot className="w-4 h-4 text-white" />
                                    </div>
                                    <div className="bg-gray-100 px-4 py-3 rounded-2xl rounded-tl-sm">
                                        <div className="flex items-center gap-2">
                                            <div className="flex gap-1">
                                                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                            </div>
                                            {processingInvoice && (
                                                <span className="text-sm text-gray-500 ml-2">Extracting invoice data...</span>
                                            )}
                                            {processingDocument && (
                                                <span className="text-sm text-gray-500 ml-2">Reading document with Mistral OCR...</span>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            <div ref={messagesEndRef} />
                        </div>
                    </div>

                    {/* Input */}
                    <div className="border-t border-gray-200/50 bg-white/80 backdrop-blur-sm px-6 py-4">
                        <div className="max-w-4xl mx-auto">
                            <input
                                type="file"
                                ref={fileInputRef}
                                accept="image/*,.pdf"
                                onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
                                className="hidden"
                            />

                            <form onSubmit={handleSubmit} className="flex gap-3">
                                <div className="flex gap-2">
                                    <button
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                        disabled={processingInvoice}
                                        className="p-3 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-all disabled:opacity-50"
                                        title="Upload file"
                                    >
                                        <Paperclip className="w-5 h-5" />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={startCamera}
                                        disabled={processingInvoice}
                                        className="p-3 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-all disabled:opacity-50"
                                        title="Take photo"
                                    >
                                        <Camera className="w-5 h-5" />
                                    </button>
                                </div>

                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder={mode === 'invoice' ? t.chat.invoicePlaceholder : t.chat.chatPlaceholder}
                                    className="flex-1 px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all text-sm"
                                    disabled={loading || processingInvoice}
                                />
                                <button
                                    type="submit"
                                    disabled={!input.trim() || loading || processingInvoice}
                                    className="px-5 py-3 bg-black text-white rounded-xl font-medium flex items-center gap-2 hover:bg-gray-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                        <Send className="w-4 h-4" />
                                    )}
                                    <span className="hidden sm:inline">{t.chat.send}</span>
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardShell>
    )
}
