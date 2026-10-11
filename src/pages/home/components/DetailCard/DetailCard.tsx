import { LuArrowUpRight } from 'react-icons/lu'
import { nodes } from '../About/data'
import styles from './DetailCard.module.css'

type DetailCardProps = {
  items: { label: string; title: string; text: string }[]
  active: number
  sourceLabel: string
}

// All cards sit in one grid cell: the active one fades in, the card keeps the height of the tallest.
const DetailCard = ({ items, active, sourceLabel }: DetailCardProps) => {
  return (
    <div className={styles.card} aria-live="polite">
      {items.map((item, index) => {
        const node = nodes[index]

        return (
          <article key={node.key} className={`${styles.item} ${index === active ? styles.visible : ''}`} inert={index !== active}>
            <span className={styles.tag}>
              0{index + 1} · {item.label}
            </span>
            <h3 className={styles.title}>{item.title}</h3>
            <p className={styles.text}>{item.text}</p>
            {node.snippet && <code className={styles.snippet}>{node.snippet}</code>}
            <a className={styles.source} href={node.source} target="_blank" rel="noopener noreferrer">
              {sourceLabel}
              <LuArrowUpRight />
            </a>
          </article>
        )
      })}
    </div>
  )
}

export default DetailCard
