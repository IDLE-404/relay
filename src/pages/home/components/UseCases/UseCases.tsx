import FlowEditor from '@/components/FlowEditor'
import { useReveal } from '@/shared/hooks'
import { useI18n } from '@/shared/i18n/I18nContext'
import styles from './UseCases.module.css'

// Loaded lazily (React Flow is heavy). The page ran useReveal before this mounted,
// so the section runs it again for its own data-reveal elements.
const UseCases = () => {
  const { t } = useI18n()
  const text = t.landing.playground
  const [first, accent, last] = text.title
  useReveal()

  return (
    <section id="use-cases" className={styles.section}>
      <div className={styles.head} data-reveal>
        <span className={styles.tag}>{text.tag}</span>
        <h2 className={styles.title}>
          {first} <em>{accent}</em> {last}
        </h2>
        <p className={styles.text}>{text.text}</p>
      </div>
      <div className={styles.editor}>
        <FlowEditor />
      </div>
    </section>
  )
}

export default UseCases
