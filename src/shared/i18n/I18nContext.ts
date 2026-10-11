import { createContext, useContext } from 'react'
import type { Dictionary } from './en'

export type Lang = 'en' | 'ru'

type I18nContextValue = {
  lang: Lang
  t: Dictionary
  setLang: (lang: Lang) => void
}

export const I18nContext = createContext<I18nContextValue | null>(null)

export const useI18n = () => {
  const context = useContext(I18nContext)
  if (!context) throw new Error('useI18n must be used within I18nProvider')
  return context
}
