import { useEffect, useState, type ReactNode } from 'react'
import { I18nContext, type Lang } from '@/shared/i18n/I18nContext'
import { en, type Dictionary } from '@/shared/i18n/en'

// English ships in the main bundle; Russian is a separate chunk, loaded when needed.
const load: Record<Lang, () => Promise<Dictionary>> = {
  en: async () => en,
  ru: () => import('@/shared/i18n/ru').then((module) => module.ru),
}

const getInitialLang = (): Lang => {
  try {
    const saved = localStorage.getItem('lang')
    if (saved === 'en' || saved === 'ru') return saved
  } catch {
    return 'en'
  }
  return navigator.language.startsWith('ru') ? 'ru' : 'en'
}

type Current = { lang: Lang; t: Dictionary }

export const I18nProvider = ({ children }: { children: ReactNode }) => {
  const [initialLang] = useState(getInitialLang)
  // null until the first dictionary is ready, so the wrong language never flashes.
  const [current, setCurrent] = useState<Current | null>(initialLang === 'en' ? { lang: 'en', t: en } : null)

  useEffect(() => {
    if (initialLang !== 'en') load[initialLang]().then((t) => setCurrent({ lang: initialLang, t }))
  }, [initialLang])

  useEffect(() => {
    if (!current) return
    document.documentElement.lang = current.lang
    try {
      localStorage.setItem('lang', current.lang)
    } catch {
      // ignore unavailable storage
    }
  }, [current])

  // Switch after the dictionary has loaded: the page keeps the old language for that moment, never a mix.
  const setLang = (lang: Lang) => {
    load[lang]().then((t) => setCurrent({ lang, t }))
  }

  if (!current) return null

  return <I18nContext.Provider value={{ lang: current.lang, t: current.t, setLang }}>{children}</I18nContext.Provider>
}
