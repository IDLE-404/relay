import { Link } from 'react-router-dom'
import { useI18n } from '@/shared/i18n/I18nContext'
import styles from './ConsolePage.module.css'

// Placeholder until the console is built.
const ConsolePage = () => {
  const { t } = useI18n()
  const [first, accent] = t.console.title

  return (
    <section className={styles.page}>
      <span className={styles.blob} aria-hidden />
      <h1 className={styles.title}>
        {first} <em>{accent}</em>
      </h1>
      <p className={styles.text}>{t.console.text}</p>
      <Link to="/" className={styles.back}>
        {t.console.back}
      </Link>
    </section>
  )
}

export default ConsolePage
