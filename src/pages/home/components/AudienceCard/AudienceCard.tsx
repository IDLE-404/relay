import type { CSSProperties, ReactNode } from 'react'
import styles from './AudienceCard.module.css'

type AudienceCardProps = {
  title: string
  text: string
  tint: string
  wide?: boolean
  active: boolean
  onHover: (active: boolean) => void
  children: ReactNode
}

const AudienceCard = ({ title, text, tint, wide, active, onHover, children }: AudienceCardProps) => {
  return (
    <article
      className={`${styles.card} ${wide ? styles.wide : ''} ${active ? styles.active : ''}`}
      style={{ '--tint': tint } as CSSProperties}
      onMouseEnter={() => onHover(true)}
      onMouseLeave={() => onHover(false)}
    >
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.text}>{text}</p>
      <div className={styles.visual}>{children}</div>
    </article>
  )
}

export default AudienceCard
