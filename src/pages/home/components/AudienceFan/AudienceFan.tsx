import { useId } from 'react'
import type { IconType } from 'react-icons'
import { tints } from '../Audiences/data'
import styles from './AudienceFan.module.css'

type AudienceFanProps = {
  center: string
  items: { icon: IconType; title: string; caption: string }[]
  hovered: number | null
  onHover: (index: number | null) => void
}

// viewBox units. The SVG stretches to the row width; tile i is centred at (i + 0.5) / 5 of it.
const width = 1000
const height = 160
const top = 18

const pathTo = (index: number, count: number) => {
  const x = ((index + 0.5) / count) * width
  return `M ${width / 2} ${top} C ${width / 2} ${height * 0.55}, ${x} ${height * 0.45}, ${x} ${height}`
}

const AudienceFan = ({ center, items, hovered, onHover }: AudienceFanProps) => {
  const id = useId()

  return (
    <div className={styles.fan}>
      <div className={styles.center}>
        <span className={styles.glow} aria-hidden />
        <span className={styles.dot} aria-hidden />
        <span className={styles.label}>{center}</span>
      </div>

      <svg className={styles.paths} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" aria-hidden>
        <defs>
          {items.map((_, index) => (
            <linearGradient
              key={index}
              id={`${id}-${index}`}
              gradientUnits="userSpaceOnUse"
              x1={width / 2}
              y1={top}
              x2={((index + 0.5) / items.length) * width}
              y2={height}
            >
              <stop offset="0%" style={{ stopColor: 'var(--color-accent)' }} />
              <stop offset="100%" style={{ stopColor: tints[index].color }} />
            </linearGradient>
          ))}
        </defs>
        {items.map((_, index) => (
          <path
            key={index}
            d={pathTo(index, items.length)}
            pathLength={1}
            stroke={`url(#${id}-${index})`}
            className={`${styles.path} ${hovered === index ? styles.active : ''}`}
          />
        ))}
      </svg>

      <ul className={styles.tiles}>
        {items.map(({ icon: Icon, title, caption }, index) => (
          <li
            key={title}
            tabIndex={0}
            className={`${styles.tile} ${hovered === index ? styles.active : ''}`}
            onMouseEnter={() => onHover(index)}
            onMouseLeave={() => onHover(null)}
            onFocus={() => onHover(index)}
            onBlur={() => onHover(null)}
          >
            <span className={styles.icon} style={{ background: tints[index].soft, color: tints[index].color }}>
              <Icon aria-hidden />
            </span>
            <span className={styles.title}>{title}</span>
            <span className={styles.caption}>{caption}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default AudienceFan
