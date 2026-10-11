import styles from './OrchestratorVisual.module.css'

// Relay → 3 agents → their servers. Only agent → server edges are MCP.
const agents = [
  { x: 50, label: 'docs', server: 'drive' },
  { x: 150, label: 'data', server: 'postgres' },
  { x: 250, label: 'telegram', server: 'telegram' },
]

const OrchestratorVisual = () => {
  return (
    <svg className={styles.diagram} viewBox="0 0 300 170" aria-hidden>
      <rect x="110" y="4" width="80" height="26" rx="8" className={styles.relay} />
      <text x="150" y="21" className={styles.relayText}>
        Relay
      </text>

      {agents.map(({ x, label, server }) => (
        <g key={label}>
          <path d={`M 150 30 C 150 50, ${x} 46, ${x} 64`} className={styles.edge} />
          <rect x={x - 40} y="64" width="80" height="24" rx="7" className={styles.agent} />
          <text x={x} y="80" className={styles.text}>
            {label}
          </text>

          <path d={`M ${x} 88 V 126`} className={`${styles.edge} ${styles.mcp}`} />
          <text x={x + 6} y="111" className={styles.mcpLabel}>
            MCP
          </text>

          <rect x={x - 40} y="126" width="80" height="24" rx="7" className={styles.server} />
          <text x={x} y="142" className={styles.text}>
            {server}
          </text>
        </g>
      ))}
    </svg>
  )
}

export default OrchestratorVisual
