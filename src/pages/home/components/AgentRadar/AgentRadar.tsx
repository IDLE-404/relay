import { useState } from 'react'
import { agentColor, agentIds, agentSoft, type AgentId } from '../ConsolePreview/data'
import styles from './AgentRadar.module.css'

type AgentRadarProps = {
  values: Record<AgentId, number[]> // 0..1 per axis
  axes: string[]
  agentNames: Record<AgentId, string> // short names for the switcher
}

const width = 360
const height = 300
const center = { x: width / 2, y: height / 2 }
const radius = 110
const axisAngles = [0, 90, 180, 270] // degrees, clockwise from the top

const point = (angle: number, distance: number) => {
  const rad = (angle * Math.PI) / 180
  return { x: center.x + distance * Math.sin(rad), y: center.y - distance * Math.cos(rad) }
}

const polygon = (values: number[]) =>
  values
    .map((value, index) => {
      const { x, y } = point(axisAngles[index], value * radius)
      return `${x},${y}`
    })
    .join(' ')

// Horizontal labels just outside each axis end.
const labelProps = [
  { dx: 0, dy: -12, anchor: 'middle' },
  { dx: 10, dy: 4, anchor: 'start' },
  { dx: 0, dy: 20, anchor: 'middle' },
  { dx: -10, dy: 4, anchor: 'end' },
] as const

const AgentRadar = ({ values, axes, agentNames }: AgentRadarProps) => {
  const [active, setActive] = useState<AgentId>('data')
  const [previous, setPrevious] = useState<AgentId | null>(null)

  const select = (agent: AgentId) => {
    if (agent === active) return
    setPrevious(active)
    setActive(agent)
  }

  return (
    <div className={styles.radar}>
      <svg viewBox={`0 0 ${width} ${height}`} className={styles.svg} aria-hidden>
        {[0.25, 0.5, 0.75, 1].map((level) => (
          <polygon key={level} points={polygon([level, level, level, level])} className={styles.grid} />
        ))}
        {axisAngles.map((angle) => {
          const end = point(angle, radius)
          return <line key={angle} x1={center.x} y1={center.y} x2={end.x} y2={end.y} className={styles.grid} />
        })}

        {/* All three shapes are drawn; switching agents crossfades them. */}
        {agentIds.map((agent) => (
          <polygon
            key={agent}
            points={polygon(values[agent])}
            className={agent === active ? styles.active : agent === previous ? styles.previous : styles.hidden}
            style={agent === active ? { fill: agentColor[agent], stroke: agentColor[agent] } : undefined}
          />
        ))}

        {axisAngles.map((angle, index) => {
          const end = point(angle, radius)
          const { dx, dy, anchor } = labelProps[index]
          return (
            <text key={angle} x={end.x + dx} y={end.y + dy} textAnchor={anchor} className={styles.label}>
              {axes[index]}
            </text>
          )
        })}
      </svg>

      <div className={styles.switcher}>
        {agentIds.map((agent) => (
          <button
            key={agent}
            type="button"
            className={styles.pill}
            aria-pressed={agent === active}
            style={agent === active ? { background: agentSoft[agent], color: agentColor[agent] } : undefined}
            onClick={() => select(agent)}
          >
            <i style={{ background: agentColor[agent] }} />
            {agentNames[agent]}
          </button>
        ))}
      </div>
    </div>
  )
}

export default AgentRadar
