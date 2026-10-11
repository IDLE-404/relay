import { LuBot } from 'react-icons/lu'
import { fill } from '@/shared/utils'
import { useEditor } from '../EditorContext'
import styles from './ResultCard.module.css'

// Shown when a run ends: a Telegram-like message with the result, or "cancelled".
const ResultCard = () => {
  const { state, text } = useEditor()
  const { status, calls } = state.run
  if (status !== 'done' && status !== 'cancelled') return null

  const seconds = (calls.reduce((sum, call) => sum + call.ms, 0) / 1000).toFixed(1)
  const done = status === 'done'

  return (
    <div className={styles.card} role="status">
      <span className={styles.avatar}>
        <LuBot aria-hidden />
      </span>
      <div className={styles.body}>
        <p className={styles.name}>{text.bot}</p>
        <p className={done ? styles.message : styles.cancelled}>
          {done ? text.templates[state.template].result : text.cancelled}
        </p>
        {done && <p className={styles.summary}>{fill(text.summary, { n: calls.length, time: `${seconds}s` })}</p>}
      </div>
    </div>
  )
}

export default ResultCard
