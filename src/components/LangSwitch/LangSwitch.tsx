import { useI18n } from '@/shared/i18n/I18nContext'
import styles from './LangSwitch.module.css'

const LangSwitch = ({ className = '' }: { className?: string }) => {
  const { lang, setLang } = useI18n()

  return (
    <div className={`${styles.switch} ${className}`}>
      <span className={`${styles.thumb} ${lang === 'ru' ? styles.right : ''}`} />
      <button className={lang === 'en' ? styles.active : ''} onClick={() => setLang('en')}>
        EN
      </button>
      <button className={lang === 'ru' ? styles.active : ''} onClick={() => setLang('ru')}>
        RU
      </button>
    </div>
  )
}

export default LangSwitch
