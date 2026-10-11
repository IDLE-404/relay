import { useState, type MouseEvent } from 'react'
import { useI18n } from '@/shared/i18n/I18nContext'
import { fill } from '@/shared/utils'
import { approval } from '../ConsolePreview/data'
import styles from './ApprovalCard.module.css'

const ApprovalCard = () => {
  const { t } = useI18n()
  const text = t.landing.preview.approval
  const agents = t.landing.preview.agents
  const [pending, setPending] = useState(approval.pending)
  const done = pending === 0

  // Approve one request here; don't follow the card link.
  const approve = (event: MouseEvent) => {
    event.preventDefault()
    event.stopPropagation()
    setPending(pending - 1)
  }

  const meta = [
    [text.agent, agents[approval.agent]],
    [text.server, approval.server],
    [text.scope, approval.scope],
  ]

  return (
    <div className={`${styles.approval} ${done ? styles.done : ''}`}>
      <span className={styles.band} aria-hidden />

      <p className={styles.title}>{text.title}</p>
      <p className={styles.tool}>{approval.tool}</p>

      <dl className={styles.meta}>
        {meta.map(([label, value]) => (
          <div key={label}>
            <dt>{label}</dt>
            <dd>{value}</dd>
          </div>
        ))}
      </dl>

      <pre className={styles.args}>{approval.args}</pre>

      <div className={styles.footer} aria-live="polite">
        {done ? (
          <span className={styles.success}>{text.approved}</span>
        ) : (
          <button type="button" className={styles.button} onClick={approve}>
            <span>{fill(text.pending, { n: pending })}</span>
          </button>
        )}
      </div>
    </div>
  )
}

export default ApprovalCard
