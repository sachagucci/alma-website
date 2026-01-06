'use client'

import { useState, useEffect } from 'react'
import { translations, Language } from '@/lib/translations'

export function useLanguage() {
    const [lang, setLangState] = useState<Language>('fr')
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

    return {
        lang,
        setLang,
        t: translations[lang],
        mounted
    }
}
