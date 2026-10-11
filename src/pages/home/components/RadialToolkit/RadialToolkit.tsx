import type { CSSProperties } from 'react'
import { LuBot } from 'react-icons/lu'
import { nodes, pointOnRing, radius, size } from '../About/data'
import styles from './RadialToolkit.module.css'

type RadialToolkitProps = {
  labels: string[]
  agent: string
  more: string
  active: number
  onSelect: (index: number) => void
}

const center = size / 2
const cone = 18 // half-width of the cone in degrees
const coneTip = pointOnRing(-cone)
const coneEnd = pointOnRing(cone)
const morePoint = pointOnRing(180)

// Positions are set as CSS variables so mobile styles can ignore them.
const placeAt = (point: { x: number; y: number }) =>
  ({ '--x': `${(point.x / size) * 100}%`, '--y': `${(point.y / size) * 100}%` }) as CSSProperties

const RadialToolkit = ({ labels, agent, more, active, onSelect }: RadialToolkitProps) => {
  return (
    <div className={styles.toolkit}>
      <svg className={styles.ring} viewBox={`0 0 ${size} ${size}`} aria-hidden>
        <defs>
          <radialGradient id="why-cone" cx={center} cy={center} r={radius} gradientUnits="userSpaceOnUse">
            <stop offset="0%" className={styles.stop} stopOpacity="0.35" />
            <stop offset="100%" className={styles.stop} stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle cx={center} cy={center} r={radius} className={styles.outer} />
        <circle cx={center} cy={center} r={radius - 70} className={styles.inner} />
      </svg>

      {/* The cone points up and rotates to the active node. */}
      <svg
        className={styles.cone}
        viewBox={`0 0 ${size} ${size}`}
        style={{ transform: `rotate(${nodes[active].angle}deg)` }}
        aria-hidden
      >
        <path
          d={`M ${center} ${center} L ${coneTip.x} ${coneTip.y} A ${radius} ${radius} 0 0 1 ${coneEnd.x} ${coneEnd.y} Z`}
          fill="url(#why-cone)"
        />
      </svg>

      <div className={styles.center} aria-hidden>
        <LuBot />
        <span>{agent}</span>
      </div>

      <div className={styles.nodes}>
        {nodes.map((node, index) => {
          const Icon = node.icon

          return (
            <button
              key={node.key}
              className={`${styles.node} ${index === active ? styles.active : ''}`}
              style={placeAt(pointOnRing(node.angle))}
              aria-pressed={index === active}
              onClick={() => onSelect(index)}
            >
              <span className={styles.icon}>
                <Icon />
              </span>
              <span className={styles.label}>
                {labels[index]}
                <kbd>{node.key}</kbd>
              </span>
            </button>
          )
        })}

        <a href="#how-it-works" className={styles.more} style={placeAt(morePoint)}>
          {more} ···
        </a>
      </div>
    </div>
  )
}

export default RadialToolkit
