import { useState } from 'react'
import { useI18n } from '@/shared/i18n/I18nContext'
import { fill } from '@/shared/utils'
import { agentColor, agentIds, usage, type AgentId } from '../ConsolePreview/data'
import styles from './UsageCard.module.css'

type UsageCardProps = {
  seconds: number
}

const formatK = (value: number) => `${(value / 1000).toFixed(1)}k`

const UsageCard = ({ seconds }: UsageCardProps) => {
  const { t } = useI18n()
  const text = t.landing.preview
  const [focused, setFocused] = useState<AgentId | null>(null)

  // A few more calls every 4 seconds, split between the agents.
  const extra = Math.floor(seconds / 4) * 3
  const byAgent = { ...usage.byAgent, data: usage.byAgent.data + extra }
  const used = usage.used + extra
  const percent = Math.round((used / usage.quota) * 100)

  // Dots: the used share of the grid, coloured by each agent's part of it.
  const total = usage.columns * usage.rows
  const usedDots = Math.round((used / usage.quota) * total)
  const dots: (AgentId | null)[] = []
  agentIds.forEach((agent) => {
    const count = Math.round((byAgent[agent] / used) * usedDots)
    for (let index = 0; index < count && dots.length < usedDots; index += 1) dots.push(agent)
  })
  while (dots.length < total) dots.push(null)

  return (
    <div className={styles.usage}>
      <p className={styles.title}>{text.usage.title}</p>

      <p className={styles.value}>
        {formatK(used)} <span>/ {formatK(usage.quota)}</span>
      </p>
      <p className={styles.quota}>{fill(text.usage.quota, { n: percent })}</p>

      <div className={styles.grid} style={{ gridTemplateColumns: `repeat(${usage.columns}, 1fr)` }} aria-hidden>
        {dots.map((agent, index) => (
          <i
            key={index}
            style={agent ? { background: agentColor[agent] } : undefined}
            className={`${agent ? styles.filled : ''} ${focused && agent && agent !== focused ? styles.dim : ''}`}
          />
        ))}
      </div>

      <ul className={styles.legend}>
        {agentIds.map((agent) => (
          <li
            key={agent}
            tabIndex={0}
            className={styles.item}
            onMouseEnter={() => setFocused(agent)}
            onMouseLeave={() => setFocused(null)}
            onFocus={() => setFocused(agent)}
            onBlur={() => setFocused(null)}
          >
            <i style={{ background: agentColor[agent] }} />
            <span className={styles.amount} style={{ color: agentColor[agent] }}>
              {formatK(byAgent[agent])}
            </span>
            <span className={styles.name}>{text.agents[agent]}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default UsageCard
