import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import styles from './BentoCard.module.css'

type BentoCardProps = {
  panel: string
  label: string
  wide?: boolean
  children: ReactNode
}

// The whole card is a link, but buttons can't live inside <a>.
// So the link is a layer under the content; only interactive children catch clicks.
const BentoCard = ({ panel, label, wide, children }: BentoCardProps) => {
  return (
    <div className={`${styles.cell} ${wide ? styles.wide : ''}`} data-reveal>
      <article className={styles.card}>
        <Link to={`/console#${panel}`} className={styles.link} aria-label={label} />
        <div className={styles.content}>{children}</div>
      </article>
    </div>
  )
}

export default BentoCard
