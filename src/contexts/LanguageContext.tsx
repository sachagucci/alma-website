'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { translations, Language } from '@/lib/translations'

interface LanguageContextType {
    lang: Language
    setLang: (lang: Language) => void
    t: typeof translations.en
    mounted: boolean
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
    const [lang, setLangState] = useState<Language>('en')
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
        // Check cookie on mount
        const match = document.cookie.match(/(^| )alma_locale=([^;]+)/)
        if (match) {
            const savedLang = match[2] as Language
            if (['fr', 'en'].includes(savedLang)) {
                setLangState(savedLang)
            }
        }
    }, [])

    const setLang = (newLang: Language) => {
        setLangState(newLang)
        // Set cookie for 1 year
        document.cookie = `alma_locale=${newLang}; path=/; max-age=31536000; SameSite=Lax`
    }

    return (
        <LanguageContext.Provider value={{ lang, setLang, t: translations[lang], mounted }}>
            {children}
        </LanguageContext.Provider>
    )
}

export function useLanguage() {
    const context = useContext(LanguageContext)
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider')
    }
    return context
}
